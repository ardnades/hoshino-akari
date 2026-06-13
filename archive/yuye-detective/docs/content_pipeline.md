# 內容管線：Genre Pack 系統（content_pipeline.md）

> 目的：用 Season 1（偵探+戀愛）驗證過的同一套系統 — 7 天結構、4 數值、14 線索、5 結局、免費主線＋付費補完、每日 cliffhanger＋SNS 截圖台詞 — 重複生產不同類型的季度內容。
> 對應 `prompts/02_genre_architect.md` 的 Genre Pack 概念：**引擎不變（public/ 前端 + story.json schema），換的只是 Genre Pack 資料**。

---

## 0. 共通 7 天骨架（所有類型不變）

| Day | 結構功能 | Season 1 對照 |
|---|---|---|
| Day1 | 異常事件入侵日常＋關鍵角色登場＋**預告型爆點** | 情書＋偵探＋失蹤預告 |
| Day2 | 預告成真，玩家被捲入；**「對方早就認識你」的第一道違和** | 結衣失蹤＋舊合照 |
| Day3 | 危機＋被保護＋對方拒絕解釋過去；**一句穿心台詞** | 「我不是第一次失去你」 |
| Day4 | 證據反咬：**最信任的人成為嫌疑/威脅** | 偵探成嫌疑人 |
| Day5 | 核心抉擇日（信任軸數值最大擺幅）＋**對方承認一半真相** | 「刪你記憶的是我安排的」 |
| Day6 | 全真相文件到手＋**揭真相會傷害想保護的人** | L7＋邀請函 |
| Day7 | 終局對峙，三選一（揭明／保護／離開）→ 依數值分歧五結局 | 診所舊址 |

每日固定欄位（引擎要求）：標題／開場／2-3 選擇（stat_delta 限 -8～+8）／主線推進／情感推進／矛盾或危險／SNS 截圖台詞／cliffhanger／明日預告。

五結局框架固定：`normal_end`（免費 fallback）／`bad_end`（免費）／`true_*_end`（付費主力）／`romance_end` 或 `bond_end`（付費）／`secret_end`（付費或二周目，解鎖碼，埋下季伏筆）。

---

## 1. 核心數值替換表

引擎只認 4 個 stat slot（`stat_a`～`stat_d`），各類型重新命名與定義；起始值/上限沿用 S1 校準（§8.2 的 delta 設計範圍直接複用）：

| slot（S1 名） | 偵探+戀愛（S1） | 冒險+戀愛 | 恐怖+戀愛 | 奇幻+戀愛 | 生存+戀愛 | 偵探+友情群像 |
|---|---|---|---|---|---|---|
| stat_a（affection） | affection 好感 | affection 好感 | bond 羈絆 | affinity 心緣 | bond 相依 | team_bond 團隊情誼 |
| stat_b（trust） | trust 信任 | courage 勇氣 | sanity 神智 | oath 誓約 | hope 希望 | trust 互信 |
| stat_c（truth） | truth 真相 | progress 旅程進度 | truth 真相 | destiny 命運揭明 | survival 生存籌備 | truth 真相 |
| stat_d（suspicion） | suspicion 懷疑 | danger 危險 | dread 恐懼 | corruption 侵蝕 | threat 威脅 | rift 嫌隙 |

判定式沿用 S1 模式：付費主力結局 = `stat_c 高 AND stat_b 高 AND stat_d 低`；情感結局 = `stat_a 高 AND stat_b 中 AND stat_c 中`；bad = `stat_c 低 OR stat_d 爆`；normal = fallback。**只換名與文案，不換數學** — QA 五路徑驗證法可整套複用。

---

## 2. 各類型 Genre Pack

### 2.1 冒險+戀愛（例：《沉沒列車的七日車票》）

- **每日爆點模板**：D1 收到死者寄出的車票／D2 地圖上不存在的車站／D3 同伴替你擋下陷阱「我答應過要帶你回去」／D4 同伴的背包裡有第二張你的車票／D5 同伴承認「這趟旅程我走過一次」／D6 終點站的代價是兩人只能回去一個／D7 終點抉擇
- **結局模板**：normal=平安歸返但謎留一半；bad=錯過末班折返；true_journey_end=完整路線真相＋兩人歸返；romance=放棄終點選擇彼此；secret=車票還有第八張
- **付費補完**：完整路線圖＋同伴的第一次旅程日誌／Secret End／全結局包
- **SNS 宣傳角度**：地圖碎片連載（每日公開一格）、「你會用唯一的回程票嗎」投票、車站場景美術圖
- **誤導機制替換**：假線索 → 假路標（看似捷徑實為陷阱，附可發現的澄清地標）

### 2.2 恐怖+戀愛（例：《別關燈，我在》）

