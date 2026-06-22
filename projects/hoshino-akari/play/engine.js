/* engine.js —— 《雨後，凌晨一點》VN 播放器（零後端，localStorage 存檔以「天」為單位） */
(function () {
  const H = window.HOSHINO, M = H.meta, ART = window.ART;
  const $ = (id) => document.getElementById(id);
  const SAVE = "HOSHINO_SAVE", GAL = "HOSHINO_GAL", ENDK = "HOSHINO_END", CH = "HOSHINO_CH";

  // ---- 狀態 ----
  let state = { day: 1, scores: { ...M.initScores }, flags: {} };
  let unlocked = new Set(JSON.parse(localStorage.getItem(GAL) || "[]"));
  let cleared = new Set(JSON.parse(localStorage.getItem(ENDK) || "[]"));
  let chapterCleared = new Set(JSON.parse(localStorage.getItem(CH) || "[]"));
  let autoMode = false, skipMode = false;
  let skipUntilUnread = false;                 // 「跳已讀」模式：skipMode 在 playLine 撞到未讀行時自動關閉
  let unreadCount = 0;
  // ---- 已讀行集合（獨立 HOSHINO_READ；不動 SAVE/GAL/ENDK/CH 契約）----
  const READ = "HOSHINO_READ";
  let readSet = new Set((() => { try { return JSON.parse(localStorage.getItem(READ) || "[]"); } catch (e) { return []; } })());
  const hashTxt = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return h; }; // ponytail: djb2；極罕碰撞只會把某句當已讀，無害
  const isRead = (txt) => readSet.has(hashTxt(txt));
  function markRead(txt) { const h = hashTxt(txt); if (!readSet.has(h)) { readSet.add(h); try { localStorage.setItem(READ, JSON.stringify([...readSet])); } catch (e) {} } } // ponytail: 每新行寫一次 localStorage，~千行 VN 無感；真要省再批次化
  function updateSkipUI() {
    const a = $("btnSkip"), r = $("btnSkipRead");
    if (a) a.classList.toggle("on", skipMode && !skipUntilUnread);
    if (r) r.classList.toggle("on", skipMode && skipUntilUnread);
  }
  // ---- 對白回顧 + 玩家設定（新增；獨立 HOSHINO_CFG，不動既有 SAVE/GAL/ENDK/CH 契約）----
  let history = [];
  const CFG = "HOSHINO_CFG";
  let cfg = Object.assign(
    { bgmVol: 0.5, seVol: 0.6, mute: false, textSpeed: "normal", autoMs: 1100 },
    (() => { try { return JSON.parse(localStorage.getItem(CFG) || "{}"); } catch (e) { return {}; } })()
  );
  const saveCfg = () => { try { localStorage.setItem(CFG, JSON.stringify(cfg)); } catch (e) {} };
  const bgmVol = () => (cfg.mute ? 0 : cfg.bgmVol);
  const seVol = () => (cfg.mute ? 0 : cfg.seVol);
  const escapeHtml = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  // 場景/時間/小標題覆蓋層由下方 OverlayDirector 統一管理（單一元素、單一 timer、dedup）

  // ---- 素材解析（assets.js manifest；缺素材一律 fallback，不報錯）----
  const A = () => (H.assets || {});
  function assetUrl(group, key) { const g = A()[group]; return (g && key != null && g[key]) || null; }
  let bgmAudio = null, bgmCur = null;
  // 音量斜坡（共用）：BGM 淡入淡出／淡出停止。skip 或 ms<=0 → 瞬間到位。
  function rampVol(audio, to, ms, onDone) {
    if (!audio) { if (onDone) onDone(); return; }
    to = Math.max(0, Math.min(1, to));
    if (skipMode || ms <= 0) { try { audio.volume = to; } catch (e) {} if (onDone) onDone(); return; }
    const from = audio.volume, steps = Math.max(1, Math.round(ms / 40));
    let i = 0;
    const t = setInterval(() => {
      i++;
      try { audio.volume = Math.max(0, Math.min(1, from + (to - from) * (i / steps))); }
      catch (e) { clearInterval(t); return; }
      if (i >= steps) { clearInterval(t); if (onDone) onDone(); }
    }, 40);
  }
  function playBGM(m) {
    const en = A().enabled || {}; if (!en.bgm) return;                 // 未啟用音訊 → 靜音 fallback
    const url = (m === "stop") ? null : assetUrl("bgm", m);
    if (!url) {                                                        // stop／無曲：淡出後暫停（不再硬切）
      const old = bgmAudio;
      if (old) rampVol(old, 0, 500, () => { try { old.pause(); } catch (e) {} });
      bgmCur = null; return;
    }
    if (url === bgmCur) return;
    try {
      const old = bgmAudio;
      const next = new Audio(); next.loop = true; next.src = url; next.volume = 0;
      next.play().catch(() => {});
      bgmAudio = next; bgmCur = url;
      rampVol(next, bgmVol(), 600);                                    // 新軌淡入
      if (old) rampVol(old, 0, 600, () => { try { old.pause(); } catch (e) {} });  // 舊軌交叉淡出
    } catch (e) {}
  }
  // 單一 SE 聲道：新音效播放時，快速淡出上一個 SE（例：撞擊聲響起→把還在響的跑步聲停掉）。
  let lastSE = null;
  function stopLastSE() {
    if (!lastSE) return;
    const a = lastSE; lastSE = null;
    try {
      let v = a.volume;
      const t = setInterval(() => {
        v -= 0.2;
        if (v <= 0) { clearInterval(t); try { a.pause(); } catch (e) {} }
        else { try { a.volume = v; } catch (e) { clearInterval(t); } }
      }, 20);                                                           // ~100ms 淡出，避免硬切爆音
    } catch (e) { try { a.pause(); } catch (e2) {} }
  }
  function playSE(key) {
    const en = A().enabled || {}; const url = en.se ? assetUrl("se", key) : null;
    if (url) {
      try {
        stopLastSE();                                                   // 新 SE 先停掉上一個（單聲道）
        const a = new Audio(url); a.volume = seVol(); a.play().catch(() => {});
        lastSE = a;
      } catch (e) {}
    }
    flashSE();                                                          // 視覺脈衝永遠保留（即使沒音檔）
  }
  const seWarm = [];
  function preloadSE() {                                                 // 預熱 SE 位元組：消除首播 fetch/解碼延遲 → 撞擊 shake 與聲音同拍（spec/50 #2）
    const en = A().enabled || {}; if (!en.se) return;
    const g = A().se || {};
    for (const k in g) { const u = g[k]; if (u) { try { const a = new Audio(); a.preload = "auto"; a.src = u; a.load(); seWarm.push(a); } catch (e) {} } }   // 保留參考避免載入途中被 GC 中止
  }
  // ── 立繪演出 v0：pos / depth / motion（讀 line 欄位 → 套 CSS class）＋ clear 乾淨退場 ──
  // 沒有任何演出欄位的 line：className 維持純 "sprite-stack"，行為與舊版完全一致（向後相容硬要求）。
  const SPRITE_POS = { left: "sprite-pos-left", right: "sprite-pos-right" };       // center = 預設，不加 class
  const SPRITE_DEPTH = { near: "sprite-depth-near", far: "sprite-depth-far", closeup: "sprite-depth-closeup" }; // normal = 預設不加 class；closeup = 維持臉部大特寫（與 walk_in 終點同框，換表情不變回原大小）
  const SPRITE_MOTION = {
    fade_in: "sprite-motion-fade-in", slide_in_left: "sprite-motion-slide-in-left",
    slide_in_right: "sprite-motion-slide-in-right", step_in: "sprite-motion-step-in", step_back: "sprite-motion-step-back",
    walk_in: "sprite-motion-walk-in",    // 慢慢走近（走路踏步感，由遠走到面前）；搭 depth:"near" 收在靠近態
    rush_in: "sprite-motion-rush-in",    // 由畫面外快速衝入＋逼近放大（撞擊）；建議同行加 shake:true + se 做撞畫面
  };
  const SPRITE_EXIT_MS = 280;
  const prefersReducedMotion = () => { try { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; } };
  let spriteGen = 0;                                                              // 競態守衛：每次 setSprite / 退場 / 換日都 +1
  function setSprite(who, expr, mask, opts) {
    spriteGen++;
    const el = $("spriteLayer"); if (!el) return;
    const c = A().characters || {}; let cw = c[who] || null;
    // 旁白等無立繪角色：expr 若能在 akari 解析，回退用 akari 立繪（旁白描述她→顯示她，如「轉身走進黑暗」顯示背影）。
    // 僅在該 who 無立繪表＋expr 非空＋akari 有此 expr 時觸發 → 純加值，不動既有 akari/manager 行為。
    if (!cw && expr != null && expr !== "" && c.akari && c.akari[expr] != null) cw = c.akari;
    const url = (expr != null && cw) ? cw[expr] : null;
    if (!url) { el.classList.add("hidden"); el.innerHTML = ""; return; }
    // 口罩等 overlay：與立繪同畫布尺寸的透明 PNG，疊在 base 上自動對位（mask 為可選，無 mask 即單張）
    const masks = (cw && cw["@masks"]) || {};
    const mUrl = (mask != null && masks[mask]) ? masks[mask] : null;
    const ov = mUrl ? `<img class="sprite-mask" src="${mUrl}" alt="" onerror="this.remove()">` : "";
    const o = opts || {};                                                         // pos/depth/motion 皆 optional；未知值 → 不加 class（安全 no-op）
    const cls = ["sprite-stack", SPRITE_POS[o.pos], SPRITE_DEPTH[o.depth], SPRITE_MOTION[o.motion]].filter(Boolean).join(" ");
    // motionDur（秒）：optional，逐句覆寫 motion 速度。設為 CSS 變數 --motion-dur（只驅動位移/縮放主動畫；
    // walk_in 的淡入是另一段固定時長動畫、不受影響）。只在有 motion 時有意義。
    const dur = (typeof o.motionDur === "number" && o.motionDur > 0) ? ` style="--motion-dur:${o.motionDur}s"` : "";
    el.innerHTML = `<div class="${cls}"${dur}><img class="sprite" src="${url}" alt="" onerror="this.closest('#spriteLayer').classList.add('hidden')">${ov}</div>`;
    el.classList.remove("hidden");
  }
  // clear:true 乾淨退場：加 .sprite-exit → await（非 fire-and-forget）→ gen 未被後續操作改變才清空。
  // skip/auto 經 delay() 收斂為 ~4ms；reduced-motion 收斂為 0；跳日/重玩會 setSprite(null) 推進 gen 使本次退場 no-op。
  async function clearSpriteAnimated() {
    const el = $("spriteLayer"); if (!el) return;
    spriteGen++; const myGen = spriteGen;
    const stack = el.querySelector(".sprite-stack");
    if (!stack || el.classList.contains("hidden")) { el.classList.add("hidden"); el.innerHTML = ""; return; }
    stack.classList.add("sprite-exit");
    await delay(prefersReducedMotion() ? 0 : SPRITE_EXIT_MS);
    if (myGen !== spriteGen) return;                                              // 已被新立繪 / 換日 / 另一次退場取代 → 不可清掉新狀態
    el.classList.add("hidden"); el.innerHTML = "";
  }

  // ---- 前進控制（點擊 / 鍵盤 / auto / skip）----
  let pendingAdvance = null, typing = false, finishTyping = null;
  function userAdvance() {
    if ($("game").classList.contains("ui-hidden")) { $("game").classList.remove("ui-hidden"); return; }   // 偷看模式：點畫面／Enter 先叫回對話框，不前進
    if (typing && finishTyping) { finishTyping(); return; }
    if (pendingAdvance) { const r = pendingAdvance; pendingAdvance = null; r(); }
  }
  function waitAdvance(ms) {
    return new Promise((res) => {
      pendingAdvance = () => { pendingAdvance = null; res(); };
      if (skipMode) { const r = pendingAdvance; pendingAdvance = null; setTimeout(r, 70); }
      else if (autoMode && ms) { setTimeout(() => { if (pendingAdvance) userAdvance(); }, ms); }
    });
  }
  const delay = (ms) => new Promise((r) => setTimeout(r, skipMode ? 25 : ms));

  // ---- 條件評估 ----
  function evalCond(cond) {
    cond = (cond || "").trim();
    if (cond.startsWith("flag:")) return !!state.flags[cond.slice(5)];
    if (cond.startsWith("!flag:")) return !state.flags[cond.slice(6)];
    const s = state.scores, scope = { affection: s.affection, distance: s.distance, awareness: s.awareness, regret: s.regret, warmth: s.affection - s.distance };
    try { return Function(...Object.keys(scope), "return (" + cond + ")")(...Object.values(scope)); }
    catch (e) { console.warn("cond err", cond, e); return false; }
  }

  // ---- 舞台繪製 ----
  // curBg：目前場景背景圖 key（地點＋情緒色，如 bg_conv_backalley_night）。場景以 setMood(mood,bgKey) 設定並「黏住」；
  // 行內 bgm 只重啟音樂、不洗掉背景圖（bgKey 省略 → 保留 curBg）。行內 bg 只換圖（mood 省略 → 不動音樂/漸層）。
  let curBg = null;
  function setMood(m, bgKey) {
    if (!m && bgKey === undefined) return;
    const bg = $("moodbg");
    if (m) bg.className = m;                              // CSS 漸層 fallback 類別（依 mood）
    if (bgKey !== undefined) curBg = bgKey;              // 場景／行內明確指定時更新（含 null = 清回 mood 圖）
    const key = curBg || m;                               // 有地點背景用它，否則退回 mood 對應圖
    const url = key ? assetUrl("background", key) : null;
    crossfadeBg(url);                                      // 雙層交叉淡入；無圖 → 淡出露出 mood 漸層
    if (m) playBGM(m);
  }
  // 背景雙層交叉淡入（mbA/mbB 輪流當前景；#moodbg 自身 CSS 漸層為無圖 fallback）。
  // reduced-motion 由全域 *{transition-duration:.001ms} 收斂為瞬切，最終態保留。
  let bgFront = null, bgCurUrl = null;
  function crossfadeBg(url) {
    const a = $("mbA"), b = $("mbB"); if (!a || !b) return;
    if (url === bgCurUrl) return;                          // 同圖不重播
    bgCurUrl = url;
    document.documentElement.style.setProperty("--scene-bg", url ? `url("${url}")` : "none");  // 桌機側欄模糊填充取用
    if (!url) { a.classList.remove("show"); b.classList.remove("show"); bgFront = null; return; }
    const back = bgFront === "A" ? b : a;                 // 要帶入的那一層（非當前前景）
    back.style.backgroundImage = `url(${url})`;
    void back.offsetWidth;                                 // reflow → 觸發 opacity transition
    back.classList.add("show");
    (bgFront === "A" ? a : b).classList.remove("show");    // 舊前景淡出
    bgFront = bgFront === "A" ? "B" : "A";
  }
  function flashSE() { const f = $("seFlash"); f.classList.remove("pulse"); void f.offsetWidth; f.classList.add("pulse"); }
  function hideExprBadge() {   // 表情已整合進角色名牌；此函式只負責藏掉已廢棄的浮動表情徽章
    const b = $("exprBadge"); if (b) b.classList.add("hidden");
  }
  let cgToken = 0;                                                       // 防止解碼期間玩家已換頁，舊圖晚到才蓋上
  async function showCG(key) {
    const myToken = ++cgToken;
    if (!key || key === "clear") { $("cgLayer").classList.add("hidden"); $("cgLayer").classList.remove("cg-full"); $("game").classList.remove("cg-on", "cg-prop"); return; }
    unlockCG(key);
    const cap = capFor(key);
    const url = assetUrl("cg", key);                                    // 有真 CG 用圖/影片，否則 inline SVG
    const isVideo = url && /\.(mp4|webm)$/i.test(url);
    if (url && !isVideo) {                                              // 靜圖：先解碼完才上畫面，杜絕「清黑底→才載圖」的黑幀（spec/50 #1）
      const pre = new Image(); pre.src = url;
      try { await pre.decode(); } catch (e) {}
      if (myToken !== cgToken) return;                                  // 解碼途中已被新 CG / clear 取代 → 放棄，避免舊圖蓋到新畫面
    }
    const poster = url ? url.replace(/\.(mp4|webm)$/i, ".png") : "";     // 影片 CG 靜圖：補滿播放前的黑幀＋載入失敗時 poster 續顯。ponytail: 假設同名 .png（ev_signlight 為 .webp → poster 404 無害，退回現狀黑底）
    const art = url
      ? (isVideo
          ? `<video class="cg-img" src="${url}" poster="${poster}" autoplay loop muted playsinline></video>`   // loop 影片 CG：assets.js 指向 .mp4/.webm 即自動循環；poster 防首幀黑屏
          : `<img class="cg-img" src="${url}" alt="" onerror="this.outerHTML=''">`)
      : (ART[key] ? ART[key]() : "");
    $("cgLayer").innerHTML = art + (cap ? `<div class="cg-cap">${cap}</div>` : "");
    const isEvent = /^ev_/.test(key);                                   // 主視覺 event CG → 全畫面＋對話框透明；道具 CG → 置中相片卡
    $("cgLayer").classList.remove("hidden"); $("cgLayer").classList.toggle("cg-full", isEvent);
    $("game").classList.toggle("cg-on", isEvent); $("game").classList.toggle("cg-prop", !isEvent);   // 道具相片卡顯示時 → 立繪退後景（CSS 壓暗），不再卡在臉上
  }
  function clearCG() { cgToken++; $("cgLayer").classList.add("hidden"); $("cgLayer").classList.remove("cg-full"); $("cgLayer").innerHTML = ""; $("game").classList.remove("cg-on", "cg-prop"); }
  function capFor(key) {
    for (const g of ["anchors", "signs", "hidden"]) {
      const it = M.gallery[g].find((x) => x.key === key); if (it) return it.cap;
    } return "";
  }
  let blackout;
  function setBlack(on) {
    if (!blackout) { blackout = document.createElement("div"); blackout.style.cssText = "position:absolute;inset:0;background:#000;z-index:7;opacity:0;transition:opacity .7s;pointer-events:none"; $("stage").appendChild(blackout); }
    blackout.style.opacity = on ? "1" : "0";
  }

  // 場景卡 / 章節卡共用的淡入淡出
  async function fadeCard(html, hold) {
    const c = $("sceneCard");
    c.innerHTML = html;
    // 暗底「瞬間」蓋上（不淡入）→ 杜絕進日時「背景先亮起、卡片才淡入變暗」的 flash；內文仍由 .dc-* fadeUp 進場
    c.classList.remove("hidden"); c.style.transition = "none"; c.style.opacity = 1; void c.offsetWidth;
    c.style.transition = "opacity .6s";                      // 之後僅供退場淡出
    $("textbox").style.visibility = "hidden";
    await Promise.race([delay(hold), waitAdvance(0)]);
    c.style.opacity = 0; await delay(skipMode ? 4 : 600); c.classList.add("hidden");
    $("textbox").style.visibility = "visible";
  }

  // ---- OverlayDirector：統一管理場景/時間/小標題覆蓋，杜絕重疊與競態（畫面上永遠最多一張）----
  const Overlay = (function () {
    let holdT = null, fadeT = null, lastSig = null;
    function clearTimers() { if (holdT) { clearTimeout(holdT); holdT = null; } if (fadeT) { clearTimeout(fadeT); fadeT = null; } }
    function node() { return $("sceneTag"); }
    function hide() { clearTimers(); const e = node(); if (e) { e.className = "hidden"; e.innerHTML = ""; } }
    function resetDay() { lastSig = null; hide(); }                       // 切日：清 dedup 記號＋殘留卡＋timer
    // Normal scene transition：小型頂部 toast，不蓋對白，dedup，停約 1.8 秒
    function scene(place, time, mood) {
      const label = sceneLabel(place, time);
      if (!label || label === lastSig) return;                           // dedup：同地點同語意時間 → 不再彈
      lastSig = label;
      clearTimers();
      const e = node(); if (!e) return;
      e.className = "scene-toast";                                        // className 整個覆蓋＝永遠單一卡
      e.innerHTML = `<div class="ov-strip">${label}</div>`;
      void e.offsetWidth; e.classList.add("show");
      holdT = setTimeout(() => { e.classList.remove("show"); fadeT = setTimeout(() => { e.className = "hidden"; }, 450); }, skipMode ? 60 : 2200);
    }
    return { scene, resetDay, hide };
  })();

  // 精確時間 → 語意時間（UI 一律顯示語意，避免「凌晨一點」反覆出現）
  function semanticTime(time) {
    const t = String(time || "");
    if (/午休/.test(t)) return "午休";
    if (/放學/.test(t)) return "放學後";
    if (/黃昏|傍晚|17:|18:/.test(t)) return "黃昏";
    if (/清晨|早晨|破曉/.test(t)) return "清晨";
    if (/午後|下午/.test(t)) return "午後";
    if (/白天|上午|午前|中午/.test(t)) return "白天";
    if (/凌晨|深夜|半夜|零點|一點|二點|三點|0[0-3]:|2[0-3]:|當晚/.test(t)) return "深夜";
    return t;
  }
  // 主要地點 → 顯示名對照（美化 toast 標籤；空字串＝不顯示地點，只留語意時間）
  const PLACE_NAME = {
    "便利商店": "便利店", "便利商店後方": "店後停車場", "主角的日常": "",
    "公司": "公司", "公司門口": "公司", "回家": "回家路上", "回家路上": "回家路上",
    "我的房間": "房間", "商店街": "商店街",
  };
  // place 常為「時間・地點」，取「・」後的真正地點，與語意時間組成 label
  function sceneLabel(place, time) {
    const p = String(place || "").trim();
    let loc;
    if (p.includes("・")) {                                   // place 可能是「時間・地點」或「地點・時間」，取非時間段
      const parts = p.split("・").map((s) => s.trim());
      loc = parts.find((s) => !/白天|深夜|半夜|凌晨|傍晚|黃昏|下午|午後|午休|清晨|早晨|當晚|零點|[一二三]點|\d{1,2}:/.test(s)) || parts[parts.length - 1];
    } else loc = p;
    loc = loc.split(/[ 　]/)[0];                              // 主要地點，去掉次區域（同店多次移動 → dedup 只彈一次）
    if (PLACE_NAME[loc] !== undefined) loc = PLACE_NAME[loc];  // 顯示名美化
    const st = semanticTime(time);
    if (loc && st) return `${st}　${loc}`;
    return loc || st || "";
  }

  // 場景轉換（Normal）：換背景 + 小型 toast（非阻塞、不蓋對白、dedup）。Day 卡才用中央 eyecatch。
  async function showScene(node) {
    resetCamera(0); clearCG(); hideExprBadge();
    if (node.mood || node.bg) setMood(node.mood, node.bg || null);   // 場景背景：地點 bg 優先，無則 mood；每場景重設 curBg
    Overlay.scene(node.place, node.time, node.mood);
    $("speaker").classList.add("hidden"); $("dialogue").textContent = ""; $("advanceHint").classList.remove("show");
    await delay(skipMode ? 4 : 220);                                      // 一個小呼吸，讓背景 crossfade 起頭
  }

  // 章節卡（Day Start／Day End）。標題缺省時仍可運作（只顯示 Day 編號）
  function dayInfo(d) { return (M.days && M.days[d]) || { title: "", subtitle: "" }; }
  async function showDayCard(d, kind) {
    const info = dayInfo(d);
    const tail = d >= M.dayCount ? "全七日　終" : "本日終";              // Day7 終章感
    const html = kind === "end"
      ? `<div class="day-card day-end"><div class="dc-no">Day ${d}</div><div class="dc-rule"></div><div class="dc-tail">${tail}</div></div>`
      : `<div class="day-card"><div class="dc-no">Day ${d}</div><div class="dc-rule"></div><div class="dc-title">${info.title}</div>${info.subtitle ? `<div class="dc-sub">${info.subtitle}</div>` : ""}</div>`;
    const tb = $("topbar"); if (tb) tb.classList.add("dim");        // eyecatch 期間頂列退讓，避免壓迫
    $("sceneCard").classList.add("daycard");
    await fadeCard(html, kind === "end" ? 1400 : 1900);
    $("sceneCard").classList.remove("daycard");
    if (tb) tb.classList.remove("dim");
    if (kind === "start") { const dt = $("dayTag"); if (dt && dt.classList) { dt.classList.remove("flash"); void dt.offsetWidth; dt.classList.add("flash"); } }  // 資訊轉移到頂列：微亮提示
  }

  async function showSNS(line) {
    const data = line.sns || { title: "推薦欄", posts: [] };
    const wrap = $("snsLayer");
    wrap.innerHTML = `<div class="phone"><div class="phone-bar"><span class="dot"></span>${data.title || "推薦欄"}</div><div id="snsPosts"></div></div>`;
    wrap.classList.remove("hidden");
    const host = wrap.querySelector("#snsPosts");
    for (const p of data.posts) {
      const d = document.createElement("div");
      d.className = "post" + (p.acct ? " acct" : "") + (p.reply ? " reply" : "");
      d.innerHTML = p.num ? p.text.replace(/\[(.+?)\]/g, '<span class="num">$1</span>') : p.text;
      host.appendChild(d);
      await delay(skipMode ? 4 : 360);
    }
  }
  function hideSNS() { $("snsLayer").classList.add("hidden"); $("snsLayer").innerHTML = ""; }

  // ---- 未讀紅點 ----
  function resetUnread() {
    unreadCount = 0;
    const el = $("unreadBadge"); if (el) el.classList.add("hidden");
  }
  function handleUnread(op) {
    if (op.op === "inc") {
      unreadCount += (op.by || 1);
      const el = $("unreadBadge"); if (!el) return;
      el.textContent = unreadCount;
      el.classList.remove("hidden");
      el.classList.remove("pulse"); void el.offsetWidth; el.classList.add("pulse");
    } else if (op.op === "clear") {
      resetUnread();
    }
    // "hold" = no-op：紅點維持原狀
  }

  // ---- camera ----
  function resetCamera(dur) {
    const el = $("stageVisual"); if (!el) return;
    el.style.transition = (dur && !prefersReducedMotion()) ? `transform ${dur}ms ease` : 'none';  // reduced-motion：瞬間 reset（保留最終狀態、不動畫）
    el.style.transform = '';
  }
  function handleCamera(op) {
    if (op.op === 'reset') { resetCamera(op.duration || 400); return; }
    if (op.op === 'hold') return;
    const el = $("stageVisual"); if (!el) return;
    const med = op.amount === 'medium';
    const xf = op.op === 'push' ? `scale(${med ? 1.08 : 1.04})`
             : op.op === 'pan'  ? `translateX(${med ? 6 : 3}%)`
             : '';
    if (!xf) return;
    el.style.transition = (skipMode || prefersReducedMotion()) ? 'none' : `transform ${op.duration || 700}ms cubic-bezier(.3,.1,.2,1)`;  // reduced-motion：瞬間套用（資訊保留、不動畫）
    el.style.transform = xf;
  }

  // ---- 打字機 ----
  function typewriter(text, speed) {
    const el = $("dialogue");
    const base = { slow: 55, normal: 26, fast: 12, instant: 0 }[cfg.textSpeed];
    let per = speed === "instant" ? 0 : speed === "slow" ? 68 : (base == null ? 26 : base);
    if (cfg.textSpeed === "instant") per = 0;   // 玩家設定瞬間 → 一律即顯（行內 slow 演出讓位給玩家偏好）
    return new Promise((res) => {
      if (per === 0 || skipMode || prefersReducedMotion()) { el.textContent = text; res(); return; }  // reduced-motion：整行即顯（JS setInterval 繞過全域動畫關閉，須在此自行讓位）
      typing = true; let i = 0; el.textContent = "";
      const done = () => { clearInterval(t); el.textContent = text; typing = false; finishTyping = null; res(); };
      finishTyping = done;
      const t = setInterval(() => { el.textContent = text.slice(0, ++i); if (i >= text.length) done(); }, per);
    });
  }

  async function playLine(node) {
    const _rtxt = node.text || "";
    if (_rtxt) {
      if (skipMode && skipUntilUnread && !isRead(_rtxt)) { skipMode = false; skipUntilUnread = false; updateSkipUI(); } // 跳已讀撞到未讀 → 停在本行正常播
      markRead(_rtxt);
    }
    if (node.add) { for (const k in node.add) state.scores[k] = (state.scores[k] || 0) + node.add[k]; refreshDbg(); }
    if (node.set) { for (const k in node.set) state.flags[k] = node.set[k]; refreshDbg(); }
    if (node.screen === "black") { setBlack(true); resetCamera(0); await delay(700); }
    else if (node.screen === "clear") setBlack(false);
    if (node.bgm) setMood(node.bgm);                 // 行內音樂：保留 curBg（不洗背景圖）
    if (node.bg) setMood(undefined, node.bg);        // 行內背景微調（如甜點櫃子場景），不動音樂/漸層
    if (node.cg !== undefined) showCG(node.cg);
    if (node.clear) { await clearSpriteAnimated(); }                              // 乾淨退場（與 expr 互斥，clear 優先）；注意：與 cg:"clear"（清 CG）不同
    else if (node.expr !== undefined) { hideExprBadge(); setSprite(node.who, node.expr, node.mask, node); }
    if (node.se) playSE(node.se);
    if (node.unread) handleUnread(node.unread);
    if (node.camera) handleCamera(node.camera);
    if (node.shake) { $("stage").classList.add("shake"); setTimeout(() => $("stage").classList.remove("shake"), 420); }

    const nm = M.names[node.who] || M.names.narration;
    const sp = $("speaker");
    if (nm.label) {
      const note = (node.expr && node.who !== "narration") ? ` <span class="sp-expr">${node.expr}</span>` : "";
      sp.innerHTML = `<span class="sp-name">${nm.label}</span>${note}`;   // 表情整合進名牌（小型、低調）
      sp.className = nm.cls; sp.classList.remove("hidden");
    } else sp.classList.add("hidden");
    const dlg = $("dialogue"); dlg.className = node.who === "narration" ? "narration" : "";
    if (!skipMode && dlg.classList) { dlg.classList.add("swap"); setTimeout(() => dlg.classList.remove("swap"), 280); }
    $("advanceHint").classList.remove("show");

    if (node.screen === "black") { setBlack(false); }
    if (node.ui === "sns") await showSNS(node);

    await typewriter(node.text || "", node.speed || "normal");
    if (node.text) pushHistory(node);
    if (node.pause && !skipMode) await Promise.race([delay(node.pause * 1000), waitAdvance(0)]);
    $("advanceHint").classList.add("show");
    const autoWait = Math.max(cfg.autoMs, (node.text || "").length * 45) + (node.pause || 0) * 1000;  // auto 等待隨字數縮放：長句留足閱讀時間（~45ms/字），短句仍≥autoMs
    await waitAdvance(autoMode ? autoWait : 0);
    if (node.ui === "sns") hideSNS();
  }

  // ---- 選項 ----
  function playChoice(node) {
    return new Promise((resolve) => {
      const box = $("choices");
      Overlay.hide();                                   // 選項出現時，場景/時間卡讓位
      box.innerHTML = node.prompt ? `<div class="choice-prompt">${node.prompt}</div>` : "";
      $("advanceHint").classList.remove("show");
      const showHint = $("dbgChk") && $("dbgChk").checked;
      node.options.forEach((op, idx) => {
        const b = document.createElement("button");
        if (op.flavor) b.classList.add("flavor-opt");
        b.style.setProperty("--i", idx);                 // 依序入場（stagger）
        b.innerHTML = op.label + (showHint && op._dbg ? `<span class="hint">${op._dbg}</span>` : "");
        b.onclick = async () => {
          if (box.dataset.locked) return; box.dataset.locked = "1";   // 防連點兩個選項
          const btns = box.querySelectorAll ? box.querySelectorAll("button") : [];
          [].forEach.call(btns, (x) => x.classList.add(x === b ? "picked" : "dim"));   // 選中態：選的高亮、其餘淡出
          await delay(skipMode ? 4 : 170);
          box.classList.add("hidden"); box.innerHTML = ""; delete box.dataset.locked;
          if (op.add) for (const k in op.add) state.scores[k] = (state.scores[k] || 0) + op.add[k];
          if (op.flag) for (const k in op.flag) state.flags[k] = op.flag[k];
          refreshDbg();
          if (op.reaction) await playNodes(op.reaction);
          resolve();
        };
        box.appendChild(b);
      });
      box.classList.remove("hidden");
    });
  }

  // ---- 走訪 ----
  async function playNode(node) {
    switch (node.type) {
      case "scene": return showScene(node);
      case "line": return playLine(node);
      case "choice": return playChoice(node);
      case "gate": return evalCond(node.cond) ? playNodes(node.then || []) : playNodes(node.else || []);
      default: return;
    }
  }
  async function playNodes(nodes) { for (const n of (nodes || [])) await playNode(n); }

  // ---- 流程 ----
  function persist() { localStorage.setItem(SAVE, JSON.stringify({ day: state.day, scores: state.scores, flags: state.flags })); }
  function unlockCG(key) {
    if (!key || unlocked.has(key)) return;
    unlocked.add(key); localStorage.setItem(GAL, JSON.stringify([...unlocked]));
  }

  function chapterOf(d) { return (H.chapters && H.chapters[d]) || {}; }
  function markChapterCleared(d) { chapterCleared.add(d); localStorage.setItem(CH, JSON.stringify([...chapterCleared])); }

  async function sectionBreak() {
    if (skipMode) return;
    $("dialogue").textContent = "";
    $("speaker").classList.add("hidden");
    $("advanceHint").classList.add("show");
    await waitAdvance(0);
    $("advanceHint").classList.remove("show");
  }

  async function runDay(d, opts) {
    opts = opts || {};
    state.day = d; if (!opts.replay) persist();      // 章節回想不覆蓋正式存檔
    const info = dayInfo(d);
    $("dayTag").textContent = "Day " + d + (info.title ? "　" + info.title : "") + (opts.replay ? "（回想）" : ""); refreshDbg();
    clearCG(); hideExprBadge(); setSprite(null, null); hideSNS(); resetUnread(); history = []; resetCamera(0); setBlack(false); Overlay.resetDay();
    setMood("night", null);                           // 開新一天：清掉上一場景殘留的 curBg
    await showDayCard(d, "start");                  // 必做1：每日章節標題卡
    await playNodes(chapterOf(d).intro || []);      // 必做3：當日極短引子（intro 後不再插空白停頓，直接進當日第一幕）
    await playNodes(H.days[d] || [{ type: "line", who: "narration", text: "（Day" + d + " 尚未實裝）" }]);
    await sectionBreak();                           // 段落停頓：主劇情結束後等玩家點一下
    await playNodes(chapterOf(d).outro || []);      // 必做4：當日極短收束
    if (!opts.replay) markChapterCleared(d);
    await showDayCard(d, "end");                     // 必做2：Day End 轉場（含 Day7 終章卡）
    if (opts.replay) {                               // 回想：只重看一日，不續播、不進結局
      const sv = JSON.parse(localStorage.getItem(SAVE) || "null");   // 還原正式存檔狀態，避免回想污染進度
      if (sv) state = { day: sv.day, scores: { ...sv.scores }, flags: { ...sv.flags } };
      openGallery(); return;
    }
    if (d < M.dayCount) { await runDay(d + 1); }
    else { await finale(); }
  }

  async function finale() {
    const tone = M.judge(state.scores, state.flags);
    cleared.add(tone); localStorage.setItem(ENDK, JSON.stringify([...cleared]));
    setMood("soft", null);                            // ending_soft：結局柔光（清 curBg；結局首個 scene 會設定地點背景）
    if (tone === "hidden_pov") {
      await playNodes(H.endings.warm_true || []);
      await playNodes(H.endings.hidden_pov_tail || []);
    } else {
      await playNodes(H.endings[tone] || []);
    }
    const em = M.endingMeta[tone] || M.endingMeta.quiet_normal;
    unlocked.add(em.badge); localStorage.setItem(GAL, JSON.stringify([...unlocked]));
    showEndingCard(tone);
  }

  function showEndingCard(tone) {
    const em = M.endingMeta[tone] || M.endingMeta.quiet_normal;
    const box = $("choices");
    box.innerHTML =
      `<div style="text-align:center;max-width:460px">
        <div style="width:160px;margin:0 auto 14px">${ART[em.badge]()}</div>
        <h2 style="letter-spacing:.18em;color:var(--akari);margin-bottom:10px">${em.title}</h2>
        <p style="color:var(--ink-dim);font-size:14px;line-height:1.9;margin-bottom:22px">${em.note}</p>
      </div>`;
    const mk = (t, fn) => { const b = document.createElement("button"); b.textContent = t; b.onclick = fn; b.style.width = "min(80vw,300px)"; box.appendChild(b); };
    mk("回想室", openGallery);
    mk("回到標題", () => location.reload());
    box.classList.remove("hidden");
  }

  // ---- 回想室 ----
  function renderGallery() {
    const fill = (host, items, group) => {
      const el = $(host); el.innerHTML = "";
      items.forEach((it) => {
        const open = unlocked.has(it.key) || unlocked.has("end_" + it.key);
        const c = document.createElement("div");
        c.className = "gal-cell" + (open ? "" : " locked");
        if (open) { c.innerHTML = (ART[it.key] ? ART[it.key]() : "") + `<div class="cap">${it.cap}</div>`; c.onclick = () => openView(it); }
        else c.innerHTML = ART.lock();
        el.appendChild(c);
      });
    };
    // 章節回想（必做5）：每格顯示 Day X + 標題；該日通關後解鎖，可重看
    const chEl = $("galChapters");
    if (chEl) {
      chEl.innerHTML = "";
      for (let d = 1; d <= M.dayCount; d++) {
        const info = dayInfo(d), open = chapterCleared.has(d);
        const c = document.createElement("div");
        c.className = "gal-cell ch-cell" + (open ? "" : " locked");
        if (open) { c.innerHTML = `<div class="ch-no">Day ${d}</div><div class="ch-ti">${info.title}</div>`; c.onclick = () => replayChapter(d); }
        else c.innerHTML = ART.lock();
        chEl.appendChild(c);
      }
    }
    const endItems = Object.keys(M.endingMeta).map((k) => ({ key: M.endingMeta[k].badge, cap: M.endingMeta[k].title, note: M.endingMeta[k].note }));
    fill("galEndings", endItems);
    fill("galAnchors", M.gallery.anchors);
    fill("galSigns", M.gallery.signs);
    fill("galHidden", M.gallery.hidden);
  }
  function replayChapter(d) {
    state = { day: d, scores: { ...M.initScores }, flags: {} };  // 章節回想＝從該日重看（不影響正式存檔分數）
    showScreen("game"); runDay(d, { replay: true });
  }
  function openView(it) {
    $("galViewArt").innerHTML = ART[it.key] ? ART[it.key]() : "";
    $("galViewText").textContent = it.note || "";
    $("galView").classList.remove("hidden");
  }
  function openGallery() { showScreen("gallery"); renderGallery(); }

  // ---- 畫面切換 ----
  function showScreen(id) { ["title", "game", "gallery"].forEach((s) => $(s).classList.toggle("hidden", s !== id)); }

  // ---- 開發者面板 ----
  function refreshDbg() {
    const p = $("dbgPanel"); if (!p || p.classList.contains("hidden")) return;
    const s = state.scores;
    const flags = Object.keys(state.flags).filter((k) => state.flags[k]);
    p.innerHTML =
      `<div class="row"><span>affection</span><b>${s.affection}</b></div>
       <div class="row"><span>distance</span><b>${s.distance}</b></div>
       <div class="row"><span>awareness</span><b>${s.awareness}</b></div>
       <div class="row"><span>regret</span><b>${s.regret}</b></div>
       <div class="row"><span>warmth(aff-dist)</span><b>${s.affection - s.distance}</b></div>
       <div class="row"><span>預測結局</span><b style="color:var(--accent)">${M.endingMeta[M.judge(s, state.flags)].title}</b></div>
       <div style="margin-top:6px;color:#6b7785">flags: ${flags.join(", ") || "（無）"}</div>
       <div class="jump"></div>`;
    const j = p.querySelector(".jump");
    for (let d = 1; d <= M.dayCount; d++) {
      const info = dayInfo(d);
      const b = document.createElement("button");
      b.innerHTML = `Day ${d}　<span style="color:var(--ink-dim)">${info.title}</span>`;  // 跳天也顯示日標題
      b.onclick = () => { closeMenu(); runDay(d); };
      j.appendChild(b);
    }
  }

  // ---- 選單 ----
  function openMenu() {
    $("menuModal").classList.remove("hidden");
    const info = dayInfo(state.day);
    $("mRestartDay").textContent = "重玩本日（Day " + state.day + "　" + info.title + "）";  // 必做5：重玩顯示日標題
    refreshDbg();
  }
  function closeMenu() { $("menuModal").classList.add("hidden"); }

  // ---- 對白回顧（backlog）----
  function pushHistory(node) {
    const nm = M.names[node.who] || M.names.narration;
    history.push({ label: nm.label || "", cls: nm.cls || "", text: node.text, narr: node.who === "narration" });
    if (history.length > 200) history.shift();
  }
  function openBacklog() {
    const box = $("backlogList"); if (!box) return;
    box.innerHTML = history.length
      ? history.map((h) => `<div class="bl-row${h.narr ? " bl-narr" : ""}">${h.label ? `<span class="bl-name ${h.cls}">${h.label}</span>` : ""}<span class="bl-text">${escapeHtml(h.text)}</span></div>`).join("")
      : `<div class="bl-row bl-narr"><span class="bl-text">（本日還沒有對白）</span></div>`;
    $("backlogModal").classList.remove("hidden");
    box.scrollTop = box.scrollHeight;   // 捲到最新
  }
  function closeBacklog() { $("backlogModal").classList.add("hidden"); }

  // ---- 設定（音量／靜音／文字速度）----
  function openSettings() {
    const m = $("settingsModal"); if (!m) return;
    $("setBgm").value = cfg.bgmVol; $("setSe").value = cfg.seVol; $("setMute").checked = cfg.mute;
    [].forEach.call(m.querySelectorAll("[data-speed]"), (b) => b.classList.toggle("on", b.dataset.speed === cfg.textSpeed));
    m.classList.remove("hidden");
  }
  function closeSettings() { $("settingsModal").classList.add("hidden"); }

  // ---- 多槽存檔／讀檔（日為單位；slot 0 = 自動存檔=既有 HOSHINO_SAVE，1..3 = 手動書籤）----
  // 註：手動「存」複製當前自動存檔（＝當日起點快照），與「繼續／重玩本日」同模型，避免日中分數重複計。
  //     場景中途任意點 resume 屬階段二（需重構 runDay/playNodes），本版未做。
  const SLOTS = 3;
  const slotKey = (i) => (i === 0 ? SAVE : SAVE + "_" + i);
  const readSlot = (i) => { try { return JSON.parse(localStorage.getItem(slotKey(i)) || "null"); } catch (e) { return null; } };
  function slotLabel(s) {
    if (!s) return "（空）";
    const info = dayInfo(s.day) || {};
    let when = "";
    if (s.ts) { const d = new Date(s.ts), p = (n) => ("0" + n).slice(-2); when = `　${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; }
    return `Day ${s.day}${info.title ? "《" + info.title + "》" : ""}${when}`;
  }
  function saveToManual(i) {
    const auto = readSlot(0); if (!auto) return false;                    // 尚無進度可存
    localStorage.setItem(slotKey(i), JSON.stringify({ day: auto.day, scores: auto.scores, flags: auto.flags, ts: Date.now() }));
    return true;
  }
  function loadSlot(i) {
    const s = readSlot(i); if (!s) return;
    state = { day: s.day, scores: { ...s.scores }, flags: { ...s.flags } };
    closeSaveLoad(); closeMenu();
    showScreen("game"); runDay(s.day);
  }
  function renderSaveLoad() {
    const box = $("saveloadList"); if (!box) return;
    const hasAuto = !!readSlot(0);
    let html = "";
    for (let i = 0; i <= SLOTS; i++) {
      const s = readSlot(i), name = i === 0 ? "自動" : "槽 " + i;
      const saveBtn = i !== 0 ? `<button class="sl-save" data-slot="${i}"${hasAuto ? "" : " disabled"}>存</button>` : "";
      html += `<div class="sl-row"><div class="sl-info"><span class="sl-name">${name}</span><span class="sl-meta">${slotLabel(s)}</span></div>`
        + `<div class="sl-btns">${saveBtn}<button class="sl-load" data-slot="${i}"${s ? "" : " disabled"}>讀</button></div></div>`;
    }
    box.innerHTML = html;
  }
  function openSaveLoad() { renderSaveLoad(); $("saveloadModal").classList.remove("hidden"); }
  function closeSaveLoad() { $("saveloadModal").classList.add("hidden"); }

  // ---- 綁定 ----
  function boot() {
    $("titleArt").innerHTML = ART.title();
    const save = JSON.parse(localStorage.getItem(SAVE) || "null");
    if (save) {
      const info = dayInfo(save.day);
      $("contLabel").textContent = "　Day " + save.day + (info.title ? "《" + info.title + "》" : "");
      $("btnContinue").disabled = false;
    } else { $("contLabel").textContent = "　（尚無進度）"; $("btnContinue").disabled = true; }

    $("btnStart").onclick = () => { state = { day: 1, scores: { ...M.initScores }, flags: {} }; showScreen("game"); runDay(1); };
    $("btnContinue").onclick = () => { if (!save) return; state = { day: save.day, scores: save.scores, flags: save.flags }; showScreen("game"); runDay(save.day); };
    $("btnGallery").onclick = openGallery;
    $("btnGalleryG").onclick = openGallery;
    $("gBack").onclick = () => showScreen($("game").classList.contains("hidden") ? "title" : "game");
    $("galViewClose").onclick = () => $("galView").classList.add("hidden");

    const devMode = /[?&]dev/.test(location.search || "");   // 開發者工具只在網址帶 ?dev 時出現（正式版隱藏分數/跳天）
    if (!devMode) { const lbl = document.querySelector(".dbg-toggle"); if (lbl) lbl.classList.add("hidden"); }

    $("textbox").onclick = userAdvance;
    $("stage").onclick = userAdvance;
    $("cgLayer").onclick = userAdvance;   // CG 全畫面層也可點前進（cgLayer 是 #game 子層、點擊不會冒泡到 #stage）
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); userAdvance(); }
      if (devMode && e.key.toLowerCase() === "d") { $("dbgChk").checked = !$("dbgChk").checked; $("dbgPanel").classList.toggle("hidden", !$("dbgChk").checked); openMenu(); }
    });

    $("btnMenu").onclick = openMenu;
    $("mResume").onclick = closeMenu;
    $("mGallery").onclick = () => { closeMenu(); openGallery(); };
    $("mRestartDay").onclick = () => { closeMenu(); const sv = JSON.parse(localStorage.getItem(SAVE) || "null") || { scores: state.scores, flags: state.flags }; state.scores = { ...sv.scores }; state.flags = { ...sv.flags }; runDay(state.day); };
    $("mTitle").onclick = () => location.reload();
    $("dbgChk").onchange = (e) => { $("dbgPanel").classList.toggle("hidden", !e.target.checked); refreshDbg(); };

    $("btnAuto").onclick = () => { autoMode = !autoMode; $("btnAuto").classList.toggle("on", autoMode); if (autoMode) userAdvance(); };
    $("btnSkip").onclick = () => { const cur = skipMode && !skipUntilUnread; skipMode = !cur; skipUntilUnread = false; updateSkipUI(); if (skipMode) userAdvance(); };            // 全部快進（含未讀）
    $("btnSkipRead").onclick = () => { const cur = skipMode && skipUntilUnread; skipMode = !cur; skipUntilUnread = !cur; updateSkipUI(); if (skipMode) userAdvance(); };          // 只快進已讀（遇未讀自動停）

    // 對白回顧
    $("btnHide").onclick = () => $("game").classList.toggle("ui-hidden");   // 隱藏對話框／頂列偷看全圖；點畫面或 Enter 恢復（見 userAdvance）
    $("btnLog").onclick = openBacklog;
    $("backlogClose").onclick = closeBacklog;
    // 設定
    $("mSettings").onclick = () => { closeMenu(); openSettings(); };
    $("setClose").onclick = closeSettings;
    // 多槽存檔／讀檔
    $("btnLoad").onclick = openSaveLoad;
    $("mSaveLoad").onclick = () => { closeMenu(); openSaveLoad(); };
    $("saveloadClose").onclick = closeSaveLoad;
    $("saveloadList").onclick = (e) => {
      const b = e.target.closest && e.target.closest("button"); if (!b || b.disabled) return;
      const i = parseInt(b.dataset.slot, 10);
      if (b.classList.contains("sl-save")) { if (saveToManual(i)) renderSaveLoad(); }
      else if (b.classList.contains("sl-load")) loadSlot(i);
    };
    $("setBgm").oninput = (e) => { cfg.bgmVol = parseFloat(e.target.value); if (bgmAudio) bgmAudio.volume = bgmVol(); saveCfg(); };
    $("setSe").oninput = (e) => { cfg.seVol = parseFloat(e.target.value); saveCfg(); };
    $("setMute").onchange = (e) => { cfg.mute = e.target.checked; if (bgmAudio) bgmAudio.volume = bgmVol(); saveCfg(); };
    [].forEach.call(document.querySelectorAll("#settingsModal [data-speed]"), (b) => { b.onclick = () => { cfg.textSpeed = b.dataset.speed; saveCfg(); openSettings(); }; });

    showScreen("title");

    // 開場 loading overlay：等字型＋標題 KV＋全部圖素材就緒（封頂 12s 安全閥）再淡出，
    // 進場前把立繪/CG/背景讀完 → 遊戲中不再有圖片 pop-in（取代 webp 壓縮路線）。(P1-7 擴充)
    const revealApp = () => { const o = $("loadingOverlay"); if (o) o.classList.add("done"); };
    // 蒐集 manifest 內所有圖片 URL（characters 含 @masks／cg／background；bgm/se 不算圖、不預載）
    const collectImageUrls = () => {
      const urls = new Set();
      const walk = (o) => { for (const k in o) { const v = o[k]; if (typeof v === "string") { if (v && !/\.(mp4|webm|mov)$/i.test(v)) urls.add(v); } else if (v && typeof v === "object") walk(v); } };  // 跳過影片：new Image() 抓 mp4 只會白下載又解碼失敗
      const a = H.assets || {}; walk(a.characters || {}); walk(a.cg || {}); walk(a.background || {});
      return [...urls];
    };
    const ldp = $("ldProgress");
    const preloadImages = () => {
      const urls = collectImageUrls(); const total = urls.length; let done = 0;
      if (!total) return Promise.resolve();
      return new Promise((resolve) => {
        const tick = () => { done++; if (ldp) ldp.textContent = done >= total ? "" : "載入素材 " + Math.round(done / total * 100) + "%"; if (done >= total) resolve(); };
        urls.forEach((u) => { const im = new Image(); im.onload = tick; im.onerror = tick; im.src = u; }); // onerror 也計數：缺圖不卡關
      });
    };
    const kv = new Image(); kv.src = "assets/ui/title_kv.webp";
    const fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    const kvReady = new Promise((res) => { kv.onload = res; kv.onerror = res; });
    const imagesReady = preloadImages();
    preloadSE();                                                         // SE 預熱（不阻塞進場；warm 一次後撞擊聲與 shake 同拍）
    // ponytail: 封頂 12s——本地/快網數秒讀完；慢網最多等 12s 仍進場（之後 pop-in 但可玩），不無限卡
    Promise.race([Promise.all([fontsReady, kvReady, imagesReady]), new Promise((r) => setTimeout(r, 12000))]).then(revealApp);
  }
  boot();
})();
