# 角色控制管線 — 星野灯 / hoshino_akari

本資料夾是「可長期重複使用的角色控制管線」的單一入口。目標：讓星野灯的美術素材**穩定、可重複、像同一個人**，並把「AI 出可修基底 → 人工/合成收尾 → approved 進遊戲」固定成流程。本套文件同時作為**未來新角色的範本**（換角色時複製本結構、重填 01 即可）。

> 產出日期：2026-06-13。方法：先盤點現有素材與模型環境 → 上網查證 Anima/Cosmos 生態 → 對抗式查證 → 產出 5 份交付物並執行素材目錄與 manifest。

## 交付物索引

| # | 文件 | 內容 |
|---|------|------|
| 1 | [01_character_bible_ref_pack.md](01_character_bible_ref_pack.md) | 角色基準資料：外觀/配色/服裝固定規格、口罩三態、6 表情上限、2 姿勢上限、sprite 規格表，收尾【必須固定／可變動／禁止漂移】三清單 |
| 2 | [02_sprite_plan.md](02_sprite_plan.md) | 最小可用素材集：全身 3 + 半身硬上限 6 張、表情×口罩×Day 對照表、P0/P1/P2 優先級 |
| 3 | [03_lora_training_plan.md](03_lora_training_plan.md) | 角色一致性 LoRA 方案（Anima/Cosmos 專用訓練法、素材選/排除、caption、trigger、驗收）|
| 4 | [04_control_workflow_plan.md](04_control_workflow_plan.md) | 控制流程：可用/不可用的 reference/inpaint/img2img/control，四層控制權責分工表 |
| 5 | [05_asset_pipeline.md](05_asset_pipeline.md) | 接入遊戲的目錄結構、狀態總表、game_state_map、檔名規則 |

實際素材與權威 manifest 在：
`public/assets/characters/hoshino_akari/`（`manifest.json` + `draft/ fix_ready/ approved/ rejected/ archive/`）。

## 一頁速記（最關鍵事實）

- **模型架構（高信心，已查證）：** `anima_baseV10` 的擴散主幹是 **NVIDIA Cosmos-Predict2-2B 衍生 DiT**（kohya 稱 *MiniTrainDIT*），**只借用** Qwen-Image VAE + Qwen3-0.6B 文字編碼器。**它不是 Qwen-Image 家族、非 SDXL/SD1.5/Flux。** → SDXL kohya 腳本、ControlNet-LLLite(經典版)、Qwen-Image 的 LoRA/ControlNet **都不可直接套用**。
- **控制權責分工：**
  - **身份（誰）** = 角色/風格 LoRA（D 組）+ 固定 seed + 從基準立繪 `225bc2d9` 低去噪 img2img/局部 inpaint。Anima 目前**無**可下載成熟 IP-Adapter 權重，沒有「丟參考圖保臉」捷徑。
  - **結構（姿勢/框構）** = **Anima-LLLite**（kohya 專為 Anima 移植的 ControlNet-LLLite，架構原生）。ControlNet 控結構**不控身份**。
  - **訓練** = `kohya-ss/sd-scripts` 的 `anima_train_network.py` + `networks.lora_anima`（可經 ComfyUI「Anima LoRA Trainer」節點驅動）。
  - **手工/合成** = 白口罩 `mask_half`、去背、接縫、最終 approved 收尾。
- **製作方針（凍結）：** AI 只出 draft 基底；人工清理後才 approved；approved 必須可穩定重複；不穩定狀態（白口罩半戴）改圖層合成或人工。

## 需使用者裁定的開放決策

1. **LoRA 風格不一致** — 已定 canonical = **D 組**（`gpt-image-2`@0.7 + `dogma`@0.4，無 NSS），但 `art_config/art_styles.json` 的 `anima_airbrush_editorial` 仍是觸發詞還原版（gpt@0.75 + NSS@0.70 + dogma@0.60 + `(kishida mel:0.5)` + 觸發詞）。manifest 已按 D 組記錄，**config 待你裁定後同步**。
2. **第二套衣裝**（P0 衣裝上限 2，已用 1）— 在「偶像舞台服」與「casual」二擇一，兩者皆未製作。
3. **是否真要訓練角色 LoRA** — 目前素材高度同構（≈2 構圖 + 1 高清臉），投報率低、易過擬合；建議先用「基準臉 + 局部重繪/img2img/overlay」做完 P0，要訓練須另補多樣性至 18–25 張。
4. **mask_half 長線做法** — 即時人工修口罩 vs overlay 合成（建議 overlay，較穩定可重複）。
5. **CFG** — 專案現值 3.5–4.5 略低於 Anima 官方建議 4–5，是否上調。
6. **商業授權** — Anima 採 CircleStone Labs 非商業授權並繼承 NVIDIA Open Model License；若日後商業發行，整套 LoRA 受限，需另洽授權。
