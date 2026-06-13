# 交付物 5：接入遊戲的 Asset Pipeline（星野灯 / hoshino_akari）

**日期：** 2026-06-13
**範圍：** 盤點 → 規劃 → 執行整理。本管線**不規劃生成新圖**；AI 只負責「可修基底」，最終 approved 由人工清理／圖層合成穩定產出。
**權威 manifest：** `public/assets/characters/hoshino_akari/manifest.json`（已取代 `art_tool/art_review/asset_manifest.draft.json`）。
**基底目錄（ASSETDIR）：** `public/assets/characters/hoshino_akari/`

> 重要原則（凍結，貫穿全文）
> 1. 不追求一次生出完美最終圖；AI 只負責**可修基底**。
> 2. approved 必須**可穩定重複使用**（同一個人、同框構、可預期）。
> 3. 不穩定狀態（例：白口罩半戴疊白圍巾）改用**圖層合成／人工**，不要硬叫 AI 自動完稿。
> 4. AI 產出一律 draft；**人工清理＋去背後才 approved**。

---

## 1. 目錄結構（5 狀態 + 半身平行目錄）

實際執行後，`ASSETDIR` 下的狀態目錄如下（本次新建 `draft/`、`rejected/`、`archive/`，各補 `.gitkeep`；`fix_ready/`、`approved/` 既有不動）：

```
public/assets/characters/hoshino_akari/
├─ manifest.json            ← 權威清單（本交付物產出）
├─ draft/                   ← 草案層【指標目錄】：README.txt 指向 generated/，不放重檔
│   ├─ .gitkeep
│   └─ README.txt
├─ fix_ready/               ← 待人工修的全身 AI 基底（白底，非 alpha）【既有，3 張】
│   ├─ akari_full_mask_off_fix_v001.png
│   ├─ akari_full_mask_on_fix_v001.png
│   └─ akari_full_mask_half_fix_v001.png
├─ bustup_fix_ready/        ← 待人工修的半身 AI 基底（白底，非 alpha）【既有，3 張 + hq_tests/】
│   ├─ akari_bustup_neutral_mask_off_fix_v001.png
│   ├─ akari_bustup_neutral_mask_on_fix_v001.png
│   ├─ akari_bustup_neutral_mask_half_fix_v001.png
│   └─ hq_tests/            ← upscale／denoise refine 實驗 + ..._hq_FINAL_local.png（目前最佳臉）
├─ approved/                ← 人工清理＋去背後的正式全身素材【既有，目前空】
│   └─ .gitkeep
├─ bustup_approved/         ← 人工清理＋去背後的正式半身素材【既有，目前空】
│   └─ .gitkeep
├─ rejected/                ← 明確不採用【本次新建，空】
│   └─ .gitkeep
└─ archive/                 ← 被取代的歷史版本【本次新建，空】
    └─ .gitkeep
```

### 各狀態語意

| 狀態 | 語意 | 能否進遊戲 |
|------|------|-----------|
| **draft** | AI 剛產出、未挑選的原始候選。實際池在 `public/assets/generated/`（gitignored，約 170 張）。本 `draft/` 只放 `README.txt` 指標，不複製重檔。 | 否 |
| **fix_ready** / **bustup_fix_ready** | 已挑中、待人工修圖的**可修基底**（白底，非 alpha）。 | 否（修完去背才行） |
| **approved** / **bustup_approved** | 人工清理＋去背（`_alpha`）後、**可穩定重複使用**的正式素材。 | **是**（前端只讀這層） |
| **rejected** | 明確不採用（雙眼錯位、口罩消失、壞手等）。 | 否 |
| **archive** | 被取代的歷史版本（保留可追溯，不再使用）。 | 否 |

### 與既有目錄的關係與遷移建議

