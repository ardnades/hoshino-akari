# QA 測試報告 — 雨夜偵探社：第七封情書（MVP）

- 測試日期：2026-06-11（JST）
- 測試對象：`M:\ai-games\ai-interactive-story-factory`（content/ 四份 JSON ＋ public/ 全部頁面與 app.js）
- 測試方法：
  - JSON 以 PowerShell `Get-Content -Raw -Encoding UTF8 | ConvertFrom-Json` 實際解析
  - `app.js` 以 `node --check` 驗證語法（node v24.14.1）
  - 結構檢查以 Node 腳本逐 scene／choice／clue 交叉比對
  - 結局判定以 Node 腳本 **直接載入 app.js 的 `applyStatDelta` / `determineEnding` 真實邏輯** 跑五條完整路徑模擬
  - 以 `python -m http.server`（專案根目錄）煙霧測試全部頁面與資料 URL（皆 200）

---

## 一、測試項目表（20 項）

| # | 測試項目 | 結果 | 備註 |
|---|---------|------|------|
| 1 | story/clues/characters/endings.json 可解析 | ✅ PASS | 四檔 ConvertFrom-Json 全數通過；修錯字後重新驗證仍合法 |
| 2 | 每天至少 3 個 scenes | ✅ PASS | Day1–7 每天恰好 3 scenes |
| 3 | 每 scene 有 2–3 個 choices | ✅ PASS | d1s1 為 2（搭檔選擇），其餘全部 3 |
| 4 | 每 choice 有 stat_delta 與 next_scene | ✅ PASS | 21 個 scene、62 個 choice 全數齊備；next_scene 引用全部有效 |
| 5 | 每天有 clue_updates | ⚠️ PASS（附註） | 欄位 7 天皆存在；Day7 為空陣列 `[]`，與 clues.json 一致（無線索 appears_day=7），屬刻意設計，非缺漏 |
| 6 | 每天有 romance_moment | ✅ PASS | 7/7 |
| 7 | 每天有 cliffhanger | ✅ PASS | 7/7 |
| 8 | 每天有 sns_share_line | ✅ PASS | 7/7 |
| 9 | Day7 能進結局 | ✅ PASS | d7s3 三選項皆 `end_of_day`；`endOfDay()` 中 `finishedDay >= totalDays` → 顯示「前往最終結局判定」→ ending.html |
| 10 | Normal End 免費完整 | ✅ PASS | `free_or_paid: "free"`、fallback 保底、12 則完整 final_chat_messages，故事自洽收尾 |
| 11 | 付費結局只是補完 | ✅ PASS | 主線真相在免費內容交代：核心反轉（七封信是玩家寫的、遺忘是自選）在 **Day6 免費主線** 揭露（c07 自動取得）；normal_end 已含「千夏被捕、結衣獲救、案件偵結」；付費結局只是終章演出補完 |
| 12 | True Case End 條件可達成 | ✅ PASS | 模擬路徑 A：最終 truth 84 / trust 81 / suspicion 7，必要線索 6＋擇一全持有（見下方路徑表） |
| 13 | Romance End 條件可達成 | ✅ PASS | 模擬路徑 B：最終 affection 74 / trust 61 / truth 49，c06＋c10 持有 |
| 14 | Bad End 條件可達成 | ✅ PASS | 兩種觸發都驗證：路徑 C（suspicion 82 ≥ 70）與路徑 D（漏拿 c06，數值再高也判 bad_end）|
| 15 | Normal End 條件可達成 | ✅ PASS | 模擬路徑 E：truth 70 但 trust 54 < 60、affection 43 < 70 → 落入 fallback |
| 16 | Secret End 可用 DEMO-TRUE 解鎖 | ✅ PASS（H-1 已修正） | `tryUnlockCode` 正規化（trim＋大寫）比對 DEMO-TRUE 正確；secret_end 改為 `explicit_only: true`，新增與 true_case_end 相同門檻及 `requires_completed_ending`，不再自動覆蓋其他結局。DEMO-TRUE 解鎖後需玩家明確選擇才進入 secret_end，true_case_end / romance_end 的完整演出不受影響。詳見 H-1 修正記錄。 |
| 17 | 線索前後一致 | ✅ PASS | 14 條線索的 appears_day / how / via 與 story.json clue_updates、choices 的 clues_gained 全部交叉吻合（腳本驗證 0 錯）|
| 18 | 真犯人有動機手段機會 | ✅ PASS | 千夏：動機（弟弟白瀨遼死於同技術，c08 病歷＋Day7 自白）、手段（前診所護理師，持有檔案與七封信原稿、左手模仿筆跡 c03/c11、冒名購機 c14）、機會（圖書館員身分接觸結衣 c09、匿名引導 c13）|
| 19 | 手機版 UI 可用 | ✅ PASS | 6 個 HTML 全有 viewport meta；手機優先（max-width 520px）；按鈕全寬、padding 13px（觸控高度約 48px）；字級 0.78–1.45rem；600px media query；choice 按鈕 textContent 防 XSS |
| 20 | localStorage 保存正確 | ✅ PASS | 前綴 `rainydetective_`、try/catch＋console.warn 不 raise；每次選擇後 saveState；刷新後從 currentScene 重播該場景（auto 線索冪等，不重複）；重開只清進度、保留 18+ 確認／解鎖／結局紀錄 |

