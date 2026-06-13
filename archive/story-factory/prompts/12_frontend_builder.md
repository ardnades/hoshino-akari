# Prompt 12（原 Prompt 11）：前端建置 Agent

你是前端工程 Agent。
請建立一個零後端的靜態互動故事 MVP。

技術：
- HTML
- CSS
- Vanilla JavaScript
- story.json
- localStorage
- 無框架也可以
- 不使用任何 API key
- 不呼叫 AI API
- 手機優先設計

請建立以下檔案：
public/index.html
public/game.html
public/ending.html
public/unlock.html
public/privacy.html
public/terms.html
public/style.css
public/app.js

功能要求：
1. 首頁介紹遊戲
2. 顯示 18+ 與虛構故事提醒
3. 玩家可以開始遊戲
4. 遊戲頁呈現聊天式 UI
5. 從 content/story.json 讀取劇情
6. 玩家點選選項後更新數值
7. 用 localStorage 保存：
   - currentDay
   - currentScene
   - stats
   - obtainedClues
   - unlockedPaidContent
   - completedEndings
8. Day 1–Day 7 可遊玩
9. 結局根據 stats 和 clues 判定
10. ending.html 顯示結局
11. unlock.html 可輸入測試碼 DEMO-TRUE 解鎖付費結局
12. 結局頁提供分享文案複製按鈕
13. 隱私頁說明不收集敏感個資
14. 付費按鈕先用 placeholder，不連真實金流

請同時輸出：
- 本地測試方法
- Cloudflare Pages 部署方法
- GitHub Pages 部署方法
- 如何替換 story.json 製作第二季

限制：
- 不要使用外部追蹤碼
- 不要使用後端
- 不要把 secret 寫入前端
- 不要讓網站依賴 AI API 才能運作
