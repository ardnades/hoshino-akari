/*
 * 雨夜偵探社：第七封情書 — 共用邏輯
 * 純靜態、零後端：所有進度只存在玩家瀏覽器的 localStorage。
 * 無任何 API 呼叫、無 API key。
 */
'use strict';

(function (global) {

  // ===== 常數 =====
  var STORAGE_PREFIX = 'rainydetective_';
  var STORY_START_DATE_JST = '2026-06-11'; // Day1 對應的 JST 日期
  var DEMO_UNLOCK_CODE = 'DEMO-TRUE';
  var ALL_PACK_IDS = ['pack_true_case', 'pack_romance', 'pack_secret', 'pack_diary', 'pack_case_file'];
  var ENDING_PACK_MAP = {
    true_case_end: 'pack_true_case',
    romance_end: 'pack_romance',
    secret_end: 'pack_secret'
  };
  var CLUE_NAMES = {
    c01_love_letter: '第一封匿名情書',
    c02_old_photo: '不記得拍過的舊合照',
    c03_ink_smudge: '情書的墨水與描摹筆跡',
    c04_cafe_receipt: '汀屋的收據與監視紀錄',
    c05_clinic_keycard: '螢窗診所門禁卡',
    c06_memory_consent: '記憶處置同意書',
    c07_seventh_letter: '第七封信原稿',
    c08_ryo_record: '白瀨遼的病歷紀錄',
    c09_library_stamp: '圖書館借閱紀錄章',
    c10_yui_voicemail: '結衣的求救語音',
    c11_handwriting_report: '筆跡鑑定報告',
    c12_makabe_file: '真壁的調查檔案',
    c13_rainy_night_news: '三年前的火災報導',
    c14_burner_phone: '預付手機購買紀錄'
  };

  // ===== localStorage 包裝（失敗時印 warning，不 raise）=====
  function storageGet(key, fallback) {
    try {
      var raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (raw === null || raw === undefined) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[rainydetective] storageGet 失敗:', key, e);
      return fallback;
    }
  }

  function storageSet(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('[rainydetective] storageSet 失敗:', key, e);
    }
  }

  function storageRemove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (e) {
      console.warn('[rainydetective] storageRemove 失敗:', key, e);
    }
  }

  function resetProgress() {
    // 重新開始：清掉進度，但保留 18+ 確認、付費解鎖、已完成結局清單、replayCount
    ['currentDay', 'currentScene', 'stats', 'obtainedClues', 'partner', 'partner_name', 'lastEnding',
     'endingJudgedThisRun']
      .forEach(storageRemove);
    // secretRouteRequested 也隨周目重置（下一局重新選擇）
    storageRemove('secretRouteRequested');
  }

  function hasSave() {
    return storageGet('currentDay', null) !== null;
  }

  // ===== JST 日期工具 =====
  function jstTodayString() {
    var jst = new Date(Date.now() + 9 * 3600 * 1000);
    return jst.toISOString().slice(0, 10);
  }

  function dayUnlockDateString(dayNumber) {
    var parts = STORY_START_DATE_JST.split('-');
    var base = Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    var d = new Date(base + (dayNumber - 1) * 86400000);
    return d.toISOString().slice(0, 10);
  }

  function isDayUnlocked(dayNumber) {
    if (storageGet('testMode', false)) return true;
    return jstTodayString() >= dayUnlockDateString(dayNumber);
  }

  // ===== 資料載入（先試 ../content/，失敗再試 content/）=====
  function fetchJsonWithFallback(paths) {
    var i = 0;
    function tryNext() {
      if (i >= paths.length) {
        console.warn('[rainydetective] 所有路徑都載入失敗:', paths);
        return Promise.resolve(null);
      }
      var p = paths[i++];
      return fetch(p).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      }).catch(function (e) {
        console.warn('[rainydetective] 載入失敗，改試下一個路徑:', p, e);
        return tryNext();
      });
    }
    return tryNext();
  }

  function loadStory() {
    return fetchJsonWithFallback(['../content/story.json', 'content/story.json']);
  }

  function loadEndings() {
    return fetchJsonWithFallback(['../content/endings.json', 'content/endings.json']);
  }

  // ===== 數值 =====
  function initStats(story) {
    var stats = {};
    Object.keys(story.stats || {}).forEach(function (k) {
      stats[k] = story.stats[k].start || 0;
    });
    return stats;
  }

  function applyStatDelta(stats, delta, statsDef) {
    if (!delta) return stats;
    Object.keys(delta).forEach(function (k) {
      var def = (statsDef && statsDef[k]) || {};
      var min = typeof def.min === 'number' ? def.min : 0;
      var max = typeof def.max === 'number' ? def.max : 100;
      var cur = typeof stats[k] === 'number' ? stats[k] : (def.start || 0);
      var next = cur + delta[k];
      if (next < min) next = min;
      if (next > max) next = max;
      stats[k] = next;
    });
    return stats;
  }

  // ===== 文字處理 =====
  function fillPartnerName(text, partnerName) {
    if (typeof text !== 'string') return '';
    var name = partnerName || '偵探';
    return text.split('{{partner_name}}').join(name);
  }

  function fillTemplate(text, vars) {
    var out = text || '';
    Object.keys(vars || {}).forEach(function (k) {
      out = out.split('{{' + k + '}}').join(String(vars[k]));
    });
    return out;
  }

  function clueDisplayName(clueId) {
    return CLUE_NAMES[clueId] || clueId;
  }

  // ===== 發話者解析 =====
  function resolveSpeaker(speakerId, story, partnerName) {
    if (speakerId === 'narrator' || speakerId === 'narration' || speakerId === 'system') {
      return { name: '', side: 'narration' };
    }
    if (speakerId === 'player') {
      return { name: '我', side: 'player' };
    }
    if (speakerId === 'partner' || speakerId === 'ren_or_mio') {
      return { name: partnerName || '偵探', side: 'other' };
    }
    var id = speakerId.replace(/^npc_/, '');
    var ch = null;
    if (story && story.characters) {
      for (var i = 0; i < story.characters.length; i++) {
        if (story.characters[i].character_id === id) { ch = story.characters[i]; break; }
      }
    }
    return { name: ch ? fillPartnerName(ch.display_name, partnerName) : id, side: 'other' };
  }

  // ===== 聊天訊息渲染（XSS 防護：一律 textContent，不用 innerHTML 插劇情文字）=====
  function buildMessageElement(message, story, partnerName) {
    var info = resolveSpeaker(message.speaker, story, partnerName);
    var wrap = document.createElement('div');
    wrap.className = 'msg msg-' + info.side;
    if (info.side !== 'narration' && info.name) {
      var nameEl = document.createElement('div');
      nameEl.className = 'msg-name';
      nameEl.textContent = info.name;
      wrap.appendChild(nameEl);
    }
    var bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.textContent = fillPartnerName(message.text, partnerName);
    wrap.appendChild(bubble);
    return wrap;
  }

  // 逐則出現（短延遲動畫）。回傳 Promise。
  function renderMessagesSequentially(container, messages, story, partnerName, delayMs) {
    var delay = typeof delayMs === 'number' ? delayMs : 650;
    return new Promise(function (resolve) {
      var i = 0;
      function next() {
        if (i >= messages.length) { resolve(); return; }
        var el = buildMessageElement(messages[i], story, partnerName);
        container.appendChild(el);
        // 觸發淡入動畫
        requestAnimationFrame(function () { el.classList.add('msg-visible'); });
        scrollToBottom(container);
        i++;
        setTimeout(next, delay);
      }
      next();
    });
  }

  function scrollToBottom(container) {
    try {
      var target = container.closest ? (container.closest('.chat-scroll') || container) : container;
      target.scrollTop = target.scrollHeight;
      window.scrollTo(0, document.body.scrollHeight);
    } catch (e) {
      console.warn('[rainydetective] 捲動失敗:', e);
    }
  }

  // 系統提示（線索取得、數值變化等）
  function appendSystemNote(container, text) {
    var el = document.createElement('div');
    el.className = 'msg msg-system msg-visible';
    el.textContent = text;
    container.appendChild(el);
    scrollToBottom(container);
  }

  // ===== 結局判定 =====
  function statCondHolds(stats, statName, cond) {
    var v = typeof stats[statName] === 'number' ? stats[statName] : 0;
    var ok = true;
    if (typeof cond.gte === 'number') ok = ok && v >= cond.gte;
    if (typeof cond.gt === 'number') ok = ok && v > cond.gt;
    if (typeof cond.lte === 'number') ok = ok && v <= cond.lte;
    if (typeof cond.lt === 'number') ok = ok && v < cond.lt;
    if (typeof cond.eq === 'number') ok = ok && v === cond.eq;
    return ok;
  }

  function checkEndingConditions(ending, stats, clues) {
    var rs = ending.required_stats || {};
    if (rs.fallback) return true;
    if (Array.isArray(rs.any_of)) {
      // 任一成立即觸發（bad_end 形式：數值條件或缺少特定線索）
      return rs.any_of.some(function (cond) {
        if (Array.isArray(cond.missing_clues)) {
          return cond.missing_clues.some(function (c) { return clues.indexOf(c) === -1; });
        }
        return Object.keys(cond).every(function (k) { return statCondHolds(stats, k, cond[k]); });
      });
    }
    var statsOk = Object.keys(rs).every(function (k) { return statCondHolds(stats, k, rs[k]); });
    if (!statsOk) return false;
    var reqClues = ending.required_clues || [];
    var allClues = reqClues.every(function (c) { return clues.indexOf(c) !== -1; });
    if (!allClues) return false;
    var anyOf = ending.required_clues_any_of;
    if (Array.isArray(anyOf) && anyOf.length > 0) {
      var hasAny = anyOf.some(function (c) { return clues.indexOf(c) !== -1; });
      if (!hasAny) return false;
    }
    return true;
  }

  function isEndingUnlocked(ending, unlockedPaid) {
    if (ending.free_or_paid === 'free') return true;
    var packId = ENDING_PACK_MAP[ending.ending_id];
    if (!packId) return true;
    return (unlockedPaid || []).indexOf(packId) !== -1;
  }

  /**
   * 判斷 unlockedPaid 是否包含 secret_end 的解鎖憑據。
   * unlockedPaid 可包含 pack id（如 'pack_secret'）或 'DEMO-TRUE'。
   */
  function isSecretEndUnlocked(unlockedPaid) {
    var list = unlockedPaid || [];
    return list.indexOf('pack_secret') !== -1 || list.indexOf('DEMO-TRUE') !== -1;
  }

  /**
   * 依審計規格的優先序判定結局：
   *   1. secret_end  — 需解鎖 + (completedEndings 含 true_case_end 或 replayCount>=1 或 secretRouteRequested) + 條件成立
   *   2. true_case_end — 條件成立即觸發（付費演出由 ending.html 另行 gate）
   *   3. romance_end  — 條件成立即觸發
   *   4. bad_end     — any_of 條件成立
   *   5. normal_end  — fallback
   *
   * 回傳 { ending, lockedBetter }；lockedBetter 供 ending.html 顯示「已達成但未解鎖」提示。
   */
  function determineEnding(endings, stats, clues, unlockedPaid) {
    var sorted = (endings || []).slice().sort(function (a, b) {
      return (a.priority || 99) - (b.priority || 99);
    });

    // 讀取 replayCount / secretRouteRequested / completedEndings（共用邏輯層讀取）
    var replayCount = storageGet('replayCount', 0);
    var secretRouteRequested = storageGet('secretRouteRequested', false);
    var completedEndings = storageGet('completedEndings', []) || [];

    var lockedBetter = null;

    for (var i = 0; i < sorted.length; i++) {
      var e = sorted[i];

      // ── 步驟二：secret_end 專屬判定 ──
      if (e.ending_id === 'secret_end') {
        // (a) 必須已解鎖
        if (!isSecretEndUnlocked(unlockedPaid)) {
          // 未解鎖：不記為 lockedBetter（secret 不在普通提示範圍）
          continue;
        }
        // (b) 必須滿足二周目/已通關/明確要求其中一項
        var hasRouteAccess = (
          completedEndings.indexOf('true_case_end') !== -1 ||
          replayCount >= 1 ||
          secretRouteRequested === true
        );
        if (!hasRouteAccess) continue;
        // (c) stats/clues 條件（endings.json 為空物件/空陣列，恆成立）
        if (!checkEndingConditions(e, stats, clues)) continue;
        return { ending: e, lockedBetter: lockedBetter };
      }

      // ── 步驟三～四：true_case_end / romance_end ──
      if (e.ending_id === 'true_case_end' || e.ending_id === 'romance_end') {
        if (!checkEndingConditions(e, stats, clues)) continue;
        // 達成條件就觸發；付費完整演出由 ending.html 的 renderEnding gate
        // 若未解鎖，記錄為 lockedBetter 後繼續往下找免費結局
        if (!isEndingUnlocked(e, unlockedPaid)) {
          if (!lockedBetter) lockedBetter = e;
          continue;
        }
        return { ending: e, lockedBetter: lockedBetter };
      }

      // ── 步驟五：bad_end / 步驟六：normal_end（fallback）及其餘結局 ──
      if (!checkEndingConditions(e, stats, clues)) continue;
      return { ending: e, lockedBetter: lockedBetter };
    }

    // 保底：回傳最後一個（normal_end）
    return { ending: sorted.length ? sorted[sorted.length - 1] : null, lockedBetter: lockedBetter };
  }

  // ===== replayCount / secretRouteRequested 輔助 =====
  /**
   * Day7 通關後呼叫，replayCount +1 存回 localStorage。
   * 建議在 ending.html 的 runJudgement() 記錄結局後呼叫。
   */
  function incrementReplayCount() {
    var cur = storageGet('replayCount', 0);
    storageSet('replayCount', cur + 1);
  }

  /**
   * 玩家在 ending.html 或 unlock.html 明確選擇 Secret End 時呼叫。
   * 將 secretRouteRequested 設為 true。
   */
  function requestSecretRoute() {
    storageSet('secretRouteRequested', true);
  }

  // ===== 解鎖碼 =====
  function tryUnlockCode(code, endings) {
    var normalized = String(code || '').trim().toUpperCase();
    if (!normalized) return { ok: false, message: '請輸入解鎖碼。' };
    var validCode = DEMO_UNLOCK_CODE;
    // 以 endings 資料為準（若有提供）
    if (Array.isArray(endings)) {
      for (var i = 0; i < endings.length; i++) {
        if (endings[i].unlock_code) { validCode = String(endings[i].unlock_code).toUpperCase(); break; }
      }
    }
    if (normalized !== validCode) {
      return { ok: false, message: '解鎖碼無效。請確認後再試一次。' };
    }
    var unlocked = storageGet('unlockedPaidContent', []);
    ALL_PACK_IDS.forEach(function (id) {
      if (unlocked.indexOf(id) === -1) unlocked.push(id);
    });
    storageSet('unlockedPaidContent', unlocked);
    return { ok: true, message: '解鎖成功！所有付費補完內容（示範版）已開啟。' };
  }

  // ===== 複製分享文案 =====
  function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function (e) {
        console.warn('[rainydetective] clipboard API 失敗，改用 fallback:', e);
        return legacyCopy(text);
      });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      console.warn('[rainydetective] 複製失敗:', e);
      return false;
    }
  }

  // ===== 匯出 =====
  global.RainyDetective = {
    STORAGE_PREFIX: STORAGE_PREFIX,
    STORY_START_DATE_JST: STORY_START_DATE_JST,
    DEMO_UNLOCK_CODE: DEMO_UNLOCK_CODE,
    ALL_PACK_IDS: ALL_PACK_IDS,
    storageGet: storageGet,
    storageSet: storageSet,
    storageRemove: storageRemove,
    resetProgress: resetProgress,
    hasSave: hasSave,
    jstTodayString: jstTodayString,
    dayUnlockDateString: dayUnlockDateString,
    isDayUnlocked: isDayUnlocked,
    loadStory: loadStory,
    loadEndings: loadEndings,
    initStats: initStats,
    applyStatDelta: applyStatDelta,
    fillPartnerName: fillPartnerName,
    fillTemplate: fillTemplate,
    clueDisplayName: clueDisplayName,
    resolveSpeaker: resolveSpeaker,
    buildMessageElement: buildMessageElement,
    renderMessagesSequentially: renderMessagesSequentially,
    appendSystemNote: appendSystemNote,
    scrollToBottom: scrollToBottom,
    checkEndingConditions: checkEndingConditions,
    determineEnding: determineEnding,
    isEndingUnlocked: isEndingUnlocked,
    isSecretEndUnlocked: isSecretEndUnlocked,
    incrementReplayCount: incrementReplayCount,
    requestSecretRoute: requestSecretRoute,
    tryUnlockCode: tryUnlockCode,
    copyTextToClipboard: copyTextToClipboard
  };

})(typeof window !== 'undefined' ? window : globalThis);
