# 部署指南（deployment_guide.md）

> 適用專案：《雨夜偵探社：第七封情書》Season 1 MVP
> 架構前提：**玩家端零後端** — 純靜態 HTML/CSS/JS + `content/story.json` + localStorage。
> 頁面位於 `/public/`，`public/app.js` 以 `fetch('../content/story.json')` 讀取劇情，並有 `'content/story.json'` 後備路徑。
> 所有時間以 JST 為準。撰寫日：2026-06-11（JST）。

---

## 0. 部署前提與路徑說明（必讀）

整個 **專案根目錄** 會被當成靜態站部署（不是只部署 `public/`），原因：

- `app.js` 用相對路徑 `../content/story.json` 讀劇情。玩家網址是 `.../public/game.html`，瀏覽器會解析成 `.../content/story.json`，所以 `content/` 必須和 `public/` 一起被部署在同一層。
- 若某些託管環境把 `public/` 設成站台根目錄（rewrite 後 `../content/` 取不到），`app.js` 內建後備路徑 `'content/story.json'`：此時請把 `content/` 整個資料夾複製一份進 `public/content/`（見 2.4 的 Cloudflare 備援做法）。

玩家入口固定為：`<部署網址>/public/index.html`。

部署前 30 秒自查：

- [ ] `public/index.html`、`game.html`、`ending.html`、`unlock.html`、`privacy.html`、`terms.html`、`style.css`、`app.js` 都存在
- [ ] `content/story.json` 存在且為合法 JSON（`python -m json.tool content/story.json` 不報錯）
- [ ] 全專案搜尋不到任何 API key / token（見第 6 節）
- [ ] 解鎖測試碼 `DEMO-TRUE` 可在 `unlock.html` 正常觸發 secret_end（本機先驗）

---

## 1. 本地測試（部署前必做）

**務必從「專案根目錄」啟動伺服器**，不是從 `public/` 內啟動，否則 `../content/story.json` 會 404。

### 方法 A：Python（零安裝）

```bash
cd ai-interactive-story-factory
python -m http.server 8000
```

開啟 `http://localhost:8000/public/index.html`。

### 方法 B：Node（npx serve）

```bash
cd ai-interactive-story-factory
npx serve .
```

開啟 `http://localhost:3000/public/index.html`（埠號以 serve 輸出為準）。

### 本地測試 checklist

- [ ] `index.html` 載入無 console 錯誤，story.json fetch 成功（DevTools Network 看到 200）
- [ ] Day1 性別選擇（蓮／澪）後顯示名正確
- [ ] 玩一輪「全選中間選項」→ 進 normal_end
- [ ] 玩一輪「迴避調查」→ 進 bad_end
- [ ] `unlock.html` 輸入 `DEMO-TRUE` → secret_end 解鎖
- [ ] 關閉分頁重開 → localStorage 進度保留
- [ ] DevTools Network 全程 **只有靜態檔案請求**，沒有任何外部 API 呼叫
- [ ] 手機寬度（375px）下 UI 不破版

> 注意：直接雙擊開啟 `index.html`（`file://` 協定）時 `fetch` 會被瀏覽器擋下，**一定要用本地伺服器**。

---

## 2. 部署方式

### 2.1 GitHub Pages（建議的免費首選）

1. 建立 GitHub repo（例如 `rainy-night-detective`），把整個專案根目錄推上去：

   ```bash
   cd ai-interactive-story-factory
   git init
   git add .
   git commit -m "Season 1 MVP"
   git remote add origin https://github.com/<帳號>/rainy-night-detective.git
   git push -u origin main
   ```

2. Repo → Settings → Pages → Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾選 **/(root)**（重要：選 root，不要選 /docs）。
3. 等 1–3 分鐘，站台網址為：

   ```
   https://<帳號>.github.io/rainy-night-detective/
   ```

4. **玩家入口網址**（給 SNS 用的連結）：

   ```
   https://<帳號>.github.io/rainy-night-detective/public/index.html
   ```

5. 建議在 repo 根目錄放一個極簡 `index.html` 做轉址，讓短網址也能進遊戲：

   ```html
   <meta http-equiv="refresh" content="0; url=public/index.html">
   ```

