/* meta.js —— 全域容器、角色設定、結局判定、圖鑑定義
   資料契約（各 dayN.js / endings.js 都遵守）：
   node 形態：
   - {type:"scene", place, time, mood}                        // 場景卡（淡入），mood∈night|warm|rain|stop|store
   - {type:"line", who, text, speed, pause, expr, se, bgm, ui, cg, screen, shake}
       who ∈ "narration"|"me"|"akari"|"manager"
       speed ∈ "normal"|"slow"|"instant"（預設 normal）；pause=該行後停頓秒數
       expr=右上角表情徽章字串；se=音效視覺脈衝(任意字串觸發閃光)；bgm∈night|warm|rain|stop|store|""(維持)
       ui ∈ "sns"(物件{title,posts:[{text,acct?,reply?,num?}]} 放在 line.sns) | "clock"
       unread ∈ {op:"inc",by?:1}|{op:"clear"}|{op:"hold"} ← 右上角未讀紅點；inc 累加並 pulse，clear 隱藏，hold no-op
       camera ∈ {op:"push"|"pan"|"hold"|"reset", amount?:"small"|"medium", duration?:ms} ← #stageVisual 鏡頭；push=scale，pan=translateX，hold=no-op，reset 還原；場景切換自動 reset
       cg = ART key（觸發 CG 覆蓋並解鎖圖鑑該項）；screen="black"；shake=true 文字震動
   - {type:"choice", id, prompt?, options:[ {label, hint?, add?:{score:n}, flag?:{name:bool}, reaction:[node...], flavor?:true} ]}
       flavor:true ← 風味選項（無分歧、或雙選同分）；引擎渲染稍淡，表示「語氣選，不影響結局路線」
       選項播完 reaction 後續接下一個 node（匯合）
   - {type:"gate", cond, then:[node...], else?:[node...]}
       cond 字串：支援 "affection>=2" / "warmth>=5" / "flag:seen_through_flag" / "!flag:xxx"
       可用變數：affection distance awareness regret warmth(=aff-dist) stance heat
*/
window.HOSHINO = { days: {}, endings: {}, meta: {} };