| 既有位置 | 內容 | 與本管線的關係 / 遷移建議 |
|----------|------|---------------------------|
| `public/assets/generated/` | AI candidate 約 170 張（gitignored），`metadata.json` 182 筆 | 即**實質 draft／experiment 池**。`draft/README.txt` 指向它。**不要**把這些重檔複製進 `draft/`。 |
| `art_tool/art_archive/unconfirmed_adopted/` | 10 檔（被取代的舊 adopted：3×character_rough、bae649ab、38cad997 等） | 屬歷史版本。**遷移建議**：日後整併入 `ASSETDIR/archive/`，集中一處可追溯（本次不搬，避免破壞既有 git 狀態）。 |
| `art_tool/art_review/needs_manual_cleanup/` | 3 張全身 fix 的 DRAFT 副本（cp 自 generated/） | 與 `fix_ready/` 同源、是過渡副本。**以 `ASSETDIR/fix_ready/` 為唯一權威**；`art_review/` 副本可保留或日後清掉。 |
| `art_tool/art_review/asset_manifest.draft.json` | 舊草案 manifest | **已被 `ASSETDIR/manifest.json` 取代**。內容已承接，不矛盾。 |
| `art_tool/art_review/ASSET_CLEANUP_REPORT.md` | 2026-06-13 整理報告 | 仍有效，作為整理過程的歷史紀錄。 |

---

## 2. 每張圖的狀態總表

本目錄頂層共 **6 張權威實體圖**（全身 3 + 半身 3），目前**全部為 fix_ready，沒有任何 approved**（因尚未人工清理＋去背）。

| asset_id | 檔案（相對 ASSETDIR） | 類別 | 表情 | 口罩態 | 狀態 | 來源 | 待人工修 |
|----------|----------------------|------|------|--------|------|------|:--------:|
| akari_full_mask_off | `fix_ready/akari_full_mask_off_fix_v001.png` | full | neutral_guarded | mask_off | fix_ready | 225bc2d9 | 否（僅去背） |
| akari_full_mask_on | `fix_ready/akari_full_mask_on_fix_v001.png` | full | neutral_guarded | mask_on | fix_ready | 89f0cdfc | 否（僅去背） |
| akari_full_mask_half | `fix_ready/akari_full_mask_half_fix_v001.png` | full | neutral_guarded | mask_half | fix_ready | f2418510 | **是（修口罩）** |
| akari_bustup_neutral_mask_off | `bustup_fix_ready/akari_bustup_neutral_mask_off_fix_v001.png` | bustup | neutral_guarded | mask_off | fix_ready | 全身 fix 裁切（225bc2d9） | 否（僅去背） |
| akari_bustup_neutral_mask_on | `bustup_fix_ready/akari_bustup_neutral_mask_on_fix_v001.png` | bustup | neutral_guarded | mask_on | fix_ready | 全身 fix 裁切（89f0cdfc） | 否（僅去背） |
| akari_bustup_neutral_mask_half | `bustup_fix_ready/akari_bustup_neutral_mask_half_fix_v001.png` | bustup | neutral_guarded | mask_half | fix_ready | 全身 fix 裁切（f2418510） | **是（修口罩）** |

- 半身三張皆由全身 fix **純裁切**（crop_box x165 y18 455×452 → 2x Lanczos → 910×904），AI refine = none，**零 AI 漂移**，與全身是同一個人。
- `bustup_fix_ready/hq_tests/` 內為 upscale／denoise refine 實驗與比對圖，含目前最佳臉 `akari_bustup_neutral_mask_off_hq_FINAL_local.png`。這些**屬實驗檔，不是權威實體**，manifest 不收錄；若要採用 FINAL 臉需人工確認後再正式納入並去背。
- `master_candidates/`（d030/d040/d050 × seed）為畫風強度比較圖，亦屬實驗。

**表情覆蓋現況：** 6 張實體只有 **neutral_guarded** 一種表情。Day1-7 需要的其餘表情（troubled/anxious、annoyed、blush+avert、small genuine smile、soft final）皆 **pending**，列於 manifest 的 `sprite_plan`（planned，指向 D2 表情規劃）。

---

## 3. 與遊戲內角色狀態的對應（game_state_map 人類可讀版）

