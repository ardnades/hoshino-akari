/* chapters.js —— 每日「極短引子(intro)」與「極短收束(outro)」
   章節標題/副標的單一真實來源是 meta.js 的 meta.days[d].title / .subtitle，本檔不再放標題。
   intro 在「Day 標題卡」之後、當日第一幕之前播；outro 在當日最後一幕之後、「Day End 轉場」之前播。
   只強化章節節奏，不改原劇情。intro/outro 皆為 node 陣列（通常 1 句 narration）。 */
window.HOSHINO.chapters = {
  1: {
    intro: [{ type: "line", who: "narration", text: "加班後的便利店，本來只是普通的一晚。", speed: "slow", pause: 0.4 }],
    outro: [{ type: "line", who: "narration", text: "那天晚上，我手裡多了一支，本來不該屬於我的護唇膏。", speed: "slow", pause: 0.6 }],
  },
  2: {
    intro: [{ type: "line", who: "narration", text: "第二天。我說只是來還護唇膏——騙誰呢。", speed: "slow", pause: 0.4 }],
    outro: [{ type: "line", who: "narration", text: "我又一次，沒能把護唇膏還出去。她也沒有，真的想拿回去。", speed: "slow", pause: 0.6 }],
  },
  3: {
    intro: [{ type: "line", who: "narration", text: "第三天。她說，想自己走進便利店一次。像普通人那樣。", speed: "slow", pause: 0.4 }],
    outro: [{ type: "line", who: "narration", text: "窗外開始下雨。手機裡，有人在找她。", speed: "slow", pause: 0.6 }],
  },
  4: {
    intro: [{ type: "line", who: "narration", text: "第四天。路上的眼睛變多了。她來得，比哪一天都晚。", speed: "slow", pause: 0.4 }],
    outro: [{ type: "line", who: "narration", text: "還剩三天。我第一次發現，自己在數日子。", speed: "slow", pause: 0.6 }],
  },
  5: {
    intro: [{ type: "line", who: "narration", text: "第五天。她沒有出現。只在牆角，留下一張奇怪的收據。", speed: "slow", pause: 0.4 }],
    outro: [{ type: "line", who: "narration", text: "我留下的東西，還在販賣機旁。但今晚，連那裡也快不能去了。", speed: "slow", pause: 0.6 }],
  },
  6: {
    intro: [{ type: "line", who: "narration", text: "第六天。便利店、販賣機，都不能再去了。", speed: "slow", pause: 0.4 }],
    outro: [{ type: "line", who: "narration", text: "最後一天就在明天。而我，連好好看她一眼，都沒能做到。", speed: "slow", pause: 0.6 }],
  },
  7: {
    intro: [{ type: "line", who: "narration", text: "第七天。我已經知道，今天之後，一切都會回到原本的位置。", speed: "slow", pause: 0.4 }],
    outro: [{ type: "line", who: "narration", text: "凌晨一點的那個小世界，到這裡，結束了。", speed: "slow", pause: 0.6 }],
  },
};
