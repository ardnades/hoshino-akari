/* Day2 —— 兩塊油豆腐（驗證之夜・首張素顏 CG・reform 版）
   契約（spec/26 §1・D2）：較安靜的一夜，無 heat、不開結局旗標。
   本夜計分（嚴格照 §1，已剝除全部舊計分）：
   - 主選擇 d2_main（stance 起手・A/B 定錨，掛在她伸手要吃油豆腐那一刻）：
       縱容她偷吃 → add {stance:-1, affection:+1}
       替她想後果＝提醒她明早身體檢查 → add {stance:+1, awareness:+1, regret:+1}
   - 收束 flavor d2_close（掛在第二塊油豆腐）：
       把第二塊也讓給她 → add {affection:+1, distance:-1}
       自己留著 → flavor:true（同分・不 add）
   已剝除的舊計分（與已證 reachability 衝突）：
     ① S1 男主獨白 add:{distance:1}（整段壓成 ≤1 行內心，其餘改環境/動作）
     ② S3 兩塊油豆腐 node add:{affection:1}
     ③ 舊 d2s3「當作沒這回事」option add:{distance:1}（該 choice 已改為 d2_close flavor）
     ④ 舊 d2s5「還沒還成」option add:{distance:1}
     ⑤ seen_through_flag gate then 的 add:{awareness:1}（gate 保留作連戲敘事分歧、零加分）
   必保留錨點（全數保留）：①注目經濟學讀心（會跟過來的人眼睛會先飄過去／你連看都沒看／昨天看到我這張臉的人裡你是唯一一個什麼都沒做的）
     ②兩塊油豆腐「剛好多一塊，剛好是昨天那塊」雙重曝光 ③「大家夏天看到的笑臉，都是冬天餓出來的」
     ④「我想自己買一次／學術考察・庶民便利商店生態」（鋪 D3 自己買布丁）⑤「真的很不會說謊」。
   連戲：開頭接 D1（護唇膏在男主手上、她依約前來）；結尾鋪 D3（她明天要自己進便利店買一次）。 */