**額外檢查**
- HTML 引用路徑：6 頁互鏈（index/game/ending/unlock/privacy/terms）與 style.css、app.js 引用全部正確 ✅
- `node --check public/app.js`：語法通過 ✅
- fetch 路徑一致性：app.js 先試 `../content/`、後備 `content/`，與 deployment_guide.md 的「從專案根目錄部署」策略一致；本機 http.server 煙霧測試 8 個 URL 全 200 ✅
- 結局 5 種 ID 在 story.json 與 endings.json 完全一致 ✅（注意：story.json 內嵌 endings 區塊的 bad_end 用 `required_stats_any_of` 鍵名、endings.json 用 `required_stats.any_of`；app 只讀 endings.json，故無實際影響，僅 schema 文件不一致，見 L-4）

通過：19 項全過＋1 項附註通過（#5）；失敗：0 項硬性 FAIL。（H-1 對應的 #16 已由「附註通過，有設計瑕疵」升格為「完全通過」，瑕疵已修正。）

---

## 一之二、結局條件總表（依 endings.json 實際數值，2026-06-12 更新）

| ending_id | 免費/付費 | 觸發條件（stats + clues） | 是否需解鎖才看完整演出 | 第一次通關可進 | 二周目或明確選擇才可進 | 備註 |
|---|---|---|---|---|---|---|
| normal_end | free | fallback（其他四個條件均不符合） | 否 | 是 | 否 | 免費完整結局，priority=4 |
| bad_end | free | truth<35 OR suspicion>=70 OR 缺 c06_memory_consent（任一成立） | 否 | 是 | 否 | 錯誤推理或線索不足，priority=5 |
| true_case_end | 達成免費，完整演出付費 | truth>=70 AND trust>=60 AND suspicion<=50 + c03/c06/c07/c09/c11/c14 全持有 + c05 或 c13 擇一 | 是（unlock_required_for_full_content） | 是 | 否 | 不可被 secret_end 蓋掉，priority=2 |
| romance_end | 達成免費，完整演出付費 | affection>=70 AND trust>=55 AND truth>=40 + c06/c10 持有 | 是（unlock_required_for_full_content） | 是 | 否 | true_case_end 條件同時成立時依優先序先進 true_case，priority=3 |
| secret_end | paid + explicit_only | 同 true_case_end 全部數值/線索門檻 + 已完成 true_case_end 或 replayCount>=1 或 secretRouteRequested=true + 已解鎖 DEMO-TRUE | 是 | 否（除非 explicit 選擇） | 是（二周目 / 明確選擇） | 解鎖碼 DEMO-TRUE 代表可看演出，不代表自動觸發；explicit_only=true，priority=2 |

