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
  // bgm 已接（Incompetech CC-BY 真人曲）＋ se 已接（freesound CC0，33 個）→ 兩者皆開。
  enabled: { bgm: true, se: true },

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

      // —— ep20 cowboy master-body 新立繪（base 層，大腿以上；6 表情；可疊 @masks 口罩 overlay）——
      //    用法：node { who:"akari", expr:"微笑", mask:"口罩" } → 微笑底 + 口罩 overlay（同 832×1216 畫布自動對位）。
      //    純新增、不動既有 expr 映射；待整套劇情改用新立繪時，再把舊 expr 指到這批即可。
      "中性": "assets/characters/akari_cb_neutral.png",
      "微笑": "assets/characters/akari_cb_smile.png",
      "藏不住的笑": "assets/characters/akari_cb_smile.png",   // Day1「噗哧笑出來」drop-in 別名→微笑
      "嘴硬": "assets/characters/akari_cb_pouty.png",
      "別開視線": "assets/characters/akari_cb_shy.png",
      "平靜": "assets/characters/akari_cb_accept.png",
      "為難": "assets/characters/akari_cb_troubled.png",
      "背對": "assets/characters/akari_cb_pullcap.png",   // 3/4 背影離場（Day1 結尾「拉低帽子，轉身走進黑暗」）：一手抬起壓低帽簷＋白口罩，整圖去背（s89104，更配文字）。無壓帽手版見 akari_cb_back_masked.png；素顏版 akari_cb_back.png
      // —— Day6 角度錨點（雨棚並肩/擦身）：整圖去背、白口罩烤入、不疊 frontal overlay。已就位待用；劇情逐行 line 接入待 Day6 場景確認 ——
      "側身": "assets/characters/akari_cb_side.png",        // s89001 側面：朝前走、視線望側前、不看鏡頭（QC canon8.5/defect7）
      "走遠": "assets/characters/akari_cb_back_walk.png",   // s89013 後3/4 背影：臉幾乎不露、白口罩可見（QC 8/8，比 akari_cb_back_masked 更乾淨，可考慮替換「背對」）

      // —— @masks：口罩 overlay（mask-only 透明 PNG，疊在以上 base 立繪上；node 加 mask:"口罩"/"半罩" 套用）——
      "@masks": {
        "口罩": "assets/characters/akari_mask_on_overlay.png",
        "半罩": "assets/characters/akari_mask_half_overlay.png",
      },
    },
    // manager: {},  // 經理人立繪本輪不接
  },
  cg: {
    // oden: "assets/cg/oden.png", pudding: "assets/cg/pudding.png", ...
  },
  background: {
    // —— mood 後備：scene 無 bg 時依 mood(night/warm/rain/stop/store) 取圖，缺則 CSS 漸層 ——
    night: "assets/bg/bg_conv_backalley_night.webp",   // 冬夜便利店後巷（mood 後備；2026-06-16 改用新後巷 webp，輕量）
    // —— 地點＋情緒色背景：scene.bg / line.bg 指定（832×1216 anime 水彩、無人物；色調依劇本暖/冷/neutral）——
    bg_conv_backalley_night:       "assets/bg/bg_conv_backalley_night.webp",       // 後巷・初遇暖
    bg_conv_backalley_empty_cold:  "assets/bg/bg_conv_backalley_empty_cold.webp",  // 後巷・她沒來冷
    bg_conv_front_night:           "assets/bg/bg_conv_front_night.webp",           // 店門口・夜
    bg_conv_interior_warm:         "assets/bg/bg_conv_interior_warm.webp",         // 店內・暖
    bg_conv_dessert_case:          "assets/bg/bg_conv_dessert_case.webp",          // 甜點櫃・暖（Day3 就你了）
    bg_conv_dessert_case_cold:     "assets/bg/bg_conv_dessert_case_cold.webp",     // 甜點櫃・冷（苦結局自買）
    bg_vending_parking_night:      "assets/bg/bg_vending_parking_night.webp",      // 販賣機停車場・暖
    bg_vending_parking_empty_cold: "assets/bg/bg_vending_parking_empty_cold.webp", // 販賣機・空椅冷
    bg_office_day_warm:            "assets/bg/bg_office_day_warm.webp",            // 公司午休・冷白
    bg_office_entrance_night:      "assets/bg/bg_office_entrance_night.webp",      // 公司門口・夜冷白
    bg_office_meeting:             "assets/bg/bg_office_meeting.webp",             // 會議室・冷白
    bg_room_night:                 "assets/bg/bg_room_night.webp",                 // 主角房間・夜
    bg_arcade_rain_night:          "assets/bg/bg_arcade_rain_night.webp",          // 雨棚下・Day6
    bg_arcade_end_twilight:        "assets/bg/bg_arcade_end_twilight.webp",        // 雨棚盡頭・Day7 傍晚告別
    bg_street_evening:             "assets/bg/bg_street_evening.webp",             // 回家路・傍晚
    bg_street_night_cold:          "assets/bg/bg_street_night_cold.webp",          // 回家路・深夜冷
    bg_train_warm:                 "assets/bg/bg_train_warm.webp",                 // 電車・暖（後日談）
    bg_train_night_cold:           "assets/bg/bg_train_night_cold.webp",           // 電車・冷夜
    bg_photo_studio_hidden:        "assets/bg/bg_photo_studio_hidden.webp",        // 攝影棚・hidden POV
  },
  bgm: {
    // ACE-Step 生成的 4 軌循環 BGM（mood→檔；engine 對 "stop" 一律靜音故不接）。seed 90001 版，候選在 _qc_bgm_20260616。
    night: "assets/bgm/night.mp3",   // 冬夜後巷・lofi 暖中帶冷
    warm:  "assets/bgm/warm.mp3",    // 溫暖/期待/後日談
    rain:  "assets/bgm/rain.mp3",    // 雨棚・溫柔微張
    store: "assets/bgm/store.mp3",   // 便利店內・chillhop
  },
  se: {
    // freesound CC0（公有領域、可商用、免標註）。33 個 key→mp3；來源見 assets/se/_sources.json。
    // 我聽不到音檔，部分自動挑選可能不貼切（需試聽微調）；缺檔/未接的 key 仍只有視覺脈衝、不會壞。
    door: "assets/se/door.mp3",       fridge: "assets/se/fridge.mp3",   heater: "assets/se/heater.mp3",
    beep: "assets/se/beep.mp3",       coin: "assets/se/coin.mp3",       count: "assets/se/count.mp3",
    receipt: "assets/se/receipt.mp3", bag: "assets/se/bag.mp3",         store: "assets/se/store.mp3",
    steam: "assets/se/steam.mp3",     rain: "assets/se/rain.mp3",       wind: "assets/se/wind.mp3",
    fog: "assets/se/fog.mp3",         give: "assets/se/give.mp3",       toss: "assets/se/toss.mp3",
    pat: "assets/se/pat.mp3",         tap: "assets/se/tap.mp3",         stick: "assets/se/stick.mp3",
    swipe: "assets/se/swipe.mp3",     cloth: "assets/se/cloth.mp3",     paper: "assets/se/paper.mp3",
    pebble: "assets/se/pebble.mp3",   mask: "assets/se/mask.mp3",       rush: "assets/se/rush.mp3",
    step: "assets/se/step.mp3",       tiptoe: "assets/se/tiptoe.mp3",   stop: "assets/se/stop.mp3",
    car: "assets/se/car.mp3",         buzz: "assets/se/buzz.mp3",       call: "assets/se/call.mp3",
    flash: "assets/se/flash.mp3",     bump: "assets/se/bump.mp3",       tummy: "assets/se/tummy.mp3",
    impact: "assets/se/impact.mp3",   // 灯衝過來「肩膀重重一撞」用（重體撞擊，比 bump 的輕 thud 有力；bump 留給販賣機「咚」）
  },
};