window.HOSHINO.days[2] = [
  /* ===== D2-S1　口袋裡的謊（男主內心壓到 ≤1 行，其餘改環境/動作） ===== */
  { type: "scene", place: "白天・回家路上", time: "傍晚", mood: "stop", bg: "bg_street_evening" },

  { type: "line", who: "narration", text: "一整天，那支護唇膏都在我口袋裡。", screen: "black", bgm: "stop" },
  { type: "line", who: "narration", text: "上班的路上、午休、開會。手插進口袋，指尖就會先碰到那塊冰涼的塑膠殼。", speed: "slow" },
  { type: "line", who: "narration", text: "背面那行字，被體溫焐得有點滑了。「如果明天還在這，就還給你。」", pause: 0.6 },
  // 男主內心唯一一行（D2≤1）：保留護唇膏觸覺那一下；不替她翻譯身分層、不堆跨夜獨白。
  { type: "line", who: "me", text: "（明天。凌晨一點。我不確定她會不會來。）", speed: "slow", pause: 0.8 },
  { type: "line", who: "narration", text: "傍晚的天色一格一格暗下去。我繞了遠路，經過那家便利商店。" },
  { type: "line", who: "narration", text: "玻璃門上，貼著新一期的雜誌封面。她在上面笑著，妝很完整，眼睛裡什麼都看不出來。", speed: "slow", pause: 1.0 },

  /* ===== D2-S2　暗處的聲音（把「等了二十分鐘」鋪成有停頓有近景的戲） ===== */
  { type: "scene", place: "深夜・便利商店", time: "凌晨零點五十分", mood: "store", bg: "bg_conv_interior_warm" },

  { type: "line", who: "narration", text: "推開門，暖氣撲到臉上。冷掉的耳朵一下子熱起來，有點刺。", bgm: "store" },
  { type: "line", who: "narration", text: "關東煮的湯氣在櫃台邊浮著，把那一小塊玻璃霧成白的。", se: "steam" },
  { type: "line", who: "narration", text: "我夾了竹輪、蘿蔔、蛋。手停在最上層那塊最大的油豆腐上。", depth: "near", camera: { op: "push", amount: "small", duration: 700 } },
  { type: "line", who: "me", text: "「……多買一塊也還好。」" },
  { type: "line", who: "narration", text: "我夾了兩塊。結帳的時候才發現，多出來的那塊，是我手自己決定的。", speed: "slow", pause: 0.6, camera: { op: "reset", duration: 400 } },

  { type: "scene", place: "便利商店 後巷", time: "凌晨一點", mood: "night", bg: "bg_conv_backalley_night" },

  { type: "line", who: "narration", text: "外面，呼出的氣是白的。我靠回昨天那面牆。", bgm: "night" },
  { type: "line", who: "narration", text: "手裡那袋關東煮還溫著，是整條巷子唯一熱的東西。湯氣從袋口的小縫鑽出來，一縷一縷散掉。", speed: "slow" },
  /* 等待戲收斂：男主內心不講，「會不會白等」全交給動作漏出（D2 內心獨白上限 ≤1，已用在 S1）。 */
  { type: "line", who: "narration", text: "一點零五分。我看了一眼街口。沒有人。屋簷不知道哪裡還在滴水，一下、一下。", pause: 0.6 },
  { type: "line", who: "narration", text: "我把袋子換到另一隻手，沒被拎著的那隻手插回口袋，碰到那支護唇膏。指尖已經凍了，我把領子拉高了一點。", se: "cloth" },
  { type: "line", who: "narration", text: "一點十八分。我吐出一口很長的白氣，轉身。", speed: "slow" },
  { type: "line", who: "narration", text: "就在轉身的那個瞬間——", speed: "instant", camera: { op: "push", amount: "small", duration: 500 } },
  /* commercial nit 定稿：刪 shake——這句是「缺席台詞更響」(S2) 的低壓刺中拍，不需震動鼓點。
     力量留在文字＋停頓＋上一行轉身那瞬間的 camera push small（L 上方）獨自承重。 */
  { type: "line", who: "akari", text: "「你站了二十分鐘。」", se: "step" },
  { type: "line", who: "narration", text: "聲音從巷口傳來。我回頭。", pause: 0.6, camera: { op: "reset", duration: 300 } },
  { type: "line", who: "narration", text: "她站在路燈照不到的地方，帽子壓得很低，手插在連帽衣口袋裡。圍巾把半張臉埋了進去。", expr: "戒備遮臉", mask: "口罩", motion: "fade_in", depth: "far" },
  { type: "line", who: "me", text: "「……妳什麼時候來的？」" },
  { type: "line", who: "akari", text: "「比你早。」" },
  { type: "line", who: "me", text: "「那為什麼不出來？」" },
  { type: "line", who: "narration", text: "她沒有立刻回答。視線在我身上慢慢掃了一圈——先是我的手，再來是口袋。", speed: "slow", pause: 1.2, depth: "near" },
  { type: "line", who: "akari", text: "「你都沒拿出來。」" },
  { type: "line", who: "me", text: "「拿什麼？」" },
  { type: "line", who: "akari", text: "「手機。」" },
  { type: "line", who: "narration", text: "我下意識摸了一下口袋。她看著這個動作，視線停了一秒。", se: "pat", depth: "near" },
  { type: "line", who: "akari", text: "「也沒往那邊看。」" },
  { type: "line", who: "narration", text: "她朝街角輕輕抬了下下巴。我順著看過去。" },
  { type: "line", who: "narration", text: "街角那棟高樓頂上，亮著一塊飯店招牌。隔了一條街，剛好能把這條巷口看進去。", speed: "slow", pause: 0.8 },
  { type: "line", who: "me", text: "「……妳剛剛在看我？」" },
  { type: "line", who: "akari", text: "「嗯。」" },
  { type: "line", who: "narration", text: "她答得很乾脆，像在陳述一件理所當然的事。" },
  // 注目經濟學讀心拍（S-READ，全劇關鍵，逐字保留＋鏡頭強化）：她的能力＝讀人，性感的能力。
  { type: "line", who: "akari", text: "「會跟過來的人，眼睛會先飄過去。」", speed: "slow", camera: { op: "push", amount: "small", duration: 800 } },
  { type: "line", who: "akari", text: "「往那塊招牌、往店裡的監視器、往我臉上。每個人都一樣。」", speed: "slow", depth: "near" },
  // commercial nit 定稿：點睛句「你連看都沒看」仍坐在 push 高點（不在此 reset）；reset 後移到下一行收。
  { type: "line", who: "akari", text: "「你連看都沒看。」", speed: "instant" },
  { type: "line", who: "akari", text: "「別誤會。」", pause: 0.6, expr: "別過視線", motion: "step_back", camera: { op: "reset", duration: 400 } },
  { type: "line", who: "akari", text: "「不是因為你特別。」" },
  { type: "line", who: "me", text: "「那是因為？」" },
  { type: "line", who: "akari", text: "「因為昨天，看到我這張臉的人裡——」" },
  { type: "line", who: "narration", text: "她停了一下。用鞋尖踢了踢地上的小石子，踢偏了，沒踢中。", se: "pebble", expr: "鬆動", mask: "半罩", depth: "near" },
  { type: "line", who: "akari", text: "「……你是唯一一個，什麼都沒做的。」", speed: "slow", pause: 1.0 },
  { type: "line", who: "narration", text: "風吹過巷子。她呼出的氣散了，圍巾被吹得貼上半邊臉。", se: "wind" },

  /* seen_through_flag 判定 → 連戲敘事分歧（day2/day7 沿用）。zero add：早鳥 awareness 已剝除。 */
  {
    type: "gate", cond: "flag:seen_through_flag",
    then: [
      /* 默契交給「假裝只是一句關於石子的話」承重；男主不宣告「我懂她在讀我」。 */
      { type: "line", who: "narration", text: "她看的不是我的臉，是我的手、我的口袋。", speed: "slow" },
      { type: "line", who: "narration", text: "她沒說破。我也沒說。我們都假裝這只是一句關於石子的話。", pause: 0.6 },
    ],
    else: [
      { type: "line", who: "narration", text: "她說得很淡，淡得像在講別人的事。", pause: 0.5 },
    ],
  },

  /* ===== D2-S3　兩塊油豆腐（雙重曝光・主選擇 stance 起手） ===== */
  { type: "line", who: "narration", text: "她往前走了半步，停在路燈的邊緣，指向我手上的袋子。", depth: "near", motion: "step_in" },
  { type: "line", who: "akari", text: "「所以呢。」" },
  { type: "line", who: "me", text: "「所以什麼？」" },
  { type: "line", who: "akari", text: "「今天的貓糧——」" },
  { type: "line", who: "narration", text: "她踮起腳，往袋子裡瞄了一眼，又很快收回視線，假裝沒在意。", se: "tiptoe", expr: "怔住", depth: "near" },
  { type: "line", who: "akari", text: "「有油豆腐嗎？」" },
  { type: "line", who: "narration", text: "我把袋子打開。湯氣一下子冒上來，在我們之間散開。", se: "steam" },
  { type: "line", who: "narration", text: "兩塊油豆腐，並排躺在最上面。", pause: 1.0, cg: "oden_cup", depth: "near", camera: { op: "push", amount: "medium", duration: 800 } },
  { type: "line", who: "narration", text: "她的動作停住了。抬眼看我，又低頭看那兩塊，再抬眼看我。", expr: "怔住", depth: "near" },
  { type: "line", who: "akari", text: "「……怎麼有兩塊。」", pause: 0.8 },
  { type: "line", who: "me", text: "「剛好買多了。」" },
  /* 雙重曝光（S6）：「剛好」這個詞被她原封不動接走，當成把柄。
     charm 定稿：與 D1「貓」的退守式雙重曝光區隔——D1 是灯把詞接走當盾（防衛、退守），
     D2 是灯把男主的詞接走當把柄（進攻、進逼）。把這個攻守反向做實在鏡頭/節奏上：
     她接走「剛好」那拍給她進逼的 camera push（非 reset），與 D1 貓的退守感拉開心理向量。 */
  { type: "line", who: "narration", text: "她把這兩個字原封不動接了回去，往前半步，像把它當成一個把柄攥住。", depth: "near", camera: { op: "push", amount: "small", duration: 500 } },
  { type: "line", who: "akari", text: "「剛好。」", speed: "slow" },
  { type: "line", who: "akari", text: "「剛好多一塊，剛好是昨天那塊。」", speed: "slow", cg: "clear", expr: "抓到把柄的笑", depth: "near", camera: { op: "reset", duration: 400 } },
  { type: "line", who: "narration", text: "她沒等我解釋，伸手就要去夾那塊較大的。動作很順，像她已經決定那是她的。", depth: "near" },

  /* 主選擇 d2_main：stance 起手・A/B 定錨，掛在她伸手要吃油豆腐那一刻 */
  {
    type: "choice", id: "d2_main",
    prompt: "她的手已經伸向那塊油豆腐——",
    options: [
      {
        label: "（什麼都不說，把袋口朝她那邊偏了偏）",
        hint: "縱容她偷吃",
        add: { stance: -1, affection: 1 },
        reaction: [
          { type: "line", who: "narration", text: "我沒攔。只是把袋口，悄悄朝她那邊偏了偏，像本來就該讓她拿得順手。", se: "bag", depth: "near" },
          { type: "line", who: "narration", text: "她夾走那塊。動作快得像怕我反悔。", expr: "怔住", depth: "near" },
          { type: "line", who: "akari", text: "「……你也沒問我明天要不要量體重。」", speed: "slow" },
          { type: "line", who: "me", text: "「妳沒問我要不要分，我也沒問。」" },
          { type: "line", who: "narration", text: "她看了我一眼，沒接話。帽簷壓下來，遮住了眼睛。", expr: "別過視線" },
        ],
      },
      {
        label: "「妳明早不是有身體檢查？」",
        hint: "替她想後果",
        add: { stance: 1, awareness: 1 },
        reaction: [
          { type: "line", who: "me", text: "「妳明早不是有身體檢查？」" },
          { type: "line", who: "narration", text: "她的手停在半空，指尖離那塊油豆腐只剩一公分。", pause: 0.8, expr: "怔住", depth: "near", camera: { op: "push", amount: "small", duration: 600 } },
          { type: "line", who: "akari", text: "「……記得。」", speed: "slow" },
          { type: "line", who: "narration", text: "她把手收回去半分，又沒真的收回去。卡在那裡。", pause: 0.6, camera: { op: "reset", duration: 400 } },
          { type: "line", who: "akari", text: "「你是想說，我不該吃。」", expr: "別過視線" },
          { type: "line", who: "me", text: "「我是想說，妳自己決定。」" },
          { type: "line", who: "narration", text: "她盯著我看了兩秒。那兩秒裡，她像在重新算一筆帳——值不值得，會不會被發現。", speed: "slow", pause: 0.8 },
          { type: "line", who: "akari", text: "「……掃興。」", speed: "slow", expr: "嘴硬" },
          { type: "line", who: "narration", text: "她還是夾走了那塊。只是這一次，是看著我夾的。", depth: "near" },
        ],
      },
    ],
  },

  /* ===== 匯合：真的很不會說謊（必保留錨點） ===== */
  { type: "line", who: "narration", text: "她沒有再追問那句「剛好」。帽簷下，她先笑了，又趕快把嘴角壓回去。", pause: 0.6, expr: "素顏微笑", depth: "near" },
  { type: "line", who: "akari", text: "「你啊。」" },
  { type: "line", who: "akari", text: "「真的很不會說謊。」", speed: "slow" },
  { type: "line", who: "narration", text: "她側過身，背對著街口，拉下口罩，就著湯氣咬了一口。", se: "mask", expr: "側身咬食", depth: "near" },
  { type: "line", who: "narration", text: "熱氣燙得她瞇起眼，下意識又把竹籤往嘴邊送了第二下，才想起要吹一吹。", expr: "側身咬食", se: "steam", depth: "near", cg: "ev_signlight", pause: 1.0 },
  { type: "line", who: "narration", text: "招牌的光打在她半張臉上。沒有妝，就是一個普通女生，在寒夜裡吃一塊很燙的油豆腐。", speed: "slow", pause: 0.8 },
  { type: "line", who: "akari", text: "「……嗯。還是這塊好吃。」", speed: "slow" },
  { type: "line", who: "narration", text: "她說「這塊」的時候，特別輕。像是在跟昨天那塊比。", speed: "slow", pause: 0.6 },

  /* ===== D2-S4　漂亮的數值與泳裝（冬天餓出夏天笑臉・必保留） ===== */
  { type: "line", who: "me", text: "「對了，今天早上的檢查？」", cg: "clear" },
  { type: "line", who: "akari", text: "「過了。」", pause: 0.5 },
  { type: "line", who: "akari", text: "「數字很漂亮。」", expr: "無表情" },
  { type: "line", who: "narration", text: "那個「漂亮」，她說得像在唸別人的成績單。沒有一點屬於自己的成分。", speed: "slow" },
  { type: "line", who: "akari", text: "「然後，明天拍泳裝。」" },
  { type: "line", who: "me", text: "「……現在是冬天吧？」" },
  { type: "line", who: "akari", text: "「春夏號要提前拍。」", expr: "聳肩" },
  { type: "line", who: "akari", text: "「棚裡會開很強的暖氣，假裝是夏天。」" },
  { type: "line", who: "akari", text: "「所以才煩。」" },
  { type: "line", who: "narration", text: "她低頭，又咬了一口油豆腐，這次小心地避開了最燙的地方。", depth: "near" },
  { type: "line", who: "akari", text: "「大家夏天看到的笑臉，都是冬天餓出來的。」", speed: "slow", pause: 1.2 },
  { type: "line", who: "narration", text: "她說完，自己愣了一下，像是不小心說多了。", pause: 0.5 },
  { type: "line", who: "akari", text: "「所以——今天這塊，特別好吃。」", expr: "素顏微笑", depth: "near" },

  /* ===== D2-S5　她又一次沒拿走（收束 flavor＋鋪 D3 自己買一次） ===== */
  { type: "line", who: "narration", text: "她吃完，把竹籤折好，放回袋子裡，連湯汁都沒滴在地上。", cg: "clear", se: "stick" },
  { type: "line", who: "narration", text: "袋子裡，還剩第二塊油豆腐。湯氣已經弱了，但還溫著。", pause: 0.6, depth: "near" },

  /* 收束 flavor d2_close：掛在第二塊油豆腐 */
  {
    type: "choice", id: "d2_close",
    prompt: "袋子裡還剩第二塊——",
    options: [
      {
        label: "（把袋子整個遞過去）",
        hint: "把第二塊也讓給她",
        add: { affection: 1, distance: -1 },
        reaction: [
          { type: "line", who: "narration", text: "我把袋子整個遞過去。", se: "bag", depth: "near" },
          { type: "line", who: "me", text: "「還有一塊。」" },
          { type: "line", who: "narration", text: "她看著那塊，又看我，沒立刻伸手。", pause: 0.8, expr: "怔住", depth: "near" },
          { type: "line", who: "akari", text: "「……你不吃？」" },
          // male-soul block 定稿：撤掉「我看妳吃就飽了」表白式餵食，回到遞而不說。
          // 男主只把袋子又往她那邊偏，零回應；讓她備好的「你不吃」撞上空無＝S1 驗證撲空。
          { type: "line", who: "narration", text: "我沒答，只把袋子又往她那邊偏了半寸。", depth: "near" },
          { type: "line", who: "narration", text: "她等的那句解釋沒等到，問句懸在半空，沒人接。", pause: 0.6 },
          { type: "line", who: "narration", text: "她沒再追問。只是接過去，這次沒側身，就當著我的面，拉下口罩咬了。", expr: "別過視線", depth: "near" },
          { type: "line", who: "akari", text: "「……最後一塊了。明天沒有。」", speed: "slow" },
        ],
      },
      {
        label: "（自己拿起來吃）",
        hint: "自己留著",
        flavor: true,
        reaction: [
          { type: "line", who: "narration", text: "我夾起第二塊，自己吃了。", depth: "near" },
          { type: "line", who: "narration", text: "她盯著我的嘴看了半秒，視線又很快移開。", expr: "別過視線", depth: "near" },
          { type: "line", who: "akari", text: "「……你還真吃啊。」" },
          { type: "line", who: "me", text: "「妳剛說數字很漂亮。」" },
          { type: "line", who: "akari", text: "「我又沒說要。」", expr: "嘴硬" },
          { type: "line", who: "narration", text: "她嘴上這麼說，眼睛卻在袋子空掉的那一刻，亮了一下又暗下去。", speed: "slow", pause: 0.6 },
        ],
      },
    ],
  },

  /* ===== 匯合：護唇膏她又一次沒拿走＋約明天進店裡 ===== */
  { type: "line", who: "narration", text: "我把護唇膏掏出來。", cg: "lipbalm" },
  { type: "line", who: "me", text: "「對了，還妳。」" },
  { type: "line", who: "narration", text: "她看著我的手。沒有接。", pause: 1.0, depth: "near" },
  { type: "line", who: "akari", text: "「……先放你那。」", pause: 0.6, expr: "別過視線" },
  { type: "line", who: "me", text: "「啊？昨天不是說好——」" },
  { type: "line", who: "akari", text: "「我改主意了。」" },
  { type: "line", who: "narration", text: "她帽子壓更低，後退半步，看向便利商店那扇亮著的玻璃門。", cg: "clear", expr: "別過視線", motion: "step_back", depth: "far" },
  { type: "line", who: "akari", text: "「明天。」", pause: 0.6 },
  { type: "line", who: "me", text: "「明天怎樣？」" },
  { type: "line", who: "akari", text: "「裡面。」", pause: 0.6 },
  { type: "line", who: "me", text: "「便利商店？」" },
  { type: "line", who: "narration", text: "她點頭。視線還黏在那扇門上，像在看一個很遠的地方。", depth: "near" },
  { type: "line", who: "akari", text: "「我想自己買一次。」", speed: "slow", expr: "收起玩笑", depth: "near" },
  { type: "line", who: "narration", text: "她說完，像是覺得自己露了什麼，立刻把臉別開。", pause: 0.5 },
  { type: "line", who: "akari", text: "「學術考察。庶民便利商店生態。」", speed: "instant", expr: "立刻嘴硬" },
  { type: "line", who: "me", text: "「生態。」" },
  { type: "line", who: "akari", text: "「對。」" },
  { type: "line", who: "narration", text: "她轉身。", expr: "背對", motion: "fade_in" },
  { type: "line", who: "akari", text: "「明天別遲到。」" },
  { type: "line", who: "narration", text: "她走進巷子。走了兩步，又像想起什麼，腳步慢了下來。", se: "step", expr: "背對", depth: "near" },

  /* 原 affection>=2 gate：Day1/2 路徑下 affection 必≥2，else（樸素版）為死碼 → 已內聯動作版。
     QA 定稿（akari-soul / charm 各一票 block）：刪原「謝謝你，記得那塊油豆腐。」這句乾淨無刺的直接道謝
     ——softness 改從動作縫隙漏出（頓住、沒回頭、用「規則的形狀」要明天那塊＝間接在乎），不靠台詞給出。 */
  { type: "line", who: "narration", text: "她停在那裡，半邊側臉被招牌的光掃過，被風吹紅的鼻尖也是。沒回頭。", expr: "背對", depth: "near", pause: 0.8 },
  { type: "line", who: "akari", text: "「……欸。」", pause: 0.6, expr: "背對", depth: "near" },
  { type: "line", who: "me", text: "「嗯？」" },
  // 「規則的形狀」要明天那塊＝間接漏出在乎；嘴硬、無「謝」字、把暖壓在背影。
  { type: "line", who: "akari", text: "「明天那塊，別買最大的。」", speed: "slow", expr: "背對", depth: "near" },
  { type: "line", who: "me", text: "「為什麼？」" },
  { type: "line", who: "akari", text: "「最大的，留給隔天。」", speed: "slow", pause: 1.0, expr: "背對", depth: "near" },

  { type: "line", who: "narration", text: "話一說完，她就像要趕在自己反悔之前，快步走進了巷子深處。", se: "wind", cg: "clear", clear: true },
  { type: "line", who: "narration", text: "我站在原地，手裡捏著那支她又一次沒拿走的護唇膏。塑膠殼，被我的手焐熱了。", screen: "black" },
  // charm 定稿：結尾補回一粒沙。她明天就要自己走進店裡，卻把今晚這支留在我這——不對稱的涼。
  // 不點破倒數，呼應 D1「是還，不是拿回」的冷句法；停在帶涼的物件而非純暖的許願。
  { type: "line", who: "narration", text: "明天她要自己走進那扇門，自己買一次。可這支護唇膏，她又留了一晚。", pause: 0.8, bgm: "warm" },
  { type: "line", who: "narration", text: "往前走的人，把要還的東西留在後面。我捏著它，沒想通——她是真的會忘，還是不想還完。", speed: "slow" },
];
