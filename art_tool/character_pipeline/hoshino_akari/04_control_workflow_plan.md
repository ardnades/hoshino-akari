# 交付物 4：Reference / Control Workflow Plan（星野灯 / hoshino_akari）

**日期：** 2026-06-13
**角色：** 星野灯 / hoshino_akari（《雨夜偵探社：第七封情書》灯線）
**範圍：** 規劃本模型「可用」的 reference / inpaint / img2img / control / edit 方案，並用一張「控制權責分工表」收尾。
**性質：** 技術／規劃文件，非劇情本文（CLAUDE.md 的劇情標點與黑名單規則不適用，但仍用繁體中文）。
**本管線定位：** 盤點 → 規劃 → 執行整理。**不規劃生成新圖。** AI 只負責「可修基底」，最終 approved 由人工／圖層合成穩定產出。

---

## 0. 前置：本文與既有檔案的關係（承接，不矛盾）

本文承接以下既有檔案，並以它們為事實基準：

- `art_tool/art_review/asset_manifest.draft.json`：素材 manifest 草案（current_drafts／sprite_plan／fix_ready_assets／manual_cleanup_policy）。
- `art_tool/art_review/ASSET_CLEANUP_REPORT.md`：2026-06-13 整理報告（含 LoRA 不一致裁定提醒）。
- `art_tool/art_config/characters.json`：角色視覺設定（visual_core／must_keep／avoid）。
- `art_tool/art_config/art_styles.json`：畫風設定（含 `anima_airbrush_editorial`）。
- `art_tool/art_workflows/base_txt2img_api.json`：實際 ComfyUI API workflow（直接驗證模型載入方式）。

承接重點：

- manifest 已定義的 mask 三態（mask_off／mask_half／mask_on）、八張 P0 sprite_plan、fix_ready 與 bustup_fix_ready 結構，本文沿用不改。
- manual_cleanup_policy（AI=draft、人工清理後才 approved、mask_half 不要求 AI 全自動完稿）是本文「控制權責分工」的政策上位規則，本文只是把它對應到具體技術節點。
- LoRA 不一致（D 組 vs art_styles.json 觸發詞還原版）尚未裁定；本文沿用整理報告的記法，技術層面以「canonical LoRA stack（待裁定）」稱之，不擅自改 config。

---

## 1. 最關鍵的架構修正（必讀，決定一切工具選擇）

**原始 brief 結論「架構屬於 Qwen-Image 家族」是錯的，必須修正。** 此修正同時通過 r1／r2／r3 研究與 v1／v2 對抗驗證，信心水準 **high（refuted）**。

正確說法：

> **Anima Base v1.0 的擴散主幹是 NVIDIA Cosmos-Predict2-2B-Text2Image 衍生（kohya-ss 稱其為 MiniTrainDIT，Rectified Flow，3D RoPE，外加一個 LLMAdapter 橋接文字條件）。它只是「借用」Qwen-Image VAE 與 Qwen3-0.6B 文字編碼器這兩個外掛元件。DiT transformer 本身是 Cosmos 血統，不是 Qwen-Image 的 MMDiT。**

由 `base_txt2img_api.json` 直接驗證的元件載入方式（與架構修正完全一致）：

| 元件 | 節點 | 檔名 | 血統 |
|------|------|------|------|
| 擴散主幹 DiT | `UNETLoader`（節點 4） | `anima_baseV10.safetensors` | **Cosmos-Predict2-2B 衍生（非 Qwen-Image MMDiT）** |
| 文字編碼器 | `CLIPLoader`（節點 10，type=stable_diffusion） | `qwen_3_06b_base.safetensors` | Qwen3 0.6B（借用元件） |
| VAE | `VAELoader`（節點 11） | `qwen_image_vae.safetensors` | Qwen-Image VAE（借用元件） |

**為什麼這個區別是致命的（不是學術細節）：**

「共用 VAE／文字編碼器」會誘使人假設「Qwen-Image 的 LoRA／ControlNet 也能套」。**不能。** 那些工具是針對 Qwen-Image 的 20B MMDiT 主幹訓練的，hidden dims 對不上 Anima 的 2B Cosmos DiT，載入即維度不匹配（tensor-dim mismatch）。同理，**SDXL／SD1.5／Flux 工具一律不適用**（這點 brief 原本就對）。

