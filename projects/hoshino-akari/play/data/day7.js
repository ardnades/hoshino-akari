/* Day7 —— 最終話・命運結算與告別（傍晚 17:40 商店街雨棚盡頭；後日談在 endings.js 依結局調味）
   ─────────────────────────────────────────────────────────────
   本夜計分（嚴格照 spec/26 §1＋gate-zero-A 修正；禁自創／禁加碼）：
   ・開場固定旁白 add:{heat:10}（曝光線底數第五筆＝最後一筆，寫死非選項；掛在 S1 開場那拍）。
   ・命運抉擇 gate cond:"stance<=-3" 分流（包住 S6 之後的高潮抉擇與告別）：
       then（A 線・一直幫她逃）：〔跟我走＝挽留〕不 set let_her_go ／〔成全放手〕set let_her_go。
       else（B 線・一直逼她面對）：
         〔逼她說出要什麼並替她擋臉送走〕add {awareness:1, affection:1}（affection:1＝fate_top 專屬 bond 緩衝，達 bond5），
             set pushed_to_choose, set let_her_go。
         〔不放手不逼＝停在原地〕→ 子抉擇：
             〔差一步／接住那句沒說完的話〕set almost_confession_flag（hidden_pov）。
             〔把話收住〕不 set 任何 flag（warm_true，不被 hidden_pov 截）。
   ・冷淡通道：B 線「如果妳說不算我也不意外」add:{regret:1}（湊 regret≥3 落 bitter）。
   ・d7s6「下次」保留 flag:{d7_food_pudding}（endings.js 讀取）；d7s3 讀紙片純 flavor（無計分）。
   ・不得新增 helped_her_escape／gambled_on_being_seen（那是 D4／D6）；heat 只有開場 +10。
   連戲：開頭接 D6（地點全暴露、明天最後工作）；A／B 由 D2＋D4 stance 合計決定；
     命運旗標（let_her_go／almost_confession_flag／pushed_to_choose）在此落地 → 7 結局全可達；
     告別後接 endings.js 後日談。tag_banter（D6）／seen_through_flag（D1）gate 回扣保留。 */