- **每日爆點模板**：D1 鏡中多一個人影＋陌生人警告你別回頭／D2 鄰居「消失」且所有人不記得他／D3 守護者替你擋下異象，手是冰的／D4 證據顯示異象隨守護者出現／D5 守護者承認「我不是活人這側的」／D6 驅散異象＝送走守護者／D7 黎明前抉擇
- **結局模板**：normal=異象退散、對方淡去留下溫度；bad=sanity 崩潰或信錯異象；true_horror_end=異象來歷全揭＋安息；romance=共存結局（刻意不甜膩，留靜美）；secret=異象的源頭看向了下一棟樓
- **付費補完**：異象觀察紀錄（案件檔案位）＋守護者生前日記／Secret End
- **SNS 宣傳角度**：深夜 0:00 限定貼文、一行怪談（截圖台詞天然適配）、「你敢開聲音玩嗎」
- **安全特別條款**：恐怖強度上限=微驚悚＋心理懸疑，禁 jump scare 圖、禁血腥描寫、死亡題材不浪漫化自傷；首頁內容提示必加「恐怖元素」
- **數值特殊規則**：sanity 是唯一「會被扣的信任軸」，低於 30 時選項文字顯示輕微扭曲（前端 CSS 即可，無後端）

### 2.3 奇幻+戀愛（例：《月蝕魔女的契約書》）

- **每日爆點模板**：D1 契約印記出現在手腕／D2 印記持有者接連昏睡，你是下一個／D3 魔女替你承受反噬「你的代價由我付」／D4 古書記載：施咒者正是魔女本人／D5 魔女承認「契約是三百年前你簽的」（記憶反轉位）／D6 解咒＝魔女消滅／D7 月蝕之夜抉擇
- **結局模板**：normal=咒解、魔女遠行；bad=corruption 吞噬或解錯咒；true_fate_end=三百年因果全揭＋雙生存解；romance=共擔契約；secret=契約書還有第二位簽名者
- **付費補完**：三百年前世篇（角色日記位）＋咒文設定集／Secret End
- **SNS 宣傳角度**：世界觀設定圖卡、每日一條咒文謎語、「你願意替誰付代價」、與 S1 共用「跨越遺忘的感情」母題可做聯動文
- **誤導機制替換**：假線索 → 偽典（被竄改的古書段落，原典可在圖書館位點找到）

### 2.4 生存+戀愛（例：《72 小時之後的我們》＝7 天倒數災變）

- **每日爆點模板**：D1 廣播宣告封城，鄰人留下一張字條／D2 物資點遇到「對你異常熟悉」的倖存者／D3 對方把最後的水給你「這次換我撐著」／D4 無線電指控對方是引發災變的研究員／D5 對方承認「我參與過，但真相不是廣播說的」／D6 撤離名單只剩一個名額／D7 撤離日抉擇
- **結局模板**：normal=兩人錯過撤離但活下來；bad=threat 爆表或信錯廣播；true_record_end=災變真相全揭＋雙撤離；romance=放棄名額留下彼此；secret=廣播的聲音，是第三個倖存者
- **付費補完**：災變事件完整時間線（案件檔案位）＋對方的研究手記／Secret End
- **SNS 宣傳角度**：倒數計時貼文（D-6…D-0 天然連載結構）、「最後一格背包你放什麼」UGC、字條截圖
- **安全特別條款**：災變寫法避免影射真實災難事件與真實地名；不渲染屍體與絕望至失能的描寫；survival 低分結局也保持「活著」基調

### 2.5 偵探+友情群像（例：《五人份的不在場證明》）— 無戀愛軸的變體

- **核心差異**：可攻略單對象 → **4 人小隊群像**，stat_a 改為 team_bond（全隊）＋每角獨立 `bond_<char_id>`（0-20 輕量子數值，只影響結局演出分支，不影響結局判定 → 引擎判定式不用改）
- **每日爆點模板**：D1 五人收到同一封匿名信「你們之中有人說謊」／D2 一人失聯／D3 兩名隊友證詞互斥／D4 證據指向隊內最可靠的人／D5 信任投票日（trust/rift 最大擺幅）／D6 真相：說謊是為了護住全隊的舊約定／D7 全員對峙抉擇
- **結局模板**：normal=案破但有人退隊；bad=互指錯人、隊伍解散；true_case_end=證據鏈全收＋全員留下；bond_end（取代 romance_end）=放棄公開真相換全員無傷；secret=匿名信的寄件人是「第六個人」
- **付費補完**：五人各自視角的當日日記（×7 天，日記位的群像強化版）／案件完整檔案／Secret End
- **SNS 宣傳角度**：「你最相信誰」每日投票（群像天然適配投票玩法）、五角色人設卡連載、MBTI 式「你是隊裡的哪一個」
- **公平性條款沿用**：假線索必附隊內可發現的澄清證據（S1 §5 公平性備註格式照搬）

---

## 3. Genre Pack 的 JSON 模組欄位（對應 Prompt 2）