---

## 二、發現問題清單

### H-1（嚴重度：中高）~~DEMO-TRUE 解鎖後，true_case_end / romance_end 的終章永遠看不到~~

**✅ 已修正（2026-06-12）**

- **原始現象**：`tryUnlockCode` 一次把全部 5 個 pack（含 pack_secret）寫入 `unlockedPaidContent`。endings.json 的 secret_end 為 priority 1、`required_stats: {}`、`required_clues: []`（零門檻），因此只要輸入過 DEMO-TRUE，之後任何周目結局判定一律回傳 secret_end，true_case / romance 終章演出無法被觀看。
- **修法採用**：`explicit_only` 機制（建議修法第 1 項 + 設計強化）
- **修改的檔案**：`content/endings.json`、`public/app.js`、`public/ending.html`

**endings.json 修改內容（secret_end）：**

| 欄位 | 修改前 | 修改後 |
|---|---|---|
| `required_stats` | `{}` | `{ truth>=70, trust>=60, suspicion<=50 }` |
| `required_clues` | `[]` | 6 條必要線索（同 true_case_end） |
| `required_clues_any_of` | 不存在 | `[c05_clinic_keycard, c13_rainy_night_news]` |
| `priority` | `1` | `2`（與 true_case_end 並列） |
| `explicit_only` | 不存在 | `true` |
| `requires_completed_ending` | 不存在 | `"true_case_end"` |
| `requires_replay` | 不存在 | `true` |
| `requires_secret_route_flag` | 不存在 | `true` |

**endings.json 其他結局異動：**

| ending_id | 修改內容 |
|---|---|
| `true_case_end` | 新增 `unlock_required_for_full_content: true` |
| `romance_end` | 新增 `unlock_required_for_full_content: true` |
| `normal_end` | priority `5` → `4`（fallback 排在 bad_end 之前） |
| `bad_end` | priority `4` → `5`（壞結局移至最末） |

**app.js 修改內容：**

| 函數 | 行號（修改後） | 異動內容 |
|---|---|---|
| `resetProgress()` | 第 65–71 行 | 新增 `storageRemove('secretRouteRequested')`（重置時清除，保留 `replayCount`） |
| `isSecretEndUnlocked()` | 第 287–294 行 | 新增：判斷 `unlockedPaid` 含 `pack_secret` 或 `DEMO-TRUE` |
| `determineEnding()` | 第 306–359 行 | 全面改寫：五步驟優先序邏輯（secret / true_case / romance / bad / normal） |
| `incrementReplayCount()` | 第 366–369 行 | 新增：`replayCount +1` 並存回 localStorage |
| `requestSecretRoute()` | 第 375–377 行 | 新增：設 `secretRouteRequested = true` |
| 匯出物件 | 第 ~430 行 | 新增三個匯出：`isSecretEndUnlocked`、`incrementReplayCount`、`requestSecretRoute` |

**ending.html 修改內容：**

| 位置 | 異動內容 |
|---|---|
| `runJudgement()` | 記錄結局後呼叫 `RD.incrementReplayCount()`；改呼叫 `renderEndingMessages()` 決定訊息數量 |
| `renderEndingMessages()` | 新增：`unlock_required_for_full_content: true` 且未解鎖時只回傳前 3 則訊息 |
| `showAfterPanel()` | 接受第六參數 `unlockedPaid`；付費結局截斷時插入 upsell 文案；Secret End 已解鎖時插入「下一局選擇 Secret End」按鈕（呼叫 `requestSecretRoute()`） |

**驗證狀態：**
- `ConvertFrom-Json`：endings.json 解析成功，5 個結局全部讀出 ✅
- `node --check public/app.js`：exit 0，語法無誤 ✅
- `public/content/endings.json`：不存在，無需同步 ✅