GitHub Pages 注意事項：

- [ ] repo 必須是 public（免費版 Pages 限制）；因此**更不能有任何 secret**（見第 6 節）
- [ ] 每次 `git push` 後 Pages 自動重建，劇情熱修只要改檔→push（生效約 1–3 分鐘，玩家需重新整理）
- [ ] `story.json` 更新後，若玩家瀏覽器快取舊檔，可在 `app.js` 的 fetch URL 加版本參數：`story.json?v=20260611`

### 2.2 Cloudflare Pages（備援或主力皆可，全球 CDN 較快）

1. 登入 Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git（或直接 Direct Upload 拖整個專案資料夾）。
2. 設定：
   - Production branch：`main`
   - Build command：**留空**（純靜態，無建置）
   - Build output directory：`/`（專案根目錄）
3. 部署完成後網址為 `https://<專案名>.pages.dev/public/index.html`。

### 2.3 自訂網域（可選）

- GitHub Pages：Settings → Pages → Custom domain，DNS 加 CNAME 指向 `<帳號>.github.io`。
- Cloudflare Pages：Pages 專案 → Custom domains，網域在 Cloudflare 上可一鍵綁定，自動 HTTPS。

### 2.4 「content/ 讀不到」的備援做法

若部署平台只服務 `public/`（`../content/` 變成站外、404）：

```bash
# 把劇情資料複製進 public/，讓後備路徑 'content/story.json' 生效
cp -r content public/content
```

之後每次更新 `content/story.json` 記得同步複製一次（可寫進部署腳本）。

---

## 3. 第二季：如何替換 story.json

系統設計上，**換一季 = 換一份 story.json（＋對應的 clues/characters/endings json）**，前端不動。

1. 用 `prompts/15_season2_generator.md` ＋ `docs/content_pipeline.md` 的 Genre Pack 產出新一季內容，輸出成相同 schema 的 `story.json`。
2. 上線方式二選一：
   - **覆蓋制**（同網址續營）：備份 `content/story.json` → `content/archive/story_s1.json`，新檔覆蓋上去，push。
   - **並行制**（推薦）：放 `content/story_s2.json`，`app.js` 依網址參數載入：

     ```js
     const season = new URLSearchParams(location.search).get('season') || 's1';
     const STORY_PATHS = [`../content/story_${season}.json`, `content/story_${season}.json`];
     ```

     第二季入口網址即 `.../public/index.html?season=s2`，第一季永久可玩（玩家拉新最強的就是免費舊季）。
3. 換季 checklist：
   - [ ] 新 json 通過 `python -m json.tool` 驗證
   - [ ] 結局 ID／數值閾值跑過 QA 五路徑（參照 `content/qa_report.md` 的方法）
   - [ ] localStorage key 加上季別前綴（如 `s2_save`），避免第二季讀到第一季存檔
   - [ ] 新季解鎖碼**不要沿用** `DEMO-TRUE`，每季換碼

---

## 4. 如何加入 Stripe Payment Link（付費補完）

> ⚠️ MVP 階段規則：**先用 Stripe 測試模式（Test mode），不要建立真實付費商品**，待明確批准才切正式。

零後端的付費流程（蜜月期 MVP 做法）：

1. Stripe Dashboard（**Test mode 開關打開**）→ Product catalog → 建立商品：
   - True Case File：NT$120 / ¥500
   - All Endings Pack：NT$250 / ¥980
   - Secret Diary：NT$60 / ¥300
2. 每個商品建立 **Payment Link**，設定付款完成後的 redirect：

   ```
   https://<站台>/public/unlock.html?paid=true_case
   ```

3. 在 `ending.html` / `unlock.html` 放上 Payment Link 按鈕（純 `<a href>`，不需任何 SDK 或 key）。
4. 交付方式：付款完成頁顯示解鎖碼（Stripe Payment Link 的「確認頁訊息」欄位可放文字），玩家回 `unlock.html` 輸入解鎖碼開啟付費結局。
5. MVP 取捨（已知且接受）：解鎖碼可被分享。量小時人工換碼即可；要堵漏才升級 optional 後端（Cloudflare Worker + KV 驗證一次性碼 + Stripe webhook），MVP 不做。

