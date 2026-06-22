/* Day4 —— 赴約的代價（曝光升溫・停車場販賣機・第一道 PONR）
   ─────────────────────────────────────────────────────────────
   本夜計分（嚴格照 spec/26 §1 D4 那條；剝除全部舊系統殘留）：
   ・開場固定旁白 add:{heat:10}（曝光線底數第二筆，寫死非選項）。
   ・決定性 PONR ＝ d4_ponr 三選（掛在停車場手機狂震、她暴露在外的高張力時刻）：
       ① 冒險偷時間 → add {stance:-2, affection:+2, heat:+18}，set helped_her_escape（A 線骨幹）。
       ② 保她       → add {stance:+2, awareness:+1, heat:-2}，set pushed_to_choose（B 線）。
       ③ 安靜不表態 → add {regret:+1}（不 set 任何 flag）。
     heat 語意：冒險＝在外多待＝更多曝光（＋18）；保她＝早點送回＝壓低曝光（－2）。
   ・其餘既有選項（貼文／手機／想吃什麼）一律降 flavor:true（不 add、不 set），或併入敘事。
   ・本夜不得出現 gambled_on_being_seen／let_her_go（那是 D6／D7）；
     almost_confession_flag 改於 D7「停在原地」才 set，D4 不可再 set。
   連戲：開頭接 D3（曝光線已起、糊照貼文）；PONR 的 stance 與 D2 起手合計決定 D5 的 stance<=-3 A／B 分流；
   結尾「護唇膏先別丟／明天可能來不了」鋪 D5 缺席日。 */