> 灯線**目前尚未接進遊戲**（`content/` 無灯的美術引用；前端零 API key、零即時 AI）。以下是**接入時的對照規格**。

對應鍵格式：`{category}:{mask_state}:{expression}`，對應到 sprite `asset_id`。
- `ready` = 已有可用的 fix_ready 實體（仍待人工去背才真正能進 approved）。
- `pending` = 尚無實體圖，屬 `sprite_plan` 規劃。

| 狀態鍵 | sprite asset_id | 對應狀態 | approved 前置障礙 |
|--------|-----------------|----------|-------------------|
| full:mask_off:neutral_guarded | akari_full_mask_off | ready | 人工輕清＋去背 |
| full:mask_on:neutral_guarded | akari_full_mask_on | ready | 人工輕清＋去背 |
| full:mask_half:neutral_guarded | akari_full_mask_half | ready | **修口罩或 overlay 合成**，再去背 |
| bust:mask_off:neutral_guarded | akari_bustup_neutral_mask_off | ready | 人工輕清＋去背 |
| bust:mask_on:neutral_guarded | akari_bustup_neutral_mask_on | ready | 人工輕清＋去背 |
| bust:mask_half:neutral_guarded | akari_bustup_neutral_mask_half | ready | **修口罩或 overlay 合成**，再去背 |
| bust:mask_on:neutral_guarded(alt) | akari_disguise_neutral_mask_on | pending | sprite_plan |
| bust:mask_half:annoyed | akari_disguise_annoyed_mask_half | pending | sprite_plan |
| bust:mask_on:troubled | akari_disguise_troubled_mask_on | pending | sprite_plan |
| bust:mask_half:blush_avert | akari_disguise_blush_avert_mask_half | pending | sprite_plan |
| bust:mask_off:small_genuine_smile | akari_casual_small_smile_mask_off | pending | sprite_plan |
| bust:mask_off:soft_final | akari_casual_soft_final_mask_off | pending | sprite_plan |

**接入時的整合規格：**
1. 前端只讀 `approved/` 與 `bustup_approved/` 的去背 PNG（`_alpha`），**不讀 fix_ready**。
2. 遊戲狀態以 `(mask_state, expression)` 決定 sprite key；**遮罩三態是 Day1-7 情緒節拍的主切換軸**（例：Day2 側身拉下口罩露真笑＝ mask_half/mask_off + small_genuine_smile；Day6/Day7 口罩後眼睛彎一下＝ mask_on + soft_final）。
3. mask_half 若採 **overlay 合成**：以 base sprite（mask_off）+ mask_half overlay PNG（含 alpha）疊圖，避免另外維護一整張 mask_half 立繪。

---

## 4. 建議檔名規則

```
{角色}_{框構}_{表情}_{口罩態}_{版本}.png
角色   = akari
框構   = full | bust
表情   = neutral_guarded | troubled | annoyed | blush_avert | small_smile | soft_final
口罩態 = maskoff | maskon | maskhalf
版本   = v001, v002, ...
```

- **fix_ready 命名範例**：`akari_full_neutral_maskoff_v001.png`、`akari_bust_small_smile_maskoff_v001.png`
- **approved 去背版加 `_alpha`**：`akari_full_neutral_maskoff_v001_alpha.png`、`akari_bust_neutral_maskon_v001_alpha.png`
- **overlay 合成件**（mask_half 採合成路線時）：`akari_bust_overlay_maskhalf_v001_alpha.png`（只含口罩圖層 + alpha，疊在 maskoff base 上）。

> 既有檔名（`akari_full_mask_off_fix_v001.png` 等）用 `_fix_` 標記「fix_ready 階段」、`mask_off` 含底線。新規則統一收斂為上表（`maskoff` 無底線、approved 去 `_fix` 改加 `_alpha`）。既有檔不必立刻改名；**進 approved 時依新規則命名去背版**即可。

---

## 5. 哪些「直接放入遊戲」、哪些「仍待人工修圖」

