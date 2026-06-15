# 交付物 7：CG Regional-ControlNet Workflow Plan（星野灯 / hoshino_akari）

**日期：** 2026-06-15
**角色 / 範圍：** 星野灯線的 **事件 CG（event_cg / 主視覺）** 生成，**不含立繪（character sprite）**。
**性質：** 技術／規劃文件，非劇情本文（CLAUDE.md 的劇情標點與黑名單規則不適用，但仍用繁體中文）。
**本管線定位：** 盤點 → 規劃 → 執行整理。**本文只規劃 CG 的「區域分區描繪」控制法，不生成新角色設定、不動立繪流程、不動 `engine.js`。**

> **觸發來源：** 社群文章「Anima-LLLite-Regional-Controlnet が神」（しずのり, note, 2026-06-15）。該文描述一個「在白底遮罩上塗色塊，依色塊區域套不同 prompt」的 Anima 用 ControlNet 權重，配合 Attention Couple 等做多角色／多物件定位。本文評估它對本專案 CG 的適用性並落為可跑流程規劃。

---

## 0. 前置：本文與既有檔案的關係（承接，不矛盾）

- 承接 **`04_control_workflow_plan.md`** 的全部架構事實與「控制權責分工」上位規則。**本文是 04 的 CG 補篇**：04 把 Anima-LLLite 定位為「結構控制（姿勢／框構／局部重繪），不控身份」；本文把同一條原則延伸到 CG 的「**區域版面 / 多 subject 定位**」，身份仍走 04 既定路徑（LoRA + 固定 seed + 低 denoise / 局部 inpaint）。
- 承接 **`base_txt2img_api.json`**：CG 沿用同一組模型載入（`UNETLoader anima_baseV10` + `CLIPLoader qwen_3_06b_base` + `VAELoader qwen_image_vae`）、官方採樣（er_sde / simple、cfg 4–5、30–50 steps）。CG 解析度為**橫向 1216×832**（見 `art_config/art_tasks.json` 的 `event_cg`），與立繪縱向 832×1216 分流。
- 承接 **`spec/10-彙整表.md`「CG / Bonus 解鎖表」** 為 CG 需求事實基準（本文第 3 節據此分類）。
- 承接 **`art_config/art_tasks.json`**：`event_cg` 的 `prompt_suffix` / `width:1216` / `height:832` / `output_kind:"cg"` 不改。

**一句話總綱（延續 04）：** 身份 = LoRA + 定稿臉 + 低 denoise；**區域版面 / 多 subject 定位 = Regional-ControlNet（本文新增）**；結構幾何 = Anima-LLLite（既有）；最終 approved = 人工 / 合成。**Regional-ControlNet 控「塗在哪 = 畫什麼」,不控「臉是誰」。**

---

## 1. 它到底是什麼、為什麼對 Anima 能用

- **機制：** 一張白底遮罩，使用者在上面塗紅／藍／綠等色塊；KJNodes 把每個顏色拆成獨立區域 mask；ComfyUI-PPM 把「各區 mask ↔ 各區 prompt」綁定；Anima-LLLite ControlNet 權重吃這張色塊圖，把對應 prompt 的內容描繪到對應區域。**通常的整體 prompt（base）照常寫在主 prompt 欄,Regional 端只寫「該區要畫的東西」。**
- **為什麼能套 Anima：** 它走的是 04 已確認的 **`kohya-ss/ComfyUI-Anima-LLLite`**（`Apply Anima ControlNet-LLLite` 節點）家族,屬 **Cosmos-Predict2-2B / Anima-native 控制法**,不是 Qwen-Image / SDXL ControlNet,因此**沒有 04 第 1 節講的維度不匹配問題**。
- **它是 ControlNet,單獨不自動對 prompt：** 文章與官方都指出需搭 **Attention Couple**（把不同 prompt 的注意力綁到不同區域）。Regional 權重負責「位置忠實度」,Attention Couple 負責「該區只看該區的 prompt」。