**正確的相容家族 = Cosmos-Predict2 / Anima-native，而非 Qwen-Image。**

> 建議：把 `brief/canon-log.md`、各 art_config 的 `_comment`、以及 `base_txt2img_api.json` 的 `_comment` 中「Qwen-Image 家族」的措辭，改為「Cosmos-Predict2-2B DiT 主幹，外接 Qwen-Image VAE + Qwen3-0.6B 文字編碼器」。（此為文檔同步建議，本管線只盤點規劃，實際改檔留待後續。）

採樣設定（官方 model card，信心 high）：er_sde 為中性預設，30-50 steps，CFG **4-5**，解析度 512²-1536²。專案目前 cfg 3.5-4.5 略低於官方 4-5 下緣 — 非錯誤，但建議往 4-5 靠。本專案 832x1216 在範圍內。

---

## 2. 各方案逐項裁定（reference / control / inpaint / img2img / edit）

下表先給結論，後文逐項展開。**「節點名」欄若標 unconfirmed 即表示未經直接 Anima 實測，僅架構推論或社群實驗節點。**

| 方案 | 對本模型可用？ | ComfyUI 節點 / 工具 | 信心 |
|------|----------------|---------------------|------|
| 標準 latent img2img（denoise < 1.0） | **可用（原生）** | `LoadImage` → `VAEEncode` → `KSampler(denoise<1.0)` | high（機制通用） |
| 局部 inpaint（遮罩重繪） | **可用** | 標準 inpaint 條件節點 + 遮罩；或 Anima-LLLite 4-ch inpaint 權重 | high / medium |
| ControlNet-LLLite（Anima 移植版） | **可用（架構原生控制法）** | `Apply Anima ControlNet-LLLite`（`kohya-ss/ComfyUI-Anima-LLLite`，**experimental**） | high（存在）／medium（v1.0 權重品質） |
| InstantX Qwen-Image ControlNet-Union | **不可用** | （為 20B Qwen-Image MMDiT 而建，維度不符） | high（架構推論，未實測） |
| Qwen-Image-Edit / Edit-2511 | **不可用** | 獨立 20B checkpoint，無法驅動 Anima 2B DiT | high（架構推論，未實測） |
| IP-Adapter（Anima 版 reference 注入） | **框架存在，權重不確定** | `comfyui-anima-ipadapter`（circlestone-labs，**需自備 IP-Adapter checkpoint**） | medium（節點存在）／low（公開權重未確認） |
| 標準 IP-Adapter / FLUX Redux / reference-only | **不可用** | 屬其他主幹（SD/SDXL/Flux） | medium（not-found，可再查） |

### 2.1 img2img（denoise 區間）— 可用，原生

任何 latent-diffusion DiT 都支援 img2img：`LoadImage` → `VAEEncode` → `KSampler` 把 `denoise` 設 < 1.0。DiffSynth-Studio 的 Anima 文檔也直接暴露 `input_image` 與 `denoising_strength`。

**建議 denoise 區間（通用 latent-diffusion 經驗法則，非 Anima 官方規格，信心 medium，須實測微調）：**

- `~0.2-0.35`：輕推／清理，**身份幾乎不漂移** — 適合在已定稿立繪上做小修。
- `~0.35-0.5`：中度局部變化（表情、口罩態切換）。
- `> 0.6`：**身份開始漂移，不建議用於差分**。

這正是把 manifest 既定的「以遮罩局部重繪自基準立繪製作所有差分」（characters.json 已記）落實的技術手段。基準立繪 = `20260613051933_225bc2d9`（mask_off 全身，褲子版，頭身比基準）。

### 2.2 局部 inpaint — 可用

口罩區、嘴／眼表情區這類「只改一塊、其餘像素不動」的需求，用遮罩 + 低 denoise 做區域重繪，是身份最安全的差分方式：不是從頭重生，而是只動目標區。可走兩條路：

