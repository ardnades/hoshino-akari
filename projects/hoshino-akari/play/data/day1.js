/* Day1 —— 後巷相遇（商業品質擴充版・定錨夜・無新計分）
   契約：D1 為定錨夜，不開結局分支、不 add 任何分數。choice d1s4 兩支皆 flavor，
   僅「戳破她」支 set seen_through_flag（day2/day7 gate 沿用的連戲旗標）。heat 從 D3 才起算。
   必保留錨點：①「我只看到一隻很急的貓」逐字＋cat_meet ②揭臉 ev_reveal 名場面
   ③護唇膏寄放=明天再還的理由 ④「如果明天還在這，就還給你／是還，不是拿回」
   ⑤「沒有人准我吃這個。我自己准的。」⑥毒舌／帽T口罩／空口袋・晚餐被收走（主題承載在旁白／物件，不在 akari 口中）。
   QA 定稿（5 關）：移除 akari 口中主題六詞「自由」［akari-soul/charm/commercial 三票 block］、
   砍俏皮句密度回壓動作［charm］、男主貓梗收短 ≤15［male-soul］、約定改規則包裝＋留白［charm］、
   ev_reveal 在場時 akari 不疊 mask/expr 避免與全幀 CG 打架［commercial nit］、兩支 choice 卸防走不同縫隙［commercial］、
   「數值背叛公司」改具體身體量測［commercial］、移除原 expr:"" 雜訊［script-control nit］。 */
