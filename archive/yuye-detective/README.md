# AI 互動故事工廠 — Season 1《雨夜偵探社：第七封情書》

> 一個可重複生產「7 天 SNS 互動故事」的內容工廠。第一季：偵探 × 懸疑 × 戀愛。
> 虛構互動故事 — 不是真人聊天、不是心理治療、不是成人陪聊。所有角色均為 18 歲以上。
> 基準日期：2026-06-11（JST）。面向台灣、日本、香港與華語圈玩家，玩家面向內容為繁體中文。

---

## 一句話賣點

**「收到情書的第一個晚上，我家門口站了一個偵探。」** — 每天 3–5 分鐘，七個雨夜，查一樁失蹤案，順便查清楚你為什麼會喜歡上一個滿口謊言的偵探。

## 目標玩家

- 18 歲以上、會被 X／IG／Threads 上「對話截圖＋一行懸念」停住手指的乙女／懸疑文字遊戲玩家
- 通勤與睡前碎片時間玩家：每天一更、3–5 分鐘讀完、不用下載 App
- 喜歡《週刊連載式》追更體驗、會在留言區吵「他到底是不是犯人」的社群型玩家

## 核心玩法

- **聊天式互動故事**：主舞台是你與偵探搭檔（蓮／澪，Day1 自選性別）的對話視窗
- **四數值**：affection 好感／trust 信任／truth 真相／suspicion 懷疑 — 每天 2–3 個選擇推動數值
- **線索帳本**：14 條線索、含 3 條公平假線索（每條假線索都有免費路線可發現的澄清證據）
- **五結局**：依 Day7 的數值與持有線索判定（normal / bad / true_case / romance / secret）

## 遊玩流程

1. Day1（06-11）收到匿名情書，深夜偵探敲門 — 情書末尾預告「明天，葉山結衣會消失」
2. Day2–Day6 每天一個劇情日：查案、選擇、收線索，每天結尾一個 cliffhanger
3. Day7（06-17）診所舊址對峙，做出終極選擇：**指認真相／保護對方／離開**
4. 結局頁產生分享圖；可重玩走其他路線；解鎖碼可開啟隱藏終章

## 收費邏輯

| 內容 | 定位 | 價格 |
|---|---|---|
| Day1–7 主線＋Normal End＋Bad End＋重玩＋分享圖 | **永久免費、完整自洽** | 免費 |
| True Case File（完整證據鏈＋真相檔案，含 True Case End） | 付費主力 | NT$120 / ¥500 |
| All Endings Pack（全結局＋提示） | 整包 | NT$250 / ¥980 |
| Secret Diary（角色日記） | 情感補完 | NT$60 / ¥300 |

原則：**付費只是補完，不把主線真相鎖在付費牆後**；免費玩家在 normal_end 路線上也能排除所有錯誤嫌疑人，只是拼不出完整動機。禁止任何情緒勒索式話術。

## 為什麼適合 SNS 傳播

- 每天內建一句「SNS 截圖台詞」（如 Day3「他說，他不是第一次失去我。可是我，明明是第一次遇見他。」）— 對話截圖即素材
- 每日 cliffhanger ＝ 天然的「明天見」連載鉤子；故事日期與現實日期同步（Day1 就是今天），追更有實況感
- 結局分享圖＋「你走到了哪個結局？」是現成的 UGC 活動
- 「相信／懷疑偵探」是可投票、可吵架的二元話題（Day5 核心抉擇日）

## 專案結構

```
ai-interactive-story-factory/
├── README.md                  ← 本檔
├── brief/
│   └── season1.md             ← Story Bible（唯一真相來源：ID、數值閾值、時間線）
├── content/                   ← 劇情資料與營運文件（由對應 prompt 產出）
│   ├── story.json             ← 7 天劇本＋選項＋stat_delta（前端唯一資料來源）
│   ├── clues.json / characters.json / endings.json
│   ├── social_calendar.csv    ← SNS 排程（全部 draft）
│   └── monetization.md / safety_report.md / qa_report.md
├── public/                    ← 玩家端靜態站（零後端、零 API key）
│   ├── index.html / game.html / ending.html / unlock.html
│   ├── privacy.html / terms.html
│   ├── style.css / app.js     ← app.js fetch('../content/story.json')，後備 'content/story.json'
│   └── assets/
├── prompts/                   ← 內容工廠的 20 個代理 prompt（00_master ～ 19_final_review）
└── docs/
    ├── deployment_guide.md    ← GitHub Pages / Cloudflare Pages / 本地測試 / Stripe / SNS 排程 / 防外洩
    ├── operation_guide.md     ← 上線前～Day10 復盤的 checklist 營運手冊
    └── content_pipeline.md    ← Genre Pack 系統：用同一引擎產五種類型的下一季
```