1. 標準 ComfyUI inpaint 條件節點 + 遮罩 + 低 denoise。
2. Anima-LLLite 4-ch inpaint 權重（`anima-lllite-inpainting-v2.safetensors`，白=重繪區）。kohya-ss 明確建議：**用 inpaint 權重時搭配 img2img+mask 以避免色偏（slight color shift）**。

### 2.3 ControlNet — 只有 Anima-LLLite 可用；它控結構，不控身份

**InstantX Qwen-Image ControlNet-Union（canny／softedge／depth／pose）：存在且 ComfyUI 原生，但為 20B Qwen-Image MMDiT 而建（其 block 由 20B transformer 複製而來），套到 2B Anima DiT 維度不符 → 不可用。** 信心 high，但屬架構推論，無任何來源直接實測 Anima + InstantX。**不要下載它指望驅動 Anima。**

**Qwen-Image-Edit / Edit-2511：存在且擅長指令式編輯與身份保持，但它是獨立的 20B checkpoint（用 Qwen2.5-VL 編碼器），是「自己一個模型」而非「base 的一個模式」，無法驅動 Anima 2B DiT → 不可用。** 信心 high（架構推論）。

> **二 checkpoint 陷阱：** Qwen-Image-Edit-2511 在「指令式改表情／口罩態」這件事上本來是最理想的工具，但它跑不在 Anima 上。所以差分管線只能二選一：(a) 全程留在 Anima 內（低 denoise img2img + Anima-LLLite inpaint）；或 (b) 接受「繞道 Qwen-Image-Edit 就等於放棄 Anima 的身份／LoRA」。兩者互斥。**本專案選 (a)。**

### 2.4 ControlNet-LLLite 是否適用本架構？ — **使用者點名問，明確回答：YES（對 Anima 而言）**

歷史上 LLLite 確實是 **SDXL-only**（kohya-ss/sd-scripts 的 `train_lllite_README.md` 原文：「Currently, only SDXL is supported」）。**但對 Anima 而言這個通則被推翻。** 信心 **high（refuted，經 v2 對抗驗證）**。

kohya-ss 已「專門」把 ControlNet-LLLite 移植到 Anima，有完整三件套：

- 訓練腳本：`anima_train_control_net_lllite.py`（+ 文檔 `docs/anima_train_control_net_lllite.md`）。
- 權重 repo：`kohya-ss/Anima-LLLite`（Hugging Face）。
- ComfyUI 節點：`kohya-ss/ComfyUI-Anima-LLLite`，節點名 **`Apply Anima ControlNet-LLLite`**（category：loaders）。

**結論：對 Anima 而言，LLLite 不是「不能用」，而是「架構原生的控制法」（與 SDXL-only 通則正好相反）。**

`Apply Anima ControlNet-LLLite` 節點輸入（信心 high）：

- `model`（Anima MODEL，來自 UNETLoader）
- `lllite_name`（取自 `ComfyUI/models/controlnet/` 的權重檔）
- `image`（控制圖，會自動縮放到 latent 的 8 倍）
- `strength`（FLOAT，預設 1.0）
- `start_percent` / `end_percent`（取樣作用區間）
- `preserve_wrapper`（BOOL，供串接）
- `mask`（選用；僅 4-ch inpaint 權重需要，白=重繪）

裝法：clone 到 `ComfyUI/custom_nodes/`，權重放 `ComfyUI/models/controlnet/`；節點 patch Anima DiT 後接 `KSampler`（在 `UNETLoader` 之後）。

**現有可用 v2 權重（針對 Anima-Base v1.0）：**

- `anima-lllite-inpainting-v2.safetensors` — 4-channel（RGB + 1-ch mask）inpaint。
- `anima-lllite-any-test-like-v2.safetensors` — 3-channel（HED/PiDiNet scribble + grayscale + lineart）。

**重要限制（信心 high）：**

- LLLite 在 Anima 上標為 **experimental，image-only（T=1）**。
- **目前沒有確認的高品質 v2 depth 或 OpenPose 權重給 v1.0。** legacy Preview3 的 lineart/depth/pose/fakescribble 權重在 v1.0 上明確品質較差。**乾淨的姿勢／深度控制很可能要自行用 `anima_train_control_net_lllite.py` 訓練。** 不要假設現成的姿勢 ControlNet 已存在。

