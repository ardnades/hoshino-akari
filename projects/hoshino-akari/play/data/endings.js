/* endings.js —— 七結局後日談（依結局調味；引擎依 tone 播放對應陣列）
   骨架取材 Day7【後日談・幾天後】：電車訪談「焦糖布丁」→ 便利商店甜點櫃 → 自己買下布丁、不要袋子
   → 落點「這一次，不是替誰買的。是我自己，選的。」（cg:"pudding"）；口袋肉球印紙片仍在。
   hidden_pov_tail 接在 warm_true 之後播；who 用 akari（灯內心第一人稱），收在半句留白。 */
window.HOSHINO.endings = {

  /* ─────────── warm_true（暖・真）：後日談偏甜 ─────────── */
  warm_true: [
    { type: "scene", place: "幾天後・通勤電車", time: "傍晚", mood: "warm", bg: "bg_train_warm" },

    { type: "line", who: "narration", text: "那之後，我沒有刻意找她的消息。", bgm: "warm" },
    { type: "line", who: "narration", text: "只是眼睛開始容易停在她的名字旁邊——招牌上、手機推薦欄、電車廂的廣告欄。" },
    { type: "line", who: "narration", text: "回家路上，我路過那間便利商店，沒有停。" },
    { type: "line", who: "narration", text: "路過那台販賣機，想起 Day5 放在取出口的那罐熱可可，不知道她後來有沒有拿到。" },
    { type: "line", who: "narration", text: "今天，我沒有多買油豆腐。因為那一份，已經真的還給她了。", pause: 0.6 },

    { type: "line", who: "narration", text: "幾天後，我在通勤的電車上，滑到一段訪談剪輯。", cg: "ev_interview", pause: 0.5 },
    { type: "line", who: "host", text: "「最近，有沒有什麼小小的獎勵？」" },
    { type: "line", who: "narration", text: "星野灯想了一下。" },
    { type: "line", who: "akari", text: "「焦糖布丁。」", speed: "slow" },
    { type: "line", who: "host", text: "「意外地普通呢。」" },
    { type: "line", who: "akari", text: "「普通的東西，有時候很貴。」", speed: "slow", pause: 0.6 },
    { type: "line", who: "narration", text: "她笑。觀眾沒聽懂。", pause: 0.5 },
    { type: "line", who: "narration", text: "只有我懂。", speed: "slow", pause: 0.8 },
    { type: "line", who: "narration", text: "下車之後，我走進車站旁的便利商店。", cg: "clear" },
    { type: "line", who: "narration", text: "走到甜點櫃前。焦糖布丁，還擺在老位置。", bg: "bg_conv_dessert_case" },
    { type: "line", who: "narration", text: "我拿起一個。", pause: 0.4 },
    { type: "line", who: "narration", text: "店員問我，要不要袋子。" },
    { type: "line", who: "me", text: "「不用。」" },
    { type: "line", who: "narration", text: "這一次，不是替誰買的。", speed: "slow", pause: 0.6 },
    { type: "line", who: "narration", text: "是我自己，選的。", speed: "slow", cg: "pudding", pause: 1.0 },
    /* d7s6「下次」回收（暖：留有後續） */
    {
      type: "gate", cond: "flag:d7_food_pudding",
      then: [ { type: "line", who: "narration", text: "「下次再買布丁吧」——那天我說的。今天這個先替自己買，下次的那個，留著。", speed: "slow", pause: 0.6 } ],
      else: [ { type: "line", who: "narration", text: "「下次再吃油豆腐吧」——那天我說的。布丁是今天的；油豆腐，留到下次，跟她。", speed: "slow", pause: 0.6 } ],
    },
    { type: "line", who: "narration", text: "口袋裡，那片歪歪的肉球印紙片還在。她把該收的都收走了，就漏了這隻貓。", speed: "slow", pause: 0.8 },
  ],

  /* ─────────── quiet_normal（靜・常・保底）：平實版 ─────────── */
  quiet_normal: [
    { type: "scene", place: "幾天後・通勤電車", time: "傍晚", mood: "night", bg: "bg_train_night_cold" },

    { type: "line", who: "narration", text: "那之後，我沒有刻意找她的消息。", bgm: "night" },
    { type: "line", who: "narration", text: "偷來的七天，安靜地還了回去。", speed: "slow", pause: 0.7 },
    { type: "line", who: "narration", text: "回家路上，我路過那間便利商店，沒有停。" },
    { type: "line", who: "narration", text: "路過那台販賣機，想起 Day5 放在取出口的那罐熱可可。" },
    { type: "line", who: "narration", text: "今天，我沒有多買油豆腐。那一份，已經還給她了。", pause: 0.5 },

    { type: "line", who: "narration", text: "幾天後，我在通勤的電車上，滑到一段訪談剪輯。", cg: "ev_interview" },
    { type: "line", who: "host", text: "「最近，有沒有什麼小小的獎勵？」" },
    { type: "line", who: "narration", text: "星野灯想了一下。" },
    { type: "line", who: "akari", text: "「焦糖布丁。」" },
    { type: "line", who: "host", text: "「意外地普通呢。」" },
    { type: "line", who: "narration", text: "她笑。影片停在那裡。", pause: 0.5 },

    { type: "line", who: "narration", text: "下車之後，我走進車站旁的便利商店。", cg: "clear" },
    { type: "line", who: "narration", text: "走到甜點櫃前。焦糖布丁，還擺在老位置。", bg: "bg_conv_dessert_case" },
    { type: "line", who: "narration", text: "我拿起一個。" },
    { type: "line", who: "narration", text: "店員問我，要不要袋子。" },
    { type: "line", who: "me", text: "「不用。」" },
    { type: "line", who: "narration", text: "這一次，不是替誰買的。", pause: 0.5 },
    { type: "line", who: "narration", text: "是我自己選的。", speed: "slow", cg: "pudding", pause: 0.8 },
    /* d7s6「下次」回收（常：平實未兌現） */
    {
      type: "gate", cond: "flag:d7_food_pudding",
      then: [ { type: "line", who: "narration", text: "「下次再買布丁吧」——我那天說的「下次」，還沒兌現。今天這個，是替自己買的。", pause: 0.5 } ],
      else: [ { type: "line", who: "narration", text: "「下次再吃油豆腐吧」——我那天說的「下次」，還沒兌現。今天手裡的，是布丁。", pause: 0.5 } ],
    },
    { type: "line", who: "narration", text: "口袋裡，那片肉球印紙片還在。我看了它一眼，把布丁帶回家。", pause: 0.6 },
  ],

  /* ─────────── bitter（苦・餘味）：加一句、只一句錯過尾句 ─────────── */
  bitter: [
    { type: "scene", place: "幾天後・通勤電車", time: "傍晚", mood: "night", bg: "bg_train_night_cold" },

    { type: "line", who: "narration", text: "那之後，我沒有刻意找她的消息。", bgm: "night" },
    { type: "line", who: "narration", text: "回家路上，我路過那間便利商店，沒有停。" },
    { type: "line", who: "narration", text: "路過那台販賣機，想起 Day5 放在取出口的那罐熱可可。" },
    { type: "line", who: "narration", text: "今天，我沒有多買油豆腐。那一份，已經還給她了。", pause: 0.5 },

    { type: "line", who: "narration", text: "幾天後，我在通勤的電車上，滑到一段訪談剪輯。", cg: "ev_interview" },
    { type: "line", who: "host", text: "「最近，有沒有什麼小小的獎勵？」" },
    { type: "line", who: "narration", text: "星野灯想了一下。" },
    { type: "line", who: "akari", text: "「焦糖布丁。」" },
    { type: "line", who: "host", text: "「意外地普通呢。」" },
    { type: "line", who: "narration", text: "她笑。影片閃過。", pause: 0.5 },

    { type: "line", who: "narration", text: "下車之後，我走進車站旁的便利商店。", cg: "clear" },
    { type: "line", who: "narration", text: "走到甜點櫃前。焦糖布丁，還擺在老位置。", bg: "bg_conv_dessert_case_cold" },
    { type: "line", who: "narration", text: "我拿起一個。" },
    { type: "line", who: "narration", text: "店員問我，要不要袋子。" },
    { type: "line", who: "me", text: "「不用。」" },
    { type: "line", who: "narration", text: "這一次，不是替誰買的。是我自己選的。", cg: "pudding", pause: 0.6 },
    { type: "line", who: "narration", text: "我學會了自己選。", speed: "slow", pause: 0.6 },
    { type: "line", who: "narration", text: "只是學得太晚，沒能跟她說一聲。", speed: "slow", pause: 1.0 },
    /* d7s6「下次」回收（苦：下次沒有來） */
    {
      type: "gate", cond: "flag:d7_food_pudding",
      then: [ { type: "line", who: "narration", text: "「下次再買布丁吧」——我那天這樣說。布丁今天買到了，那句「下次」沒有。", speed: "slow", pause: 0.6 } ],
      else: [ { type: "line", who: "narration", text: "「下次再吃油豆腐吧」——我那天這樣說。油豆腐沒有下次，那句話也一樣。", speed: "slow", pause: 0.6 } ],
    },
    { type: "line", who: "narration", text: "口袋裡那片肉球印紙片還在。她漏收的這隻貓，我也沒能還回去。", pause: 0.7 },
  ],

  /* ─────────── hidden_pov_tail（接在 warm_true 之後播）：灯視角內心半句 ─────────── */
  hidden_pov_tail: [
    { type: "scene", place: "同一個傍晚・攝影棚", time: "收工後", mood: "warm", bg: "bg_photo_studio_hidden" },

    { type: "line", who: "narration", text: "——而那一頭，她拍完了最後一個工作。", speed: "slow", bgm: "warm", pause: 0.6 },
    { type: "line", who: "akari", text: "燈一盞一盞暗下去，只剩我站的這一塊還亮著。", speed: "slow", cg: "akari_studio" },
    { type: "line", who: "akari", text: "工作人員的腳步在遠處收線，誰都沒注意我。" },
    { type: "line", who: "akari", text: "我把手伸進外套最裡面的口袋，按了一下。" },
    { type: "line", who: "akari", text: "那支用了七天的護唇膏，還在。", speed: "slow", pause: 0.6 },
    { type: "line", who: "akari", text: "那隻很急的貓，今天……", speed: "slow", pause: 1.0 },
    { type: "line", who: "staff", text: "「灯，下一場。」" },
    { type: "line", who: "akari", text: "我把手從口袋裡收回來。", speed: "slow" },
    { type: "line", who: "akari", text: "「來了。」", pause: 0.8 },
  ],

  /* ─────────── fate_top（命運頂・她替自己選）：B 線・苦得發亮（最高結局・最完整） ─────────── */
  /* 落點：便利店私下，她第一次替自己選；退不掉的票她沒去趕＝她自己的決定。
     男主看懂她該走、沒攔也沒替她決定。基調＝苦得發亮的成全。收在「貓被放走」。 */
  fate_top: [
    { type: "scene", place: "幾天後・通勤電車", time: "傍晚", mood: "warm", bg: "bg_train_warm" },

    { type: "line", who: "narration", text: "那之後，我沒有刻意找她的消息。", bgm: "warm" },
    { type: "line", who: "narration", text: "那天在甜點櫃前，我沒有替她拿。我把手收在口袋裡，等她自己伸手。", speed: "slow" },
    { type: "line", who: "narration", text: "她站了很久。久到店裡的廣播換了一首歌。" },
    { type: "line", who: "narration", text: "然後她伸手，拿了那盒布丁。", speed: "slow", pause: 0.5 },
    { type: "line", who: "narration", text: "那班退不掉的車，她沒去趕。那一刻沒有人攔她——我也沒有。", speed: "slow", pause: 0.6 },
    { type: "line", who: "narration", text: "把最後一步留給她，是我能替她做的、唯一不算替她做的事。", speed: "slow", pause: 0.8 },

    { type: "line", who: "narration", text: "回家路上，我路過那台販賣機，想起 Day4 那罐她雙手圈著卻沒喝的可可。", cg: "cocoa" },
    { type: "line", who: "narration", text: "那一罐後來涼了。但這一次，涼的是別的東西換來的。", pause: 0.5 },

    { type: "line", who: "narration", text: "幾天後，我在通勤的電車上，滑到一段訪談剪輯。", cg: "ev_interview", pause: 0.5 },
    { type: "line", who: "host", text: "「最近，有沒有什麼小小的獎勵？」" },
    { type: "line", who: "narration", text: "星野灯想了一下。臉上有一種我沒在螢幕上看過的鬆。" },
    { type: "line", who: "akari", text: "「焦糖布丁。」", speed: "slow" },
    { type: "line", who: "host", text: "「意外地普通呢。」" },
    { type: "line", who: "akari", text: "「這一個，是我自己決定要吃的。」", speed: "slow", pause: 0.6 },
    { type: "line", who: "narration", text: "觀眾笑了，當她在說一句俏皮話。", pause: 0.4 },
    { type: "line", who: "narration", text: "只有我聽得出，那幾個字底下壓著多少東西。", speed: "slow", pause: 0.8 },

    { type: "line", who: "narration", text: "下車之後，我走進車站旁的便利商店。", cg: "clear" },
    { type: "line", who: "narration", text: "走到甜點櫃前。焦糖布丁，還擺在老位置。", bg: "bg_conv_dessert_case" },
    { type: "line", who: "narration", text: "我拿起一個。" },
    { type: "line", who: "narration", text: "店員問我，要不要袋子。" },
    { type: "line", who: "me", text: "「不用。」" },
    { type: "line", who: "narration", text: "這一次，不是替誰買的。", speed: "slow", pause: 0.6 },
    { type: "line", who: "narration", text: "是我自己，選的。", speed: "slow", cg: "pudding", pause: 1.0 },

    { type: "line", who: "narration", text: "口袋裡那片歪歪的肉球印紙片，我那天沒有再帶在身上。", speed: "slow" },
    { type: "line", who: "narration", text: "不是弄丟了。是我打開了手，讓那隻很急的貓，自己走。", speed: "slow", pause: 0.8 },
    { type: "line", who: "narration", text: "牠跑得很快，沒有回頭。", pause: 0.5 },
    { type: "line", who: "narration", text: "嘴裡的焦糖是甜的。喉嚨那裡有一塊，苦得發亮。", speed: "slow", pause: 1.0 },
  ],

  /* ─────────── brave_freedom（勇敢的自由）：A 線・釋然帶一塊空 ─────────── */
  /* 你陪她賭過幾晚、最後沒留下她；她往她要去的地方走、腳步輕了；你站在雨棚下沒追。
     基調＝釋然帶一塊空，兩人都往前。 */
  brave_freedom: [
    { type: "scene", place: "幾天後・通勤電車", time: "傍晚", mood: "warm", bg: "bg_train_warm" },

    { type: "line", who: "narration", text: "那之後，我沒有刻意找她的消息。", bgm: "warm" },
    { type: "line", who: "narration", text: "那幾晚，我陪她在不該久留的地方多待了好幾次。每一次都像賭，賭沒人經過。", speed: "slow" },
    { type: "line", who: "narration", text: "最後一晚，雨下得不大。她要走的時候，我沒有把她留下。", pause: 0.5 },

    { type: "line", who: "narration", text: "她往她要去的地方走。我看著那個背影，腳步好像比這七天裡任何一次都輕。", speed: "slow", pause: 0.6 },
    { type: "line", who: "narration", text: "我站在雨棚下，靠牆的一側。沒有追。", pause: 0.5 },
    { type: "line", who: "narration", text: "想追的那一步，我用另一隻腳踩住了。", speed: "slow", pause: 0.7 },

    { type: "line", who: "narration", text: "幾天後，我在通勤的電車上，滑到一段訪談剪輯。", cg: "ev_interview", pause: 0.5 },
    { type: "line", who: "host", text: "「最近過得怎麼樣？」" },
    { type: "line", who: "narration", text: "鏡頭裡的她，背景不是攝影棚，像是某個很遠的地方。" },
    { type: "line", who: "akari", text: "「比以前，能喘一口氣。」", speed: "slow" },
    { type: "line", who: "host", text: "「聽起來不太像妳會講的話呢。」" },
    { type: "line", who: "akari", text: "「換個地方，連話都換了。」", speed: "slow", pause: 0.6 },
    { type: "line", who: "narration", text: "她笑了。那個笑，比螢幕上任何一次都鬆。", pause: 0.5 },
    { type: "line", who: "narration", text: "鏡頭裡沒有我。本來就不該有。", speed: "slow", pause: 0.7 },

    { type: "line", who: "narration", text: "下車之後，我走進車站旁的便利商店。", cg: "clear" },
    { type: "line", who: "narration", text: "走到甜點櫃前。焦糖布丁，還擺在老位置。", bg: "bg_conv_dessert_case" },
    { type: "line", who: "narration", text: "我拿起一個。店員問我要不要袋子。" },
    { type: "line", who: "me", text: "「不用。」" },
    { type: "line", who: "narration", text: "這一次，不是替誰買的。是我自己選的。", speed: "slow", cg: "pudding", pause: 0.6 },

    { type: "line", who: "narration", text: "口袋裡那片肉球印紙片還在。她走遠了，這隻貓卻像忘了帶走。", speed: "slow", pause: 0.6 },
    { type: "line", who: "narration", text: "胸口有一塊地方空著，風會穿過去。", speed: "slow", pause: 0.5 },
    { type: "line", who: "narration", text: "但那塊空著的旁邊，是兩個人各自往前走的方向。", speed: "slow", pause: 1.0 },
  ],

  /* ─────────── true_bad（真壞・永久缺席）：A 線貪到底・去能動歸因 ─────────── */
  /* 歸因鎖『時程／系統把她收走』非『男主害她』。不寫災難現場、不灑狗血。
     錨定措辭：「連那隻很急的貓，都被路上的燈火淹沒了」「他沒守住那一點縫隙」。
     基調＝冷、空、悔，最克制。 */
  true_bad: [
    { type: "scene", place: "幾天後・通勤電車", time: "深夜", mood: "night", bg: "bg_train_night_cold" },

    { type: "line", who: "narration", text: "那之後，我沒有刻意找她的消息。", bgm: "night" },
    { type: "line", who: "narration", text: "後來才知道，那幾晚我們多待的每一分鐘，都被別人算進了一條我們看不見的進度表。", speed: "slow" },
    { type: "line", who: "narration", text: "有一晚，路邊有人多看了一眼。沒有照片，沒有騷動，什麼戲劇性的事都沒發生。", pause: 0.5 },
    { type: "line", who: "narration", text: "只是那之後，安排她的那套東西，把縫隙收得更緊了一點。", speed: "slow", pause: 0.6 },
    { type: "line", who: "narration", text: "再過幾天，她的名字從每一個我習慣看見它的地方，安靜地不見了。", speed: "slow", pause: 0.6 },

    { type: "line", who: "narration", text: "我在電車上滑著手機，沒有訪談剪輯，沒有甜點櫃前的那個人。", cg: "clear", pause: 0.5 },
    { type: "line", who: "narration", text: "Day4 那台販賣機我也路過了。取出口空的，一罐沒人領的可可早就涼透。", cg: "cocoa", pause: 0.6 },
    { type: "line", who: "narration", text: "她沒做錯任何一個勇敢的決定。她只是還來不及做，就被收走了。", speed: "slow", pause: 0.7 },

    { type: "line", who: "narration", text: "下車之後，我還是走進車站旁的便利商店。", cg: "clear" },
    { type: "line", who: "narration", text: "走到甜點櫃前。焦糖布丁，還擺在老位置。", bg: "bg_conv_dessert_case_cold" },
    { type: "line", who: "narration", text: "我拿起一個。店員問要不要袋子。" },
    { type: "line", who: "me", text: "「不用。」" },
    { type: "line", who: "narration", text: "我學會了自己選。只是這一次，旁邊那個該看著我選的位置，永遠空了。", speed: "slow", cg: "pudding", pause: 0.7 },

    { type: "line", who: "narration", text: "口袋裡那片肉球印紙片還在。我想替那隻很急的貓找一條路。", speed: "slow" },
    { type: "line", who: "narration", text: "可是連那隻很急的貓，都被路上的燈火淹沒了。", speed: "slow", pause: 0.6 },
    { type: "line", who: "narration", text: "不是誰把牠推出去的。是太多盞燈，太亮，太快。", pause: 0.5 },
    { type: "line", who: "narration", text: "我什麼也沒做錯。我只是，沒守住那一點縫隙。", speed: "slow", pause: 1.0 },
  ],

};
