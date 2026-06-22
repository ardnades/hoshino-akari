/* Day6 —— 並肩的雨棚（第二道 PONR・地點曝光・不能被同一個鏡頭看成一組人）
   ─────────────────────────────────────────────────────────────
   本夜計分（嚴格照 spec/26 §1 D6）：
   ・開場固定旁白 add:{heat:10}（曝光線底數第四筆，寫死非選項；掛在「地點被說出來」那段）。
   ・決定性 PONR ＝ d6_ponr 三選（雨棚並肩、被拍、曝光最緊張那一刻）：
       ① 再走一段＝再偷一晚 → add {stance:-1, affection:+1, heat:+20}（A 線，不 set flag）。
       ② 克制              → add {stance:+1, awareness:+1, heat:-2}（B 線）；reaction 內含雨棚甜點 add:{affection:+1}（B 線專屬，不給再走／賭兩支）。
       ③ 賭被看見＝多偷這一刻 → add {affection:+1, heat:+20}，set gambled_on_being_seen（true_bad 必要旗標）。
   ・heat 只有開場 +10 與 PONR 的 +20／-2／+20；不出現 helped_her_escape／pushed_to_choose／let_her_go。
   ・「不要回頭／像剛好同路」皆 flavor:true（不 add）。tag_banter 為 D7 gate(flag:tag_banter) 讀取的連戲旗標，
     保留在鬥嘴支當純語氣連戲 flag（零加分，鏡像 D1 seen_through_flag），否則 D7 鬥嘴回收不可達。
   連戲：開頭接 D5（地點已暴露）；PONR 決定 true_bad（賭）vs brave_freedom（再走）vs 克制路；結尾「明天再還，最後一次」鋪 D7。 */
