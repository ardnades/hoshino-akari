/* Day5 —— 她不在，可是痕跡在（缺席日・收據暗號解謎＋留物互救）
   計分（嚴格照 spec/26 §1 D5 那條，舊計分已剝除）：
     ・D5-S1 開場固定旁白 add:{heat:10}（曝光線底數第三筆，寫死非選項）。
     ・gate cond:"stance<=-3" A／B 分歧（兩線她都缺席，差在男主怎麼讀痕跡）：
         then（A 線・共謀逃）→分支結尾 add:{affection:1}（A 線禁 awareness）。
         else（B 線・見證她自己做決定）→分支結尾 add:{awareness:1, affection:1}。
     ・d5s3 解謎軟分歧：讀懂 add:{affection:1} ／ 看不懂 add:{regret:1}。
     ・d5s4 兩塊油豆腐＝flavor（不 set、不加分；留一塊結尾仍收走盒子，連戲鐵則 BLOCKER#4）。
     ・d5s5 留物回應＝flavor（剝除加分；保留未開封熱可可立回原位＋收好收據的留痕互救情感拍）。
   D5 無 stance 加分；不得 set helped／gambled／let_her_go／pushed／almost；heat 只有開場 +10。
   男主內心旁白＝缺席日例外，放寬至 ≤20 行（單句仍 ≤15 字、不全知化、不替她翻譯身分層）。*/