**信心標註：** Anima-LLLite 框架存在 = **high**（04 已查證）；「Regional-Controlnet」這個**特定權重檔**的存在與通道數 = **medium（社群單一來源,未獨立驗證）**——需照第 7 節到官方配布頁核對檔名與通道格式後再下載。

---

## 2. 需要的節點堆與資產（最小可跑清單）

| 角色 | 自訂節點 / 資產 | 用途 | 落點 |
|------|----------------|------|------|
| ControlNet 套用 | `kohya-ss/ComfyUI-Anima-LLLite`（04 已規劃） | `Apply Anima ControlNet-LLLite`,patch Anima DiT | `ComfyUI/custom_nodes/` |
| Regional 權重 | **Anima-LLLite-Regional-Controlnet**（.safetensors,**待從官方配布頁取得**） | 區域色塊 → 區域描繪 | `ComfyUI/models/controlnet/` |
| 區域 prompt 綁定 | `ComfyUI-PPM` | 各區 mask ↔ 各區 prompt | `ComfyUI/custom_nodes/` |
| 色塊拆 mask | `KJNodes` | 把紅／藍／綠拆成獨立區域 mask | `ComfyUI/custom_nodes/` |
| 區域注意力 | **Attention Couple**（PPM 內含或獨立節點） | 每區只套該區 prompt | `ComfyUI/custom_nodes/` |
| 塗 mask（選用） | ComfyUI Impact Pack（文章用改造版 PreviewBridge） | 在白底上手塗色塊 | `ComfyUI/custom_nodes/` |

> **本專案立場：** 色塊 mask 也可在外部影像軟體畫好直接 `LoadImage`,不一定要 Impact Pack 的 PreviewBridge(文章作者反映其不穩定才改造)。**先走「外部畫好 PNG → LoadImage」最省事,Impact Pack 列為選用。**

---

## 3. 本專案 CG 分類：哪些 CG 真的吃 Regional

依 `spec/10-彙整表.md` 的 CG 解鎖表,把 CG 分成四類,只有 B/C 是 Regional 的主場,A 用既有流程即可,D 不該用它。

### 類 A — 單人臉／表情為主（**不要用 Regional,走 04 身份流程**）
水窪邊揭臉對望(D1-S2)、素顏側臉真笑(D2-S3)、眼鏡起霧白屏(D3-S2)、雜誌封面舞台(D3-S4)、對視她抬眼看鏡頭(D7-S4 主打CG)、攝影棚按口袋(D7-S8 hidden)。
→ 重點在「是不是灯的臉」,Regional 控版面不控身份,幫不上;維持 LoRA + 固定 seed + 從定稿臉低 denoise。

### 類 B — 單人 + 道具,道具「位置」由劇本指定（**Regional 有實益**）
指尖隔玻璃點布丁(D3-S3)、路燈下捧布丁(D3-S6)、販賣機光下吃布丁(D4-S4)、掌心護唇膏(D6-S5)、甜點櫃前手拿焦糖布丁(D7-S8 結局主圖)、背對咬油豆腐(D1-S4)。
→ 油豆腐／布丁／熱可可／護唇膏是**全劇回收的記憶錨點道具**(spec/README「四記憶錨點 CG」),跨 CG 的擺位一致性本來就難。塗一塊區域指定道具落點(如「布丁在玻璃後、手指在前」的前後分層),比反覆 reroll 穩。

### 類 C — 純物件定位 / 多角色同框（**Regional 不可取代**）
- **純物件、無人**：販賣機冷光・取出口旁一罐熱可可・空椅(D5-S4 本集主視覺)、兩罐熱可可立同位置(D5-S5)、暗號圖含/無護唇膏記號版(D5-S3,兩版差一個小記號區)。
- **多角色同框**：雨棚並肩・半步距離(D6-S3,自標「同框風險名場面」)、經理人遞暖暖包剪影(D7-S2)、握很久的掌心變體(D7-S4)。
→ 「兩人並肩又要控半步間距、又不能糊在一起」正是 base txt2img 最易爆、Regional + Attention Couple 設計來解的場景。純物件圖(空椅 + 罐)則完全是文章「荷包蛋浮在平底鍋上方」的同型問題。