### 2.5 ControlNet 適合控什麼、不適合控什麼

**適合（結構幾何）：**

- 鎖定全身站姿（standing pose）。
- 統一半身框構 / bustup crop（讓多張 bustup 同框）。
- 複製構圖 / 版面（composition layout）。
- 結構性 inpaint 遮罩（劃定重繪區）。

**不適合（身份）：**

- **臉 / 角色身份。** 一張 pose／canny／depth map 只約束幾何，不約束「這是誰」。同一張 pose map 可以被任何角色滿足。InstantX 自家對 Qwen ControlNet 的定位也是「structural control rather than identity preservation」（註：此句出自 Qwen ControlNet 一般定位，v2 驗證指出 InstantX README 並未逐字出現該句 — 結論不變，但措辭來源放寬，信心 high 的是原則本身）。

### 2.6 Reference / 身份轉移（IP-Adapter / Redux / reference-only）

- **標準 IP-Adapter / FLUX Redux / reference-only：不可用**（屬 SD/SDXL/Flux 主幹）。
- **Anima 專屬 IP-Adapter：框架存在，但權重不確定。** `comfyui-anima-ipadapter`（circlestone-labs，鏡像 `Wenaka2004/comfyui-anima-ipadapter`）會用 Qwen3-VL-Embedding-2B 抽 reference 圖嵌入，經 Perceiver Resampler 變 16 tokens，以 decoupled cross-attention 注入 Anima 的 28 層 cross-attention 做角色一致性生成。**但該 repo 只給整合「框架」，需使用者自備 IP-Adapter checkpoint（.safetensors）；公開可下載的預訓練 Anima IP-Adapter 權重未確認。** 信心：節點存在 medium，端到端可用性 low。

> 修正記錄：r3 原本宣稱「Anima 完全沒有 reference 注入工具」，已由 v2 對抗驗證部分推翻 — 框架已出現。但在「沒有確認可下載的訓練權重」之前，**實務上身份仍只能靠 LoRA + 固定 seed + 從定稿立繪低 denoise img2img**，不存在「丟一張 reference 就保身份」的捷徑。

---

## 3. 角色臉／身份穩定性的明確限制

**這是本文必須講清楚的硬限制：**

1. **ControlNet（含 Anima-LLLite）不可當成角色身份控制工具。** 它控姿勢／框構／構圖，不控「這張臉是不是星野灯」。**明說：不要用 ControlNet 去讓臉變成灯。**
2. **目前沒有確認可下載的 Anima reference/IP-Adapter 訓練權重。** 不能靠「丟一張參考圖」穩定複製臉。
3. 因此 **跨鏡頭的身份一致性，只能來自：LoRA（canonical stack）+ base prompt + 固定 seed + 從已定稿立繪做低 denoise img2img / 局部 inpaint。** 沒有 reference-image 捷徑。
4. 這也是為什麼 manifest 的做法是對的：所有差分都從同一張基準立繪（`225bc2d9`）局部重繪而來 — 這是在「無 reference 工具」前提下維持「保持像同一個人」（P0 規則）的唯一穩定路徑。

**附帶身份治理（來自 characters.json 的 avoid 清單）：** 即使日後自訓 LoRA，**trigger word 與 reference 絕不可用真實偶像的名字或臉**；avoid 清單禁止可辨識真實藝人臉孔與任何未成年／loli 呈現 — 這條約束在 LoRA 資料集策展與 trigger 命名時必須遵守。

---

## 4. 控制權責分工表（核心收尾）

> **一句話總綱：身份 = LoRA + 定稿立繪 + 低 denoise img2img/inpaint；結構 = Anima-LLLite；最終 approved = 人工/合成。ControlNet 不碰身份。**