**現況結論：目前沒有任何一張可以『直接』放入遊戲**——因為政策要求 AI=draft、人工清理（含去背）後才 approved，而 `approved/`、`bustup_approved/` 目前皆空。

分三類明確點名：

### A. 輕清＋去背後即可 approved（不需重畫，最接近可用）
- `akari_full_mask_off` / `akari_full_mask_on`（全身）
- `akari_bustup_neutral_mask_off` / `akari_bustup_neutral_mask_on`（半身）

這 4 張只差「人工輕清雜點 + 去背（白底 → alpha）」。完成後依命名規則放入 `approved/` 或 `bustup_approved/`。

### B. 仍待人工修圖 / 改 overlay 合成（不要硬叫 AI 自動完稿）
- `akari_full_mask_half`（全身）、`akari_bustup_neutral_mask_half`（半身）

問題：白口罩疊白圍巾辨識度太低。處理路線二選一：
1. **人工修**：口罩冷白化、加 contact shadow、補耳掛線、修接縫，再去背。
2. **overlay 合成**（建議的穩定路線）：保留 mask_off base，另做一張 mask_half 口罩 overlay（含 alpha），遊戲端疊圖。這能讓「口罩態」變成可重複套用的圖層，符合「approved 必須可穩定重複使用」「不穩定狀態改用合成」的原則。

### C. 尚無實體圖（pending，屬規劃）
- 所有非 neutral 表情（troubled/anxious、annoyed、blush+avert、small genuine smile、soft final）。
- 第二套衣裝（casual）。
- 見 manifest `sprite_plan` 與 D2 表情規劃；本管線不在此生成。

---

## 附註：模型架構技術修正（以 RESEARCH/VERIFICATION 為準，信心：高）

供日後做差分／表情圖時參考，避免選錯工具：

- `anima_baseV10` 的擴散骨幹是 **NVIDIA Cosmos-Predict2-2B**（kohya 稱 MiniTrainDIT），**僅借用** Qwen-Image VAE 與 Qwen3-0.6B 文字編碼器。**它不是 Qwen-Image 家族、非 SDXL、非 SD1.5、非 Flux。**（原 brief「屬於 Qwen-Image 家族」的說法已被一手來源 refuted；VAE/TE 是 Qwen 系，但 DiT 骨幹是 Cosmos 系。）
- 因此：**SDXL 與 Qwen-Image 的 LoRA／ControlNet 皆不可直接套用。** 不可宣稱「SDXL 流程可直接套用」。
- 採樣官方建議：er_sde、cfg **4-5**、steps 30-50、512²–1536²。專案歷史預設 cfg 3.5-4.5 略低於官方下限，建議向 4-5 對齊。
- 若日後要做「同一個人」的差分／表情／口罩態：身分一致性靠 **D 組 LoRA + 固定 seed + 自基準立繪做低 denoise img2img / 局部 inpaint**；**ControlNet 控結構（姿勢／構圖）不控身分**。Anima 的原生控制是 **Anima-LLLite**（kohya 專為 Anima 移植，含 4ch inpaint 與 3ch lineart/scribble 權重），可用於 mask_half 的局部重繪/合成輔助。Qwen-Image-ControlNet-Union 與 Qwen-Image-Edit 是另一顆 20B 模型，**無法驅動 Anima**（架構推論，信心高）。
- 上述屬「日後製作」的技術備忘；**本管線僅盤點與整理，不執行訓練／生成／控制。**

> 風格設定已同步（2026-06-13）：`art_config/art_styles.json` 的 `anima_airbrush_editorial` 已是 production **D 組（gpt@0.7 + dogma@0.4，無 NSS，cfg 4.0，保留 @gpt-image-2 觸發詞，`production_default: true`）**。原觸發詞還原版（gpt@0.75 + NSS@0.70 + dogma@0.60 + (kishida mel:0.5) + @sw33t）已另存為獨立備用 style `anima_airbrush_editorial_sweet_experimental`（`production_default: false`、`commercial_review_required: true`）。manifest 與 config 一致。