window.HOSHINO.days[4] = [
  /* ===== D4-S1 白天・公司：推薦欄的數字（heat 開場底數）===== */
  { type: "scene", place: "白天・公司", time: "午休", mood: "warm", bg: "bg_office_day_warm" },

  { type: "line", who: "narration", text: "午休的辦公室，只剩冷氣的風聲。", bgm: "warm", add: { heat: 10 } },
  { type: "line", who: "narration", text: "我滑開手機。" },
  { type: "line", who: "narration", text: "推薦欄裡，昨晚那張模糊照片，已經不只一個帳號在轉。" },
  {
    type: "line", who: "narration", text: "", ui: "sns",
    sns: {
      title: "推薦欄",
      posts: [
        { acct: "娛樂帳號", text: "星野灯？深夜目擊情報　轉貼 [3.2萬]", num: true },
        { acct: "留言", text: "這是不是她住的飯店附近？", reply: true },
        { acct: "留言", text: "看路燈很像江東區那邊。", reply: true },
        { acct: "留言", text: "她最近不是在拍寫真？", reply: true },
        { acct: "留言", text: "又是炒作吧。", reply: true },
      ],
    },
    se: "count",
  },
  { type: "line", who: "narration", text: "轉貼數，比昨晚多了一位數。" },
  { type: "line", who: "narration", text: "留言開始猜地點。", speed: "instant" },
  { type: "line", who: "narration", text: "有人貼出一張路口的街景圖，問是不是這裡。", pause: 0.6 },
  { type: "line", who: "narration", text: "下面三個人說像，兩個人說不像。" },
  { type: "line", who: "narration", text: "沒有人說對。", pause: 0.8 },
  { type: "line", who: "narration", text: "……還沒有。", speed: "slow" },
  { type: "line", who: "narration", text: "我關掉螢幕。", screen: "black", pause: 0.5 },
  { type: "line", who: "narration", text: "風聲還在。" },
  { type: "line", who: "narration", text: "下午開會，我又點開了一次。", pause: 1.0 },
  { type: "line", who: "narration", text: "跟午休那次，一模一樣的動作。", pause: 1.2 },

  {
    type: "choice", id: "d4s1",
    prompt: "那則貼文——",
    options: [
      {
        label: "「記下他們比對的是哪幾個路口。」", flavor: true,
        reaction: [
          { type: "line", who: "narration", text: "我把留言裡點到的路口，一個一個記下來。" },
          { type: "line", who: "narration", text: "照片糊，但他們在比對招牌。", speed: "slow" },
          { type: "line", who: "narration", text: "下次她站的位置，得換一個。" },
        ],
      },
      {
        label: "「滑掉，告訴自己照片很糊。」", flavor: true,
        reaction: [
          { type: "line", who: "narration", text: "我把它滑掉。" },
          { type: "line", who: "narration", text: "照片很糊，我對自己說。" },
          { type: "line", who: "narration", text: "說了兩次，才把手機放下。", speed: "slow" },
        ],
      },
    ],
  },

  /* ===== D4-S2 深夜・公司門口：去，還是不去（內心壓回動作，去留交給玩家的腳）===== */
  { type: "scene", place: "深夜・公司門口", time: "零點四十分", mood: "night", bg: "bg_office_entrance_night" },

  { type: "line", who: "narration", text: "加班結束。", bgm: "night" },
  { type: "line", who: "narration", text: "公司就在那間便利商店兩條街外。" },
  { type: "line", who: "narration", text: "凌晨一點的便利商店。本來只是加班後順路經過的地方。" },
  { type: "line", who: "narration", text: "今天，我在門口站了一下。", pause: 0.8 },
  { type: "line", who: "narration", text: "白天那些比對路口的留言，還貼在腦子裡。", speed: "slow" },
  { type: "line", who: "narration", text: "一個人，站在沒有人的門口，風從巷子那頭灌過來。", speed: "slow", pause: 1.2, bgm: "stop" },

  {
    type: "choice", id: "d4s2",
    prompt: "我的腳——",
    options: [
      {
        label: "「和平常一樣的方向，邁開腳步。」", flavor: true,
        reaction: [
          { type: "line", who: "narration", text: "我邁開腳步。", se: "step" },
          { type: "line", who: "narration", text: "和平常一樣的方向。" },
        ],
      },
      {
        label: "「在門口，多站了一會兒。」", flavor: true,
        reaction: [
          { type: "line", who: "narration", text: "我在門口，多站了一會兒。" },
          { type: "line", who: "narration", text: "然後還是走了。", speed: "slow", se: "step" },
        ],
      },
    ],
  },

  /* ===== D4-S3 深夜・便利商店 後巷：繞遠路的貓（遲到訊號錨在路燈／貓，不報時排比）===== */
  { type: "scene", place: "深夜・便利商店 後巷", time: "一點零五分", mood: "night", bg: "bg_conv_backalley_night" },

  { type: "line", who: "narration", text: "風比昨天更冷。", bgm: "night" },
  { type: "line", who: "narration", text: "我把手插進口袋。" },
  { type: "line", who: "narration", text: "指尖碰到那支護唇膏的外殼，被體溫焐得有點溫。" },
  { type: "line", who: "narration", text: "前三天，她從來沒有這麼晚。" },
  { type: "line", who: "narration", text: "巷口那盞路燈忽明忽暗，像快要撐不住。" },
  { type: "line", who: "narration", text: "一點二十三分。", speed: "slow" },
  { type: "line", who: "narration", text: "我盯著巷口。今天，連貓都沒有。", pause: 1.5 },
  { type: "line", who: "narration", text: "腳步聲。", se: "rush", pause: 0.6, camera: { op: "push", amount: "small", duration: 600 } },
  { type: "line", who: "narration", text: "她從巷子另一頭出現。", expr: "喘氣帽簷低", mask: "口罩", motion: "rush_in", depth: "far" },
  { type: "line", who: "narration", text: "不是平常的方向。" },
  { type: "line", who: "narration", text: "圍巾是歪的，帽簷下呼吸有點急。" },
  { type: "line", who: "narration", text: "白氣一團接一團，散得很慢。", camera: { op: "reset", duration: 400 } },
  { type: "line", who: "narration", text: "她一隻手撐在牆上，先把氣喘勻，才肯抬頭。" },
  { type: "line", who: "akari", text: "「……今天的貓，」她扶著牆，喘了兩口，「繞遠路了。」", expr: "喘氣帽簷低", mask: "口罩", depth: "near" },
  { type: "line", who: "me", text: "「繞了多遠？」" },
  { type: "line", who: "akari", text: "「三條街。」她比了個三，「外加一個地下道。」" },
  { type: "line", who: "narration", text: "她的鞋尖沾了一圈灰，褲腳濕了一截。" },
  { type: "line", who: "narration", text: "地下道那種濕。", speed: "slow" },
  { type: "line", who: "narration", text: "她說地下道的時候，下意識回頭看了巷口一眼。", expr: "看玻璃門眼神警戒", mask: "口罩", depth: "near" },
  { type: "line", who: "me", text: "「為什麼——」", speed: "instant" },
  { type: "line", who: "akari", text: "「別露出那種臉。」她打斷我，「我沒被抓。」", speed: "instant", expr: "直起身嘴硬", depth: "near" },
  { type: "line", who: "narration", text: "她直起身，拍了拍連帽衣，把歪掉的圍巾重新繞好。" },
  { type: "line", who: "narration", text: "繞得很仔細，把下半張臉又埋進去了一些。" },
  { type: "line", who: "akari", text: "「只是最近，路上的眼睛有點多。」", speed: "slow" },
  { type: "line", who: "narration", text: "她又看了一眼便利商店的玻璃門。", expr: "看玻璃門眼神警戒", mask: "口罩", depth: "far" },
  { type: "line", who: "narration", text: "那扇門裡的燈，今天好像特別亮。" },
  { type: "line", who: "narration", text: "玻璃上倒映著她裹得密不透風的輪廓。" },
  { type: "line", who: "narration", text: "她盯著那個倒影看了一秒，移開了視線。", speed: "slow", pause: 0.6 },
  { type: "line", who: "narration", text: "今天，她沒有說要進去。", pause: 0.6 },
  { type: "line", who: "akari", text: "「後面。」她朝店的另一側抬了下下巴。" },
  { type: "line", who: "me", text: "「後面？」" },
  { type: "line", who: "akari", text: "「停車場那邊有販賣機。」她把手插回口袋，「偵察成果。」", expr: "嘴硬", depth: "near" },
  { type: "line", who: "narration", text: "說「偵察成果」的時候，她的下巴抬高了一點。", pause: 0.6 },

  /* ===== D4-S4 深夜・停車場：熱可可（兩聲咚・剛好的位置）===== */
  { type: "scene", place: "深夜・便利商店後方 停車場", time: "一點二十五分", mood: "store", bg: "bg_vending_parking_night" },

  { type: "line", who: "narration", text: "停車場的盡頭。", bgm: "store", expr: "全身", depth: "far", motion: "fade_in" },
  { type: "line", who: "narration", text: "一排自動販賣機，旁邊一張塑膠長椅。" },
  { type: "line", who: "narration", text: "地上是停車格褪色的白線。" },
  { type: "line", who: "narration", text: "從店裡看不到這裡。" },
  { type: "line", who: "narration", text: "但只要走十步，就能回到那片白亮的燈光下。" },
  { type: "line", who: "narration", text: "不太亮，也不全暗。", speed: "slow" },
  { type: "line", who: "narration", text: "她先在椅子旁邊站了一下，回頭量了量巷口的角度。", expr: "看玻璃門眼神警戒", mask: "口罩", depth: "near" },
  { type: "line", who: "narration", text: "確認那邊的人，看不見坐在這裡的人。" },
  { type: "line", who: "narration", text: "做這些的時候，她的動作很熟練，像量過很多次。", speed: "slow" },
  { type: "line", who: "narration", text: "我在販賣機投了兩罐熱可可。", se: "give" },
  { type: "line", who: "narration", text: "咚。", se: "bump", pause: 0.4 },
  { type: "line", who: "narration", text: "咚。", se: "bump", pause: 0.6, cg: "cocoa" },
  { type: "line", who: "narration", text: "她接過罐子，沒有開。", expr: "貼罐子放鬆", motion: "fade_in", depth: "near" },
  { type: "line", who: "narration", text: "在伸手接的前一瞬，她先瞄了我空著的另一隻手一眼。", depth: "closeup", pause: 0.6 },
  { type: "line", who: "narration", text: "確認我沒有別的動作，才接過去。", speed: "slow" },
  { type: "line", who: "narration", text: "然後把罐子先貼在臉頰上，又換到另一邊。", expr: "貼罐子放鬆", depth: "near" },
  { type: "line", who: "akari", text: "「……活過來了。」", expr: "貼罐子放鬆", depth: "closeup" },
  { type: "line", who: "narration", text: "她兩隻手圈著那罐熱的，圈了好一會，還是沒喝。", cg: "clear", depth: "near" },
  { type: "line", who: "narration", text: "好像捧著的不是飲料，是一小塊可以暖手的火。", speed: "slow" },
  { type: "line", who: "narration", text: "我把自己那罐打開，喝了一口。" },
  { type: "line", who: "narration", text: "太甜了。", pause: 0.6 },
  { type: "line", who: "narration", text: "塑膠長椅冰得像鐵板。" },
  { type: "line", who: "narration", text: "她從口袋掏出一個東西，晃了晃。" },
  { type: "line", who: "narration", text: "昨天那個暖暖包。" },
  { type: "line", who: "akari", text: "「涼了。」她說，「但丟掉又可惜。」" },
  { type: "line", who: "narration", text: "她把它墊在長椅上，坐上去。", expr: "坐姿", motion: "fade_in", depth: "near" },
  { type: "line", who: "akari", text: "「……完全沒用。」" },
  { type: "line", who: "me", text: "「那現在是坐墊嗎。」" },
  { type: "line", who: "akari", text: "「現在是了。」", expr: "嘴硬被逗", depth: "near" },
  { type: "line", who: "narration", text: "我在長椅另一頭坐下。" },
  { type: "line", who: "narration", text: "中間隔著一個拳頭的距離。" },
  { type: "line", who: "narration", text: "風從停車場那頭灌過來，她不著痕跡地往中間挪了一點。", depth: "near", pause: 0.6 },
  { type: "line", who: "narration", text: "只挪了一點，剛好讓那點風被擋住。", speed: "slow" },
  { type: "line", who: "narration", text: "兩個人都沒說話，只有罐子裡的熱，隔著鐵皮慢慢散。", pause: 1.0 },

  /* ===== D4-S5 停車場：七天・期間限定（倒數錨・男主心算為全夜唯一內心 2 行）===== */
  { type: "line", who: "narration", text: "她捧著罐子，看著停車格的白線，忽然開口。", expr: "看白線出神" },
  { type: "line", who: "akari", text: "「七天。」" },
  { type: "line", who: "me", text: "「什麼七天？」" },
  { type: "line", who: "akari", text: "「這次的工作。」她說，「都排在附近的攝影棚，到週日。」" },
  { type: "line", who: "akari", text: "「住的地方也是公司訂的。」" },
  { type: "line", who: "narration", text: "她聳聳肩，肩膀很輕，像在說一件跟自己無關的事。" },
  { type: "line", who: "akari", text: "「所以我是觀光客。", pause: 0.8 },
  { type: "line", who: "akari", text: "期間限定的那種。」", speed: "slow" },
  { type: "line", who: "narration", text: "說「期間限定」時，她用指尖在罐身的水珠上，輕輕劃了一道。" },
  { type: "line", who: "narration", text: "像在一張看不見的日曆上，劃掉了一格。", speed: "slow", pause: 0.8 },
  { type: "line", who: "narration", text: "我沒接話。", pause: 1.0 },
  { type: "line", who: "narration", text: "心裡卻自動算了一下。到週日。" },
  { type: "line", who: "narration", text: "……還剩三天。", speed: "slow", pause: 1.2 },
  { type: "line", who: "narration", text: "她沒看我，繼續看著那條白線，看它在停車格盡頭斷掉。", speed: "slow", pause: 0.8 },

  /* ===== D4-S6 停車場：放了一天的布丁（藉口母題・凍手撕不開借男主）===== */
  { type: "line", who: "narration", text: "她從另一邊口袋，掏出那個焦糖布丁。" },
  { type: "line", who: "narration", text: "放了一天的布丁。" },
  { type: "line", who: "narration", text: "盒身被口袋壓得有點變形。" },
  { type: "line", who: "narration", text: "她用兩隻手捧著。", expr: "珍惜", depth: "near" },
  { type: "line", who: "akari", text: "「本來想留到今天當理由。」她說。" },
  { type: "line", who: "akari", text: "「結果真的變成理由了。」" },
  { type: "line", who: "narration", text: "她去撕蓋子。", expr: "凍手撕蓋", depth: "near" },
  { type: "line", who: "narration", text: "撕了一次，沒撕開。", se: "pat" },
  { type: "line", who: "narration", text: "換個角度，再撕一次，還是沒開。" },
  { type: "line", who: "narration", text: "手指凍僵了，連封口的小角都捏不住。" },
  { type: "line", who: "narration", text: "她把布丁往我這邊推了半公分。", depth: "near" },
  { type: "line", who: "akari", text: "「借我——」" },
  { type: "line", who: "narration", text: "話還沒說完，我接過來，撕開，還給她。", cg: "pudding", se: "give", depth: "near" },
  { type: "line", who: "akari", text: "「……哼。」她接回去，「算你有用。」", cg: "clear", expr: "嘴硬被逗", depth: "near" },
  { type: "line", who: "narration", text: "她用附的小湯匙，挖了一小口。" },
  { type: "line", who: "narration", text: "很慢地吃。", speed: "slow" },
  { type: "line", who: "narration", text: "像在吃什麼很貴的東西。", pause: 0.8 },

  /* ===== D4-S7 停車場：想吃什麼（主權母題・flavor）===== */
  { type: "line", who: "narration", text: "她吃到一半，忽然停下來。" },
  { type: "line", who: "akari", text: "「我不是想逃工作。」她說。" },
  { type: "line", who: "me", text: "「嗯。」" },
  { type: "line", who: "akari", text: "「工作我可以做。跳舞、唱歌、笑，都可以。」" },
  { type: "line", who: "narration", text: "她轉著手裡的湯匙。" },
  { type: "line", who: "akari", text: "「我只是有時候，想確認自己還會想吃什麼。」", speed: "slow" },
  { type: "line", who: "narration", text: "販賣機的光，落在她的睫毛上。", pause: 0.8 },

  {
    type: "choice", id: "d4s7",
    prompt: "我看著她——",
    options: [
      {
        label: "「今天想吃布丁？」", flavor: true,
        reaction: [
          { type: "line", who: "me", text: "「今天想吃布丁？」" },
          { type: "line", who: "narration", text: "她點頭。點得很慢。", expr: "認真點頭微笑", depth: "near" },
          { type: "line", who: "akari", text: "「嗯。想吃。」" },
          { type: "line", who: "me", text: "「然後呢？」" },
          { type: "line", who: "akari", text: "「很好吃。」" },
          { type: "line", who: "narration", text: "她說完自己笑了。" },
          { type: "line", who: "akari", text: "「就這樣。很普通吧。」", expr: "瞇眼吃焦糖", depth: "near" },
        ],
      },
      {
        label: "「自己挑的，味道有不一樣嗎。」", flavor: true,
        reaction: [
          { type: "line", who: "me", text: "「自己挑的，味道有不一樣嗎。」" },
          { type: "line", who: "narration", text: "她舀焦糖的手停了一下。" },
          { type: "line", who: "akari", text: "「……有。」她想了想，「說不上來。」", expr: "別開視線", depth: "near" },
          { type: "line", who: "akari", text: "「但有。」", speed: "slow" },
        ],
      },
    ],
  },

  /* ===== D4-S8 停車場：手機狂震・暴露在外（PONR 前的拉鋸）===== */
  { type: "line", who: "narration", text: "她吃到底層的焦糖，瞇起眼睛。", expr: "瞇眼吃焦糖", depth: "near" },
  { type: "line", who: "narration", text: "停車場安靜下來，只剩販賣機的運轉聲。" },
  { type: "line", who: "narration", text: "手機在她口袋裡震了。", se: "buzz", unread: { op: "inc", by: 1 }, camera: { op: "push", amount: "medium", duration: 700 } },
  { type: "line", who: "narration", text: "她的動作停了半秒。", expr: "動作凝滯", depth: "near", pause: 0.6 },
  { type: "line", who: "narration", text: "掏出來，看了一眼螢幕。" },
  { type: "line", who: "narration", text: "沒接。反扣在長椅上。" },
  { type: "line", who: "narration", text: "過了一會。" },
  { type: "line", who: "narration", text: "又震。", se: "buzz", unread: { op: "inc", by: 1 } },
  { type: "line", who: "narration", text: "螢幕的光從長椅縫裡漏出來，一閃一閃。" },
  { type: "line", who: "narration", text: "她看著販賣機的燈，笑了一下。", expr: "微笑", depth: "near" },
  { type: "line", who: "akari", text: "「今天好熱鬧。」" },
  { type: "line", who: "me", text: "「妳不回？」" },
  { type: "line", who: "akari", text: "「回了，就要回去。」", pause: 0.8 },
  { type: "line", who: "narration", text: "她說完，沒有再補第二句。", pause: 0.8 },
  { type: "line", who: "narration", text: "又震。", se: "buzz", unread: { op: "inc", by: 1 } },
  { type: "line", who: "narration", text: "這次她把湯匙擱下，雙手收進袖子裡，像在等它自己停。" },
  { type: "line", who: "narration", text: "我看著她那隻反扣在長椅上的手機，沒去碰。", depth: "near" },
  { type: "line", who: "narration", text: "也沒往店那邊的亮光退。", speed: "slow" },
  { type: "line", who: "narration", text: "又震。", se: "buzz", unread: { op: "inc", by: 1 }, shake: true },
  { type: "line", who: "narration", text: "這一次，連長椅都跟著輕輕一抖。" },
  { type: "line", who: "narration", text: "她沒看手機，反而把帽簷又壓低了一指。", expr: "看玻璃門眼神警戒", mask: "口罩", depth: "near" },
  { type: "line", who: "narration", text: "停車場太空了。" },
  { type: "line", who: "narration", text: "她坐在這片半亮的光裡，從巷口那頭，其實一眼就能看見。", speed: "slow", pause: 0.8 },
  { type: "line", who: "narration", text: "白天那些比對路口的留言，又浮了上來。", pause: 1.0 },

  /* d4_ponr ── 第一道 PONR（唯一帶計分與旗標的三選；A／B 分歧由此夜決定）── */
  {
    type: "choice", id: "d4_ponr",
    prompt: "手機還在震，她暴露在這片光裡——",
    options: [
      {
        label: "「再坐一會。把椅子往陰影那邊挪。」",
        hint: "陪她多賭一會，幫她躲開巷口的視線",
        add: { stance: -2, affection: 2, heat: 18 },
        flag: { helped_her_escape: true },
        reaction: [
          { type: "line", who: "me", text: "「再坐一會。」" },
          { type: "line", who: "narration", text: "我站起來，把長椅往販賣機背後的陰影裡挪了半步。", se: "give" },
          { type: "line", who: "narration", text: "那裡，從巷口看不見。" },
          { type: "line", who: "narration", text: "她抬眼看我，又看了看新的位置。", expr: "別開視線", depth: "near" },
          { type: "line", who: "akari", text: "「……你這人，很會讓人變壞。」" },
          { type: "line", who: "me", text: "「我只是挪了張椅子。」" },
          { type: "line", who: "narration", text: "她坐回陰影裡，把手機關了靜音，反扣得更緊。", expr: "嘴硬被逗", depth: "near" },
          { type: "line", who: "akari", text: "「對。」她把布丁挖了一大口，「所以很壞。」", pause: 0.8 },
          { type: "line", who: "narration", text: "她沒再看巷口。", speed: "slow" },
          { type: "line", who: "narration", text: "我也沒再看時間。", speed: "slow", pause: 1.0 },
        ],
      },
      {
        label: "「妳想要什麼，現在說。我送妳回去。」",
        hint: "逼她說出想要的，護著把她安全送走",
        add: { stance: 2, awareness: 1, heat: -2 },
        flag: { pushed_to_choose: true },
        reaction: [
          { type: "line", who: "me", text: "「妳想要什麼。」" },
          { type: "line", who: "narration", text: "她的湯匙停在半空。", expr: "動作凝滯", depth: "near" },
          { type: "line", who: "me", text: "「現在說。我送妳回去。」" },
          { type: "line", who: "narration", text: "她看著我，看了很久。", expr: "別開視線", depth: "near", pause: 0.8 },
          { type: "line", who: "akari", text: "「……你今天不太一樣。」" },
          { type: "line", who: "narration", text: "她把布丁的最後一口吃掉，蓋子壓回去。" },
          { type: "line", who: "akari", text: "「好啦。」她站起來，「送到路口就好。」", expr: "嘴硬", depth: "near" },
          { type: "line", who: "narration", text: "她走在我前面半步，刻意低著頭，繞開了亮的那一側。", expr: "圍巾遮臉", mask: "口罩", depth: "far", motion: "step_back" },
          { type: "line", who: "narration", text: "到路口，她比平常早回去了二十分鐘。", speed: "slow", pause: 1.0 },
        ],
      },
      {
        label: "「……」（什麼都沒說，看她自己決定）",
        hint: "不表態，把這一刻留給她",
        add: { regret: 1 },
        reaction: [
          { type: "line", who: "narration", text: "我沒說話。" },
          { type: "line", who: "narration", text: "手機又震，她終於把它翻過來，按掉了螢幕。", se: "buzz" },
          { type: "line", who: "akari", text: "「……算了。」她說，「也該回去了。」", expr: "別開視線", depth: "near" },
          { type: "line", who: "narration", text: "她把布丁吃完，動作比剛才快了一點。" },
          { type: "line", who: "narration", text: "我看著她收拾，沒接話，也沒攔。", speed: "slow", pause: 1.0 },
        ],
      },
    ],
  },

  /* ===== D4-S9 停車場：告別三連 Hook（鋪 D5 缺席日）===== */
  { type: "line", who: "narration", text: "手機不震了。", unread: { op: "clear" }, camera: { op: "reset", duration: 400 } },
  { type: "line", who: "narration", text: "她把空盒子收好，起身丟進販賣機旁的垃圾桶。" },
  { type: "line", who: "narration", text: "動作很乾脆。" },
  { type: "line", who: "narration", text: "走回來的時候，手機又亮了一下。", se: "buzz" },
  { type: "line", who: "narration", text: "這次，她盯著螢幕看了很久。", expr: "看螢幕凝重", pause: 2.0 },
  { type: "line", who: "narration", text: "久到手裡那罐熱可可的白氣，都散得差不多了。" },
  { type: "line", who: "narration", text: "然後她把手機收起來。", pause: 0.6 },
  { type: "line", who: "akari", text: "「明天，我可能來不了。」", bgm: "night", expr: "無表情", depth: "near" },
  { type: "line", who: "narration", text: "我沒說話。", pause: 1.0 },
  { type: "line", who: "narration", text: "她也沒馬上走，捧著那罐熱可可，站在原地。", depth: "near" },
  { type: "line", who: "narration", text: "罐子早就涼了，她還是沒放下。", speed: "slow", pause: 0.8 },
  { type: "line", who: "akari", text: "「我是說，可能。」她立刻補，「貓的行程很難懂。」", expr: "嘴硬", depth: "near" },
  { type: "line", who: "me", text: "「嗯。」" },
  { type: "line", who: "akari", text: "「不要『嗯』。」她別開視線，「算了，反正你明天還是會來。」", expr: "別開視線", depth: "near" },
  { type: "line", who: "me", text: "「……大概吧。」" },
  { type: "line", who: "akari", text: "「對。」她點頭，「你前三天都是這樣的。」", expr: "嘴硬被逗", depth: "near" },
  { type: "line", who: "narration", text: "我無話可說。" },
  { type: "line", who: "narration", text: "她轉身往巷口走。", expr: "背對", motion: "step_back", depth: "far" },
  { type: "line", who: "narration", text: "走了幾步，回頭。", expr: "回頭半側臉", depth: "far" },
  { type: "line", who: "akari", text: "「如果我沒來——」" },
  { type: "line", who: "narration", text: "她頓了一下。", pause: 0.8 },
  { type: "line", who: "akari", text: "「護唇膏，先別丟。」" },
  { type: "line", who: "me", text: "「為什麼？」" },
  { type: "line", who: "akari", text: "「因為我還沒說不要了。」", expr: "回頭半側臉", depth: "near", pause: 1.5 },
  { type: "line", who: "narration", text: "她說完，拉低帽子，走進巷子另一頭的黑暗裡。", se: "step", expr: "背對", motion: "step_back" },
  { type: "line", who: "narration", text: "這次，她的背影走得比哪一天都慢。", speed: "slow", pause: 1.5 },

  /* ===== D4-S10 回家・深夜：貼文再升級與收抽屜（收抽屜動作自己漏沙，不旁白翻譯）===== */
  { type: "scene", place: "回家・深夜", time: "深夜", mood: "night", bg: "bg_street_night_cold" },

  { type: "line", who: "narration", text: "我躺在床上，滑開手機。", bgm: "night" },
  { type: "line", who: "narration", text: "推薦欄裡，那則目擊貼文又被轉了一次。" },
  { type: "line", who: "narration", text: "標題多了幾個字。" },
  {
    type: "line", who: "narration", text: "", ui: "sns",
    sns: {
      title: "推薦欄",
      posts: [
        { acct: "娛樂帳號", text: "星野灯？深夜目擊，飯店附近？　轉貼 [5.8萬]", num: true },
        { acct: "留言", text: "比對一下街燈的反光，這招牌……", reply: true },
        { acct: "留言", text: "路面反光的角度，像不像那條街？", reply: true },
      ],
    },
    se: "count",
  },
  { type: "line", who: "narration", text: "留言裡，有人開始比對街燈、招牌、路面的反光。" },
  { type: "line", who: "narration", text: "還沒有人說出那間便利商店的名字。" },
  { type: "line", who: "narration", text: "但已經很近了。", speed: "slow", pause: 1.0 },
  { type: "line", who: "narration", text: "最新的一則留言，貼了一張街角的照片。" },
  { type: "line", who: "narration", text: "拍的是那條巷子的入口。", speed: "slow" },
  { type: "line", who: "narration", text: "畫面裡沒有人。", pause: 0.8 },
  { type: "line", who: "narration", text: "只是再晚一點按下快門，就會有了。", speed: "slow", pause: 1.2 },
  { type: "line", who: "narration", text: "我關掉螢幕，看向桌上。", screen: "black" },
  { type: "line", who: "narration", text: "那支護唇膏，立在檯燈下。", cg: "lipbalm" },
  { type: "line", who: "narration", text: "我起身，把它收進抽屜最裡面。", se: "give", cg: "clear" },
  { type: "line", who: "narration", text: "「還沒說不要了。」", speed: "slow", pause: 1.0 },
  { type: "line", who: "narration", text: "窗外，風聲很大。", pause: 1.5 },
];