### L-1（低，已修）story.json Day6 `d6s3c1` label 簡體字「拼图」→ 已改「拼圖」
### L-2（低，已修）story.json Day4 `d4s1c1` consequence_text 簡體字「流畅」→ 已改「流暢」
### L-3（低，已修）endings.json romance_end 對白「今天這一side，換我站」中英混雜 → 已改「今天這一邊，換我站」
- 以上三處修正後均重新通過 ConvertFrom-Json 驗證。

### L-4（低，不影響運行）story.json 內嵌 `endings` 區塊與 endings.json schema 鍵名不一致
- story.json 用 `required_stats_any_of` / `missing_clue_triggers`；endings.json 用 `required_stats.any_of` / `missing_clues`。app.js 只消費 endings.json，無實際 bug；建議下版統一 schema 或從 story.json 移除內嵌 endings 區塊避免雙來源漂移。

### L-5（低，邊角案例）Day3 進入 d3s1 時，c02 會自動補發給 Day2 沒拿到的玩家
- Day3 clue_updates 的 `{ "clue_id": "c02_old_photo", "how": "auto", "update": "reversed" }` 在 `grantAutoClues` 中與一般 auto 取得無差別，Day2 未看手機的玩家會在 Day3 開場「無聲」補拿 c02。敘事上其實合理（湊主動坦白照片來歷），且 c02 不在任何結局必要清單，無判定影響。可接受，列為已知行為。

---

## 三、五條完整測試路徑（逐日選擇表）

數值初始：好感 10／信任 20／真相 0／懷疑 10。每日結束另套用當日 `stat_delta`（truth：Day1 +4，Day2–7 各 +6）。下列數值為以 app.js 真實 `applyStatDelta` 模擬之每日終了值（好感/信任/真相/懷疑）。

### 路徑 A：True Case End（真相結局）
| Day | 選擇 | 日終數值 |
|-----|------|----------|
| 1 | d1s1c1（選蓮）→ d1s2c1 → d1s3c2 | 16/24/6/10 |
| 2 | d2s1c1 → d2s2c1 → d2s3c1 | 16/34/20/10 |
| 3 | d3s1c1 → d3s2c1 → d3s3c3 | 16/44/34/10 |
| 4 | d4s1c1 → d4s2c2 → d4s3c1 | 21/53/45/10 |
| 5 | d5s1c1 → d5s2c1 → d5s3c1 | 21/63/56/7 |
| 6 | d6s1c1 → d6s2c1 → d6s3c1 | 21/73/70/7 |
| 7 | d7s1c1 → d7s2c1 → d7s3c1 | **21/81/84/7** |

- 最終：truth 84 ≥ 70 ✅、trust 81 ≥ 60 ✅、suspicion 7 ≤ 50 ✅
- 線索 13/14：必要 6 條（c03/c06/c07/c09/c11/c14）✅＋擇一（c05、c13 兩條都有）✅
- 判定：未解鎖 → normal_end＋lockedBetter 提示「已達成 true_case_end」✅；解鎖 pack_true_case 後 → **true_case_end** ✅

### 路徑 B：Romance End（戀愛結局）
| Day | 選擇 | 日終數值 |
|-----|------|----------|
| 1 | d1s1c1 → d1s2c2 → d1s3c2 | 20/21/4/10 |
| 2 | d2s1c2 → d2s2c2 → d2s3c2 | 32/26/10/10 |
| 3 | d3s1c2 → d3s2c2 → d3s3c3 | 41/33/18/10 |
| 4 | d4s1c2 → d4s2c2 → d4s3c1 | 50/40/26/10 |
| 5 | d5s1c1 → d5s2c1 → d5s3c1 | 50/50/37/7 |
| 6 | d6s1c2 → d6s2c2 → d6s3c2 | 62/55/43/7 |
| 7 | d7s1c2 → d7s2c2 → d7s3c2 | **74/61/49/7** |