## 快速開始（本地測試 3 步驟）

```bash
# 1. 進入專案根目錄（務必是根目錄，不是 public/）
cd ai-interactive-story-factory

# 2. 啟動本地靜態伺服器（二擇一）
python -m http.server 8000        # 或：npx serve .

# 3. 瀏覽器開啟
#    http://localhost:8000/public/index.html
```

測試付費結局：到 `unlock.html` 輸入解鎖測試碼 **`DEMO-TRUE`** → 解鎖 secret_end（需先完成 true_case_end 或二周目，並在結局後面板點選「下一局選擇 Secret End」才可進入）。部署上線見 `docs/deployment_guide.md`。

## v1 結局判定來源

| 角色 | 說明 |
|---|---|
| `endings.json`（runtime source of truth） | 前端判定結局的唯一依據，app.js 在 `determineEnding()` 中讀取此檔 |
| `story.json` 頂層 `endings` 區塊 | ending_id 參照清單，非 runtime 判定用，僅供劇本參考 |
| 未來 v2 schema 統一建議 | 移除 story.json 頂層 endings 的 condition 欄位，僅保留 ending_id 參照；所有條件集中在 endings.json |

### 結局條件總表（依 endings.json 實際數值）

| ending_id | 免費/付費 | 觸發條件（stats + clues） | 是否需解鎖才看完整演出 | 第一次通關可進 | 二周目或明確選擇才可進 | 備註 |
|---|---|---|---|---|---|---|
| normal_end | free | fallback（其他四個條件均不符時） | 否 | 是 | 否 | 免費完整結局，12 則 final_chat_messages |
| bad_end | free | truth<35 OR suspicion>=70 OR 缺 c06_memory_consent | 否 | 是 | 否 | 任一成立即觸發，無論其他數值 |
| true_case_end | 達成免費，完整演出付費 | truth>=70 AND trust>=60 AND suspicion<=50 + c03/c06/c07/c09/c11/c14 全持有 + c05 或 c13 擇一 | 是（full content） | 是 | 否 | 不可被 secret_end 蓋掉；`unlock_required_for_full_content: true` |
| romance_end | 達成免費，完整演出付費 | affection>=70 AND trust>=55 AND truth>=40 + c06/c10 持有 | 是（full content） | 是 | 否 | true_case_end 條件同時成立時依優先序先進 true_case；`unlock_required_for_full_content: true` |
| secret_end | paid + explicit_only | 同 true_case_end 數值/線索門檻 + 已完成 true_case_end 或 replayCount>=1 或 secretRouteRequested=true + 已解鎖（DEMO-TRUE） | 是 | 否（除非 explicit 選擇） | 是（二周目 / 明確選擇） | DEMO-TRUE 代表可看演出，不代表自動觸發；`explicit_only: true`，須玩家主動選擇 |

## Assumptions（合理假設清單）

以下為 MVP 階段的明確假設與取捨，未經驗證或待人工確認：

1. **價格未經市場驗證**：NT$120/¥500 等定價為建議值，待 Day8 後實際轉換數據校準；Stripe 目前僅 Test mode，未建立真實商品。
2. **解鎖碼機制可被分享**：零後端下解鎖碼為前端比對，可被轉傳 — 屬 MVP 取捨；量大時換碼或升級 optional 後端（Cloudflare Worker + KV），第一版不做。
3. **SNS 日曆全部為 draft、未發佈**：`social_calendar.csv` 內所有貼文未經明確批准前不正式發出。
4. **零後端 ⇒ 數據能力有限**：留存與結局分佈以 SNS 互動、平台流量面板與分享圖比例粗估，無玩家級追蹤（也因此不收集任何個資，僅用 localStorage 存本機進度）。
5. **每日更新採「日期對齊」設計**：故事 Day1–7 對應 2026-06-11～06-17（JST）；錯過上線窗的玩家仍可從 Day1 連續補玩（不做硬性斷頭）。
6. **角色年齡可驗證性**：所有角色年齡均在劇本文本內明寫（player 25／偵探 26／結衣 24／湊 27／真壁 45／千夏 29／遼 歿年 26），下游劇本不得刪除這些明寫處。
7. **`content/` 與 `public/` 同站部署**：app.js 的 `../content/story.json` 依賴整個專案根目錄作為靜態站部署；若平台僅服務 `public/`，採後備路徑＋複製 `content/` 進 `public/` 的備援（見部署指南 §2.4）。
8. **瀏覽器支援假設**：現代行動瀏覽器（近兩年的 Safari/Chrome）；不支援關閉 JavaScript 或無痕模式下的進度保存。
9. **第二季是否製作未定**：依 `docs/operation_guide.md` §12 的 Day10 復盤決策標準判斷。

