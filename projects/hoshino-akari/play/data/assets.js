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
      // —— mask_on（P0-1 修復：bust 缺檔→cb base；用這些 expr 的劇情行需配 mask:"口罩"）——
      "口罩圍巾": "assets/characters/akari_cb_neutral.png",
      "壓低帽簷": "assets/characters/akari_cb_neutral.png",        // 劇情未引用
      "拉低帽簷": "assets/characters/akari_cb_neutral.png",        // 劇情未引用
      "喘氣帽簷低": "assets/characters/akari_cb_troubled.png",
      "警戒": "assets/characters/akari_cb_neutral.png",
      "戒備遮臉": "assets/characters/akari_cb_neutral.png",
      "圍巾遮臉": "assets/characters/akari_cb_scarf_walk.png",   // batch6：3/4 背・圍巾拉高走遠（口罩烤入，不疊 overlay）；Day6:260「連這次都沒看到她的臉」走進大馬路
      "看玻璃門眼神警戒": "assets/characters/akari_cb_neutral.png",
      // —— mask_off（P0-1：bust 缺檔→cb base；素顏，不疊 mask）——
      "素顏": "assets/characters/akari_cb_neutral.png",
      "素顏微笑": "assets/characters/akari_cb_smile.png",
      "素顏感笑": "assets/characters/akari_cb_smile.png",
      "無表情": "assets/characters/akari_cb_neutral.png",
      "遠目": "assets/characters/akari_cb_accept.png",
      "貼罐子放鬆": "assets/characters/akari_cb_shy.png",
      // —— mask_half（P0-1：bust 缺檔→cb base；用這些 expr 的劇情行需配 mask:"半罩"）——
      "鬆動": "assets/characters/akari_cb_shy.png",
      "眼神放軟": "assets/characters/akari_cb_smile.png",

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
      // —— 動作姿勢（batch1，spec/41）：半蹲低姿，白口罩烤入底圖、不疊 frontal overlay；用於「蹲下塞東西／蹲回來寫字／低頭處理手邊」 ——
      "半蹲": "assets/characters/akari_cb_crouch.png",   // crouch_write_s82002 去背（batch_cutout）：低頭、雙手身前持物、戴白口罩、帽簷適中
      "攤手": "assets/characters/akari_cb_handshrug.png",   // batch2：正面攤手聳肩（戴白口罩）；「聳肩」鍵也指到這
      "坐姿": "assets/characters/akari_cb_sit.png",   // batch2：坐長椅捧罐（含長椅、戴白口罩）；用於 Day4 長椅戲坐下那拍
      "背對吃": "assets/characters/akari_cb_back_eat.png",   // batch2：3/4 背對・抬手吃（口罩烤入底圖，不疊 frontal overlay）；Day1:91 背對咬油豆腐
      "全身": "assets/characters/akari_fullbody_maskon.png",   // batch1：全身遠景（mask_on，img2img off v007）；用 depth:"far" 做入場/離席遠景
      "側身咬食": "assets/characters/akari_cb_eat_squint.png",   // waveA：3/4 側拉口罩咬油豆腐・熱氣瞇眼（素顏，口罩拉下）；Day2:118
      "並肩": "assets/characters/akari_cb_side_walk.png",   // batch4：3/4 背・同向往前走（口罩烤入，不疊 overlay）；Day6 雨棚並肩段
      "背對伸手": "assets/characters/akari_cb_hand_out.png",   // batch4：3/4 背・一手向外伸掌心朝上討回（口罩烤入）；Day6:241

      // —— 演出 pass 別名：story data 的情緒描述字串 → 最近似的現有素材（零新圖）——
      // Day2
      "別過視線": "assets/characters/akari_cb_shy.png",          // 側臉迴避 ≈ 別開視線
      "怔住":     "assets/characters/akari_cb_neutral.png",      // 動作停住・驚訝空白 ≈ 中性
      "抓到把柄的笑": "assets/characters/akari_cb_smile.png",    // 得意逮到 ≈ 微笑
      "憋笑":     "assets/characters/akari_cb_smile.png",        // 忍笑 ≈ 微笑
      "收笑":     "assets/characters/akari_cb_accept.png",       // 笑意收起 ≈ 平靜
      "收起玩笑": "assets/characters/akari_cb_accept.png",       // 認真說話 ≈ 平靜
      "立刻嘴硬": "assets/characters/akari_cb_pouty.png",        // 反射性嘴硬 ≈ 嘴硬
      "聳肩":     "assets/characters/akari_cb_handshrug.png",   // batch2：改指到「攤手聳肩」立繪（原為中性 bust）
      // Day3
      "盯著自動門":  "assets/characters/akari_cb_side34.png", // waveA：3/4 側・望門戒備（side34_glance，口罩烤入→劇情行不要再配 mask:"口罩"）
      "心虛":        "assets/characters/akari_cb_troubled.png",  // 心虛 ≈ 為難
      "藏不住的高興":"assets/characters/akari_cb_smile.png",     // = 藏不住的笑
      "不服氣":      "assets/characters/akari_cb_pouty.png",     // 不服氣 ≈ 嘴硬
      "當機":        "assets/characters/akari_cb_neutral.png",   // 當機・凍住 ≈ 中性
      "凝視自己":    "assets/characters/akari_cb_neutral.png", // P0-1：cb base（素顏，不疊 mask）
      "自嘲":        "assets/characters/akari_cb_shy.png",       // 自嘲苦笑 ≈ 別開視線
      "僵硬秒答":    "assets/characters/akari_cb_neutral.png",   // 僵著回答 ≈ 中性
      "慌":          "assets/characters/akari_cb_troubled.png",  // 慌張 ≈ 為難
      "專注數錢":    "assets/characters/akari_cb_accept.png",    // 專注 ≈ 平靜
      "一本正經":    "assets/characters/akari_cb_neutral.png",   // 一本正經 ≈ 中性
      "珍惜":        "assets/characters/akari_cb_hold_prop.png",  // waveA：雙手捧物胸前・低頭凝視（hold_prop_chest，mask_on）；Day3:179 捧布丁
      "眼睛彎":      "assets/characters/akari_cb_closedsmile.png", // day3:192 隔口罩「眼睛彎起來」→ 閉眼笑底；ComfyUI 眼睛 inpaint 於 master，原生 832×1216 → 共用 @masks 口罩 overlay 原生對位（day3 那行配 mask:"口罩"）
      "試探":        "assets/characters/akari_cb_shy.png",       // 試探性回頭 ≈ 別開視線
      "瞪":          "assets/characters/akari_cb_pouty.png",     // 瞪 ≈ 嘴硬
      "淡笑帶酸":    "assets/characters/akari_cb_smile.png",     // 帶苦味的笑 ≈ 微笑
      // Day4
      "直起身嘴硬":  "assets/characters/akari_cb_pouty.png",     // 喘完氣反射性嘴硬 ≈ 嘴硬
      "嘴硬被逗":    "assets/characters/akari_cb_pouty.png",      // 被逗到嘴硬 ≈ 嘴硬
      "看白線出神":  "assets/characters/akari_cb_accept.png",     // 盯停車格白線出神 ≈ 平靜
      "凍手撕蓋":    "assets/characters/akari_cb_look_down.png",   // waveA：低頭看手・雙手胸前操作道具（look_down_handle，mask_on）；Day4:165 撕蓋
      "動作凝滯":    "assets/characters/akari_cb_neutral.png",    // 手機來電・湯匙停在半空 ≈ 中性
      "低頭聲音小":  "assets/characters/akari_cb_shy.png",        // 低頭・聲音小 ≈ 別開視線
      "瞇眼吃焦糖":  "assets/characters/akari_cb_closedsmile.png", // day4:222 吃到焦糖底層・瞇眼 → 閉眼笑（素顏 mask-off，收斂的滿足笑，好感明確但克制）
      "認真點頭微笑":"assets/characters/akari_cb_smile.png",      // 緩慢真誠的點頭 ≈ 微笑
      "耳朵紅低頭":  "assets/characters/akari_cb_shy.png",        // 耳朵紅了・低頭 ≈ 別開視線
      "看螢幕凝重":  "assets/characters/akari_cb_neutral.png",    // 盯著手機螢幕・重量感 ≈ 中性
      "回頭半側臉":  "assets/characters/akari_cb_back_turn.png",   // batch2：改指到「側身回頭」立繪（back_turn_smile_s83002 去背，口罩烤入，不疊 overlay）
      // Day6（並肩・不能看彼此・口罩全程）
      "眼神彎":      "assets/characters/akari_cb_smile.png", // P0-1：cb base（劇情行配 mask:"半罩"）
      "眼神低":      "assets/characters/akari_cb_shy.png",   // P0-1：cb base（劇情行配 mask:"口罩"）
      // Day7（正面相見・素顏・可以 near/closeup）
      "妝容＋塌髮＋貓眼神": "assets/characters/akari_cb_day7.png", // Day7 見面造型：chic 米色針織+牛仔外套+雙馬尾+素顏有妝（denim_s96001）；取代原 catgaze/shy 錯接
      "嘴硬但眼底鬆":       "assets/characters/akari_cb_pouty.png",    // 嘴硬防禦但眼神已在鬆動 ≈ 嘴硬
      "直視・眼底鬆嘴硬收起": "assets/characters/akari_cb_accept.png",  // 護唇膏交還對視・戒心放下 ≈ 平靜
      "嘴硬・眼神鬆":       "assets/characters/akari_cb_pouty.png",    // 說「閉嘴」但眼神已溫 ≈ 嘴硬
      "寂寞笑":             "assets/characters/akari_cb_smile.png",    // 道別・帶一點寂寞的笑 ≈ 微笑

      // —— 「閉眼」立繪：ComfyUI 眼睛 inpaint（face_inpaint_api.json，於 master smile/neutral 只重繪眼睛，雙眼對稱）
      //    → 使用者 PSD 加工合成回 master body 匯出，原生 832×1216 去背、與 cb_* 同幾何（口罩 overlay 原生對位）。
      //    接點：「眼睛彎」(day3:192,+口罩)、「瞇眼吃焦糖」(day4:222,素顏)→ 閉眼笑。單純閉眼暫無 on-canon 接點，先備用不接線。
      "閉眼笑":   "assets/characters/akari_cb_closedsmile.png",  // 閉眼彎眼笑（好感明確但克制）
      "單純閉眼": "assets/characters/akari_cb_closedeyes.png",   // 平靜閉眼・不笑（安心/卸防備一瞬；待 on-canon 接點）
      "閉眼":     "assets/characters/akari_cb_closedeyes.png",   // = 單純閉眼 別名

      // —— @masks：口罩 overlay（mask-only 透明 PNG，疊在以上 base 立繪上；node 加 mask:"口罩"/"半罩" 套用）——
      "@masks": {
        "口罩": "assets/characters/akari_mask_on_overlay.png",
        "半罩": "assets/characters/akari_mask_half_overlay.png",
      },
    },
    // manager: {},  // 經理人立繪本輪不接
  },
    cg: {
    cat_meet: "assets/cg/cat_meet.png",
    ev_interview: "assets/cg/ev_interview.png",   // 三結局訪談剪輯：手機畫面播灯的電視訪談（route B，s97001）；接 endings warm/quiet/bitter「滑到訪談剪輯」→「下車之後」clear
    cocoa: "assets/cg/cocoa.png",
    lipbalm: "assets/cg/lipbalm.png",
    note: "assets/cg/note.png",
    note_pawonly: "assets/cg/note_pawonly.png",   // GPT 生成（皺紙巾＋單一肉球 variant B）→ RMBG 去背；接 D7 結尾
    oden: "assets/cg/oden.png",   // 關東煮杯：單塊三角油豆腐＋蛋（使用者單塊版）。用於 D1:55 她看那袋關東煮 ＋ 回憶 D6:225/D7:156。＝油豆腐錨點（gallery anchor key=oden）。Day1 一塊→Day2 才揭「兩塊」
    oden_solo: "assets/cg/oden_solo.png",   // 單塊油豆腐特寫：D1:91「背對拉口罩咬一口」那一口
    oden_cup: "assets/cg/oden_cup.png",   // 關東煮杯：兩塊三角油豆腐並排（已驗證圖內為兩塊）。用於 D2:80「兩塊油豆腐」、D5:49/171「兩塊並排」（D1:55 已改用單塊 oden）

    pudding: "assets/cg/pudding.png",
    receipt: "assets/cg/receipt.png",
    receipt_back: "assets/cg/receipt_back.png",   // GPT 生成手畫暗號 → RMBG 去背；接 D5「翻到背面」（取代 art.js SVG fallback）
    akari_studio: "assets/cg/akari_studio.webp",   // hidden 結局 CG：攝影棚的灯（Anima char-lock v2 ep20 生成→RMBG 去背→webp/alpha 110KB）；接 endings.js:112，取代 art.js 線稿 fallback
    // —— 主視覺 event CG（spec/31 §2.1；真・一枚絵 galge CG：char-LoRA 0.75 整張融合場景生成，非去背立繪貼底）——
    // 2026-06-18 生成，待逐幕掛 cg: cue。皆 cap-on（LoRA baked，=她公開 canon 常態）；cap-off 揭臉版尚無。
    ev_reveal: "assets/cg/ev_reveal.mp4",        // 【loop 影片版，靜圖 ev_reveal.png 留作底圖/fallback】揭臉對望（使用者最終加工版 ev_reveal.png，修回背部/長髮垂背）：半蹲撿掉落的帽子、回頭 3/4 對視、素顏被撞見、戒備帶尊嚴、微俯角；便利店在框外僅店燈暖光斜灑＋冷藍暗後巷；已掛 day1:13
    ev_signlight: "assets/cg/ev_signlight.mp4", // 【loop 影片版，靜圖 ev_signlight.webp 留作底圖/fallback】招牌光・3/4 背側（NAI 出構圖→Anima i2i dn0.45 鎖灯風/身分）：暖 bokeh 無店面、無豆腐、露一隻 teal 眼、白圍巾裹臉；已掛 day2:119
    ev_umbrella: "assets/cg/ev_umbrella.mp4",   // 【loop 影片版・雙人重做】Day6 雨夜：前景無臉男主背影＋空位＋灯中景低頭走（距離感）；GPT 出構圖→masked-i2i 只重繪灯轉 Ayori 水彩風（男主/背景凍結）→臉部 inpaint 修眼→Grok 動成 loop。靜圖底圖＝ev_umbrella.png（dn50）。已掛 day6:135
    ev_lipbalm: "assets/cg/ev_lipbalm.mp4",     // 【loop 影片版】護唇膏對視 POV：四目對視、護唇膏圓柱遞接、口罩拉下巴。底圖製程 dn55b→嘴部 inpaint 把甜笑改克制(dn55，masked 只動嘴)→Grok 動成 loop。靜圖底圖＝ev_lipbalm.png。已掛 day7:110「她也看著我」（道具 lipbalm 在 L108 遞出那拍）
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
    // freesound CC0（公有領域、可商用、免標註）。來源見 assets/se/_sources.json。
    // 我聽不到音檔，部分自動挑選不貼切；缺檔/空字串的 key 仍只有視覺脈衝、不會壞。
    //
    // ── QA止血 2026-06-17（Step 4.5 FAIL → P0 第1輪「SE 全面止血」）──
    // 玩測回報大量 SE 接錯（收銀聲亂出現、木門聲用在自動門、走路像跑步、手機震動變跑步聲、道具聲接錯…）。
    // 策略：寧願少聲音也不要錯聲音 → 只保留「明確正確且必要」的 5 個 key；其餘暫時靜音（值設 ""，
    // 引擎→null url→只剩視覺脈衝；保留 key 讓 validator 維持 0 warning）。原路徑留在註解，要復原改回即可。
    // 要恢復某個音效：把 "" 換回註解中的路徑（並先試聽確認貼切）。

    // —— 保留（QA 通過：正確且必要）——
    buzz:  "assets/se/buzz.mp3",    // 手機震動（D4/D5/D6）— 必留
    bag:   "",                      // assets/se/bag.mp3 — D4 QA：太長太吵（~146KB≈10s）暫靜音；TODO 需短促「膠袋」素材
    bump:  "assets/se/bump.mp3",    // 販賣機飲品掉落「咚」（D4/D5）— 必留
    flash: "",                      // assets/se/flash.mp3 — 玩測：快門音不貼切；暫靜音；TODO 需正確「相機快門」素材
    impact:"assets/se/impact.mp3",  // D1 開場「肩膀重重一撞」— 正確的撞擊聲、開場鉤子；要拿掉跟我說

    // —— 暫時靜音（QA止血；原路徑在註解，試聽後再逐一恢復）——
    door:   "", // assets/se/door.mp3 — 木門聲用在便利店自動門/車門＝錯；需要「自動門叮咚/滑門」素材
    step:   "", // assets/se/step.mp3 — 走路聲像跑步/多人腳步＝錯；需要「單人輕腳步」素材（可選）
    rush:   "", // assets/se/rush.mp3 — 被誤用成手機震動（已改 buzz）；衝刺聲開場改由 impact 承載
    coin:   "", // assets/se/coin.mp3 — 收銀/數錢聲亂出現
    count:  "", // assets/se/count.mp3 — 收銀/數錢聲亂出現
    beep:   "", // assets/se/beep.mp3 — 掃條碼嗶聲，玩測覺得突兀
    receipt:"", // assets/se/receipt.mp3 — 收據聲接錯
    give:   "", // assets/se/give.mp3 — 「遞/拿」道具聲大面積接錯（護唇膏/可可/布丁/收據）
    pat:    "", // assets/se/pat.mp3 — 摸口袋聲接錯
    fridge: "", // assets/se/fridge.mp3
    heater: "", // assets/se/heater.mp3
    store:  "", // assets/se/store.mp3
    steam:  "", // assets/se/steam.mp3
    rain:   "", // assets/se/rain.mp3 — 與 bgm:rain 重複
    wind:   "", // assets/se/wind.mp3
    fog:    "", // assets/se/fog.mp3
    toss:   "", // assets/se/toss.mp3
    tap:    "", // assets/se/tap.mp3
    stick:  "", // assets/se/stick.mp3
    swipe:  "", // assets/se/swipe.mp3
    cloth:  "", // assets/se/cloth.mp3
    paper:  "", // assets/se/paper.mp3
    pebble: "", // assets/se/pebble.mp3
    mask:   "", // assets/se/mask.mp3
    tiptoe: "", // assets/se/tiptoe.mp3
    stop:   "", // assets/se/stop.mp3
    car:    "", // assets/se/car.mp3
    call:   "", // assets/se/call.mp3
    tummy:  "", // assets/se/tummy.mp3
  },
};