window.HOSHINO.days[1] = [
  { type: "scene", place: "深夜・便利商店 後巷", time: "凌晨一點", mood: "night", bg: "bg_conv_backalley_night" },

  /* ===== D1-S0　雨後的後巷（環境鋪陳） ===== */
  { type: "line", who: "narration", text: "我拎著剛買的關東煮，從便利商店側門繞出來。", bgm: "night" },
  { type: "line", who: "narration", text: "雨剛停。整條後巷還在滴水，屋簷一下、一下，敲在堆好的紙箱上。", speed: "slow" },
  { type: "line", who: "narration", text: "地上的水窪映著招牌的紅光，一被風碰，紅就碎成一片。", pause: 0.5 },
  { type: "line", who: "narration", text: "袋子在我手裡，還溫的。除了我的腳步，這條巷子安靜得有點過頭。", pause: 0.6 },
  { type: "line", who: "narration", text: "——然後巷子另一頭，傳來一陣很急的腳步聲。", speed: "slow", pause: 0.4, se: "step" },
  { type: "line", who: "narration", text: "由遠而近。不是散步的人會有的節奏。是在逃什麼的節奏。", speed: "slow", camera: { op: "push", amount: "small", duration: 700 } },
  { type: "line", who: "narration", text: "有個人影從轉角衝出來，低著頭，全速朝我這邊撞過來。", speed: "instant", se: "rush" },
  { type: "line", who: "akari", text: "「抱歉借過——！」", speed: "instant" },
  { type: "line", who: "narration", text: "來不及閃。肩膀重重一撞，她斜背的小包從肩上滑落。", shake: true, se: "impact", camera: { op: "reset", duration: 200 } },
  { type: "line", who: "narration", text: "鴨舌帽壓得很低、黑色口罩、寬鬆的淡藍色連帽衣。整個人裹得不留一點縫。", speed: "slow" },
  { type: "line", who: "narration", text: "她蹲下去，手忙腳亂地把散出來的東西往回撿。我也跟著蹲下去幫忙。", expr: "半蹲", motion: "fade_in" },
  { type: "line", who: "narration", text: "護唇膏滾到我腳邊。我撿起來，遞過去。", se: "give" },
  { type: "line", who: "narration", text: "就在她伸手來接的那個瞬間——", pause: 0.8, camera: { op: "push", amount: "medium", duration: 600 } },

  /* ===== D1-S1　揭臉（ev_reveal 名場面・停駐約一分鐘）
     注意：ev_reveal 是全幀 event CG（素顏揭臉）。在它顯示期間，akari 行不疊 mask:"口罩"／expr，
     讓 CG 獨挑畫面、避免「剛被掀掉帽子露臉，立繪卻又戴口罩」的語意打架（commercial nit）。
     等「噗哧一聲」那行 cg:"clear" 收回 CG，才在 L『藏不住的笑』起恢復 expr/mask 立繪敘事。 */
  { type: "line", who: "narration", text: "一陣風從巷口灌進來。她的帽子，被掀掉了。", pause: 0.9, se: "wind", cg: "ev_reveal" },
  { type: "line", who: "narration", text: "我愣住。", pause: 0.8, screen: "black" },
  { type: "line", who: "narration", text: "那張臉——這個月在車站、在電視、在我經過的每一面看板上，都笑著對我。", speed: "slow" },
  { type: "line", who: "narration", text: "星野灯。今年最紅的偶像。", speed: "slow", pause: 0.6 },
  { type: "line", who: "narration", text: "可是現在，沒有妝，沒有燈，沒有那個笑。", speed: "slow", camera: { op: "push", amount: "small", duration: 900 } },
  { type: "line", who: "narration", text: "口罩上緣，隨著一次很淺的呼吸起伏。她的瞳孔縮了一下。", speed: "slow", pause: 0.7 },
  { type: "line", who: "narration", text: "那不是被粉絲認出來的眼神。那是——被當場逮到的人，才會有的眼神。", speed: "slow", pause: 0.8 },
  // 男主內心第一行（D1 ≤2 行）：察覺而非試探，不替她翻譯身分層
  { type: "line", who: "me", text: "（我該退開的。）" },
  { type: "line", who: "narration", text: "我沒退。膝蓋還蹲著，遞護唇膏的手停在半空，零點幾秒，沒收回去。", speed: "slow", pause: 0.6 },
  { type: "line", who: "narration", text: "我們蹲在水窪邊對望。三秒。雨水順著屋簷，又滴了一下。", pause: 1.0 },
  { type: "line", who: "akari", text: "「……你看到了。」", speed: "slow" },
  { type: "line", who: "me", text: "「看到什麼？」" },
  { type: "line", who: "narration", text: "我把護唇膏，放進她掌心。", se: "give" },
  { type: "line", who: "me", text: "「我只看到一隻很急的貓。」", speed: "slow", cg: "cat_meet" },
  { type: "line", who: "akari", text: "「貓？」" },
  // male-soul：錨句已乾淨落地，男主回得比她小一號——一句鈍的補刺即收，不展開把哏講滿。
  { type: "line", who: "me", text: "「會撞人的那種。」" },
  { type: "line", who: "narration", text: "她盯著我看了很久，像在確認我這句話是不是陷阱。", pause: 0.6 },
  { type: "line", who: "narration", text: "確認完，她噗哧一聲，笑了出來。", cg: "clear", camera: { op: "reset", duration: 400 } },
  { type: "line", who: "akari", text: "「那隻貓，現在很感謝你。」", expr: "藏不住的笑", mask: "口罩", depth: "near", motion: "step_in" },

  /* ===== D1-S2　空口袋（她檢查、找不到東西的不安） ===== */
  { type: "line", who: "narration", text: "她迅速把帽子戴回去，壓得比剛才更低，蹲在地上把東西一件件塞回小包。", expr: "半蹲", motion: "fade_in" },
  { type: "line", who: "narration", text: "護唇膏。奇異筆。一張房卡。幾張揉皺的便條紙。", pause: 0.4 },
  { type: "line", who: "narration", text: "塞到一半，她的手停住了。", pause: 0.5 },
  { type: "line", who: "narration", text: "她摸了摸連帽衣的口袋。左邊。右邊。又翻回左邊。", se: "pat", depth: "near" },
  { type: "line", who: "narration", text: "動作很快，可是越來越用力——那種，活得很緊的人，下意識在確認自己還剩多少的反射。", speed: "slow", camera: { op: "push", amount: "small", duration: 700 } },
  { type: "line", who: "narration", text: "什麼都沒有。兩個口袋都是空的。", pause: 0.8, camera: { op: "reset", duration: 400 } },
  { type: "line", who: "narration", text: "她別過頭，盯著便利商店那扇亮著的玻璃門，盯了三秒。", expr: "別開視線", mask: "口罩", depth: "far" },
  { type: "line", who: "narration", text: "——肚子，就在這個時候叫了。", se: "tummy", pause: 1.0 },
  { type: "line", who: "akari", text: "「……剛剛那個，也是貓。」", expr: "別開視線", mask: "口罩", depth: "far", motion: "step_back" },
  { type: "line", who: "me", text: "「第二隻？」" },
  { type: "line", who: "akari", text: "「對。一窩的。」", expr: "嘴硬", mask: "口罩" },

  /* ===== D1-S3　被收走的晚餐（主題承載在具體物與留白，不在 akari 口中） ===== */
  { type: "line", who: "narration", text: "我看了看那扇亮著的玻璃門，又看了看她。" },
  { type: "line", who: "me", text: "「妳不進去買？」" },
  { type: "line", who: "narration", text: "她沉默了一下，把空空的口袋整個翻給我看。", pause: 0.6, expr: "平靜", mask: "口罩" },
  { type: "line", who: "akari", text: "「買不了。」" },
  { type: "line", who: "me", text: "「沒帶錢包？」" },
  { type: "line", who: "akari", text: "「連手機，都被收走了。」", expr: "中性", mask: "口罩", motion: "fade_in" },
  // QA 三票 block：移除「自由」。改報被沒收的具體清單，主權與「被管」的涼由旁白＋留白承載。
  { type: "line", who: "akari", text: "「今晚吃哪一塊，本來也不歸我決定。」", speed: "slow", expr: "平靜", mask: "口罩" },
  { type: "line", who: "narration", text: "她說這句的時候，語氣輕得像在報一個跟自己無關的天氣。", speed: "slow", pause: 0.5 },
  // akari-soul：刪「不是我可憐」自我點評（給出脆弱→改漏出）。只留反問擋問題，把球踢回去。
  { type: "line", who: "akari", text: "「你以為偶像，想吃什麼就能吃？」", expr: "嘴硬", mask: "口罩" },
  { type: "line", who: "me", text: "「經紀人？」" },
  { type: "line", who: "akari", text: "「你剛剛不是說，什麼都沒看到嗎？」", expr: "別開視線", mask: "口罩" },
  { type: "line", who: "narration", text: "一句話把我堵回去。我閉嘴了。", pause: 0.5 },
  { type: "line", who: "narration", text: "沉默了幾秒，這次換她先開口。", pause: 0.6 },
  { type: "line", who: "akari", text: "「飯店後門。工作人員在搬器材，沒人看我。」" },
  { type: "line", who: "me", text: "「妳就這樣溜出來？」" },
  { type: "line", who: "akari", text: "「嗯。」" },
  { type: "line", who: "akari", text: "「想在被量身體之前，自己決定一次晚餐。」", speed: "slow", expr: "平靜", mask: "口罩" },
  { type: "line", who: "narration", text: "她的視線，落到我手上那袋還溫著的關東煮。", cg: "oden", depth: "near", camera: { op: "push", amount: "small", duration: 600 } },
  { type: "line", who: "akari", text: "「欸，那個……是你的嗎？」", expr: "別開視線", mask: "口罩" },

  /* ===== D1-S4　choice（語氣分支・無計分・僅戳破支 set 連戲旗標）
     commercial：兩支卸防走不同縫隙——option0「猶豫→放縱」屬 S1 驗證撲空，
     option1「認帳→豪取」她剛賭氣認帳、直接夾最大那塊、不再猶豫挑哪塊。鏡頭與情緒分得開。 */
  {
    type: "choice", id: "d1s4",
    options: [
      {
        label: "「想吃哪個自己挑。」（把袋子放到你們中間）",
        flavor: true,
        reaction: [
          { type: "line", who: "me", text: "「想吃哪個自己挑。」" },
          { type: "line", who: "narration", text: "我沒把袋子遞到她面前，只是放到我們中間的地上，像是它本來就該擺在那裡。", se: "give" },
          { type: "line", who: "narration", text: "她整個人僵住，盯著那袋東西，又抬眼看我，像在等一個附帶條件。", expr: "中性", mask: "口罩", depth: "near" },
          { type: "line", who: "narration", text: "我沒說話。她備好的那句嗆聲，對不上這個場面，卡在喉嚨裡。", pause: 0.6 },
          // option0：保留猶豫挑哪塊的儀式感（S1 驗證撲空）。
          { type: "line", who: "narration", text: "她蹲回來，手在油豆腐和白蘿蔔之間來回。", expr: "半蹲", motion: "fade_in", cg: "oden", depth: "closeup", camera: { op: "push", amount: "medium", duration: 700 } },
          { type: "line", who: "akari", text: "「蘿蔔……熱量低。」", speed: "slow" },
          { type: "line", who: "narration", text: "她的手停在蘿蔔上方。又移開。盯著那塊最大的油豆腐，盯了三秒。", pause: 1.0 },
          { type: "line", who: "akari", text: "「……明天才檢查。」", speed: "slow" },
          { type: "line", who: "narration", text: "她夾起那塊最大的油豆腐。乾淨俐落，沒再猶豫。", cg: "clear", camera: { op: "reset", duration: 400 } },
        ],
      },
      {
        label: "「妳從中午就沒吃了吧。」（戳破她）",
        flavor: true, flag: { seen_through_flag: true },
        reaction: [
          { type: "line", who: "me", text: "「妳從中午就沒吃了吧。」" },
          { type: "line", who: "narration", text: "她肩膀一抖。盯著我的不是臉，是我拿袋子的那隻手。", shake: true, expr: "別開視線", mask: "口罩", depth: "near" },
          { type: "line", who: "akari", text: "「……明早有拍攝前的身體檢查。中午過後，不准進食。」", expr: "別開視線", mask: "口罩" },
          { type: "line", who: "me", text: "「那妳現在偷吃——」", speed: "instant" },
          { type: "line", who: "akari", text: "「噓。」", speed: "instant", expr: "嘴硬", mask: "口罩" },
          // commercial：改具體身體量測語，不用 game-stat 詞「數值」。
          { type: "line", who: "akari", text: "「反正明天一上磅，就全露餡了。」", speed: "instant" },
          // commercial：option1 不再「猶豫挑哪塊」，改「看都沒看蘿蔔、直接夾最大那塊」的賭氣俐落，呼應主權勝利。
          { type: "line", who: "narration", text: "她蹲下去，看都沒看蘿蔔，手就往那塊最大的油豆腐去。", expr: "半蹲", motion: "fade_in", cg: "oden", depth: "closeup", camera: { op: "push", amount: "medium", duration: 700 } },
          { type: "line", who: "akari", text: "「沒有人准我吃這個。」", speed: "slow", pause: 0.5 },
          { type: "line", who: "akari", text: "「我自己准的。」", speed: "slow", cg: "clear", camera: { op: "reset", duration: 400 } },
        ],
      },
    ],
  },

  /* ===== D1-S5　背對偷吃（卸防漏在動作縫隙） ===== */
  { type: "line", who: "narration", text: "她站起來，轉過身去，背對著我。", expr: "背對", motion: "fade_in" },
  { type: "line", who: "narration", text: "確認我看不到正面，才飛快地把口罩拉下半邊，咬了一口。", cg: "oden_solo", expr: "背對吃", depth: "near" },
  { type: "line", who: "narration", text: "我只看得到她的後腦勺。可是她的肩膀，在咬下去那一刻，整個鬆了下來。", speed: "slow", pause: 0.6, camera: { op: "push", amount: "small", duration: 800 } },
  { type: "line", who: "akari", text: "「……好吃。」", speed: "slow", pause: 0.5 },
  { type: "line", who: "narration", text: "聲音比剛才所有的嗆聲都輕。輕到，像是不小心說出來的。", speed: "slow", camera: { op: "reset", duration: 400 } },
  { type: "line", who: "narration", text: "她吃完，把竹籤折好，乖乖放回袋子裡，連湯汁都沒滴在地上。", cg: "clear" },
  // charm：砍俏皮句密度。原「謝謝你，沒有偷看的好人」→改冷的單字回應＋一個不解釋的小動作，
  // 讓上一拍「肩膀鬆下來」獨自承重，稀缺卸防留在動作而非台詞。
  { type: "line", who: "narration", text: "她沒回頭，伸手把口罩往上推回原位，蓋好。", expr: "背對", depth: "near" },
  { type: "line", who: "akari", text: "「……謝了。」", expr: "別開視線", mask: "口罩", motion: "step_in" },

  /* ===== D1-S6　護唇膏寄放＝明天再還的理由 ===== */
  { type: "line", who: "narration", text: "她站起來，卻沒急著走。", pause: 0.6, clear: true },
  { type: "line", who: "narration", text: "她想了一下，又摸出那支奇異筆，蹲回地上，把護唇膏翻過來，在背面寫字。", expr: "半蹲", motion: "fade_in", depth: "near" },
  { type: "line", who: "narration", text: "筆尖在某個地方頓了一下，停了半秒，才繼續寫完。", speed: "slow", pause: 0.5, camera: { op: "push", amount: "small", duration: 700 } },
  { type: "line", who: "narration", text: "寫完，她把護唇膏塞進我手裡，比塞進自己包裡還順手。", se: "give", cg: "lipbalm", camera: { op: "reset", duration: 400 } },
  { type: "line", who: "akari", text: "「這個，先寄放在你這。」" },
  { type: "line", who: "me", text: "「啊？」" },
  // charm：把約定講成完整邀請句少了嘴硬+心虛落差。改規則包裝＋砍短，懸念下放到背面字與動作。
  { type: "line", who: "akari", text: "「明天再還。」", speed: "slow", cg: "clear", expr: "微笑", mask: "口罩", motion: "fade_in" },
  { type: "line", who: "narration", text: "我捏著那支護唇膏。塑膠殼上，還留著她剛才握過的、一點點體溫。", pause: 0.6 },
  { type: "line", who: "me", text: "「……可能會吧。」", speed: "slow" },
  // charm：「你會來嗎」的不安改寫成動作——走兩步又頓住，沒回頭也沒再說。
  { type: "line", who: "narration", text: "她拉低帽子，轉身。走了兩步，又頓住。", expr: "背對", motion: "fade_in", depth: "near", pause: 0.8 },
  { type: "line", who: "narration", text: "她沒回頭，也沒再說什麼。肩膀那裡，好像鬆了一點點。", speed: "slow", pause: 0.5 },
  { type: "line", who: "narration", text: "然後她繼續往前，走進雨後的黑暗裡。", camera: { op: "push", amount: "small", duration: 1000 } },

  /* ===== D1-S7　翻過護唇膏（留白懸念・主題重量由旁白承載） ===== */
  { type: "line", who: "narration", text: "我站在原地，等她的腳步聲完全消失，才把那支護唇膏翻過來。", cg: "lipbalm", clear: true, camera: { op: "reset", duration: 400 } },
  { type: "line", who: "narration", text: "背面，用奇異筆寫著一行小字。", pause: 0.5 },
  { type: "line", who: "narration", text: "「如果明天還在這，就還給你。」", speed: "slow", pause: 0.6 },
  { type: "line", who: "narration", text: "我停住。", pause: 0.8 },
  { type: "line", who: "narration", text: "是還，不是拿回。", speed: "slow", pause: 0.6 },
  { type: "line", who: "narration", text: "她到底，想還我什麼？", speed: "slow", cg: "clear" },
];