Stripe checklist：

- [ ] 全程使用 Payment Link 網址，**前端零 Stripe key**（連 publishable key 都不需要）
- [ ] 商品頁文案不得情緒勒索（禁止「不付費偵探就消失」類話術）
- [ ] 付費頁明示：主線 Day1–7 ＋ Normal/Bad End 完全免費，付費僅為補完
- [ ] 測試模式用測試卡號 `4242 4242 4242 4242` 走完整流程一次

---

## 5. 如何接 SNS 排程工具（Buffer / Later / Publer）

`content/social_calendar.csv` 是排程的單一來源（所有貼文目前皆為 **draft，未發佈**）。

通用流程：

1. 確認 CSV 欄位至少含：`date_jst, time_jst, platform, post_text, image_ref, status`。
2. 各工具匯入方式：
   - **Publer**（最推薦，CSV 匯入最寬鬆）：Posts → Bulk → Import CSV，把欄位對映到 Date/Time/Text，時區設 **Asia/Tokyo**。
   - **Buffer**：不支援原生 CSV 匯入（免費版），可用其「Ideas」貼上批次文字，或透過 Zapier「CSV → Buffer」。
   - **Later**：Bulk upload 以圖片為主，先傳 `assets/` 圖片，再貼上 caption；文字型貼文建議用 Publer。
3. 匯入後 checklist：
   - [ ] 工具時區 = JST（最常見出包點：用本機時區排程，日本玩家收到時差錯一天）
   - [ ] 全部貼文狀態 = **Draft / 待審**，不開 auto-publish — 未經明確批准不正式發佈
   - [ ] 每日貼文時間對齊營運手冊（劇情日 20:00 JST 主貼文，見 operation_guide.md）
   - [ ] 連結統一帶 UTM：`?utm_source=x&utm_medium=social&utm_campaign=s1_dayN`（零後端下這是少數可用的歸因手段）

---

## 6. 如何避免 API key 外洩

本專案的根本防線是**架構性的**：玩家端零後端、零 AI 呼叫、零金流 SDK → **前端本來就不存在任何 key**。維持這條線即可。

### 6.1 前端零 key 原則（紅線）

- [ ] `public/` 與 `content/` 下永遠不出現 `sk-`、`key`、`token`、`secret`、`Bearer` 等字樣的真實憑證
- [ ] `app.js` 不得新增任何外部 API 呼叫（包含「只是統計一下」的第三方 SDK，需經審核）
- [ ] 解鎖碼（如 `DEMO-TRUE`）是**內容口令不是 secret**，可以在前端比對；但正式販售碼每季更換
- [ ] 製作期用的 LLM key 只存在本機環境變數，絕不寫進任何專案檔案

### 6.2 .gitignore（repo 建立時就放好）

```gitignore
.env
.env.*
*.key
*.pem
secrets/
node_modules/
.DS_Store
tmp/
```

### 6.3 Secret 掃描

- [ ] GitHub repo → Settings → Security → 開啟 **Secret scanning** 與 **Push protection**（public repo 免費）
- [ ] 每次部署前本機掃一次：

  ```bash
  # 簡易掃描（任一命中即停止部署，逐一人工確認）
  grep -rniE "sk-[a-z0-9]|api[_-]?key|secret|token|Bearer " public/ content/ --include="*.js" --include="*.json" --include="*.html"
  ```

  （進階可裝 `gitleaks detect` 全 repo 掃描。）
- [ ] **若不慎已 push 過 secret**：視同已外洩 — 立刻到對應平台 **revoke 該 key**，再清 git 歷史（revoke 為主，清歷史只是順手）。

---

## 7. 部署完成後的最終驗收

- [ ] 正式網址手機開一次、桌機開一次，走完 Day1
- [ ] `DEMO-TRUE` 線上可解鎖
- [ ] Network 面板無任何非本站請求
- [ ] `privacy.html` / `terms.html` 可從首頁點到
- [ ] 把正式網址填回 `content/social_calendar.csv` 的連結欄位
- [ ] 通知營運：進入 `docs/operation_guide.md` 的「上線前一天」流程