window.HOSHINO.days[5] = [
  /* ===== D5-S1：午休・決定要不要去（開場 heat 底數） ===== */
  { type: "scene", place: "白天・公司", time: "午休", mood: "store", bg: "bg_office_day_warm" },

  { type: "line", who: "narration", text: "我又點開那則貼文。", bgm: "rain" },
  { type: "line", who: "narration", text: "轉貼還在增加。" },
  { type: "line", who: "narration", text: "留言更多了。", se: "buzz" },
  {
    type: "line", who: "narration", text: "", ui: "sns",
    sns: {
      title: "推薦欄",
      posts: [
        { text: "路燈的位置查到了，江東區沒錯。" },
        { text: "她這週是不是住那邊的飯店？", acct: true },
        { text: "有人去蹲點了嗎？" },
        { text: "不要去啦，造成困擾。", reply: true },
      ],
    },
  },
  /* ↓ 開場固定旁白 add:{heat:10}（D5 曝光線底數；掛在「看 SNS 升溫」這拍） */
  { type: "line", who: "narration", text: "熱度像水，從遠處一格一格漫過來。", speed: "slow", pause: 0.8, add: { heat: 10 } },
  { type: "line", who: "narration", text: "還沒有人說出那間便利商店。" },
  { type: "line", who: "narration", text: "但留言往那個方向，一步一步靠近。", speed: "slow", pause: 0.8 },

  { type: "line", who: "narration", text: "我把手機收進口袋。" },
  { type: "line", who: "narration", text: "指尖碰到護唇膏的外殼。", se: "pat" },
  { type: "line", who: "narration", text: "隔著一層布，它抵著我的手背。" },
  { type: "line", who: "narration", text: "比手機還有存在感。", speed: "slow", pause: 0.8 },

  { type: "line", who: "narration", text: "昨天她說，先別丟。" },
  { type: "line", who: "narration", text: "說完就把臉別開，像那句話沒有重量。", pause: 0.6 },
  { type: "line", who: "narration", text: "我替她拿著，到現在。", speed: "slow", pause: 1.0 },

  { type: "line", who: "narration", text: "下午開會，我又摸了一次。" },
  { type: "line", who: "narration", text: "還在。", pause: 0.6 },
  { type: "line", who: "narration", text: "她說，今天可能來不了。", speed: "slow", pause: 1.0 },
  { type: "line", who: "narration", text: "那我，還要去嗎？", pause: 0.6 },
  { type: "line", who: "narration", text: "去了她沒來，我就是站在巷子裡發呆的笨蛋。" },
  { type: "line", who: "narration", text: "不去——", speed: "instant", pause: 0.5 },
  { type: "line", who: "narration", text: "她說的是「可能來不了」。" },
  { type: "line", who: "narration", text: "不是「不要來」。", speed: "slow", pause: 1.0 },
  { type: "line", who: "narration", text: "她用字一向準。", pause: 0.6 },
  { type: "line", who: "narration", text: "準到留了一個縫給我鑽。", speed: "slow", pause: 0.8 },
  { type: "line", who: "narration", text: "那就去。", speed: "slow", pause: 0.8, camera: { op: "push", amount: "small", duration: 500 } },

  /* ===== D5-S2：等待・空位（無人的後巷，缺席感主軸） ===== */
  { type: "scene", place: "深夜・便利商店 後巷", time: "凌晨一點", mood: "night", bg: "bg_conv_backalley_empty_cold" },

  { type: "line", who: "narration", text: "一點零五分。沒有人。", speed: "instant", bgm: "night", pause: 0.8 },
  { type: "line", who: "narration", text: "一點十五分。沒有人。", speed: "instant", pause: 0.8 },
  { type: "line", who: "narration", text: "一點二十分。連腳步聲都沒有。", speed: "slow", pause: 1.0 },
  { type: "line", who: "narration", text: "風把巷子吹得很乾淨。", se: "wind" },
  { type: "line", who: "narration", text: "乾淨得像從來沒有人在這裡站過。", speed: "slow", pause: 0.8 },

  { type: "line", who: "narration", text: "我盯著她平常站的那個角落。" },
  { type: "line", who: "narration", text: "路燈照不到，正好。", depth: "near" },
  { type: "line", who: "narration", text: "她總挑這種地方。" },
  { type: "line", who: "narration", text: "亮一點都不肯，暗一點又嫌看不見出口。", speed: "slow", pause: 0.8 },
  { type: "line", who: "narration", text: "今天那個角落，空的。", pause: 1.2 },

  { type: "line", who: "narration", text: "我進店裡買了關東煮。", se: "store" },
  { type: "line", who: "narration", text: "竹輪、蘿蔔、蛋——", speed: "instant" },
  /* charm：降級為安靜回扣（不再當第二個發現式驚喜，鏡頭高光只留給收據暗號）。
     拿掉「我什麼時候夾的？」的懸念與 camera push；只留沉澱回扣。 */
  { type: "line", who: "narration", text: "結帳時，袋子裡又是兩塊油豆腐。", cg: "oden_cup", se: "pat" },
  { type: "line", who: "narration", text: "手比腦子先動了。", pause: 0.6 },
  { type: "line", who: "narration", text: "替她留一份，已經變成習慣了。", speed: "slow", pause: 1.0, cg: "clear" },

  { type: "line", who: "narration", text: "我提著袋子走回那個空角落。" },
  { type: "line", who: "narration", text: "她不在。" },
  { type: "line", who: "narration", text: "可是地上，有東西。", speed: "slow", pause: 0.8 },

  { type: "line", who: "narration", text: "牆角壓著一張白色的小紙，折成四折。" },
  { type: "line", who: "narration", text: "底下墊著半塊磚。" },
  { type: "line", who: "narration", text: "像怕被風吹走。" },
  { type: "line", who: "narration", text: "又像怕太顯眼。", pause: 0.8 },
  { type: "line", who: "narration", text: "放得很講究。" },
  { type: "line", who: "narration", text: "顯眼到剛好只有等門的人會看到，路過的人不會。", speed: "slow", pause: 1.0 },
  { type: "line", who: "narration", text: "我蹲下去，撿起來，打開。", se: "give", cg: "receipt", depth: "closeup" },

  /* ===== D5-S3：解謎・收據正背面（軟分歧：讀懂／看不懂） ===== */
  { type: "line", who: "narration", text: "邊角有一點泥印。", bgm: "warm" },
  { type: "line", who: "narration", text: "是收據。", speed: "slow" },
  { type: "line", who: "narration", text: "不是今天的。", speed: "slow", pause: 0.6 },
  { type: "line", who: "narration", text: "日期是前天。" },
  { type: "line", who: "narration", text: "那天，她久違地自己走進便利商店。" },
  { type: "line", who: "narration", text: "自己選、自己拿、自己付錢。" },
  { type: "line", who: "narration", text: "品項只有一個。", pause: 0.8 },
  { type: "line", who: "narration", text: "焦糖布丁。", speed: "slow" },
  { type: "line", who: "narration", text: "她第一次自己選的那一個。", speed: "slow", pause: 1.0 },
  { type: "line", who: "narration", text: "時間印在上面：01:03。" },
  { type: "line", who: "narration", text: "那串數字旁邊，有人用原子筆畫了一個很小的東西。" },
  { type: "line", who: "narration", text: "一個肉球印。", speed: "slow", pause: 0.8, camera: { op: "push", amount: "small", duration: 500 } },
  { type: "line", who: "narration", text: "她不寫字。", pause: 0.6 },
  { type: "line", who: "narration", text: "畫圖比較像回信。", speed: "slow", pause: 1.0 },

  { type: "line", who: "narration", text: "我把收據翻到背面。", se: "give", cg: "receipt_back", camera: { op: "push", amount: "medium", duration: 700 } },
  { type: "line", who: "narration", text: "背面的線條比正面的字跡深，像是後來才補上的。" },

  /* gate cond:"stance<=-3"，A／B 分歧；兩線她都缺席，差只在男主「讀痕跡的方式」 */
  {
    type: "gate", cond: "stance<=-3",
    then: [
      /* A 線・共謀逃：把同一組痕跡讀成「她在準備悄悄離開，這條肉球印是留給你跟上的線」 */
      { type: "line", who: "narration", text: "一隻畫得很歪的小貓。", cg: "receipt_back" },
      { type: "line", who: "narration", text: "便利商店的玻璃門上，打了一個大大的叉。" },
      { type: "line", who: "narration", text: "貓沒有走向門。" },
      { type: "line", who: "narration", text: "牠繞過去。", speed: "slow", pause: 0.6 },
      { type: "line", who: "narration", text: "一串肉球印，繞過正門，往側邊去。" },
      { type: "line", who: "narration", text: "繞到一台四四方方的機器旁邊。" },
      { type: "line", who: "narration", text: "販賣機。", speed: "slow", pause: 0.8 },
      { type: "line", who: "narration", text: "她不是叫我別來。", pause: 0.6 },
      { type: "line", who: "narration", text: "是把人多的那道門打了叉。", speed: "slow" },
      { type: "line", who: "narration", text: "然後留了一條只有貓走得通的路。", speed: "slow", pause: 0.8 },
      { type: "line", who: "narration", text: "肉球印停在販賣機旁邊。" },
      { type: "line", who: "narration", text: "那裡，點了一個小小的、長條形的記號。" },
      { type: "line", who: "narration", text: "護唇膏。", speed: "slow", pause: 0.8 },
      { type: "line", who: "narration", text: "她連這個都畫上去了。", speed: "slow", pause: 1.2 },
      { type: "line", who: "narration", text: "像在說：那邊，你跟上。", speed: "slow" },
      { type: "line", who: "narration", text: "沒有任何字。", speed: "instant", pause: 1.5, cg: "clear", camera: { op: "reset", duration: 400 }, add: { affection: 1 } },
    ],
    else: [
      /* B 線・見證：停在「她畫了、我讀到了」，不替她翻譯身分層、不替她下心理定論。
         male-soul／charm：刪「那道門她已經不能再進來」（替她讀身分層後果），
         「不是求救／已經決定好了」改成扣在「畫」這個動作上的觀察。 */
      { type: "line", who: "narration", text: "一隻畫得很歪的小貓。", cg: "receipt_back" },
      { type: "line", who: "narration", text: "便利商店的玻璃門上，打了一個大大的叉。" },
      { type: "line", who: "narration", text: "貓沒有走向門。" },
      { type: "line", who: "narration", text: "牠繞過去。", speed: "slow", pause: 0.6 },
      { type: "line", who: "narration", text: "一串肉球印，繞過正門，往側邊去。" },
      { type: "line", who: "narration", text: "繞到一台四四方方的機器旁邊。" },
      { type: "line", who: "narration", text: "販賣機。", speed: "slow", pause: 0.8 },
      { type: "line", who: "narration", text: "門上那個叉，是她自己畫的。", pause: 0.6 },
      { type: "line", who: "narration", text: "她沒有問我怎麼辦。", speed: "slow", pause: 0.8 },
      { type: "line", who: "narration", text: "只是把走法畫下來，留在這裡。" },
      { type: "line", who: "narration", text: "肉球印停在販賣機旁邊。", pause: 0.8 },
      { type: "line", who: "narration", text: "她畫了。", speed: "slow" },
      { type: "line", who: "narration", text: "剩下的，要我自己讀。", speed: "slow", pause: 1.0 },
      { type: "line", who: "narration", text: "沒有任何字。", speed: "instant", pause: 1.5, cg: "clear", camera: { op: "reset", duration: 400 }, add: { awareness: 1, affection: 1 } },
    ],
  },

  { type: "line", who: "narration", text: "我又翻回正面，看著那個 01:03，和旁邊的肉球印。" },
  { type: "line", who: "narration", text: "……這是什麼意思？", speed: "slow", pause: 1.2 },

  {
    type: "choice", id: "d5s3",
    prompt: "（收據翻來翻去。她到底要我懂什麼？）",
    options: [
      {
        label: "「肉球印的方向，才是重點。」", _dbg: "affection +1（讀懂）",
        add: { affection: 1 },
        reaction: [
          { type: "line", who: "me", text: "「肉球印的方向，才是重點。」" },
          { type: "line", who: "narration", text: "門上打了叉。" },
          { type: "line", who: "narration", text: "肉球印繞過去，停在販賣機旁邊。", pause: 0.6 },
          { type: "line", who: "narration", text: "她沒寫地點。" },
          { type: "line", who: "narration", text: "因為地點不能寫，只能畫成一隻貓走的路。", speed: "slow" },
          { type: "line", who: "narration", text: "我把收據捏在手裡，朝停車場走。" },
          { type: "line", who: "narration", text: "腳先動的。" },
          { type: "line", who: "narration", text: "後來才知道，自己一點都沒猶豫。", speed: "slow", pause: 0.8 },
        ],
      },
      {
        label: "「01:03……她要我算什麼？」", _dbg: "regret +1（看不懂）",
        add: { regret: 1 },
        reaction: [
          { type: "line", who: "me", text: "「01:03……她要我算什麼？」" },
          { type: "line", who: "narration", text: "我盯著那串數字，想了很久。" },
          { type: "line", who: "narration", text: "減去開店時間？加上她平常出現的點？", speed: "instant" },
          { type: "line", who: "narration", text: "都算不出一個地方。", pause: 0.8 },
          { type: "line", who: "narration", text: "她畫圖，是因為畫圖比寫字像回信。" },
          { type: "line", who: "narration", text: "我卻把回信當成考題在解。", speed: "slow" },
          { type: "line", who: "narration", text: "繞了兩圈，才注意到那串肉球印指向哪裡。" },
          { type: "line", who: "narration", text: "朝販賣機走過去的時候，我比她慢了不只一點。", speed: "slow", pause: 1.0 },
        ],
      },
    ],
  },

  /* ===== D5-S4：停車場・還溫的熱可可（缺席日寶石；兩塊油豆腐 flavor 匯合） ===== */
  { type: "scene", place: "深夜・便利商店後方 停車場", time: "凌晨一點半", mood: "night", bg: "bg_vending_parking_empty_cold" },

  { type: "line", who: "narration", text: "販賣機的燈，在黑暗裡亮著。", bgm: "warm", camera: { op: "push", amount: "small", duration: 600 } },
  { type: "line", who: "narration", text: "塑膠長椅空著。" },
  { type: "line", who: "narration", text: "她沒有坐在那裡。", pause: 0.8 },
  { type: "line", who: "narration", text: "但取出口旁邊，立著一罐熱可可。", cg: "cocoa", depth: "near" },
  { type: "line", who: "narration", text: "我拿起來。", se: "give" },
  /* commercial：刪同義墊行「罐子還溫著」，一拍發現直接接一拍推理。 */
  { type: "line", who: "narration", text: "還是溫的。", speed: "slow", pause: 1.2 },
  { type: "line", who: "narration", text: "表示把它放在這裡的人，離開沒多久。" },
  { type: "line", who: "narration", text: "也許就差十分鐘。", pause: 0.6 },
  { type: "line", who: "narration", text: "也許就差一個轉角。", speed: "slow", pause: 1.0 },
  /* commercial：刪後半硬湊的反事實對偶，錯過感落在單一真句＋停頓承重。 */
  { type: "line", who: "narration", text: "我來早一點，會不會就接住她了。", speed: "slow", pause: 1.2 },
  { type: "line", who: "narration", text: "她不在。", speed: "instant", pause: 1.0 },
  { type: "line", who: "narration", text: "可是那罐熱可可，像是替她，坐在這裡。", speed: "slow" },

  { type: "line", who: "narration", text: "她沒有選完全沒人的地方，也沒有選太亮的地方。" },
  { type: "line", who: "narration", text: "在亮和暗的邊界，挑了一個剛好能逃走的位置。", speed: "slow" },
  { type: "line", who: "narration", text: "連留東西，都像貓。", pause: 0.8, cg: "clear" },

  { type: "line", who: "narration", text: "我坐下，打開那袋關東煮。" },
  { type: "line", who: "narration", text: "兩塊油豆腐，並排躺著。", cg: "oden_cup", depth: "near" },
  { type: "line", who: "narration", text: "一塊是我的。" },
  { type: "line", who: "narration", text: "另一塊，是手自己多夾的那塊。", speed: "slow" },
  { type: "line", who: "narration", text: "她今天不會來。" },
  { type: "line", who: "narration", text: "這我知道。", pause: 0.8 },

  {
    type: "choice", id: "d5s4",
    prompt: "（兩塊油豆腐。）",
    options: [
      {
        label: "「兩塊，都吃掉。」", _dbg: "+0（情緒選擇）", flavor: true,
        reaction: [
          { type: "line", who: "narration", text: "吃吧。" },
          { type: "line", who: "narration", text: "她要是看到剩菜，大概又要唸浪費。" },
          { type: "line", who: "narration", text: "我把兩塊都吃了。" },
          { type: "line", who: "narration", text: "第二塊不知道為什麼，燙得很過分。", speed: "slow", pause: 0.8 },
          { type: "line", who: "narration", text: "燙到我得停一下，才嚥得下去。", speed: "slow", pause: 1.0, cg: "clear" },
        ],
      },
      {
        label: "「留一塊，陪一會。」", _dbg: "+0（情緒選擇）", flavor: true,
        reaction: [
          { type: "line", who: "narration", text: "我吃了一塊。" },
          { type: "line", who: "narration", text: "另一塊，蓋回盒子裡。" },
          { type: "line", who: "narration", text: "盒子擱在長椅上，挨著我坐。" },
          { type: "line", who: "narration", text: "明知道她今天不會來。" },
          { type: "line", who: "narration", text: "湯涼掉之前，我還是讓那塊油豆腐，在旁邊多待了一會。" },
          { type: "line", who: "narration", text: "像替誰佔著位子。", speed: "slow", pause: 1.0 },
          { type: "line", who: "narration", text: "後來，我把盒子收好。" },
          { type: "line", who: "narration", text: "留在外面，她不一定拿得到。" },
          { type: "line", who: "narration", text: "也可能被踩到、被撿走。" },
          { type: "line", who: "narration", text: "這種東西，留在這裡只會變髒。" },
          { type: "line", who: "narration", text: "不如，我替她收著。", speed: "slow", pause: 0.8, cg: "clear" },
        ],
      },
    ],
  },

  /* ===== D5-S5：實物回應・護唇膏不留＋留痕互救（flavor，零加分） ===== */
  { type: "line", who: "narration", text: "我把手伸進口袋。" },
  { type: "line", who: "narration", text: "護唇膏還在。", speed: "instant" },
  { type: "line", who: "narration", text: "我把它拿出來，在販賣機的燈光下看了一眼。", cg: "lipbalm", depth: "closeup" },
  { type: "line", who: "narration", text: "要不要……也留在這裡？", speed: "slow", pause: 1.0 },
  { type: "line", who: "narration", text: "——不行。", speed: "instant", pause: 0.4, shake: true },
  { type: "line", who: "narration", text: "留在這裡太顯眼。" },
  { type: "line", who: "narration", text: "被風吹走、被人撿走，哪一種都不行。" },
  { type: "line", who: "narration", text: "她說先別丟。" },
  { type: "line", who: "narration", text: "那這東西，就只能在我這裡。", speed: "slow" },
  { type: "line", who: "narration", text: "我把它放回口袋最深的地方。", cg: "clear", pause: 0.6 },

  /* d5s5＝flavor 零加分（剝除舊加分）；保留「投未開封熱可可立回原位＋收好收據」的留痕互救情感拍。
     akari／male／charm：刪「我看懂了」明示宣告，把「懂」收回動作（位置一模一樣＝回信）。
     script-control：兩支差異段拉開對比——A＝替她佔位賭她拿得到／B＝乾淨退場只收回信。 */
  {
    type: "choice", id: "d5s5",
    prompt: "（換我留點什麼。）",
    options: [
      {
        label: "也替她留一塊油豆腐，賭她拿得到。",
        _dbg: "+0（留痕互救・flavor）", flavor: true,
        reaction: [
          { type: "line", who: "narration", text: "我沒有寫字，也沒有畫圖。" },
          { type: "line", who: "narration", text: "只走到販賣機前，投了一罐熱可可。", se: "give" },
          { type: "line", who: "narration", text: "咚。", speed: "instant", se: "bump", pause: 0.8 },
          { type: "line", who: "narration", text: "沒有開。", speed: "instant" },
          { type: "line", who: "narration", text: "我把它立在她剛才放罐子的那個位置。", depth: "near" },
          { type: "line", who: "narration", text: "未開封的，不會涼得太快，也不會弄髒地方。" },
          { type: "line", who: "narration", text: "位置跟她放的，一模一樣。", speed: "slow", pause: 0.8 },
          { type: "line", who: "narration", text: "我來過。", speed: "slow", pause: 1.0 },
          { type: "line", who: "narration", text: "那塊手自己多夾的油豆腐，連盒蓋好，立在熱可可旁邊乾淨的地方。" },
          { type: "line", who: "narration", text: "她要是繞回來，拿得到。" },
          { type: "line", who: "narration", text: "繞不回來，就當我替她坐了一會。", speed: "slow", pause: 0.8 },
          { type: "line", who: "narration", text: "那張焦糖布丁的收據，我重新折好，收進口袋最裡面。", se: "give" },
          { type: "line", who: "narration", text: "別的可以不留。" },
          { type: "line", who: "narration", text: "這張，我不能弄丟。", speed: "slow", pause: 0.8 },
        ],
      },
      {
        label: "什麼都不多留，乾淨地走。",
        _dbg: "+0（留痕互救・flavor）", flavor: true,
        reaction: [
          { type: "line", who: "narration", text: "我沒有寫字，也沒有畫圖。" },
          { type: "line", who: "narration", text: "只走到販賣機前，投了一罐熱可可。", se: "give" },
          { type: "line", who: "narration", text: "咚。", speed: "instant", se: "bump", pause: 0.8 },
          { type: "line", who: "narration", text: "沒有開。", speed: "instant" },
          { type: "line", who: "narration", text: "我把它立在她剛才放罐子的那個位置。", depth: "near" },
          { type: "line", who: "narration", text: "位置跟她放的，一模一樣。", speed: "slow", pause: 0.8 },
          { type: "line", who: "narration", text: "我來過。", speed: "slow", pause: 1.0 },
          { type: "line", who: "narration", text: "別的什麼都沒留。" },
          { type: "line", who: "narration", text: "地上乾乾淨淨，像沒人來過。" },
          { type: "line", who: "narration", text: "只有那罐可可，立得跟她放的一樣。", speed: "slow", pause: 0.8 },
          { type: "line", who: "narration", text: "那張焦糖布丁的收據，我重新折好，收進口袋最裡面。", se: "give" },
          { type: "line", who: "narration", text: "別的可以不留。" },
          { type: "line", who: "narration", text: "這張，我不能弄丟。", speed: "slow", pause: 0.8 },
        ],
      },
    ],
  },

  { type: "line", who: "narration", text: "像在替自己確認一件事：" },
  { type: "line", who: "narration", text: "沒丟。", speed: "slow", pause: 0.6 },
  { type: "line", who: "narration", text: "也沒走。", speed: "slow", pause: 1.0 },

  /* ===== D5-S6：店前・地點開始暴露（結尾 Hook，接 D6 雨棚） ===== */
  { type: "scene", place: "深夜・便利商店 前", time: "凌晨一點半", mood: "store", bg: "bg_conv_front_night" },

  { type: "line", who: "narration", text: "繞回店門口的時候，手機震了一下。", bgm: "rain", se: "buzz" },
  { type: "line", who: "narration", text: "推薦欄，新的貼文。" },
  {
    type: "line", who: "narration", text: "", ui: "sns",
    sns: {
      title: "推薦欄",
      posts: [
        { text: "拍到了！便利商店後方那排販賣機。" },
        { text: "畫質好差……不過長椅角落那個，是不是有東西？", acct: true },
        { text: "放大看看，好像真的有人放了什麼。", reply: true },
        { text: "所以這間店到底在哪？" },
      ],
    },
  },
  { type: "line", who: "narration", text: "照片裡沒有人。", speed: "instant" },
  { type: "line", who: "narration", text: "拍的是便利商店後方，那一排自動販賣機。" },
  { type: "line", who: "narration", text: "畫質很差。" },
  { type: "line", who: "narration", text: "但長椅的角落，拍到了一點，不該被拍到的東西。", speed: "slow", pause: 0.8, camera: { op: "push", amount: "medium", duration: 700 } },

  { type: "line", who: "narration", text: "我站在原地。", speed: "instant", pause: 1.5 },
  { type: "line", who: "narration", text: "回頭，看向停車場的方向。" },
  { type: "line", who: "narration", text: "販賣機的燈還亮著。" },
  { type: "line", who: "narration", text: "我剛剛留下的東西，還在那裡。", speed: "slow", pause: 1.0 },

  { type: "line", who: "narration", text: "今天這個角落，她已經沒辦法再用了。", speed: "slow", pause: 0.8 },
  { type: "line", who: "narration", text: "鏡頭一寸一寸往這裡爬。" },
  { type: "line", who: "narration", text: "她能站的地方，又少了一塊。", speed: "slow", pause: 1.0 },

  { type: "line", who: "narration", text: "她拿得到嗎？" },
  { type: "line", who: "narration", text: "還是會先被別人拿走？", speed: "slow", pause: 0.8 },
  { type: "line", who: "narration", text: "還有——", speed: "instant", pause: 0.6 },
  { type: "line", who: "narration", text: "明天，連這裡，還能來嗎？", speed: "slow", pause: 1.2, camera: { op: "reset", duration: 400 }, screen: "black" },
];