window.HOSHINO.days[7] = [
  /* ===== D7-S1 下午・公司：標籤縫裡的紙片（開場 heat 底數） ===== */
  { type: "scene", place: "下午・公司", time: "午休～下午", mood: "warm", bg: "bg_office_day_warm" },

  { type: "line", who: "narration", text: "最後一天。", bgm: "warm", speed: "slow" },
  { type: "line", who: "narration", text: "我知道。" },
  { type: "line", who: "narration", text: "今天下午的排程是空的。請假單上填的是「私用」。兩個字，寫起來很普通。" },
  /* ↓ 開場固定旁白 add:{heat:10}（D7 曝光線底數第五筆＝最後一筆；掛在「外面還在發酵」這拍） */
  { type: "line", who: "narration", text: "可是早上滑開推薦欄，昨晚那張雨棚的糊照，還在被人一遍一遍地轉。", speed: "slow", pause: 0.6, add: { heat: 10 } },
  { type: "line", who: "narration", text: "沒有人認得出那是誰。只是熱度自己在那裡，不肯停。", speed: "slow" },

  { type: "line", who: "narration", text: "午休，我又摸到口袋裡的護唇膏。這幾天，它一直在那裡。" },
  { type: "line", who: "narration", text: "便利商店不能去了。販賣機不能去了。雨棚也用過一次，不能再用。" },
  { type: "line", who: "narration", text: "那個凌晨一點的小世界，已經沒有入口。" },
  { type: "line", who: "narration", text: "但我還是把護唇膏，帶在身上。" },
  { type: "line", who: "narration", text: "今天不是去等她。今天是去把東西，還回去。" },
  { type: "line", who: "narration", text: "……至少，我是這樣告訴自己的。", pause: 0.8 },

  { type: "line", who: "narration", text: "下午，我拿出護唇膏，想再確認一次它還在。" },
  { type: "line", who: "narration", text: "外殼上那圈印著成分的標籤，有一角翹起來。", se: "paper", depth: "near" },
  { type: "line", who: "narration", text: "不太對。昨天還好好的。" },
  { type: "line", who: "narration", text: "我用指甲，從標籤的縫裡，挑出一小片捲起來的紙。", se: "paper", pause: 0.6, depth: "near" },
  { type: "line", who: "narration", text: "捲得很緊。緊到一看就知道，是有人趁我沒注意的時候，慢慢塞進去的。", speed: "slow" },
  { type: "line", who: "narration", text: "攤開。", pause: 1.0, camera: { op: "push", amount: "medium", duration: 600 } },
  { type: "line", who: "narration", text: "沒有字。", cg: "note", pause: 0.8 },
  { type: "line", who: "narration", text: "她不寫字。她畫圖。畫圖比較像回信。", speed: "slow", pause: 0.6 },
  { type: "line", who: "narration", text: "只有一個歪歪的肉球印。旁邊寫著一個數字：", pause: 0.4 },
  { type: "line", who: "narration", text: "17:40。", speed: "instant" },
  { type: "line", who: "narration", text: "肉球印下面，畫了一條斜斜的線。線的盡頭，點著一盞小小的燈。" },
  { type: "line", who: "narration", text: "我認得那條線。是雨棚。還有，雨棚到頭的那盞路燈。", speed: "slow" },
  { type: "line", who: "narration", text: "昨天，我們分開的那個地方。", speed: "slow", pause: 0.6 },
  { type: "line", who: "narration", text: "我想起昨天，她把護唇膏塞回我手裡之前，握了好久。原來，是在做這個。", speed: "slow", pause: 0.8 },
  { type: "line", who: "narration", text: "我把那片紙，收進口袋。", cg: "clear", camera: { op: "reset", duration: 400 } },
  { type: "line", who: "narration", text: "17:40。冬天，差不多那時候，天就黑了。", speed: "slow", pause: 0.6 },

  /* ===== D7-S2 傍晚・雨棚盡頭：工作車旁的十分鐘 ===== */
  { type: "scene", place: "傍晚・商店街 雨棚盡頭", time: "傍晚 17:38", mood: "stop", bg: "bg_arcade_end_twilight" },

  { type: "line", who: "narration", text: "冬天的傍晚，黑得很快。", bgm: "stop" },
  { type: "line", who: "narration", text: "商店街的鐵門，白天就拉著，到現在也沒開。雨棚一路延伸到盡頭，接上前面那條大路。" },
  { type: "line", who: "narration", text: "路燈和車燈，亮得有點刺眼。昨天，我們就是在這裡分開的。" },
  { type: "line", who: "narration", text: "我站在雨棚下，靠牆的一側。不擋路。" },
  { type: "line", who: "narration", text: "下班的人偶爾經過，沒有人看我一眼。" },
  { type: "line", who: "narration", text: "我把手插在口袋裡。指尖隔著布，按著那支護唇膏，跟那一小片捲緊的紙。" },
  { type: "line", who: "narration", text: "等。", pause: 0.8 },
  { type: "line", who: "narration", text: "17:39。手機螢幕亮了一下，又暗下去。" },
  { type: "line", who: "narration", text: "我沒有低頭看時間。我知道她會在的時候，才會出現。", speed: "slow", pause: 0.6 },

  { type: "line", who: "narration", text: "一台工作車，停在大路邊。", se: "car" },
  { type: "line", who: "narration", text: "車門開了。先下來的，不是她。", se: "door" },
  { type: "line", who: "narration", text: "是一個穿深色大衣的女人。手裡夾著平板，講話很快。" },
  { type: "line", who: "narration", text: "經理人。星野跟在後面。" },
  { type: "line", who: "narration", text: "她們站在車旁。我屏住呼吸。但她們沒有往雨棚這邊看。" },
  { type: "line", who: "narration", text: "經理人停下來，從外套口袋掏出一個未開封的暖暖包，和一張卡片，一起遞進星野手裡。" },
  { type: "line", who: "manager", text: "「外面冷。」" },
  { type: "line", who: "narration", text: "她頓了一下。" },
  { type: "line", who: "manager", text: "「十分鐘。」", speed: "slow", pause: 0.6 },
  { type: "line", who: "narration", text: "星野停住。" },
  { type: "line", who: "akari", text: "「……可以？」" },
  { type: "line", who: "manager", text: "「不是給妳約會。」", speed: "instant" },
  { type: "line", who: "akari", text: "「那是什麼？」" },
  { type: "line", who: "manager", text: "「整理狀態。」", speed: "instant" },
  { type: "line", who: "narration", text: "星野看著她。" },
  { type: "line", who: "akari", text: "「這個說法，好狡猾。」" },
  { type: "line", who: "manager", text: "「我是經理人。」" },
  { type: "line", who: "narration", text: "經理人把平板夾回腋下。" },
  { type: "line", who: "manager", text: "「這幾天，妳的表情好一點了。」" },
  { type: "line", who: "narration", text: "她停了一下，像在斟酌要不要把後半句說出來。" },
  { type: "line", who: "manager", text: "「但照片不會替妳解釋。」" },
  { type: "line", who: "manager", text: "「十分鐘後沒回來，我會親自去抓妳。」", speed: "instant" },
  { type: "line", who: "narration", text: "說完，她沒有走遠。只退到工作車旁，和工作人員確認行程。" },
  { type: "line", who: "narration", text: "從那裡，她看得見星野的背影。但聽不見我們說話。" },
  /* male-soul BLOCK：刪原兩行「我忽然懂了／包成規則」全知化宣告。改成一個收據式中性動作收尾，不腦補經理人替誰偷。 */
  { type: "line", who: "narration", text: "我把站的位置，又往牆邊靠了半步。把路，讓得更開一點。", depth: "near", pause: 0.6 },
  { type: "line", who: "narration", text: "星野捏著那張房卡，還有那個暖暖包。然後，她朝雨棚這邊，走過來。" },

  /* ===== D7-S3 雨棚下・一步的距離：seen_through 回扣＋讀紙片（純 flavor，無計分） ===== */
  { type: "line", who: "narration", text: "她在離我一步的地方停下。這次，她沒有戴口罩。", pause: 1.2 },
  { type: "line", who: "narration", text: "妝還在。頭髮還綁著拍攝時的馬尾。外面隨便披了一件普通外套。" },
  { type: "line", who: "narration", text: "她看起來，比這幾天的任何一晚，都更像「星野灯」。" },
  { type: "line", who: "narration", text: "但她的眼睛，是那隻在巷子裡偷吃油豆腐的貓。", speed: "slow" },
  { type: "line", who: "akari", text: "「……看夠了沒。」", speed: "slow", expr: "妝容＋塌髮＋貓眼神", motion: "fade_in", depth: "near" },
  { type: "line", who: "me", text: "「抱歉。」", speed: "instant" },
  { type: "line", who: "akari", text: "「沒叫你道歉。」", speed: "instant" },
  { type: "line", who: "narration", text: "她的視線在我臉上停了一下，又移開，像在數雨棚的燈。", depth: "near" },

  /* seen_through_flag 專屬回扣（Day1 戳破鏈） */
  {
    type: "gate", cond: "flag:seen_through_flag",
    then: [
      { type: "line", who: "narration", text: "然後她忽然又看回來。" },
      { type: "line", who: "akari", text: "「你從第一天，就看穿我。」", speed: "slow", pause: 0.8, expr: "嘴硬但眼底鬆", depth: "near" },
      { type: "line", who: "me", text: "「只看到一隻很急的貓。」", speed: "instant" },
      { type: "line", who: "akari", text: "「……哼。」她別開臉，可是沒反駁。", expr: "嘴硬但眼底鬆", depth: "near" },
    ],
  },

  {
    type: "choice", id: "d7s3", prompt: "口袋裡那片紙——",
    options: [
      {
        label: "立刻讀懂，疊好收進胸前口袋。", _dbg: "純語氣（無加分）", flavor: true,
        reaction: [
          { type: "line", who: "narration", text: "那條線、那盞燈、那個 17:40，我都看懂了。" },
          { type: "line", who: "narration", text: "我把那片紙疊好，收進胸前口袋——離心臟最近的那個。" },
          { type: "line", who: "narration", text: "她不知道我已經讀懂。但這封用肉球印寫的信，我接住了。", speed: "slow", pause: 0.6 },
        ],
      },
      {
        label: "先收進口袋，等等再看。", _dbg: "純語氣（無加分）", flavor: true,
        reaction: [
          { type: "line", who: "narration", text: "我把它收進口袋。現在還不能看。" },
          { type: "line", who: "narration", text: "看了，今天大概會更難結束。" },
          { type: "line", who: "narration", text: "但光是知道它在那裡，就夠我把這十分鐘，好好站完。", speed: "slow", pause: 0.6 },
        ],
      },
    ],
  },

  /* ===== D7-S4 護唇膏正面交還・對視（全劇對視最高潮・ev_lipbalm 停駐戲） ===== */
  { type: "line", who: "narration", text: "她伸出手，手心朝上。", se: "cloth", depth: "near" },
  { type: "line", who: "akari", text: "「護唇膏。」" },
  { type: "line", who: "narration", text: "我把手從口袋裡抽出來。" },
  { type: "line", who: "narration", text: "這一次，我沒有先看她的手，也沒有先看她的口袋。", speed: "slow", pause: 0.6 },
  { type: "line", who: "narration", text: "我把護唇膏，放到她手裡。", se: "give", pause: 0.6, cg: "lipbalm", camera: { op: "push", amount: "small", duration: 500 } },
  { type: "line", who: "narration", text: "這次，我看著她。", speed: "slow", pause: 0.8 },
  { type: "line", who: "narration", text: "她也看著我。", cg: "ev_lipbalm", pause: 1.2, camera: { op: "hold" } },
  { type: "line", who: "narration", text: "雨棚的燈，把她半張臉照得很清楚。妝、塌下來的馬尾、還有那雙沒在演任何人的眼睛。", speed: "slow", pause: 1.0 },
  { type: "line", who: "narration", text: "兩個人都沒有把視線移開。", speed: "slow", pause: 1.2 },
  { type: "line", who: "akari", text: "「你今天，看著我了。」", speed: "slow", expr: "直視・眼底鬆嘴硬收起", depth: "near" },
  { type: "line", who: "me", text: "「嗯。」", speed: "instant" },
  { type: "line", who: "narration", text: "她的喉嚨動了一下，像要把什麼嗆回去，又像把什麼吞下來。", depth: "near", pause: 0.8 },
  { type: "line", who: "akari", text: "「那就……」", pause: 2.0 },
  { type: "line", who: "narration", text: "她握住護唇膏。" },
  { type: "line", who: "akari", text: "「算了。」", se: "stop" },
  { type: "line", who: "narration", text: "她沒有把它收進口袋。就那樣握著，握了很久。", speed: "slow", pause: 1.5 },
  { type: "line", who: "narration", text: "握得指節有點發白，像在確認那是真的、不會在她鬆手的下一秒就不見。", speed: "slow", pause: 1.0, cg: "clear", camera: { op: "reset", duration: 400 } },

  /* ===== D7-S5 算數鬥嘴（冷淡通道 regret+1 保留在「說不算」那支） ===== */
  {
    type: "choice", id: "d7s5", prompt: "替她接一句——",
    options: [
      {
        label: "「這次算數了吧。」", _dbg: "純語氣（無加分）", flavor: true,
        reaction: [
          { type: "line", who: "me", text: "「這次算數了吧。」" },
          { type: "line", who: "narration", text: "她瞪我一眼。" },
          { type: "line", who: "akari", text: "「……不准反悔。」" },
          { type: "line", who: "me", text: "「是妳一直反悔。」", speed: "instant" },
          { type: "line", who: "akari", text: "「閉嘴。」", speed: "instant", expr: "嘴硬・眼神鬆", depth: "near" },
          { type: "line", who: "narration", text: "可是她「閉嘴」兩個字，比平常輕。" },
        ],
      },
      {
        label: "「如果妳說不算，我也不意外。」", _dbg: "regret+1（沒接住・冷淡通道）",
        add: { regret: 1 },
        reaction: [
          { type: "line", who: "me", text: "「如果妳說不算，我也不意外。」" },
          { type: "line", who: "narration", text: "她瞪我。" },
          { type: "line", who: "akari", text: "「你把我當成什麼。」" },
          { type: "line", who: "akari", text: "「會反悔的那種？」" },
          { type: "line", who: "akari", text: "「……哼。」", speed: "instant" },
          { type: "line", who: "narration", text: "但她沒有否認。" },
          { type: "line", who: "narration", text: "我也沒有再多說。那句話一出口，我自己就有點後悔。", speed: "slow", pause: 0.6 },
        ],
      },
    ],
  },

  { type: "line", who: "narration", text: "一陣風灌過雨棚，把鐵門吹得輕輕響。", se: "wind", pause: 0.8 },
  { type: "line", who: "narration", text: "她縮了一下肩膀，又放鬆。" },
  { type: "line", who: "narration", text: "大路那頭，經理人抬手看了一下錶。十分鐘，已經走掉一半。", speed: "slow", pause: 0.6 },

  /* ===== D7-S6 命運結算 gate cond:"stance<=-3" 分流（包住高潮抉擇與告別） ===== */
  {
    type: "gate", cond: "stance<=-3",
    then: [
      /* ───── A 線（你一直在幫她逃）：共謀／逃 式告別（較短） ───── */
      { type: "line", who: "narration", text: "這幾天，我陪她偷時間、繞遠路、躲鏡頭。" },
      { type: "line", who: "narration", text: "我們都很清楚，這條路是往哪裡走的。", speed: "slow", pause: 0.6 },
      { type: "line", who: "akari", text: "「明天拍完，我就走了。」" },
      { type: "line", who: "akari", text: "「不是搬到隔壁。是真的，走遠。」", speed: "slow", pause: 0.6 },
      { type: "line", who: "narration", text: "她看著大路那片亮得發白的燈，像在看一條已經買好票的路。" },
      /* akari-soul warn：刪正面「謝謝你陪我繞路」＋charm warn：刪「貓繞路」自我翻譯口號句。感謝改記帳式嘴硬承載。 */
      { type: "line", who: "akari", text: "「這幾天的繞路，算你陪的。」", speed: "slow", pause: 0.8 },

      {
        type: "choice", id: "d7_fate_a", prompt: "她要往那片燈裡走了——",
        options: [
          {
            label: "「跟我走。」", _dbg: "挽留（不 set let_her_go）", hint: "捨不得，壓著聲音說出口的一句",
            reaction: [
              { type: "line", who: "me", text: "「跟我走。」", speed: "slow" },
              /* script-control nit＋male-soul#3：內心反思裁到 2 行；剝掉「輕到我自己都知道」那層自我評註，沉默承重。 */
              { type: "line", who: "narration", text: "三個字，我說得很輕。", speed: "slow", pause: 0.8 },
              { type: "line", who: "narration", text: "她愣了半秒。" },
              { type: "line", who: "akari", text: "「……你知道我不能。」", speed: "slow", expr: "嘴硬但眼底鬆", depth: "near" },
              { type: "line", who: "narration", text: "我知道。" },
              /* akari-soul warn：脆弱不靠旁白「聲音有點抖」翻譯，改身體反應漏；刪撒嬌型「笨蛋」。 */
              { type: "line", who: "narration", text: "她別開臉，喉嚨動了一下，半天才把那句話從牙縫裡擠出來：", depth: "near", pause: 0.6 },
              { type: "line", who: "akari", text: "「……最後一句，留這個。」", speed: "slow", expr: "別開視線", depth: "near", pause: 0.8 },
            ],
          },
          {
            label: "「去吧。我幫妳擋著這頭。」", _dbg: "成全放手（set let_her_go → brave_freedom）", hint: "幫她走向她要去的地方，自己留在原地",
            flag: { let_her_go: true },
            reaction: [
              { type: "line", who: "me", text: "「去吧。」", speed: "slow" },
              { type: "line", who: "narration", text: "我往大路那頭瞄了一眼，把站的位置挪了半步，剛好擋住那個方向可能有的鏡頭。" },
              /* male-soul BLOCK：原 17 字「這頭我幫妳看著。妳走前面那段亮的。」砍到最低限度（5 字），方向下放到動作旁白。 */
              { type: "line", who: "me", text: "「這頭我看著。」", speed: "instant" },
              { type: "line", who: "narration", text: "我用下巴朝大路前面那段亮的方向，輕輕示意了一下。", depth: "near" },
              { type: "line", who: "narration", text: "她沒有馬上動。", pause: 0.6 },
              { type: "line", who: "akari", text: "「……你這樣，很像在趕貓走。」", speed: "slow", expr: "別開視線", depth: "near" },
              /* male-soul WARN＋charm warn：刪 me「是放貓回家」——不替主隱喻蓋章金句。男主只回更鈍的動作。 */
              { type: "line", who: "narration", text: "我沒有接她的話。只是往她和大路之間，又站正了一點。", depth: "near" },
              { type: "line", who: "narration", text: "她看了我很久。" },
              { type: "line", who: "narration", text: "然後點了一下頭，像把什麼很重的東西，輕輕放下了。", speed: "slow", pause: 0.8 },
              { type: "line", who: "akari", text: "「……記得，是你自己讓我走的。」", speed: "slow", pause: 0.8 },
            ],
          },
        ],
      },
    ],
    else: [
      /* ───── B 線（你一直在逼她面對）：溫暖告別（普通很貴＋下次＋命運抉擇） ───── */

      /* 「普通很貴」段（主題用具體物承載，akari 嘴裡不出現主題六詞） */
      { type: "line", who: "akari", text: "「這七天，我沒有變回普通人。」", speed: "slow" },
      { type: "line", who: "me", text: "「嗯。」" },
      { type: "line", who: "akari", text: "「房卡還是別人保管。手機還是會響。明天，我就不在這裡了。」" },
      { type: "line", who: "narration", text: "她看著自己掌心裡的護唇膏。" },
      { type: "line", who: "akari", text: "「但我想起來，自己決定今天吃哪一個，是什麼感覺。」", speed: "slow" },
      { type: "line", who: "me", text: "「……油豆腐？」", cg: "oden", camera: { op: "push", amount: "small", duration: 500 } },
      { type: "line", who: "akari", text: "「還有焦糖布丁。」", cg: "pudding" },
      { type: "line", who: "narration", text: "她說完，自己先笑了一下。", cg: "clear", camera: { op: "reset", duration: 400 } },
      { type: "line", who: "akari", text: "「我以前覺得，普通是很無聊的東西。」" },
      { type: "line", who: "me", text: "「現在呢？」" },
      { type: "line", who: "akari", text: "「現在覺得，」", pause: 1.0 },
      { type: "line", who: "akari", text: "「很貴。」", speed: "slow", pause: 0.8 },
      /* charm warn：「很貴」這拍底下補同框的涼——說完立刻嘴硬岔開的反射動作，讓結論從動作縫隙漏出。 */
      { type: "line", who: "narration", text: "說完，她像是發現自己講太多了，握著護唇膏的手指緊了一下，立刻把頭撇開。", depth: "near", pause: 0.6 },
      { type: "line", who: "akari", text: "「……別記下來。」", speed: "instant", expr: "別開視線", depth: "near" },

      {
        type: "choice", id: "d7s6", prompt: "「下次」——",
        options: [
          {
            label: "「下次再買布丁吧。」", _dbg: "布丁線（set d7_food_pudding，endings 讀取）",
            flag: { d7_food_pudding: true },
            reaction: [
              { type: "line", who: "me", text: "「下次再買布丁吧。」" },
              { type: "line", who: "akari", text: "「……你這人，說話很犯規。」" },
              { type: "line", who: "narration", text: "她別過臉。但握著護唇膏的手，握得更緊。" },
            ],
          },
          {
            label: "「下次再吃油豆腐吧。」", _dbg: "油豆腐線（不 set flag）",
            reaction: [
              { type: "line", who: "me", text: "「下次再吃油豆腐吧。」" },
              { type: "line", who: "narration", text: "她笑了。" },
              { type: "line", who: "akari", text: "「完全沒吃膩。」" },
              { type: "line", who: "me", text: "「我也是。」" },
              { type: "line", who: "akari", text: "「你又沒在減體重。」" },
              { type: "line", who: "me", text: "「……也是。」" },
            ],
          },
        ],
      },

      { type: "line", who: "narration", text: "她抬起頭，看著大路那片亮得發白的燈。" },
      { type: "line", who: "akari", text: "「我不是討厭星野灯。」" },
      { type: "line", who: "me", text: "「嗯。」" },
      { type: "line", who: "akari", text: "「她很厲害。能跳、能唱、能笑給很多人看。」" },
      { type: "line", who: "akari", text: "「只是有時候，」", pause: 0.4 },
      { type: "line", who: "akari", text: "「想確認海報撕下來的後面，還黏著一個誰。」", speed: "slow" },
      /* charm warn＋commercial nit：抽象自剖改物件化（海報撕下來），並讓男主「嗯」後接她自己丟梗破壞氛圍，避免連三句不被打斷的內心剖白。 */
      { type: "line", who: "narration", text: "我沒有說話。" },
      { type: "line", who: "akari", text: "「……幹嘛這種表情。我又沒要你回答。」", speed: "instant", expr: "別開視線", depth: "near" },
      { type: "line", who: "narration", text: "風從大路那頭灌進雨棚。她把外套拉緊了一點。", se: "wind", pause: 0.6 },

      /* 命運抉擇（B 線）：逼送走（fate_top 緩衝＋雙旗）／停在原地（→子抉擇分 hidden_pov vs warm_true） */
      { type: "line", who: "narration", text: "大路那頭，經理人又抬了一次手錶。十分鐘，快到了。", speed: "slow", pause: 0.6 },
      { type: "line", who: "narration", text: "她也看見了。肩膀繃了一下，像被人提醒了什麼。" },
      { type: "line", who: "narration", text: "她張了張嘴，像要說一句什麼，又停在那裡。", depth: "near", pause: 0.8 },

      {
        type: "choice", id: "d7_fate_b", prompt: "十分鐘快到了，她卡在那句沒說出口的話上——",
        options: [
          {
            label: "替她把話接過來：「妳要的，自己說。我幫妳擋著臉，送妳上車。」",
            _dbg: "逼她說＋擋臉送走（awareness+1, affection+1＝fate_top 緩衝；set pushed_to_choose＋let_her_go）",
            hint: "不替她決定，但逼她替自己決定，然後護著她走完最後一段",
            add: { awareness: 1, affection: 1 },
            flag: { pushed_to_choose: true, let_her_go: true },
            reaction: [
              { type: "line", who: "me", text: "「妳要的，自己說。」", speed: "slow" },
              { type: "line", who: "narration", text: "她愣住。" },
              { type: "line", who: "me", text: "「不是我猜。不是經理人替妳安排。」" },
              { type: "line", who: "me", text: "「妳自己想要什麼，妳說。」", speed: "slow", pause: 0.8 },
              { type: "line", who: "narration", text: "她看著我，眼睛裡有什麼東西晃了一下。" },
              /* akari-soul warn（授權內微修）＋charm：主權宣言貼物件、留一根刺，別講太順太完整。 */
              { type: "line", who: "akari", text: "「……明天那個工作，我自己走完。」", speed: "slow", expr: "直視・眼底鬆嘴硬收起", depth: "near" },
              { type: "line", who: "akari", text: "「然後我自己決定，要不要再繞回這條街，買油豆腐。」", speed: "slow", pause: 0.8 },
              { type: "line", who: "narration", text: "說完，她像鬆了一口很長的氣。那是她這七天，第一次替自己把話講完。", speed: "slow", pause: 0.8 },
              { type: "line", who: "me", text: "「好。」", speed: "instant" },
              { type: "line", who: "narration", text: "大路那頭，經理人朝這裡走來。" },
              { type: "line", who: "narration", text: "我往她和那個方向之間挪了半步，用肩膀替她擋住那一側的視線。" },
              { type: "line", who: "narration", text: "讓她可以好好地、不被任何人看見地，把臉上的東西收回去。", speed: "slow", pause: 0.8 },
              { type: "line", who: "akari", text: "「……你今天，很多管閒事。」她的聲音悶悶的。", expr: "別開視線", depth: "near" },
              { type: "line", who: "me", text: "「最後一次。」", speed: "instant", pause: 0.6 },
            ],
          },
          {
            label: "不催她。停在原地，等她。",
            _dbg: "停在原地 → 進入子抉擇（almost_confession_flag 分水嶺）",
            hint: "不放手也不逼，把那句沒說完的話，留給她自己",
            reaction: [
              { type: "line", who: "narration", text: "我沒有替她把話接過去。" },
              { type: "line", who: "narration", text: "也沒有催。就站在離她一步的地方，等。", speed: "slow", pause: 0.8 },
              { type: "line", who: "akari", text: "「如果哪天，」", pause: 0.4 },
              { type: "line", who: "akari", text: "「我真的可以，自己走進便利商店買一次。」", speed: "slow" },

              /* d7s6「下次」回收：布丁版／油豆腐版 */
              {
                type: "gate", cond: "flag:d7_food_pudding",
                then: [
                  { type: "line", who: "akari", text: "「那時候，我會買兩塊油豆腐。一塊給那隻貓。」" },
                  { type: "line", who: "akari", text: "「……再買一個焦糖布丁。」" },
                  { type: "line", who: "me", text: "「布丁給誰？」" },
                  { type: "line", who: "akari", text: "「給——」", speed: "slow", pause: 0.8, expr: "別開視線", depth: "near" },
                ],
                else: [
                  { type: "line", who: "akari", text: "「那時候，我會自己買兩塊油豆腐。」" },
                  { type: "line", who: "me", text: "「一塊不夠？」" },
                  { type: "line", who: "akari", text: "「一塊，留給那隻貓。」" },
                  { type: "line", who: "akari", text: "「另一塊給——」", speed: "slow", pause: 0.8, expr: "別開視線", depth: "near" },
                ],
              },

              { type: "line", who: "manager", text: "「灯，時間。」", speed: "instant", se: "call" },
              { type: "line", who: "narration", text: "經理人的聲音，從大路那頭傳過來。" },
              { type: "line", who: "narration", text: "她的嘴停住。剩下半句，懸在那盞燈底下。", speed: "slow", pause: 1.0 },
              { type: "line", who: "narration", text: "那半句，她差一步就要說出口了。", speed: "slow", pause: 0.8 },

              {
                type: "choice", id: "d7_almost", prompt: "那半句懸在那裡——",
                options: [
                  {
                    label: "輕輕替她把那半句接住：「給我，對吧。」",
                    _dbg: "差一步・接住沒說完的話（set almost_confession_flag → hidden_pov）",
                    hint: "不戳破、不放大，只是讓她知道你聽見了",
                    flag: { almost_confession_flag: true },
                    reaction: [
                      { type: "line", who: "me", text: "「給我，對吧。」", speed: "slow", pause: 0.8 },
                      { type: "line", who: "narration", text: "我說得很輕，輕到只有站在一步之內的人聽得見。" },
                      { type: "line", who: "narration", text: "她沒有承認。" },
                      { type: "line", who: "narration", text: "但她握著護唇膏的手，緊了一下；耳朵，紅了。", speed: "slow", expr: "別開視線", depth: "near", pause: 0.8 },
                      { type: "line", who: "akari", text: "「……你自己說的。我可沒說。」", speed: "slow", pause: 0.8 },
                      { type: "line", who: "narration", text: "她沒有說。可是那半句，已經被我們兩個人，一起放進口袋了。", speed: "slow", pause: 0.8 },
                    ],
                  },
                  {
                    label: "把話收住，不替她接。",
                    _dbg: "收住・不接（不 set 任何 flag → warm_true，不被 hidden_pov 截）", flavor: true,
                    reaction: [
                      { type: "line", who: "narration", text: "我沒有替她把那半句說完。" },
                      { type: "line", who: "narration", text: "有些話，由我接過去，就變成我的了。" },
                      { type: "line", who: "narration", text: "我寧願讓它留在她那裡，留到她哪天願意，自己說完。", speed: "slow", pause: 0.8 },
                      { type: "line", who: "akari", text: "「……算了。」她握緊護唇膏，把剩下的半句，吞了回去。", speed: "slow", expr: "別開視線", depth: "near", pause: 0.8 },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  /* ===== D7-S7 道別尾＋按口袋＋紙片收束（全路徑共用；tag_banter 回扣保留） ===== */
  { type: "line", who: "narration", text: "她回頭，朝大路那頭應了一聲：" },
  { type: "line", who: "akari", text: "「來了。」" },
  { type: "line", who: "narration", text: "那是工作的聲音。" },
  { type: "line", who: "narration", text: "她轉回來，看我。" },
  { type: "line", who: "akari", text: "「我走了。」", speed: "instant" },
  { type: "line", who: "me", text: "「嗯。」", speed: "instant" },
  { type: "line", who: "akari", text: "「……不要又只會嗯。」" },

  {
    type: "choice", id: "d7s7", prompt: "最後一句——",
    options: [
      {
        label: "「再見。」", flavor: true,
        reaction: [
          { type: "line", who: "me", text: "「再見。」" },
          { type: "line", who: "narration", text: "她笑。有點寂寞。" },
          { type: "line", who: "narration", text: "點了點頭。" },
          { type: "line", who: "akari", text: "「嗯。再見。」", expr: "寂寞笑", depth: "near" },
        ],
      },
      {
        label: "「下次見。」", flavor: true,
        reaction: [
          { type: "line", who: "me", text: "「下次見。」" },
          { type: "line", who: "narration", text: "她停了一下。", pause: 1.0 },
          /* Day6 d6s3 語氣回收：鬥嘴→嘴硬討「下次」；坦白→既有「不會說謊」。兩者皆「沒有否定」收束。 */
          {
            type: "gate", cond: "flag:tag_banter",
            then: [ { type: "line", who: "akari", text: "「……下次，也只是剛好同路。」", expr: "寂寞笑", depth: "near" } ],
            else: [ { type: "line", who: "akari", text: "「你真的很不會說謊。」", expr: "寂寞笑", depth: "near" } ],
          },
          { type: "line", who: "narration", text: "但這次，她沒有否定。" },
          { type: "line", who: "narration", text: "她只是把護唇膏，放進外套最裡面的口袋。按了一下。" },
          { type: "line", who: "narration", text: "像在確認，它不會掉。", speed: "slow", pause: 0.6 },
        ],
      },
    ],
  },

  { type: "line", who: "narration", text: "她轉身，走回大路那片光裡。", expr: "走遠", motion: "step_back", depth: "far" },
  { type: "line", who: "narration", text: "工作人員朝她圍過去。有人替她拿東西，有人跟她講明天的行程。" },
  { type: "line", who: "narration", text: "她又變回那個，海報上的星野灯。", speed: "slow" },
  { type: "line", who: "narration", text: "但走到車門邊的時候，她停了半秒。", pause: 1.5 },
  { type: "line", who: "narration", text: "沒有回頭。只把手，按在外套口袋上。", depth: "near" },
  { type: "line", who: "narration", text: "那裡，裝著一支用了七天的護唇膏。", speed: "slow", pause: 0.8 },
  { type: "line", who: "narration", text: "然後，車門關上。", se: "door", clear: true },
  { type: "line", who: "narration", text: "她回到原本的世界。", speed: "slow", pause: 0.8 },

  /* ── 回家路上 ── */
  { type: "scene", place: "深夜・回家路上", time: "當晚", mood: "store", bg: "bg_street_night_cold" },

  { type: "line", who: "narration", text: "我路過那間便利商店。沒有停。只看了一眼玻璃門。", bgm: "store" },
  { type: "line", who: "narration", text: "裡面很亮。關東煮的湯氣，還是把玻璃霧成一片白。", cg: "clear" },
  { type: "line", who: "narration", text: "走回停車場的方向，路過那台販賣機。" },
  { type: "line", who: "narration", text: "那天，我把熱可可放在取出口。不知道她後來，有沒有拿到。", cg: "cocoa" },
  { type: "line", who: "narration", text: "今天，我沒有多買油豆腐。", cg: "clear" },
  { type: "line", who: "narration", text: "因為那一份——已經真的，還給她了。", speed: "slow", pause: 0.6 },

  /* ── 回家：口袋摸到紙片（告別段收束，後日談在 endings.js） ── */
  { type: "line", who: "narration", text: "回到家，我把手伸進口袋。" },
  { type: "line", who: "narration", text: "指尖碰到那一小片紙。", pause: 0.6, camera: { op: "push", amount: "small", duration: 600 }, depth: "near" },
  { type: "line", who: "narration", text: "護唇膏，被她收回去了。" },
  { type: "line", who: "narration", text: "但這片她偷偷塞進標籤縫裡的紙，還留在我口袋裡。" },
  { type: "line", who: "narration", text: "紙上沒有地址。沒有名字。什麼都沒有。" },
  { type: "line", who: "narration", text: "只有一個歪歪的肉球印。", cg: "note_pawonly", pause: 0.8 },
  { type: "line", who: "narration", text: "我看著它，忍不住笑了。" },
  { type: "line", who: "narration", text: "她把該收的，都收走了。就是漏了這隻貓。", speed: "slow", cg: "clear", camera: { op: "reset", duration: 400 } },
];