window.HOSHINO.meta = {
  // 專案標記（為未來 multi-game 預留；目前 runtime 僅讀不依賴）
  gameId: "hoshino-akari",
  version: "1.0.0",
  schemaVersion: 1,

  dayCount: 7,

  // 章節中繼資料：Day Start／Day End 卡、dayTag、存檔顯示共用；engine 依此自動播放章節卡
  days: {
    1: { title: "後巷相遇", subtitle: "一隻很急的貓，撞進這個夜晚。" },
    2: { title: "兩塊油豆腐", subtitle: "她第一次自己選的東西。" },
    3: { title: "焦糖布丁", subtitle: "久違的便利商店，自己選，自己付。" },
    4: { title: "赴約的代價", subtitle: "停車場販賣機的兩聲咚。" },
    5: { title: "她不在的那天", subtitle: "人缺席，痕跡卻留下。" },
    6: { title: "並肩的雨棚", subtitle: "不能被同一個鏡頭看成一組人。" },
    7: { title: "最後一次藉口", subtitle: "要還的，從不是那支護唇膏。" },
  },

  names: {
    akari: { label: "星野灯", cls: "akari" },
    me: { label: "我", cls: "me" },
    manager: { label: "經理人", cls: "manager" },
    host: { label: "主持人", cls: "manager" },        // 後日談電車訪談主持人（非經理人；沿用 manager 名牌樣式）
    staff: { label: "工作人員", cls: "manager" },      // hidden_pov_tail 攝影棚收工人員
    narration: { label: "", cls: "narration" },
  },

  // 初始分數（affection=bond / awareness=seen / distance 僅入 warmth / stance 幫她逃(負)↔逼她面對(正) / heat 曝光熱度0-100）
  initScores: { affection: 0, distance: 0, awareness: 0, regret: 0, stance: 0, heat: 0 },

  // 結局判定（D7 結算，由上往下短路；回傳 tone key）
  // 7 命運結局。順序是承重的：true_bad 必排第一（否則被 warm_true 截走）；
  // fate_top/brave_freedom 排在 hidden_pov/warm_true 之前。bond=affection, seen=awareness。
  judge(s, flags) {
    const warmth = s.affection - s.distance;
    const bond = s.affection, seen = s.awareness;
    if (flags.gambled_on_being_seen && s.heat >= 85 && !flags.let_her_go && !flags.pushed_to_choose) return "true_bad";
    if (seen >= 4 && bond >= 5 && flags.pushed_to_choose && flags.let_her_go && s.regret <= 1) return "fate_top";
    if (flags.helped_her_escape && flags.let_her_go && seen < 4 && s.regret <= 2 && bond >= 5) return "brave_freedom";
    if (seen >= 4 && bond >= 5 && flags.sns_post_seen && flags.almost_confession_flag) return "hidden_pov";
    if (warmth >= 5 && seen >= 2 && s.regret <= 2) return "warm_true";
    if (s.regret >= 3) return "bitter";
    return "quiet_normal";
  },

  endingMeta: {
    warm_true:    { badge: "end_warm",   title: "暖・真結局", note: "她願意想像下次；但下次沒有日期。護唇膏物歸原主，藉口結束——甜裡有捨不得。" },
    quiet_normal: { badge: "end_quiet",  title: "靜・常結局", note: "偷來的七天，安靜地還了回去。主角學會自己選——不特別甜，也不特別苦。" },
    bitter:       { badge: "end_bitter", title: "苦・餘味結局", note: "他親手讓溫度降下來。布丁仍自己買，只是話學得太晚，沒能跟她說一聲。" },
    hidden_pov:   { badge: "end_hidden", title: "隱藏・灯視點", note: "唯一一次，她的內心正面給你看半句。她仍選擇不聯絡，把那隻沒被收的貓留在口袋。" },
    fate_top:     { badge: "end_fate",   title: "命運頂結局", note: "甜點櫃前，她第一次替自己選了一次——那班退不掉的票，她沒去趕。你沒攔、也沒替她決定，只是站在原地，看懂了就夠。苦，但是亮的。" },
    brave_freedom:{ badge: "end_brave",  title: "勇敢的自由結局", note: "陪她賭過那幾晚，最後沒把她留下。她往她要去的地方走，腳步輕了一點；你站在雨棚下，沒有追。釋然裡有一塊空，但兩個人都往前了。" },
    true_bad:     { badge: "end_bad",    title: "真壞・永久缺席結局", note: "貪了太多次，那一刻終究被人多看了一眼。熱度一夜燒過頭，連那隻很急的貓，都被路上的燈火淹沒了。她沒再出現——不是誰害的，是時程自己把她收走了。" },
  },

  // 圖鑑（cg key → 分組與說明）。story 中出現對應 cg 即解鎖。
  gallery: {
    anchors: [
      { key: "oden", cap: "油豆腐", note: "她今晚第一次自己選的東西。「沒有人准我吃這個。我自己准的。」" },
      { key: "pudding", cap: "焦糖布丁", note: "甜點櫃前站很久的回憶；「普通的東西，有時候很貴」。" },
      { key: "cocoa", cap: "熱可可", note: "停車場販賣機的兩聲『咚』；她沒選太亮也沒選全暗，挑了剛好能逃走的位置。" },
      { key: "lipbalm", cap: "護唇膏", note: "貫穿七天的藉口。她要還的從不是這支護唇膏。" },
    ],
    signs: [
      { key: "cat_meet", cap: "很急的貓", note: "Day1 後巷。「我只看到一隻很急的貓。」——她決定賭他安全的起點。" },
      { key: "receipt", cap: "收據暗號", note: "Day5 收據雙面：玻璃門打叉、肉球印繞向販賣機。圖不用字，比較像回信。" },
      { key: "note", cap: "標籤縫紙片", note: "Day7 護唇膏標籤縫裡的肉球印＋17:40。她把該收的都收走了，就漏了這隻貓。" },
    ],
    hidden: [
      { key: "akari_studio", cap: "攝影棚的光", note: "（隱藏・灯視點）拍完最後一個工作，她在光裡按著口袋——那隻很急的貓，今天……" },
    ],
  },
};