- 最終：affection 74 ≥ 70 ✅、trust 61 ≥ 55 ✅、truth 49 ≥ 40 ✅；c06 ✅、c10（Day6 自動）✅
- 未滿足 true_case（缺 c09），優先序正確落 romance_end ✅（未解鎖時 normal_end＋lockedBetter=romance_end）

### 路徑 C：Bad End（懷疑路線）
| Day | 選擇 | 日終數值 |
|-----|------|----------|
| 1 | d1s1c1 → d1s2c3 → d1s3c3 | 10/20/4/17 |
| 2 | d2s1c3 → d2s2c3 → d2s3c3 | 10/20/6/26 |
| 3 | d3s1c3 → d3s2c3 → d3s3c1 | 10/20/11/36 |
| 4 | d4s1c3 → d4s2c3 → d4s3c3 | 8/20/16/48 |
| 5 | d5s1c2 → d5s2c2 → d5s3c3 | 8/18/25/59 |
| 6 | d6s1c3 → d6s2c3 → d6s3c3 | 5/18/30/71 |
| 7 | d7s1c3 → d7s2c3 → d7s3c3 | **3/16/36/82** |

- suspicion 82 ≥ 70 → **bad_end** ✅（any_of 條件之懷疑分支驗證通過）

### 路徑 D：Bad End（漏拿 c06 關鍵線索）
| Day | 選擇 | 日終數值 |
|-----|------|----------|
| 1–4 | 同路徑 A（Day3 末改 d3s3c2、Day4 中改 d4s2c1） | Day4 末 19/49/46/12 |
| 5 | d5s1c1 → **d5s2c3（拒看檔案櫃，不取 c06）** → d5s3c1 | 20/56/51/9 |
| 6 | d6s1c1 → d6s2c1 → d6s3c1 | 20/66/65/9 |
| 7 | d7s1c1 → d7s2c1 → d7s3c1 | **20/74/79/9** |

- 數值極佳（truth 79／trust 74）但缺 c06 → **bad_end** ✅（missing_clues 分支驗證通過，與 clues.json「未持有 c06 一律 bad_end」設計吻合）

### 路徑 E：Normal End（fallback）
| Day | 選擇 | 日終數值 |
|-----|------|----------|
| 1 | d1s1c1 → d1s2c2 → d1s3c1 | 16/20/6/12 |
| 2 | d2s1c1 → d2s2c2 → d2s3c1 | 21/29/17/12 |
| 3 | d3s1c2 → d3s2c1 → d3s3c2 | 28/35/26/12 |
| 4 | d4s1c1 → d4s2c1 → d4s3c2 | 31/38/38/11 |
| 5 | d5s1c3 → d5s2c1 → d5s3c2 | 35/42/50/13 |
| 6 | d6s1c1 → d6s2c3 → d6s3c2 | 38/47/59/17 |
| 7 | d7s1c1 → d7s2c2 → d7s3c1 | **43/54/70/17** |

- trust 54 < 60（差 true_case 一步）、affection 43 < 70、未觸 bad 條件（有 c06、susp 17、truth 70）→ **normal_end** ✅，且無 lockedBetter 誤報 ✅

---

## 四、結論：是否可公開 MVP 測試

**可以公開。**

- 免費主線（Day1–7、normal_end / bad_end、每日解鎖、進度保存、分享文案、18+ 閘門、手機 UI）全部驗證通過，0 個阻斷性 bug。
- 中高嚴重度問題 H-1（DEMO-TRUE 一碼解全部＋secret_end 零門檻最高優先）**已於 2026-06-12 修正**：採用 `explicit_only` 機制搭配門檻補齊，付費的 true_case / romance 終章演出不再被 secret_end 蓋掉。endings.json ConvertFrom-Json PASS、node --check app.js PASS。
- 低嚴重度錯字 3 處（L-1～L-3）已於初版 QA 直接修正並重新驗證 JSON 合法。
- 剩餘低嚴重度問題（L-4 schema 鍵名不一致、L-5 c02 冷補發行為）不阻斷上線，建議 v2 統一處理。
