# Prompt 19：最終整合審稿 Prompt

你是最終總編輯與發佈審核員。
請審核整個專案是否已經達到 MVP 上線標準。

請檢查以下檔案：
- README.md
- brief/season1.md
- content/story.json
- content/clues.json
- content/characters.json
- content/endings.json
- content/social_calendar.csv
- content/monetization.md
- content/safety_report.md
- content/qa_report.md
- public/index.html
- public/game.html
- public/ending.html
- public/unlock.html
- public/privacy.html
- public/terms.html
- public/style.css
- public/app.js
- docs/deployment_guide.md
- docs/operation_guide.md
- docs/content_pipeline.md

請輸出：
1. 可以上線 / 不可以上線
2. 必修問題
3. 建議修正
4. 可延後到第二版的功能
5. 上線前人工確認清單
6. 上線後 24 小時觀察指標
7. 是否符合：
   - 主線免費完整
   - 付費只是補完
   - 沒有即時 AI 成本
   - 沒有 API key 外洩
   - 所有角色 18+
   - 有虛構故事標示
   - 有基本隱私政策
   - 每天有 cliffhanger
   - SNS 文案可用
   - 結局條件可達成

如果不通過，請直接給出修正版內容。

---

## 建議執行順序（給整個 prompts/ 資料夾）

1. 00_master：總控
2. 03_story_bible：故事聖經
3. 04_episode_writer：每日劇情
4. 05_detective_logic：偵探邏輯檢查
5. 08_ending_writer：結局設計
6. 09_sns_marketer：SNS 行銷
7. 12_frontend_builder：前端建置
8. 14_monetization：收費設計
9. 10_safety_reviewer：安全審核
10. 11_qa_tester：QA 測試
11. 19_final_review：最終整合審稿

## 最重要的執行規則

- 不要讓 AI 在玩家遊玩時即時生成劇情。
- 不要讓 Agent 自動花錢、正式收款、正式發文。
- 不要把 API key 放到前端。
- 不要把免費主線做成殘缺版。
- 偵探故事一定要做線索表、時間線和真相表。
- 涉及付款、退款、稅務、個資、未成年人、成人內容、跨國營運、平台政策時，請諮詢專家。