### 類 D — 不適用 / 風險
經理人**沒有 canonical LoRA / 不接立繪**(見 `assets.js` 註記「經理人立繪本輪不接」)。多角色 CG 裡的第二人,身份不受 LoRA 約束 → **第二人一律走背影 / 剪影 / 裁切 / 側臉**,避免身份漂移(剪影 CG 如 D7-S2 正好天然契合)。

---

## 4. 兩個建議測試案例（一個驗物件擺位、一個驗同框）

### 測試 1：純物件擺位 —「販賣機空椅・取出口旁一罐熱可可」(D5-S4 主視覺)
最乾淨的 Regional 驗證(無人、無身份變數),只驗「塗的位置 = 物件落點」。
- 色塊 mask（橫向 1216×832）：左下塗一塊(取出口旁) = 熱可可罐區;畫面中偏右塗一塊 = 空椅區;其餘留白 = 販賣機冷光背景。
- Base prompt：販賣機冷光夜景、冷白色調(沿用 art_styles 冷白基調)。
- 區域 prompt（精簡,只寫該區物件）：罐區「a single warm canned cocoa, standing upright」;椅區「an empty chair, no person」。
- 驗收：罐確實落在取出口旁、椅確實空且在指定位置、未長出人。

### 測試 2：雙人同框 —「雨棚並肩・半步距離」(D6-S3)
驗 Regional + Attention Couple 能否控雙人相對位置且不互相污染。
- 色塊 mask：左區 = 灯;右區 = 第二人(**背影/側臉/裁切,不給正臉**);兩區間留半步間距。
- Base prompt：雨棚下夜景、並肩、半步距離氛圍。
- 區域 prompt：灯區寫灯的 visual_core(帽 + 連帽衣 + 白圍巾,正面);第二人區只寫「a person seen from behind / side, cropped」極簡描述。
- **已知風險（重點驗的就是這個）：** 角色 LoRA 預設**全域套用**,可能讓第二人也長出灯的臉(identity bleed)。緩解:第二人走背影 / 剪影削弱可見度;若 PPM / Attention Couple 支援**區域 LoRA**,把灯 LoRA 限定在灯區。此案例若不穩,退守「兩人分開生成 → 人工合成」(但會犧牲半步互動張力,故才優先試 Regional)。

---

## 5. ComfyUI 流程串接（接 base_txt2img,加 Regional 分支）

```
UNETLoader(anima_baseV10)
  └─ LoraLoader(canonical D 組)                      # 身份(全域;多角色時注意 bleed)
       └─ Apply Anima ControlNet-LLLite              # ← 新增:Regional 權重
            ├─ image  = 色塊 mask（LoadImage 外部畫好,或 Impact Pack 塗）
            ├─ strength = 0.4–0.6（壓低,見下）
            ├─ start_percent / end_percent（作用區間）
            └─ model  → KSampler.model
CLIPLoader(qwen_3_06b_base)
  ├─ CLIPTextEncode(base 整體 prompt) ─────────────→ 主 positive
  └─ 各區 prompt → ComfyUI-PPM / Attention Couple ─→ 區域 conditioning
        ↑ KJNodes：把色塊圖的紅/藍/綠拆成各區 mask,餵給 PPM 綁 prompt
KSampler(er_sde/simple, cfg 4.0, steps 30, denoise 1.0)
  → VAEDecode(qwen_image_vae) → SaveImage(hoshino_akari/event_cg)
  → [人工] 清理/修邊/合成 → approved
```