window.HOSHINO.days[6] = [
  /* ===== D6-S1 白天・公司：地點被說出來了（開場 heat 底數） ===== */
  { type: "scene", place: "白天・公司", time: "下午", mood: "rain", bg: "bg_office_day_warm" },

  { type: "line", who: "narration", text: "那張販賣機的照片，傳開了。", bgm: "rain", pause: 0.6 },
  { type: "line", who: "narration", text: "我盯著轉貼數字往上跳，一格，又一格。" },
  { type: "line", who: "narration", text: "留言區終於出現那一句。" },

  {
    type: "line", who: "narration", text: "我往下滑著推薦欄。", ui: "sns",
    sns: {
      title: "推薦欄",
      posts: [
        { text: "我知道這間，是車站後面那家。　轉貼 [482]", num: true },
        { text: "（拍的是後方那排自動販賣機）", reply: true },
        { text: "有人要去蹲點嗎？　[211]", num: true },
        { text: "我今晚過去看看。", reply: true },
        { text: "不要造成困擾啦。", reply: true },
      ],
    },
  },

  { type: "line", who: "narration", text: "那間便利商店的位置，被說出來了。", speed: "slow", pause: 0.6 },
  { type: "line", who: "narration", text: "不是猜的。是被人，一個字一個字打在留言裡。", speed: "slow" },
  { type: "line", who: "narration", text: "我把手機收進口袋。" },
  /* ↓ 開場固定旁白 add:{heat:10}（D6 曝光線底數；掛在「地點被說出來」這拍） */
  { type: "line", who: "narration", text: "便利商店，不能去了。", speed: "slow", pause: 0.8, add: { heat: 10 } },
  { type: "line", who: "narration", text: "後巷，也不能去了。", speed: "slow", pause: 0.8 },
  { type: "line", who: "narration", text: "連那台販賣機，都不能去了。", speed: "slow", pause: 0.8 },
  { type: "line", who: "narration", text: "那個只屬於我們兩個人的、凌晨一點的小小夜晚——", pause: 1.0 },
  { type: "line", who: "narration", text: "被世界，找到入口了。", speed: "slow", pause: 1.0, camera: { op: "push", amount: "small", duration: 600 } },
  { type: "line", who: "narration", text: "我握著手機，指尖碰到口袋裡護唇膏的外殼。", se: "pat" },
  { type: "line", who: "narration", text: "隔著一層布，它比手機還燙手。", speed: "slow", pause: 0.8, camera: { op: "reset", duration: 400 } },
  { type: "line", who: "narration", text: "她今天，大概連飯店都出不來。", pause: 0.6 },

  { type: "line", who: "narration", text: "整個下午，我又開了幾次推薦欄。" },
  { type: "line", who: "narration", text: "蹲點的人，從一個，變成一串。" },
  { type: "line", who: "narration", text: "他們在比對招牌、路口、那排販賣機的角度。", speed: "slow" },
  { type: "line", who: "narration", text: "像在拼一張地圖，要把那隻貓，從牠的窩裡翻出來。", speed: "slow", pause: 1.0 },

  { type: "line", who: "narration", text: "下班的時候，外面下著雨。" },
  { type: "line", who: "narration", text: "冬天的雨，又細又冷。", se: "rain" },
  { type: "line", who: "narration", text: "我沒有撐傘。" },
  { type: "line", who: "narration", text: "回家的路上有一段商店街，有長長的雨棚。" },
  { type: "line", who: "narration", text: "便利商店不能去。後巷不能去。販賣機不能去。", speed: "slow" },
  { type: "line", who: "narration", text: "那我還能去哪？", pause: 0.8 },
  { type: "line", who: "narration", text: "……哪裡都不去。", speed: "instant" },
  { type: "line", who: "narration", text: "就走平常那條，回家的路。", pause: 0.6 },

  /* ===== D6-S2 雨棚・相遇：不要回頭（flavor，不 add／不 set） ===== */
  { type: "scene", place: "深夜・商店街 雨棚下", time: "深夜", mood: "rain", bg: "bg_arcade_rain_night" },

  { type: "line", who: "narration", text: "鐵門大半都拉下來了。" },
  { type: "line", who: "narration", text: "只剩雨棚的燈，一盞一盞，把濕掉的地面照成亮黃色。" },
  { type: "line", who: "narration", text: "雨打在棚頂，聲音很密。", se: "rain" },
  { type: "line", who: "narration", text: "密到走在裡面的人，講話不必怕被聽見。", speed: "slow" },
  { type: "line", who: "narration", text: "我把手插進口袋，走在中間。" },
  { type: "line", who: "narration", text: "護唇膏還在。" },

  { type: "line", who: "narration", text: "前面，一個戴口罩、圍著圍巾的人，迎面走來。" },
  { type: "line", who: "narration", text: "低著頭。走得很普通。" },
  { type: "line", who: "narration", text: "普通到，要不是那個身形，我大概就這樣錯過去了。", speed: "slow" },
  { type: "line", who: "narration", text: "擦肩的那一瞬間，那個人沒有停。", se: "give", pause: 0.6 },
  { type: "line", who: "akari", text: "「不要回頭。」", speed: "slow", expr: "口罩圍巾", mask: "口罩", pos: "right", depth: "far", motion: "fade_in" },
  { type: "line", who: "narration", text: "聲音壓得很低，貼著雨聲，剛好只夠我一個人聽見。" },
  { type: "line", who: "narration", text: "然後她繼續往前走，沒有停下半步。" },
  { type: "line", who: "narration", text: "我停了半秒。", pause: 0.8 },
  { type: "line", who: "narration", text: "那個聲音，我認得。", speed: "slow", pause: 0.6 },

  {
    type: "choice", id: "d6s2",
    prompt: "她從我背後擦過去——",
    options: [
      {
        label: "照她說的，不回頭。", flavor: true,
        reaction: [
          { type: "line", who: "narration", text: "我沒有回頭。" },
          { type: "line", who: "narration", text: "腳步放慢，等她繞回來，走到我背後。" },
          { type: "line", who: "akari", text: "「……今天很聽話。」", speed: "slow", expr: "眼神放軟", mask: "半罩", pos: "left", depth: "far" },
          { type: "line", who: "me", text: "「妳說的。」" },
          { type: "line", who: "akari", text: "「嗯。」" },
          { type: "line", who: "akari", text: "「難得。」" },
        ],
      },
      {
        label: "差點回頭，硬忍住。", flavor: true,
        reaction: [
          { type: "line", who: "narration", text: "我的肩膀動了一下，脖子已經要轉。" },
          { type: "line", who: "narration", text: "半路又僵住，轉了回來。" },
          { type: "line", who: "akari", text: "「……差一點。」", speed: "slow", expr: "口罩圍巾", mask: "口罩", pos: "left", depth: "far" },
          { type: "line", who: "me", text: "「沒回頭就好。」" },
          { type: "line", who: "akari", text: "「差點，不算合格。」" },
          { type: "line", who: "narration", text: "但聽得出來，她沒有真的在生氣。" },
        ],
      },
    ],
  },

  /* ===== D6-S3 雨棚・並肩：像剛好同路（同框風險・flavor；tag_banter 為 D7 連戲 flag，零加分） ===== */
  { type: "line", who: "narration", text: "她繞到我側後方，跟我隔著半步，往同一個方向走。", expr: "並肩", motion: "fade_in", depth: "far" },
  { type: "line", who: "me", text: "「妳怎麼知道我會走這裡？」" },
  { type: "line", who: "akari", text: "「便利商店不能去，販賣機也不能去。」" },
  { type: "line", who: "akari", text: "「你回家只剩這條路了。」" },
  { type: "line", who: "me", text: "「妳想到這個？」" },
  { type: "line", who: "akari", text: "「貓看到獵物，盯著不放。」", speed: "instant" },
  { type: "line", who: "narration", text: "她說「獵物」的時候，下巴抬了一下，像那是什麼了不起的偵察成果。" },
  { type: "line", who: "narration", text: "我差點笑出來，又忍住。" },
  { type: "line", who: "akari", text: "「別笑。」" },
  { type: "line", who: "akari", text: "「站著說話太顯眼。」" },
  { type: "line", who: "me", text: "「所以走路？」" },
  { type: "line", who: "akari", text: "「所以走路。」" },
  { type: "line", who: "me", text: "「不看妳？」" },
  { type: "line", who: "akari", text: "「你也不要看我。」" },
  { type: "line", who: "narration", text: "我把視線收回前面那盞燈。" },
  { type: "line", who: "narration", text: "她也把臉，更深地埋進圍巾裡一點。", depth: "far" },
  { type: "line", who: "akari", text: "「不要走太近。」" },
  { type: "line", who: "akari", text: "「也不要離太遠。」" },
  { type: "line", who: "me", text: "「那要怎樣？」" },
  { type: "line", who: "akari", text: "「像剛好同路。」", speed: "slow" },

  {
    type: "choice", id: "d6s3",
    prompt: "半步的距離，一盞一盞燈往後退——",
    options: [
      {
        /* tag_banter＝D7 gate(flag:tag_banter) 讀取的連戲旗標；此支零加分純語氣（鏡像 D1 seen_through_flag）。 */
        label: "「像剛好同路？」", flavor: true,
        flag: { tag_banter: true },
        reaction: [
          { type: "line", who: "me", text: "「像剛好同路？」" },
          { type: "line", who: "akari", text: "「對。」", expr: "眼神彎", mask: "半罩", pos: "right", depth: "far" },
          { type: "line", who: "akari", text: "「今天稍微有點聰明。」" },
          { type: "line", who: "me", text: "「只有今天？」" },
          { type: "line", who: "akari", text: "「別得寸進尺。」" },
        ],
      },
      {
        label: "「很難。」", flavor: true,
        reaction: [
          { type: "line", who: "me", text: "「很難。」" },
          { type: "line", who: "narration", text: "她沉默了半步。", pause: 0.8 },
          { type: "line", who: "akari", text: "「……我也覺得。」", speed: "slow", expr: "眼神低", mask: "口罩", pos: "right", depth: "far" },
          { type: "line", who: "akari", text: "「但今天，只能這樣。」" },
        ],
      },
    ],
  },

  { type: "line", who: "narration", text: "我們並排走在雨棚下。", cg: "ev_umbrella" },
  { type: "line", who: "narration", text: "不看彼此。不叫名字。" },
  { type: "line", who: "narration", text: "半步的縫裡，她的影子和我的影子，被燈光拉長，又被下一盞拆開。", speed: "slow" },
  { type: "line", who: "narration", text: "像兩個剛好同路的陌生人。", pause: 0.8, cg: "clear" },

  /* ===== D6-S4 雨棚・並肩：被拍那秒（名場面・雙向擋鏡頭錯位・純文本零新 flag） ===== */
  { type: "line", who: "narration", text: "前面，店面之間的一個轉角，有個人停著。" },
  { type: "line", who: "narration", text: "我先看見的，是那塊亮起來的螢幕。", speed: "slow", depth: "near" },
  { type: "line", who: "narration", text: "他舉起手機，鏡頭朝著雨棚這一頭。", camera: { op: "push", amount: "medium", duration: 600 } },
  { type: "line", who: "narration", text: "喀。", speed: "instant", se: "flash", shake: true, pause: 0.4 },

  { type: "line", who: "narration", text: "那一秒，兩件事同時發生。" },
  { type: "line", who: "narration", text: "她的手，往內勾住我的袖子，要把我拉進她那一側的陰影。", speed: "slow", depth: "near" },
  { type: "line", who: "narration", text: "我的腳，往外讓了半步，想把自己從她身邊讓開。", speed: "slow", depth: "near" },
  { type: "line", who: "narration", text: "一個往內，一個往外。" },
  { type: "line", who: "narration", text: "方向剛好相反。", speed: "slow", pause: 0.8 },
  { type: "line", who: "narration", text: "兩個人都想替對方擋掉那個鏡頭，卻誰都沒發現，自己擋的方向，正好跟對方相反。", speed: "slow", pause: 1.0 },

  { type: "line", who: "narration", text: "她的手指在我袖子上停了不到半秒。" },
  { type: "line", who: "narration", text: "像碰到燙的，立刻彈開。", speed: "slow", se: "give", pause: 0.8, camera: { op: "reset", duration: 400 } },
  { type: "line", who: "narration", text: "我們之間，多出一個人的距離。", pause: 1.0 },
  { type: "line", who: "narration", text: "那個人收起手機，看都沒往這邊看，走遠了。" },
  { type: "line", who: "narration", text: "大概只是隨手拍了張雨棚的燈。", pause: 0.6 },
  { type: "line", who: "narration", text: "她才慢慢跟上來，把袖口被勾皺的地方，自己壓平。", depth: "far", pause: 0.8 },

  { type: "line", who: "narration", text: "我把多出來的那段距離，留著沒補回去。", pause: 0.8 },
  { type: "line", who: "me", text: "「貓被看到？」" },
  { type: "line", who: "akari", text: "「不是。」" },
  { type: "line", who: "akari", text: "「貓窩，被看到了。」", speed: "slow", pause: 0.8 },
  { type: "line", who: "narration", text: "她沒有再多說。" },
  { type: "line", who: "narration", text: "但那半步的距離，比任何一句話都清楚。", pause: 0.8 },

  /* ===== D6-S5 雨棚・中段：倒數揭露＋油豆腐都還沒吃膩 ===== */
  { type: "line", who: "narration", text: "我們又走過一盞燈。" },
  { type: "line", who: "akari", text: "「經理人，發現了。」" },
  { type: "line", who: "me", text: "「很生氣？」" },
  { type: "line", who: "akari", text: "「沒有。」", pause: 0.8 },
  { type: "line", who: "me", text: "「……那更可怕。」" },
  { type: "line", who: "akari", text: "「她只說，今晚開始，房卡由工作人員保管。」" },
  { type: "line", who: "narration", text: "她頓了一下。", pause: 0.6 },
  { type: "line", who: "akari", text: "「還說，照片被放上去之後，沒有人會照事實寫。」" },
  { type: "line", who: "narration", text: "我沒接話。" },

  { type: "line", who: "akari", text: "「明天，」" },
  { type: "line", who: "akari", text: "「最後一個工作。」" },
  { type: "line", who: "narration", text: "腳步差點停了。" },
  { type: "line", who: "akari", text: "「拍完，我就不住這邊了。」", speed: "slow", pause: 0.8 },
  { type: "line", who: "me", text: "「那便利商店呢？」" },
  { type: "line", who: "akari", text: "「貓會搬家。」" },
  { type: "line", who: "akari", text: "「那條巷子，那台販賣機，都不能再用了。」" },
  { type: "line", who: "narration", text: "她的語氣很平，像在報行程。" },
  { type: "line", who: "narration", text: "我把腳步放慢，配著她，慢了半拍。", pause: 0.8 },

  { type: "line", who: "narration", text: "她的手機，在口袋裡震。", se: "buzz" },
  { type: "line", who: "narration", text: "一次。又一次。", se: "buzz", pause: 0.6 },
  { type: "line", who: "narration", text: "她沒有拿出來。" },
  { type: "line", who: "narration", text: "只是把走在外側的我，不著痕跡地往雨棚柱子的陰影裡帶了半步。", depth: "near" },
  { type: "line", who: "narration", text: "雨還在下。", se: "rain", pause: 0.6 },

  { type: "line", who: "akari", text: "「我以為七天很長。」" },
  { type: "line", who: "me", text: "「現在呢？」" },
  { type: "line", who: "narration", text: "「現在覺得，」她的聲音輕得快被雨聲蓋掉，", pause: 1.0 },
  { type: "line", who: "akari", text: "「油豆腐都還沒吃膩。」", speed: "slow", cg: "oden", expr: "眼神放軟", mask: "半罩", pos: "right", depth: "far" },
  { type: "line", who: "narration", text: "我差點笑出來。", cg: "clear" },
  { type: "line", who: "me", text: "「完全沒有？」" },
  { type: "line", who: "akari", text: "「完全沒有。」" },
  { type: "line", who: "narration", text: "她說完，把臉別回前面，又加了一句，聲音硬回去。" },
  { type: "line", who: "akari", text: "「……剛好而已。」" },

  /* ===== D6-S6 雨棚盡頭・並肩：第二道 PONR（唯一帶計分與旗標的三選） ===== */
  { type: "line", who: "narration", text: "前面，雨棚剩最後一小段。" },
  { type: "line", who: "narration", text: "再過去，就是那條大馬路。路燈、車燈，亮得容不下兩個並排的影子。", speed: "slow" },
  { type: "line", who: "narration", text: "她的腳步，比剛才慢了。" },
  { type: "line", who: "narration", text: "慢到我知道，這半步的距離，再走幾盞燈，就要散了。", speed: "slow", pause: 0.8 },
  { type: "line", who: "narration", text: "雨還在下。手機還在她口袋裡，一下一下地震。", se: "buzz" },
  { type: "line", who: "narration", text: "蹲點的人，也許就在這條街的某個轉角。", speed: "slow", pause: 1.0, camera: { op: "push", amount: "small", duration: 600 } },

  {
    type: "choice", id: "d6_ponr",
    prompt: "雨棚要到頭，半步的距離也快散了——",
    options: [
      {
        label: "「再走一段。繞遠路回去。」",
        hint: "捨不得這半步散掉，多陪她走一段雨棚",
        add: { stance: -1, affection: 1, heat: 20 },
        reaction: [
          { type: "line", who: "me", text: "「再走一段。」" },
          { type: "line", who: "narration", text: "我在雨棚要到頭的地方，往回折，走進另一排還亮著燈的店面下。" },
          { type: "line", who: "narration", text: "她愣了半步，跟上來。" },
          { type: "line", who: "akari", text: "「……繞遠路。」", expr: "眼神放軟", mask: "半罩", pos: "right", depth: "far" },
          { type: "line", who: "me", text: "「貓不是都繞遠路。」" },
          { type: "line", who: "narration", text: "她沒反駁。" },
          { type: "line", who: "narration", text: "腳步配著我，又慢了半拍。", speed: "slow" },
          { type: "line", who: "narration", text: "多走的這一段，雨棚的燈一盞一盞亮著，沒有人來拍，也沒有人來蹲。", speed: "slow", pause: 0.8 },
          { type: "line", who: "akari", text: "「今天的貓，多走了三條街。」" },
          { type: "line", who: "me", text: "「值得嗎？」" },
          { type: "line", who: "akari", text: "「……閉嘴走路。」", speed: "slow", pause: 1.0 },
        ],
      },
      {
        label: "「到這裡就好。妳先走。」",
        hint: "該散就散，保持錯位，不讓你們被同一個鏡頭收走",
        add: { stance: 1, awareness: 1, heat: -2 },
        reaction: [
          { type: "line", who: "me", text: "「到這裡就好。」" },
          { type: "line", who: "narration", text: "我在雨棚盡頭停下，往牆邊讓開，把往前那一段亮路，留給她一個人走。" },
          { type: "line", who: "narration", text: "她也停了。" },
          { type: "line", who: "akari", text: "「……你這次，倒是很懂規矩。」", expr: "眼神低", mask: "口罩", pos: "right", depth: "far" },
          { type: "line", who: "me", text: "「妳教的。」" },
          { type: "line", who: "narration", text: "她沒有馬上走。" },
          { type: "line", who: "narration", text: "在亮路和雨棚的交界上，站了一會。", pause: 0.8 },
          /* ↓ 雨棚甜點 add:{affection:1}（B 線專屬；只掛克制這一支，不給再走／賭兩支） */
          { type: "line", who: "narration", text: "然後她伸手，把我被雨打濕、翹起來的帽 T 帽繩，往領子裡塞好。", speed: "slow", se: "give", depth: "near", add: { affection: 1 } },
          { type: "line", who: "narration", text: "手指在那裡停了不到一秒，又像碰到燙的，收回去。" },
          { type: "line", who: "akari", text: "「……這樣才不顯眼。」她別開臉，「藏好。」", expr: "眼神放軟", mask: "半罩", pos: "right", depth: "far" },
          { type: "line", who: "narration", text: "她先走進亮路，隔著一段距離，不回頭。", speed: "slow", pause: 1.0 },
        ],
      },
      {
        label: "「再多待一會。」",
        hint: "貪這多偷的一刻，被看見的風險我自己扛",
        add: { affection: 1, heat: 20 },
        flag: { gambled_on_being_seen: true },
        reaction: [
          { type: "line", who: "me", text: "「再多待一會。」" },
          { type: "line", who: "narration", text: "我沒有往牆邊讓，也沒有往前折繞遠路。" },
          { type: "line", who: "narration", text: "就在雨棚盡頭、最後一盞燈底下，站著，沒走。", depth: "near" },
          { type: "line", who: "narration", text: "前面那條街某個轉角，也許有人正在等一張更清楚的照片。" },
          { type: "line", who: "narration", text: "更危險。這個我知道——我還是沒走。", speed: "slow", pause: 0.8 },
          { type: "line", who: "akari", text: "「……你瘋了。」她的聲音壓得更低，可是沒有後退。", expr: "眼神低", mask: "口罩", pos: "right", depth: "far" },
          { type: "line", who: "me", text: "「跟妳學的。」" },
          { type: "line", who: "narration", text: "她沒走。" },
          { type: "line", who: "narration", text: "兩個人就站在那盞燈下，多站了一會。雨打在棚頂，很密。", speed: "slow", pause: 1.0 },
          { type: "line", who: "akari", text: "「……記得，是你自己要多站的。」", speed: "slow", pause: 0.8 },
        ],
      },
    ],
  },

  /* ===== D6-S7 商店街盡頭：明天再還，最後一次（鋪 D7） ===== */
  { type: "scene", place: "商店街 盡頭", time: "深夜", mood: "rain", bg: "bg_arcade_rain_night" },

  { type: "line", who: "narration", text: "雨棚到頭了。" },
  { type: "line", who: "narration", text: "前面是一條大馬路。" },
  { type: "line", who: "narration", text: "路燈很亮，車燈很亮。" },
  { type: "line", who: "narration", text: "亮得，容不下兩個並排的影子。" },
  { type: "line", who: "narration", text: "再往前，她就不能和我，走在同一個畫面裡。", speed: "slow", pause: 0.8 },

  { type: "line", who: "narration", text: "她停下來。" },
  { type: "line", who: "narration", text: "沒有回頭。" },
  { type: "line", who: "narration", text: "只伸出一隻手，手心朝上。", expr: "背對伸手", depth: "near" },
  { type: "line", who: "akari", text: "「護唇膏。」", speed: "slow" },
  { type: "line", who: "narration", text: "我把護唇膏，放到她手裡。", cg: "lipbalm", se: "give" },
  { type: "line", who: "narration", text: "她握了一下。" },
  { type: "line", who: "narration", text: "那支用了好幾天的護唇膏，被她整個握進掌心。", pause: 2.0 },
  { type: "line", who: "narration", text: "然後——", pause: 0.6 },
  { type: "line", who: "narration", text: "下一秒，又像被燙到一樣，塞回我手裡。", se: "give", cg: "clear" },
  { type: "line", who: "akari", text: "「明天再還。」", speed: "slow" },
  { type: "line", who: "me", text: "「……又來？」" },
  { type: "line", who: "akari", text: "「今天不算。」" },
  { type: "line", who: "me", text: "「什麼不算？」" },
  { type: "line", who: "akari", text: "「你沒有看著我，把它還給我。」" },
  { type: "line", who: "me", text: "「……不是妳叫我不要看？」" },
  { type: "line", who: "akari", text: "「所以不算。」" },
  { type: "line", who: "narration", text: "她的聲音很輕，卻很硬。" },
  { type: "line", who: "akari", text: "「明天再還一次。」", speed: "slow" },
  { type: "line", who: "akari", text: "「最後一次。」", speed: "slow" },
  { type: "line", who: "akari", text: "「真的，最後一次。」", speed: "slow", pause: 0.8 },
  { type: "line", who: "narration", text: "連這一次，都沒看到她的臉。" },
  { type: "line", who: "narration", text: "她把圍巾往上拉，遮住半張臉。", expr: "圍巾遮臉", motion: "fade_in", depth: "far", pos: "right" },
  { type: "line", who: "narration", text: "走進大馬路的燈光裡。" },
  { type: "line", who: "narration", text: "白氣跟在身後。很快散了。", expr: "", clear: true, pause: 0.8 },

  { type: "line", who: "narration", text: "我站在雨棚的盡頭。" },
  { type: "line", who: "narration", text: "低頭看著掌心裡，那支又被塞回來的護唇膏。", cg: "lipbalm" },
  { type: "line", who: "narration", text: "一支這麼小的東西，", pause: 0.6 },
  { type: "line", who: "narration", text: "也能把明天，留住。", speed: "slow", pause: 1.0 },

  { type: "line", who: "narration", text: "明天。", speed: "slow", cg: "clear", pause: 0.8 },
  { type: "line", who: "narration", text: "最後一天。", speed: "slow", bgm: "" },
];
