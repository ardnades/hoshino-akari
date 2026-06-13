/* assets.js —— 素材接入點（manifest）
   ─────────────────────────────────────────────────────────────
   目的：未來接真實立繪 / CG / 背景 / BGM / SE 時，只改本檔，不動引擎。
   現況：全部留空（null / {}），引擎一律 fallback 到 inline SVG（art.js）／CSS 漸層／靜音＋視覺脈衝。
   缺素材永遠不會讓遊戲壞掉。

   替換方式（之後 ComfyUI / 配樂完成再填）：
   - characters[who][expr] = "相對路徑.png"   立繪（who: akari/manager；expr 用 data 裡的表情字串，如 "素顏微笑"）
   - cg[cgKey]            = "相對路徑.png"   單張 CG（cgKey: oden/pudding/cocoa/lipbalm/cat_meet/receipt/note/akari_studio）
   - background[mood]     = "相對路徑.jpg"   背景圖（mood: night/warm/rain/stop/store）
   - bgm[mood]           = "相對路徑.mp3"   背景音樂（並把 enabled.bgm 設 true）
   - se[seKey]           = "相對路徑.wav"   音效（並把 enabled.se 設 true；seKey: rush/bump/wind/tummy/give/steam/buzz…）

   建議素材放在 play/assets/ 下（characters/ cg/ bg/ bgm/ se/）。路徑相對於 play/index.html。
   ───────────────────────────────────────────────────────────── */
window.HOSHINO.assets = {
  // 全域音訊開關：沒有任何音檔前保持 false（避免半套素材出現破音/404）。填好 bgm/se 後再開。
  enabled: { bgm: false, se: false },

  characters: {
    // 星野灯 立繪（P0-C 最小接入）：目前只有一張臉 neutral_guarded，故只接「與中性臉相容」的 expr，
    // 依口罩狀態分流到 3 張半身去背 PNG（bust，含 alpha）；其餘情緒明確的 expr 一律留空，走 art.js 的 SVG fallback。
    // maskhalf（口罩拉到下巴）白口罩疊白圍巾辨識度較低，僅接少數「卸下戒備／神情鬆動」的過渡台詞。
    // 全身 full 立繪本輪不接（引擎單一 sprite 槽以 expr 為鍵，bust 為對話用立繪）。素材在 ../../../public/.../approved，
    // 已複製進 play/assets/characters/ 使路徑自洽（相對 index.html）。
    akari: {
      // —— mask_on：警戒／遮臉／壓帽 ——
      "口罩圍巾": "assets/characters/akari_bust_neutral_guarded_maskon_alpha_v001.png",
      "壓低帽簷": "assets/characters/akari_bust_neutral_guarded_maskon_alpha_v001.png",
      "拉低帽簷": "assets/characters/akari_bust_neutral_guarded_maskon_alpha_v001.png",
      "喘氣帽簷低": "assets/characters/akari_bust_neutral_guarded_maskon_alpha_v001.png",
      "警戒": "assets/characters/akari_bust_neutral_guarded_maskon_alpha_v001.png",
      "戒備遮臉": "assets/characters/akari_bust_neutral_guarded_maskon_alpha_v001.png",
      "圍巾遮臉": "assets/characters/akari_bust_neutral_guarded_maskon_alpha_v001.png",
      "看玻璃門眼神警戒": "assets/characters/akari_bust_neutral_guarded_maskon_alpha_v001.png",
      // —— mask_off：素顏／中性／放鬆 ——
      "素顏": "assets/characters/akari_bust_neutral_guarded_maskoff_alpha_v001.png",
      "素顏微笑": "assets/characters/akari_bust_neutral_guarded_maskoff_alpha_v001.png",
      "素顏感笑": "assets/characters/akari_bust_neutral_guarded_maskoff_alpha_v001.png",
      "無表情": "assets/characters/akari_bust_neutral_guarded_maskoff_alpha_v001.png",
      "遠目": "assets/characters/akari_bust_neutral_guarded_maskoff_alpha_v001.png",
      "貼罐子放鬆": "assets/characters/akari_bust_neutral_guarded_maskoff_alpha_v001.png",
      // —— mask_half：過渡／卸下戒備（白口罩辨識度低，僅少量）——
      "鬆動": "assets/characters/akari_bust_neutral_guarded_maskhalf_alpha_v001.png",
      "眼神放軟": "assets/characters/akari_bust_neutral_guarded_maskhalf_alpha_v001.png",
    },
    // manager: {},  // 經理人立繪本輪不接
  },
  cg: {
    // oden: "assets/cg/oden.png", pudding: "assets/cg/pudding.png", ...
  },
  background: {
    // night: "assets/bg/night.jpg", rain: "assets/bg/rain.jpg", ...
  },
  bgm: {
    // night: "assets/bgm/night.mp3", rain: "assets/bgm/rain.mp3", warm: "assets/bgm/warm.mp3", ...
  },
  se: {
    // rush: "assets/se/rush.wav", bump: "assets/se/bump.wav", ...
  },
};