**參數要點：**
- **Strength 壓低（建議 0.4–0.6 起跳,實測微調）。** 文章原話:領域忠實度高、Strength 適度下調,否則過度貼合塗的形狀、犧牲自然度（附「目玉燒精靈 Strength 別一致率」對照圖佐證）。
- **區域 prompt「只寫該區要畫的東西」,別塞多餘資訊**（文章列的關鍵訣竅）。整體描述留在 base prompt。
- 採樣沿用 base：er_sde / simple、cfg 4.0、steps 30;CG 用 1216×832 橫向。
- **denoise = 1.0（純 txt2img + Regional 控版面）**;若要在既有 CG 基底上改物件位置,改走「VAEEncode + 低 denoise + Regional」混合(同 04 的 img2img 經驗區間)。

---

## 6. 邊界與禁區（沿用 04,避免誤用）

1. **Regional-ControlNet 控版面 / 區域,不控身份。** 灯每張 CG 是同一張臉,仍靠 LoRA + 固定 seed + 定稿臉低 denoise / inpaint。Regional 是**互補**,不是取代。
2. **多角色第二人不受 LoRA 約束** → 一律背影 / 剪影 / 裁切,別指望它畫出第二個 canon 角色的正臉。經理人本輪不接立繪,維持此政策。
3. **只動 CG workflow,不碰立繪流程、不碰 `engine.js`、不改 `art_tasks.json` 既有欄位。** CG 與立繪解析度/流程本就分流。
4. **AI 出 draft 基底,人工/合成收尾才 approved**（manual_cleanup_policy 上位規則不變）。
5. **授權**：本權重經 Anima 衍生,繼承 CircleStone Labs 非商業 + NVIDIA Open Model License,商業化前須釐清(同 04 第 6 節)。

---

## 7. 信心水準與須再查項（誠實標註）

| 主張 | 信心 | 備註 |
|------|------|------|
| Anima-LLLite 框架 / 節點存在且適用 Anima | **high** | 04 已查證(kohya 專門移植) |
| 「Regional-Controlnet」特定權重存在 / 通道格式 | **medium（社群單一來源）** | 須到官方配布頁核對檔名與通道數再下載 |
| 需配 Attention Couple 才能對 prompt | **high** | 文章與官方說明一致 |
| KJNodes 拆色塊 / PPM 綁區域 prompt 的串法 | **medium** | 文章描述,未獨立實跑 |
| Strength 宜壓低 | **medium-high** | 文章附對照圖,但數值須本機實測 |
| 多角色 LoRA 全域 bleed 風險 | **high（機制推論）** | Attention Couple 區域 LoRA 是否支援須驗 |

**須再查 / 須本機驗（時效性）：**
1. 到「Anima-LLLite-Regional-Controlnet」官方配布頁核對：權重檔名、通道數(3-ch 色塊？)、是否限 Anima v1.0、是否 image-only。
2. ComfyUI-PPM 與 Attention Couple 是否支援**區域 LoRA**(決定測試 2 的雙人 bleed 能否根治)。
3. KJNodes 色塊→mask 的實際節點名與輸出格式。

> **無法在本環境驗證的硬限制：** 此容器**沒有 ComfyUI / Anima 權重**,本文只交付節點圖 + 參數規劃,**所有實跑驗證(出圖、Strength 掃描、bleed 測試)須在本機 ComfyUI 執行**。建議先跑測試 1(無身份變數)確認 Regional 基本盤,再跑測試 2(雙人)。

---

## 8. 與既有交付物的銜接落點

- 身份層 / LoRA → 04 第 4 節分工表「身份」列 + `art_styles.json`(D 組,已裁定)。
- CG 任務參數 → `art_config/art_tasks.json` 的 `event_cg`(1216×832 / output_kind:cg),不改。
- CG 清單與情緒節點 → `spec/10-彙整表.md` CG 解鎖表(本文第 3 節分類依據)。
- 產出落點 → `SaveImage` filename_prefix `hoshino_akari/event_cg`,draft → 人工 → approved(同 05 資產管線狀態流)。