## 完成清單（最終審稿 Prompt 19 — 2026-06-11 更新）

### 已完成（最終審核通過）

| 項目 | 狀態 |
|---|---|
| brief/season1.md（Story Bible） | ✅ 完成 |
| prompts/00–19 | ✅ 完成 |
| content/story.json（7 天 × 3 scenes、每日 cliffhanger＋sns_share_line、age/fictional notice） | ✅ 完成（QA 20 項通過） |
| content/clues.json / characters.json / endings.json | ✅ 完成（14 線索交叉一致；五結局路徑經 app.js 真實邏輯驗算可達成） |
| content/social_calendar.csv（58 則，全部 status=draft） | ✅ 完成（safety 第 10 項替換文案已套用：虛構標注、移除蠟燭符號） |
| content/sns_extras.md / monetization.md | ✅ 完成 |
| content/safety_report.md（10 項：0 fail；3 warn 之替換文案已全數套用） | ✅ 完成 |
| content/qa_report.md（20 項：0 硬性 FAIL；L-1～L-3 已修） | ✅ 完成 |
| public/ 網站 MVP（6 頁＋style.css＋app.js；18+ 閘門、虛構聲明、零外部 API、零 api key） | ✅ 完成 |
| docs/deployment_guide.md / operation_guide.md / content_pipeline.md | ✅ 完成 |
| 最終審稿修正：story.json 與 index.html 的 age_notice 增列創傷主題提示；endings.json bad_end upsell 改「免費重玩優先」 | ✅ 已套用 |

### 已知問題（不阻斷免費 MVP，導入金流前必修）

| 項目 | 說明 |
|---|---|
| QA H-1：DEMO-TRUE 一碼解全部＋secret_end 零門檻最高優先 | ✅ **已修正（2026-06-12）**。修法：secret_end 改為 `explicit_only: true`，並新增與 true_case_end 相同的數值/線索門檻、`requires_completed_ending: "true_case_end"`、`requires_replay: true`、`requires_secret_route_flag: true`。DEMO-TRUE 保留為解鎖碼，但不再自動覆蓋其他結局——必須先完成 true_case_end 或二周目，並由玩家明確選擇才可進入。app.js 新增 `isSecretEndUnlocked()`、`incrementReplayCount()`、`requestSecretRoute()` 三個函數；ending.html 新增 upsell 截斷與「下一局選擇 Secret End」按鈕。驗證：endings.json ConvertFrom-Json PASS、node --check app.js PASS。 |

### 需人工確認（上線前）

| 項目 | 狀態 |
|---|---|
| 最終定價批准（NT$120/¥500 等為建議值，未經市場驗證） | ⬜ 需人工批准 |
| Stripe 帳號開通＋建立正式 Payment Links（目前 unlock.html 為「即將開放」佔位、無真實金流） | ⬜ 需人工操作 |
| 網域購買與部署（GitHub Pages / Cloudflare Pages，見 deployment_guide.md） | ⬜ 需人工操作 |
| SNS 帳號建立（X/Threads、IG、TikTok、小紅書、LINE OA）＋角色帳號【虛構角色】標注 | ⬜ 需人工操作 |
| social_calendar.csv 逐則人工批准後才可發佈（目前全 draft） | ⬜ 需人工批准 |
| AI 圖像/影片素材生成（visual_prompt / video_script 僅為提示詞，public/assets/ 目前為空） | ⬜ 需人工產出 |