每季交付一份 `content/genre_pack.json`，引擎讀取後即知如何渲染與判定。Schema：

```json
{
  "pack_id": "horror_romance_s3",
  "genre": "horror+romance",
  "title": "別關燈，我在",
  "season_dates_jst": { "day1": "2026-09-01", "day7": "2026-09-07" },
  "stats": [
    { "slot": "stat_a", "id": "bond",   "label": "羈絆", "initial": 10, "max": 100 },
    { "slot": "stat_b", "id": "sanity", "label": "神智", "initial": 20, "max": 100 },
    { "slot": "stat_c", "id": "truth",  "label": "真相", "initial": 0,  "max": 100 },
    { "slot": "stat_d", "id": "dread",  "label": "恐懼", "initial": 10, "max": 100 }
  ],
  "characters": [
    { "character_id": "guardian", "age": 27, "age_verifiable_in_text": true,
      "romanceable": true, "suspicion_design": 7, "romance_relevance": 10 }
  ],
  "daily_beats": [
    { "day": 1, "beat_template": "intrusion_and_arrival", "boom": "預告型爆點文字",
      "sns_quote": "截圖台詞", "cliffhanger": "...", "choices_stat_budget": { "stat_a": 12, "stat_b": 10, "stat_c": 8, "stat_d": [-8, 12] } }
  ],
  "clue_ledger": {
    "count": 14, "fake_count": 3,
    "fairness_rule": "every fake clue must list a clarifying_clue_id reachable in free route"
  },
  "endings": [
    { "ending_id": "secret_end",    "priority": 1, "gate": { "unlock_code": "PER-SEASON-CODE" }, "tier": "paid" },
    { "ending_id": "true_horror_end","priority": 2, "gate": { "stat_c_min": 70, "stat_b_min": 60, "stat_d_max": 50, "required_clues": ["..."] }, "tier": "paid_main" },
    { "ending_id": "romance_end",   "priority": 3, "gate": { "stat_a_min": 70, "stat_b_min": 50, "stat_c_min": 40, "required_clues": ["..."] }, "tier": "paid" },
    { "ending_id": "bad_end",       "priority": 4, "gate": { "stat_c_max": 34, "or_stat_d_min": 70, "or_missing_clue": "key_clue_id" }, "tier": "free" },
    { "ending_id": "normal_end",    "priority": 5, "gate": "fallback", "tier": "free" }
  ],
  "monetization": {
    "free": ["day1-7", "normal_end", "bad_end", "replay", "share_image"],
    "paid": [
      { "sku": "true_case_file", "label": "完整真相檔案", "price_twd": 120, "price_jpy": 500 },
      { "sku": "all_endings",    "label": "全結局包",     "price_twd": 250, "price_jpy": 980 },
      { "sku": "secret_diary",   "label": "角色日記",     "price_twd": 60,  "price_jpy": 300 }
    ]
  },
  "sns_pack": {
    "primary_angle": "一行怪談",
    "daily_post_slots": ["20:00"],
    "ugc_hook": "你敢開聲音玩嗎",
    "all_posts_status": "draft"
  },
  "safety_overrides": ["no_jump_scare_images", "content_warning_horror_on_index"]
}
```

欄位規則：

- `stats[].slot` 固定四槽，前端 UI 與判定引擎只認 slot；`id/label` 任換。
- `characters[].age` 一律 ≥18 且 `age_verifiable_in_text` 必為 true（劇本中需有明寫年齡的台詞或文件）。
- `clue_ledger.fairness_rule` 為硬約束：QA（Prompt 11）驗收時逐條檢查假線索的澄清路徑在免費路線可達。
- `endings` 的 priority 判定順序、free fallback、解鎖碼位 — 與 S1 §8.3 同構，引擎零改動。
- 每季解鎖碼必換，不沿用 `DEMO-TRUE`。

---

## 4. 生產流程（一季 = 跑一輪 prompts/）

1. 選類型 → 從本文件 §2 取對應 Pack 模板，填 `genre_pack.json` 草稿
2. `02_genre_architect` 校驗欄位 → `03_story_bible` 產季度 brief（角色年齡明寫、時間線 JST、真凶三要件）
3. `04_episode_writer` ×7 天 → `05/06/07` 對應類型邏輯審（偵探邏輯／冒險邏輯／情感弧）→ `08_ending_writer` 五結局
4. `10_safety_reviewer` 紅線審（含該類型的 safety_overrides）→ `11_qa_tester` 五路徑數值驗證
5. `09_sns_marketer` 產 social_calendar.csv（全 draft）→ `12_frontend_builder` 僅需替換 json
6. 依 `docs/deployment_guide.md` §3 換季部署 → 進 `docs/operation_guide.md` 營運循環

產能基準（operation_guide §12 B2）：一季從選型到可玩初稿 ≤2 天。