| 控制層 | 由「誰」控 | 負責什麼（範圍） | 不負責 / 禁區 | ComfyUI 節點 / 手段 |
|--------|-----------|------------------|----------------|---------------------|
| **身份（identity）** | **LoRA**（canonical stack，待裁定：D 組 gpt-image-2@0.7 + dogma@0.4，或 art_styles.json 觸發詞還原版） | 臉、髮型髮色（黑長直齊瀏海）、眼色（青綠 teal）、偶像清秀氣質、藏起的疲憊感 | 不負責姿勢、不負責構圖、不負責口罩開合幾何 | `LoraLoader`（接在 UNETLoader / CLIPLoader 之後）；目前由 generation_service 依 art_styles.json 注入 |
| **服裝固定件 / 配色 / 口罩態語意** | **REF / base prompt**（visual_core + style positive_prefix） | 偽裝核心三件（深帽壓低 + 寬鬆連帽衣 + 白圍巾）、黑窄管褲、白氣/暖黃店光、冷白色調、口罩三態的「語意」（off/half/on 的文字描述） | 不負責「口罩在臉上的精確像素位置與摺線」（那是幾何/局部重繪） | `CLIPTextEncode`（節點 6 positive / 7 negative）；prompt 來自 characters.json + art_styles.json |
| **姿勢 / 半身框構 / 站姿 / 構圖 / 局部重繪** | **ControlNet(Anima-LLLite) / img2img / inpaint** | 全身站姿、bustup 統一框構、構圖版面；以及「口罩區」「表情區」的**局部結構重繪**（遮罩 + 低 denoise） | **絕不負責身份/臉是誰**；不負責服裝設計（那是 prompt/LoRA） | `Apply Anima ControlNet-LLLite`（experimental）；`VAEEncode`+`KSampler(denoise 0.2-0.5)`；inpaint 遮罩節點 |
| **白口罩 mask_half / 去背 / 接縫 / 最終收尾** | **手工修圖 / 圖層合成** | mask_half 白口罩疊白圍巾的辨識度（冷白化、contact shadow、補耳掛線、修接縫）；去背（白底→alpha）；最終 approved；未來 overlay 合成（base sprite + mask_half overlay PNG + alpha） | 不交給 AI 全自動完稿（manual_cleanup_policy 明訂） | 影像編輯軟體 / Photoshop / 合成；對應 manifest 的 `needs_manual_cleanup` 與 `approved` 層 |

**對照 manifest 的落點：**

- 身份層 → `style.loras`（manifest）/ `art_styles.json`。
- 服裝/口罩語意層 → characters.json `visual_core` / `outfit`。
- 姿勢/局部層 → 把 manifest `fix_ready_assets` 的「以遮罩局部重繪自基準立繪」具體化為 img2img/inpaint/LLLite。
- 手工層 → manifest `manual_cleanup_policy` + `asset_layers.approved` / `bustup_approved`（目前皆空，待人工填）。

---

## 5. 實際 ComfyUI 流程串接建議（2-3 條）

以下流程**不生成新角色設定**，只把既有 fix_ready/draft 推進為可修基底或補既定 sprite_plan 差分。全部維持「AI 出基底 → 人工清理 → approved」政策。

### 流程 A：口罩態差分（mask_off → mask_on / 過渡 mask_half 基底）— inpaint 局部換口罩

目標：在不漂移身份的前提下，從基準立繪 `225bc2d9`（mask_off）產出 mask_on / mask_half 的**可修基底**。

```
UNETLoader(anima_baseV10)
  └─ LoraLoader(canonical stack)            # 身份：LoRA
       └─ KSampler(denoise 0.35-0.5)        # 結構：局部變化
LoadImage(akari_full_mask_off_fix_v001.png) # REF：定稿立繪
  └─ VAEEncode(qwen_image_vae)              # → latent
LoadImageMask(口罩區遮罩)                    # 結構：只圈口罩/下半臉
CLIPTextEncode(positive: + "wearing mask / mask pulled to chin")  # 語意：口罩態
→ KSampler(inpaint, 遮罩內重繪) → VAEDecode → SaveImage(draft)
→ [人工] 清理/修邊 → approved
```

要點：denoise 壓在 0.35-0.5、遮罩只圈口罩與下半臉，臉的其餘像素不動 → 身份穩。輸出一律 draft。

### 流程 B：表情差分（Day1-7 情緒節拍）— 低 denoise img2img + 局部眼/嘴 inpaint

目標：從定稿 bustup（`akari_bustup_neutral_mask_off_fix_v001`，純裁切零漂移）產出 sprite_plan 所需的小範圍表情（neutral_guarded / troubled / annoyed / blush_avert / small_smile / soft_final）。

```
LoadImage(bustup 定稿) → VAEEncode
UNETLoader + LoraLoader(canonical stack)     # 身份
LoadImageMask(眼+嘴區)                        # 結構：只圈表情區
CLIPTextEncode(+ "small genuine smile, eyes slightly curved" 等)  # 語意：表情
→ KSampler(inpaint, denoise 0.35-0.5) → VAEDecode → SaveImage(draft)
→ [人工] 收尾 → bustup_approved
```

要點：表情範圍小（本作是內斂雙人小品，非大卡司），P0 表情上限 6；務必同一張臉局部改，不從頭重生。

### 流程 C：mask_half 的最終穩定產出 — AI 出基底 + 手工/overlay 合成（推薦長線做法）

目標：解決 manifest 標記的問題圖（白口罩疊白圍巾辨識度低）。**這是 inpaint/img2img 區域工作 + 手工合成，不是從頭重生，更不是 ControlNet 身份問題。**

```
方案 C1（即時手修）：
  流程 A 出 mask_half 基底(draft) → [人工] 口罩冷白化 / 加 contact shadow / 補耳掛線 / 修接縫 → approved

方案 C2（長線 overlay，manifest 已預留、本次不實作）：
  base sprite(mask_off, approved) 為底
  + 獨立 mask_half overlay PNG（口罩單獨一層，含 alpha）
  → alpha compositing 合成
  優點：口罩態切換不重生臉、零身份漂移、可重用於多表情
```

要點：mask_half 依政策**不要求 AI 全自動完稿**；AI 只出基底，辨識度由手工或 overlay 圖層穩定解決。

> 可選增強：若日後要「鎖站姿/框構一致」，可在流程 A/B 加 `Apply Anima ControlNet-LLLite`（any-test-like v2 的 lineart/scribble 控結構），strength 從 1.0 起、start/end_percent 控作用區間 — 但記住它控結構不控臉，且為 experimental、image-only。乾淨 pose/depth 控制目前無現成 v1.0 權重，需自訓。

---

## 6. 信心水準與須再查項（誠實標註）

| 主張 | 信心 | 備註 |
|------|------|------|
| 架構 = Cosmos-Predict2-2B 衍生（非 Qwen-Image 家族） | **high（refuted 原 brief）** | 官方 model card + kohya 文檔 + diffusion-pipe 都證實 |
| SDXL/SD1.5/Flux 工具不適用 | **high** | brief 原本即正確 |
| ControlNet-LLLite 對 Anima 適用（YES） | **high** | kohya 專門移植，三件套齊全 |
| InstantX Qwen ControlNet / Qwen-Image-Edit 不適用 | **high（架構推論，未實測）** | 無來源直接實測 Anima，維度不符屬推論 |
| img2img/inpaint 原生可用 | **high（機制）** / medium（denoise 區間） | denoise 數值為通用經驗法則，須實測 |
| Anima IP-Adapter 框架存在 | **medium** | 公開訓練權重未確認（low） |
| 無 reference 捷徑，身份靠 LoRA+seed+img2img | **high** | reference 工具狀態為 time-sensitive，可再查 |
| LLLite v2 無高品質 pose/depth for v1.0 | **high** | Preview3 pose/depth 在 v1.0 品質差，乾淨控制須自訓 |

**須再查（時效性）：** Anima IP-Adapter 公開權重是否釋出；LLLite v2 是否出 pose/depth for v1.0；ai-toolkit(#791)/OneTrainer(#1278) 的 Anima 支援是否合併。委派任何控制管線前重新核對 kohya-ss / Comfy-Org repos。

**授權提醒（若本作商業化）：** Anima 採 CircleStone Labs Non-Commercial License，且經 Cosmos 衍生而繼承 NVIDIA Open Model License，限制傳遞到其上訓練的 LoRA / IP-Adapter / control 權重。商業發行需聯絡 CircleStone Labs（tdrussell@circlestone.ai）。本專案前端為零 API key／零即時 AI（CLAUDE.md 安全底線），生成在離線管線完成，但模型授權仍須在商業化前釐清。
