# 交付物 3：Character LoRA Training Plan — 星野灯 / hoshino_akari

**專案：** 雨夜偵探社：第七封情書（視覺小說，星野灯線）
**底模：** anima_baseV10.safetensors（Anima Base v1.0）
**日期：** 2026-06-13
**狀態：** 規劃文件（不生成新圖；本管線是「盤點 -> 規劃 -> 執行整理」）
**承接：** `art_tool/art_review/asset_manifest.draft.json`、`art_tool/art_review/ASSET_CLEANUP_REPORT.md`、`art_tool/art_config/characters.json`、`art_tool/art_config/art_styles.json`

> 本文是技術/規劃文件，非劇情本文，專案 `CLAUDE.md` 的劇情標點/黑名單規則不適用；仍以繁體中文撰寫，技術名詞/prompt/節點名/檔名保留英文。
> 所有技術主張以本文附帶的 RESEARCH + VERIFICATION 為準。凡標 refuted/partly-wrong/uncertain 者，本文照修正後版本寫，並標明信心水準。

---

## 0. 架構前提（先讀，務必更新既有文件的錯誤標籤）

### 0.1 重要更正：本底模「不是」Qwen-Image 家族

專案 brief 與 manifest 草案把 anima_baseV10 標為「Qwen-Image 家族 2B DiT」。**這個結論被一手來源 refuted（信心：高）**，必須更正：

- **真正的擴散主幹是 NVIDIA Cosmos-Predict2-2B-Text2Image 的衍生模型**（CircleStone Labs x Comfy Org，2026-05-15 正式釋出）。官方 model card 明確寫 "Built on NVIDIA Cosmos"、"Derivative Model of Cosmos-Predict2-2B-Text2Image"，受 NVIDIA Open Model License 約束。kohya-ss sd-scripts 文件稱其骨幹為 `MiniTrainDIT`（Rectified Flow 訓練、3D RoPE、`LLMAdapter` 文字橋接）。
- **只有 VAE 與文字編碼器是 Qwen 系零件**：`qwen_image_vae.safetensors`（Qwen-Image VAE，16-channel latent，8x 下採樣）+ `qwen_3_06b_base.safetensors`（Qwen3-0.6B），透過一個 `LLMAdapter` 接到 T5 相容的 cross-attention 空間。
- **主線 Qwen-Image 是另一個無關模型**：Alibaba 的 ~20B MMDiT，用 Qwen2.5-VL 7B 編碼器。與本底模完全不同。

**為什麼這個區分是「致命」的（決定工具選擇）：**
共用 VAE/編碼器「不會」讓 Qwen-Image 的 LoRA / ControlNet / IP-Adapter 變得相容——那些針對的是 Qwen-Image 的 20B MMDiT 骨幹，本底模沒有那個骨幹。因此：

| 工具家族 | 可否用於 anima_baseV10 | 原因 |
|---|---|---|
| SDXL / SD1.5 kohya 流程（`sdxl_train_network.py`） | **否** | 雙 CLIP 編碼器 + 4-ch VAE + U-Net，張量形狀/通道數全不符 |
| 通用「Qwen-Image LoRA」trainer（ai-toolkit Qwen-Image preset、diffusion-pipe `qwen_image` type、musubi-tuner Qwen-Image） | **否** | 針對 Alibaba 20B + Qwen2.5-VL 7B，非本底模的 Qwen3-0.6B + LLMAdapter |
| Anima 原生路徑（kohya `anima_train_network.py` + `networks.lora_anima`） | **是（主方案）** | 第一方專屬腳本，正是為此架構新增 |

> **行動項（給後續同步 config 的人）：** 更新 `brief/canon-log.md`、`asset_manifest.draft.json` 內「Qwen-Image 家族」字樣，改為「Cosmos-Predict2-2B 衍生 DiT（MiniTrainDIT），借用 Qwen-Image VAE + Qwen3-0.6B 文字編碼器」。本交付物不直接改那些檔，只標示需更正。

### 0.2 確認無誤的事實（信心：高）

- 三檔載入方式與 `base_txt2img_api.json` 一致：UNETLoader 載 DiT、CLIPLoader（type=stable_diffusion）載 Qwen3-0.6B、VAELoader 載 Qwen-Image VAE。
- 官方取樣建議：er_sde（中性預設）、30-50 steps、CFG 4-5、解析度 512² ~ 1536²（~1MP 甜蜜點）。
- **專案目前 CFG 3.5-4.5 略低於官方 4-5 下緣**，非錯誤但建議推測試圖時往 4-5 靠。
- **授權：** Anima Base v1.0 採 CircleStone Labs Non-Commercial License，並因 Cosmos 衍生而連帶 NVIDIA Open Model License。**LoRA 衍生物同屬非商業**。若本視覺小說日後商業化，整套 D 組 LoRA + 本角色 LoRA 都受限，需聯絡 CircleStone Labs（tdrussell@circlestone.ai）取得商業授權。此為規劃前提，非本文可解決。

### 0.3 可用的 Anima LoRA 訓練方法與節點

**主方案（信心：高，confirmed）— kohya-ss/sd-scripts `anima_train_network.py`，透過 ComfyUI 節點驅動**

- 腳本：`anima_train_network.py`，network module = `networks.lora_anima`（sd-scripts/docs/anima_train_network.md）。
- 必要參數：`--pretrained_model_name_or_path`（Anima DiT .safetensors）、`--qwen3`（Qwen3-0.6B 編碼器）、`--vae`（Qwen-Image VAE）。可選 `--llm_adapter_path`（省略則從 DiT 內讀）、`--t5_tokenizer_path`（預設用內建 `configs/t5_old/`）。
- 預設 LoRA 注入 DiT block 的 self-attn / cross-attn / MLP，**排除** `_modulation` / `_norm` / `_embedder` / `final_layer`。
- 記憶體槓桿：`--cache_latents`、`--cache_text_encoder_outputs`、`--gradient_checkpointing`、`--blocks_to_swap`（28-block 最大 26 / 36-block 34 / 20-block 18）、`--unsloth_offload_checkpointing`。
- **LLM adapter LoRA 預設「關」**（要開才用 `--network_args train_llm_adapter=True`，並建議用更低 LR）。本角色訓練「不要」開，見第 6 節。
- 注意：若 loss 變 NaN，確認 PyTorch >= 2.5。
- **ComfyUI 可直接訓練**：用 "Anima LoRA Trainer for ComfyUI" 自訂節點（Civitai 2502969），它就是 kohya sd-scripts 的封裝（自動安裝 SD-Scripts Manager、12/16/24 GB VRAM presets、TOML 設定產生/預覽、一鍵 HF 下載）。資料夾遵循 sd-scripts 慣例：`<repeats>_<concept>` 內放圖 + 同名 `.txt` caption。**這是本專案的建議前端**，因為已在 Windows 跑 ComfyUI，且現成已有 `anima_baseV10` / `qwen_3_06b_base` / `qwen_image_vae` 三檔。

**備援方案 A（信心：高，confirmed，但 Linux/WSL2 取向）— diffusion-pipe**
- Anima 作者自己的參考路徑。diffusion-pipe 的 `supported_models.md` 有一個 first-class 的 `anima` model_type，實例化 `CosmosPredict2Pipeline`（不是 `QwenImagePipeline`），與通用 `qwen_image` type 是「不同 pipeline class」，非只是換 TOML。Windows 直跑不便，故列為備援。

**備援方案 B（信心：高，confirmed，純 CLI）— kohya sd-scripts 直接命令列**
- 若 ComfyUI 訓練節點所 pin 的 sd-scripts commit 太舊、缺新 flag，直接 clone upstream kohya-ss/sd-scripts 跑 `anima_train_network.py`。風險：需自行配環境（Python/PyTorch>=2.5/CUDA）。

**明確不可用 / 尚未支援（unconfirmed 或 open request，勿硬套）：**
- ai-toolkit：Anima 是 **open feature request #791**，未合併。其 Qwen-Image preset 針對 Alibaba 模型，**不可假設能載本底模**。（信心：高）
- OneTrainer：**open #1278 + WIP PR #1487**，卡在上游 diffusers 先實作 Anima。未出。（信心：中-高）
- SimpleTuner：**無來源確認**支援 Cosmos-2B + Qwen3-0.6B 堆疊。勿假設可用。（unconfirmed）

> 工具狀態於 2026-06 變動快。若偏好 OneTrainer/ai-toolkit UI，承接者請先回查 issue tracker 是否已合併，再決定。本文以「今日 confirmed」的 kohya `anima_train_network.py`（經 ComfyUI 節點）為主方案。

---

## 1. 訓練素材選擇（從現有 confirmed / fix_ready 挑）

### 1.1 身份基準：為什麼是 225bc2d9 系列

`20260613051933_225bc2d9`（mask_off 全身，褲子版）是**頭身比與身份基準**，理由：

1. 它是 mask 三態全身 fix 的「源頭」——`asset_manifest.draft.json` 三張全身 fix 都標 `outfit=disguise_hoodie_scarf`，且 manifest 與 characters.json 都明寫「所有差分以遮罩局部重繪自此圖製作」。換言之三態本就是同一張臉的局部差分，身份一致性已在素材層被刻意維持。
2. 它由 `d0d576e0` 腿部重繪而來，是**目前唯一完成到「褲子定案版 + 完整頭身比」**的全身立繪。早於它的版本（bae649ab / 38cad997）都是「改褲子前」，造型已過時。
3. 半身 fix（910x904）是從這張全身 fix **純 Lanczos 裁切**（crop_box x165 y18 455x452 -> 2x），`ai_refine=none`、`zero drift`。亦即半身與全身像素同源、零 AI 漂移，是「同一個人」最硬的保證。

### 1.2 建議納入訓練集的素材（從現有檔挑，不生成新圖）

| # | 來源檔（絕對路徑） | 角色態 | 用途 | 備註 |
|---|---|---|---|---|
| 1 | `public/assets/characters/hoshino_akari/fix_ready/akari_full_mask_off_fix_v001.png` | 全身 mask_off | 身份骨幹（正面、放鬆、露臉） | 源 225bc2d9，**身份基準**，必收 |
| 2 | `public/assets/characters/hoshino_akari/fix_ready/akari_full_mask_on_fix_v001.png` | 全身 mask_on | 口罩戴正態 | 源 89f0cdfc |
| 3 | `public/assets/characters/hoshino_akari/bustup_fix_ready/hq_tests/akari_bustup_neutral_mask_off_hq_FINAL_local.png` | 半身 mask_off（HQ 臉） | **臉部細節錨點**（目前最佳臉） | 提供高解析五官，補全身圖臉部偏小的細節 |

**全身 mask_half（`akari_full_mask_half_fix_v001.png`，源 f2418510）—— 條件納入：**
- 原圖是「白口罩疊白圍巾辨識度低」的問題圖（manifest 標 `needs_manual_cleanup`）。**未修版不可直接進訓練集**（見第 2 節）。
- 若要讓 LoRA 學到 mask_half 態，**先人工修過**（口罩冷白化 / contact shadow / 耳掛線 / 接縫）再納入；或乾脆不在 LoRA 學 mask_half，改由 overlay 合成處理（見第 6 節策略）。建議**後者**，因 mask_half 本就是 manifest 政策上「AI 出基底 -> 人工/合成」的態。

**半身 fix（裁切版）—— 預設「不」單獨納入：**
- `bustup_fix_ready/akari_bustup_neutral_mask_off_fix_v001.png` 等三張是全身 fix 的**純裁切**，與全身圖、與彼此都是近重複（near-duplicate）。把近重複塞進小資料集會**把 LoRA 偏向單一構圖**（見第 3、6 節）。
- 若 ComfyUI 訓練節點需要「不同 crop」當資料多樣性，可納入 mask_off / mask_on 兩張裁切，但**務必用 caption 標明 framing（bust shot / upper body）**，且**不要**把三張裁切全收（三張幾乎同框，只差口罩）。

### 1.3 素材清單小結

最小可用集（純現有素材、零新生成）：上表 1-3（全身 off、全身 on、HQ 臉）。
這只有 3 張，且幾乎同構圖——**不足以訓練穩健身份 LoRA**。第 3 節說明為何、以及在「不生成新圖」前提下的補救取捨。

---

## 2. 哪些圖「不能」進訓練集（含原因）

| 不可納入 | 位置 / 來源 | 原因 |
|---|---|---|
| 5 張舊「accepted」 | `metadata.json` 內標 accepted 的 5 筆 | 全已被取代：3x `character_rough`（舊 soft_romance smoke-test，非定稿灯）、`bae649ab`（key visual，改褲子前）、`38cad997`（standee，改褲子前，被 225bc2d9 取代）。造型過時，學進去會污染身份 |
| 3x character_rough | `art_tool/art_archive/unconfirmed_adopted/character_rough_*` | 舊 soft_romance smoke-test，**根本不是定稿星野灯**（不同臉/造型）。混入會直接破壞身份一致性 |
| bae649ab / 38cad997 | `art_tool/art_archive/unconfirmed_adopted/` | 改褲子前冬裝版，已被 225bc2d9 取代。造型不一致 |
| 漂移圖 / 失敗圖 | `public/assets/generated/` 內約 167 張 candidate | 雙眼異常、錯位、口罩消失、壞手等草案池失敗圖。AI 漂移 = 同一資料集內混入「不同的人」，是小資料集身份崩壞主因 |
| 未修的 mask_half | `akari_full_mask_half_fix_v001.png` / `akari_bustup_neutral_mask_half_fix_v001.png` 原狀 | 白口罩疊白圍巾辨識度低；未修就學，LoRA 會學到「口罩=一片白糊」的壞特徵。要納入須先人工修（見第 1.2） |
| HQ tests 中間實驗檔 | `bustup_fix_ready/hq_tests/_cmp_*`、`_seed*`、`master_candidates/master_d0*` 等 | 比較網格、denoise 掃描、seed group、master 候選掃描等中間產物，非定稿臉。除了明確標 `_FINAL_local` 的那張，其餘**不進訓練集** |
| 既有 5 種 art_styles 的測試圖 | `cool_reflective`、`airy_editorial` 等舊風格產出 | 非 D 組 canonical 風格；風格不一致會讓 LoRA 同時學進雜風格 |

**核心原則：** 小資料集裡，「一張錯的圖」比「少一張對的圖」傷害大得多。身份 LoRA 寧缺勿濫。

---

## 3. 素材數量與多樣性建議

### 3.1 目標與失敗模式

- 目標：**只固定身份**，不過擬合單一構圖、不把帽子/口罩學死。
- 社群引用的角色 LoRA 張數：sw0ad「15-50 張」、HEADGEAR88「30-50，視概念數可到 500+」。
- **已記錄的失敗案例（HF discussion #119）：** 46 張（16 張臉 + 30 張跨 45/75/90 度側面 + 全身）**仍只能重現正面身份**，診斷主因是 **LR 太低**，次因是資料缺多樣性。結論：**足夠多樣性 + 正確 LR 兩者都要**，缺一就「只有正面 work」。

### 3.2 本專案目前素材的風險（誠實評估）

- 真正零漂移、定稿、可用的全身只有 **mask_off / mask_on 兩態**（mask_half 是問題圖）。
- 半身全是全身的純裁切（近重複）。HQ FINAL 是同一張臉的高清版。
- 亦即「實質不同的影像資訊」≈ **2 個構圖（正面全身 off / 正面全身 on）+ 1 張高清臉**。
- **這對身份 LoRA 是高度同構（near-mono-pose）資料集**，直接訓練極可能落入「只有正面 work、換姿勢就走樣」的 #119 失敗模式。

### 3.3 在「不生成新圖」前提下的取捨

本管線規定「不規劃生成新圖；AI 只負責可修基底」。因此這裡**不開生成任務**，而是給「素材就緒度」的條件判斷，交由使用者裁定：

- **選項 A（建議，與管線一致）— 暫不訓練 LoRA，先用既有差分管線。**
  身份一致性目前已由「canonical 基準立繪 + 遮罩局部重繪 + 低 denoise img2img + overlay」維持（見第 6 節）。在素材多樣性補足前，LoRA 投資報酬率低，且容易過擬合。**先做完 P0 的 8 張立繪/6 表情，再評估是否真需要 LoRA。**
- **選項 B — 若決定訓練，先補多樣性（需另開生成/盤點任務，非本文範圍）。**
  目標 **18-25 張精選**（非 10 張），刻意鋪滿：
  - 表情：neutral/guarded、troubled/anxious、annoyed（嘴硬）、blush+avert、small genuine smile、soft final/quiet（對應 Day1-7 節拍，範圍本就小）。
  - 口罩三態：mask_off / mask_half / mask_on。
  - 裁切：full body / bustup / face close-up 各若干。
  - 角度：正面 + 幾個 3/4 側面（補 #119 教訓）。
  - 背景：plain / 變化背景皆可，但**避免同一背景重複**。
  - **不要近重複幀**（同框只差口罩那種，最多留一張代表）。
  - 這些「補多樣性」的圖要從 canonical 基準以 img2img/inpaint 衍生（保身份），由人工挑選確認是「同一個人」後才入訓練集——仍符合「AI 出基底、人工確認」的政策。

> 結論：**本交付物建議走選項 A**（與管線「盤點/規劃/整理、不生成」一致），並把選項 B 列為「若使用者明確要 LoRA」時的素材前置條件。下面第 4-7 節按「真要訓練時」給完整方案。

### 3.4 曝光次數（exposure）與 epoch

- repeats x images x epochs = 總曝光。社群常見「~16 epochs 開始 memorize」（HF #106，confirmed）。
- **更正（verification）：** 流傳的「~600-720 曝光甜蜜點 / 908=過擬合」數字**在被引來源 #106 找不到**，標為 **uncertain**。**不要把它當硬目標。**
- 可靠的停損訊號是**「~16 epochs 上限 / 觀察樣本是否開始記憶」**，而非精確曝光數。用 repeats 把小資料集的每張曝光拉到合理量，但以「看樣本是否燒臉/只正面」為準動態調整。

---

## 4. 標註與 caption 方案

### 4.1 Anima 的 caption 取捨（信心：高，confirmed）

- model card 確認：**支援 danbooru tags、自然語言 caption、或兩者混用**（因編碼器是 LLM = Qwen3）。tag 用小寫、空格不用底線；自然語言 caption 建議 >= 2 句描述；可任意混合。
- sd-scripts 支援 tags-only / NL-only（`_nl.txt` 後綴）/ 百分比混合模式。
- **本角色建議：混合**——短自然語言句（2 句，描述姿勢/表情/口罩態/取景）+ 少量 danbooru tag（如 `1girl, solo, full body`）。

### 4.2 要「固定」什麼、要「變動」什麼（避免把帽子/口罩學死）

核心原則（standard LoRA practice + neme-anima 慣例）：**不要在 caption 描述身份的不變特徵；只描述會變動的東西，讓 trigger 吸收身份。**

| 處理 | 內容 | 理由 |
|---|---|---|
| **不寫進 caption（讓它塌進 trigger）** | 長黑直髮、齊瀏海、青綠眼、偽裝核心（鴨舌帽 + 口罩 + 寬鬆連帽衣 + 白圍巾 + 黑窄管褲） | 這些是 must_keep 的「不變身份」。寫進 caption 會讓模型把它們綁到那些 tag 而非 trigger；不寫則模型把「未解釋的常見元素」推進 LoRA（= 推進 trigger） |
| **務必寫進 caption（要能變動）** | 姿勢（standing / sitting / walking / side profile）、表情（neutral guarded / troubled / annoyed / blush / small smile / soft quiet）、**口罩態（mask off / mask pulled down to chin / mask on）**、取景（full body / upper body / face close-up）、背景 | 這些是要在推論時自由控制的軸。caption 明寫 -> 推論時換詞即可改，不會被學死 |

> **關鍵：口罩/帽子一定要當「可變描述」寫進 caption。** 若把「baseball cap, mask」當不變身份不寫，LoRA 會把「永遠戴帽戴口罩」綁進 trigger，導致無法生出 mask_off 或脫帽。反之，描述口罩態（off/half/on）使其成為可控變數。這正是 must_keep（核心偽裝）與「不過擬合單一口罩態」之間的平衡點：**偽裝造型的「件數」可固定塌進 trigger，但「口罩的狀態」必須當變數 caption 出來。**

### 4.3 core-tag pruning（信心：中，社群工具預設值，非官方規格）

- neme-anima 等工具用 WD14 自動 tag + NL，並做 core-tag pruning：**丟掉在該角色 >X%（預設 35%）frame 出現的 tag**，逼模型把這些常數特徵推進 LoRA 而非綁 tag。
- **>35% 是工具預設，不是 Anima 官方規格**（verification 標註）。原則可採，閾值自行調。
- 實作上：自動 tag 後，**手動刪掉**所有「長黑直髮/青綠眼/帽/口罩/連帽衣/圍巾/窄管褲」類 tag，只留變動描述。

### 4.4 caption 範本（每張圖一個 `.txt`）

```
# 範例：全身 mask_off 正面（akari_full_mask_off_fix_v001）
hoshino_akari, 1girl, solo, full body, standing front, plain background.
She has a quiet guarded expression, looking slightly to the side, relaxed.
```
```
# 範例：全身 mask_on（akari_full_mask_on_fix_v001）
hoshino_akari, 1girl, solo, full body, standing front, plain background.
Wearing the face mask pulled up over nose and mouth, wary alert mood.
```
```
# 範例：HQ 半身臉（akari_bustup_neutral_mask_off_hq_FINAL_local）
hoshino_akari, 1girl, solo, upper body, face close-up, plain background.
Neutral calm expression, soft facial shading, eyes slightly relaxed.
```
> 注意三範例都「沒寫」黑髮/青綠眼/帽/連帽衣——它們塌進 `hoshino_akari` trigger。只有「口罩態、表情、取景、姿勢」被明寫。

---

## 5. 觸發詞設計

### 5.1 角色 trigger（信心：中，社群慣例，無 Anima 官方強制語法）

- 用一個**罕見、唯一**的 token 綁角色，搭配第 4 節的 core-tag pruning，讓身份特徵塌到該 token。
- **建議：`hoshino_akari`**（與 `character_id` 一致，跨 config/manifest/檔名統一，降低混淆）。
- 不另造 `akari_idol` 之類別名，避免訓練/推論 token 不一致；如要短別名，二選一固定用，不要兩個都餵。
- **安全約束（avoid list）：** trigger 與參考圖**絕不可**用任何真實偶像的名字或臉。Akari 的 avoid 明禁「可辨識真實藝人臉孔」與未成年/loli。trigger 命名用虛構角色 ID（`hoshino_akari`）即可，資料集策展也要守此底線。

### 5.2 與既有風格觸發詞的相容性

- D 組 canonical 風格 = gpt-image-2 @0.7 + dogma @0.4，**不含 NSS**。
- 既有 `art_styles.json` 的 `anima_airbrush_editorial` 仍是觸發詞還原版（gpt 0.75 + NSS 0.70 + dogma 0.60 + (kishida mel:0.5) + 觸發詞 `@gpt-image-2` / `@sw33t`）——**尚未同步成 D 組**（manifest 已記此不一致，待使用者裁定，本文不改 config）。
- **相容性結論：** 角色 trigger `hoshino_akari` 與風格觸發詞 `@gpt-image-2` / `@sw33t` **不衝突**，因為：
  - `hoshino_akari` 是「角色 LoRA」自己的觸發詞（控制「是誰」）。
  - `@gpt-image-2` / `@sw33t` 是「風格 LoRA」的觸發詞（控制「畫風」）。
  - 兩者作用在不同 LoRA、不同語意軸；推論 prompt 同時放沒問題。
- **建議推論寫法（角色 LoRA 訓成後）：**
  `@gpt-image-2, @sw33t, hoshino_akari, 1girl, solo, <pose>, <expression>, <mask state>, ...`
  並在 ComfyUI 同時掛：角色 LoRA + D 組風格 LoRA（gpt @0.7 + dogma @0.4）。
- **注意：** 訓練角色 LoRA 時的資料集若已是 D 組風格產出，角色 LoRA 會夾帶部分風格。建議訓練資料**盡量風格中性或就用 D 組一致風格**，並在訓練 caption **不寫**風格觸發詞（讓風格交給風格 LoRA，角色 LoRA 專心學身份）。若日後想換風格，角色 LoRA 才不會把舊風格學死。

---

## 6. 訓練目標：優先固定身份，不過度學單一構圖/單一口罩態

### 6.1 結構（pose/構圖/口罩態）vs 身份（誰）的分工（信心：高）

這是本架構最重要的觀念，直接決定「不要把構圖/口罩學死」怎麼做到：

- **身份（是不是星野灯：臉/髮色/眼色/偶像氣質/偽裝外觀）只能靠：**
  LoRA(角色) + 底模 + 固定 seed + prompt token + 從 canonical 基準做**低 denoise img2img**。
  **本架構沒有 IP-Adapter / Redux / reference-only 的現成「可下載權重」**（見 6.4），身份沒有 reference-image 捷徑。
- **結構（pose/取景/口罩位置/構圖）靠：**
  Anima-LLLite（kohya 把 ControlNet-LLLite 移植到 Anima 的原生控制法）做 pose/lineart/scribble/depth 約束；或低 denoise img2img / 局部 inpaint。
- **ControlNet/LLLite 控制「結構」，不控制「身份」**：同一張 pose map 可被任何角色滿足。所以**身份永遠來自 LoRA/base/seed**，結構交給 LLLite。

### 6.2 避免過擬合單一構圖/口罩的策略

1. **資料多樣性**（第 3 節）：18-25 張鋪滿表情/口罩三態/裁切/角度，避免近重複幀。**這是首要防線**——#119 證明缺多樣性 + 低 LR = 只有正面 work。
2. **caption 策略**（第 4 節）：把姿勢/口罩態/取景/表情都當「變動描述」明寫，讓它們成為可控變數而非塌進 trigger 的常數。**口罩態尤其要 caption 成 off/half/on 三值**，否則 LoRA 把單一口罩態學死。
3. **regularization（正則）取捨：**
   - 經典 SDXL/SD1.5 的 class-image regularization 對小角色集**未必必要**，且 Anima 無現成 reg set。
   - **本文不建議**為了正則去硬湊一批 class 圖（成本高、易引入雜風格）。改用上面 1+2（資料多樣性 + caption）+ 控制 epoch（~16 上限）+ 看樣本停損，達到不過擬合。
   - 若仍過擬合（換 pose 走樣），優先**加多樣性**與**微調 LR**，而非加正則。
4. **mask_half 不靠 LoRA 學死：** mask_half 本就是 manifest 政策上「AI 出基底 -> 人工修 / overlay 合成（base sprite + mask_half overlay PNG + alpha）」的態。**建議讓 LoRA 只穩 mask_off / mask_on**，mask_half 用 overlay 或局部 inpaint 處理（白口罩疊白圍巾問題本就是 inpaint/合成工作，不是從頭重生、也不是 ControlNet 身份問題）。

### 6.3 超參數（信心：高，但多為社群共識非官方規格；務必連帶 batch/accum）

| 參數 | 建議值 | 來源與信心 |
|---|---|---|
| network module | `networks.lora_anima` | 官方 confirmed |
| network_dim / rank | **32**（社群共識，「dim 32 對 Anima 必要，不像 SDXL 用 16」HF #106） | partly-wrong 更正：**kohya 官方「範例」是 dim=8**，dim 32 是社群建議，**勿稱 32 為官方設定** |
| network_alpha | 16 ~ 32（alpha 1-to-dim）；kohya 文件把 LR=1e-4 錨在 alpha=1.0 | alpha 與 LR 耦合，改 alpha 要重縮 LR（missing consideration） |
| learning_rate | **起手 ~1e-4（社群中點）；range 2e-5 ~ 1.22e-4** | partly-wrong 更正：**1.22e-4 是綁 batch_size=1/accum=1 的值**，不是通用上限；accum=2 時降到 ~5e-5。官方 model card 起點是「rank-32 用 2e-5」。**任何 LR 必須連帶寫 batch size + gradient accumulation** |
| 訓練範圍 | `--network_train_unet_only`（只訓 DiT） | 官方 confirmed；**不要**訓 LLM adapter（adapter 易退化、會加重遺忘） |
| train_llm_adapter | **off**（預設關，保持關） | 官方 confirmed |
| optimizer | AdamW8bit 或 Prodigy（ComfyUI 節點可選） | 社群 |
| mixed_precision | bf16 | 社群 |
| epochs | **~16 上限**，看樣本停損（開始 memorize 就停） | HF #106 confirmed |
| 記憶體 | `--cache_latents --cache_text_encoder_outputs --gradient_checkpointing`；不夠再 `--blocks_to_swap` | 官方 confirmed |
| VRAM | 6GB floor / 12GB comfortable / 24GB ample（2B 模型很輕） | confirmed。**勿套主線 Qwen-Image 的 24-42GB 數字（那是 7B 編碼器模型）** |

**調參啟發式：**
- 臉「燒掉/過曝感」(burned) = LR 太高 -> 降 LR。
- 「只有正面 work、換 pose 走樣」 = LR 太低 **或** 資料太同構 -> 升 LR 或補多樣性（#119）。
- LR 數字**永遠連帶寫 batch/accum**，否則 burned/only-frontal 的調整建議無法用。

### 6.4 身份一致性的天花板（誠實揭露，含一處 verification 更正）

- r3 原稱「Anima 完全無 IP-Adapter」。**verification partly-refuted（信心：中）：** 確實**存在**一個 `comfyui-anima-ipadapter` 自訂節點（CircleStone Labs，Qwen3-VL embedding + Perceiver Resampler -> 注入 Anima 28 層 cross-attn）。**但：該 repo 只提供整合框架，需使用者自備 IP-Adapter checkpoint；無法確認有公開的預訓練 Anima IP-Adapter 權重。**
- 因此實務結論：在確認有可下載權重前，**身份一致性仍靠 LoRA + 固定 seed + 從 canonical 基準的低 denoise img2img/inpaint**，沒有 reference-image 捷徑。承接者若要走 IP-Adapter，先回查權重是否已公開。

---

## 7. 輸出測試 prompt 與驗收方法

### 7.1 一致性驗收清單（換 pose/口罩/表情仍是同一人？）

訓練完成後，固定其他變因、逐軸測試：

- [ ] **同 seed 換 pose**：standing front / 3/4 side / sitting -> 臉/髮色/眼色/偶像氣質是否一致？
- [ ] **同 seed 換口罩態**：mask off / mask pulled down to chin / mask on -> 換口罩時臉的下半部與耳掛是否合理？mask_off 露的素顏是否同一張臉？
- [ ] **同 seed 換表情**：neutral guarded / troubled / annoyed / blush avert / small genuine smile / soft quiet -> 換表情時是否仍像同一人（不變臉型）？
- [ ] **換 seed 測穩定**：3-5 個不同 seed -> 身份是否跨 seed 穩定（不是只在一個 lucky seed work）？
- [ ] **脫帽測試**：prompt 不寫 cap/hoodie -> 能否生出脫帽/換裝的同一張臉（驗證沒把偽裝學死）？若不能，表示帽/口罩被學死，需檢討 caption。
- [ ] **must_keep 檢查**：成年 20 歲（無未成年/loli 感）、偶像氣質帶藏起的疲憊、青綠眼、黑長直髮齊瀏海。
- [ ] **avoid 檢查**：無 nsfw、無未成年/loli/teen、不像可辨識真實藝人、無壞手、不過度妖豔。
- [ ] **風格相容**：同掛角色 LoRA + D 組（gpt @0.7 + dogma @0.4）+ `@gpt-image-2`/`@sw33t`，畫風是否仍是 D 組空氣感插畫，未被角色 LoRA 夾帶的舊風格污染？
- [ ] **與 canonical 基準比對**：與 225bc2d9 系列並排，頭身比/臉是否一致？

### 7.2 測試 prompt（5 個；採官方取樣：er_sde/simple、cfg 4-5、30-50 steps、832x1216 或 ~1MP）

> 同一組固定 seed（如 12345 / 7777，已是現有 master 掃描用過的 seed），逐 prompt 比對。掛載：角色 LoRA + gpt-image-2_anima-base1_v1 @0.7 + dogma_animaV1.6 @0.4。

**T1 — 基準正面 mask_off（對齊身份基準）**
```
@gpt-image-2, @sw33t, hoshino_akari, 1girl, solo, full body, standing front, plain background,
quiet guarded expression, relaxed, oversized hoodie, baseball cap, mask off, masterpiece, best quality
```
驗收：應接近 225bc2d9 的臉/頭身比。

**T2 — 換口罩態（mask on，警戒）**
```
@gpt-image-2, @sw33t, hoshino_akari, 1girl, solo, upper body, face mask pulled up over nose and mouth,
wary alert eyes, plain background, masterpiece, best quality
```
驗收：與 T1 同一人；露出的雙眼一致。

**T3 — 換表情（small genuine smile，Day1/2 真笑節拍）**
```
@gpt-image-2, @sw33t, hoshino_akari, 1girl, solo, upper body, mask pulled down to chin, small genuine smile,
eyes slightly curved, soft expression, warm shop light, masterpiece, best quality
```
驗收：笑時仍同臉型；眼睛微彎（放鬆癖）。

**T4 — 換 pose/角度（3/4 側面，並肩走 Day6 節拍）**
```
@gpt-image-2, @sw33t, hoshino_akari, 1girl, solo, three-quarter view, walking, looking aside,
quiet bittersweet mood, winter scarf, faint visible breath, plain background, masterpiece, best quality
```
驗收：側面是否仍同一人（最易暴露過擬合正面）。

**T5 — 脫帽/換裝壓力測試（驗證沒把偽裝學死）**
```
@gpt-image-2, @sw33t, hoshino_akari, 1girl, solo, upper body, no cap, casual clothes, neutral calm expression,
plain background, masterpiece, best quality
```
驗收：能否生出脫帽、換便服的同一張臉。若 LoRA 強行加帽/口罩/連帽衣，代表偽裝被學死，需回第 4 節修 caption。

### 7.3 驗收門檻（建議）

- T1-T4 **至少跨 3 個 seed** 身份一致才算過。
- T5 能脫帽換裝且仍同臉 = caption 策略成功（身份與偽裝解耦）。
- 任何一張出現 burned 臉 / only-frontal-work / 未成年感 / 壞手 = 不通過，依 6.3 啟發式回調（多為 LR 或多樣性）。

---

## 8. 與既有素材政策/manifest 的銜接（承接，不矛盾）

- **AI 一律 draft，人工清理後才 approved**（manifest `manual_cleanup_policy`）。本 LoRA 計畫不改此政策：**LoRA 是「產 draft 基底」的工具**，產出仍走「AI draft -> 人工清理 -> approved」。
- **P0 上限不變**：立繪<=8、表情<=6、衣裝<=2、姿勢<=2、CG<=4、背景<=5。LoRA 不是用來爆量出圖，是用來讓 P0 那批「像同一個人」更穩。
- **mask_half 仍是「AI 出基底 -> 人工/overlay」**：LoRA 只穩 mask_off/mask_on，mask_half 不靠 LoRA 完稿（第 6.2.4）。
- **LoRA 不一致待裁定**：D 組（gpt 0.7 + dogma 0.4，無 NSS）vs `art_styles.json` 現值（含 NSS + kishida mel + 觸發詞）尚未同步。**訓練角色 LoRA 前建議先裁定風格 config**，否則測試 prompt 的風格基準會浮動。本文不改 config，只標示需先決。
- **建議排序：** 先把 P0 用「canonical 基準 + 局部重繪 + img2img + overlay」做出來（選項 A）；待素材多樣性補足且確有跨 pose 需求，再評估訓練角色 LoRA（選項 B）。

---

## 9. 信心水準總表

| 主張 | 信心 | 依據 |
|---|---|---|
| 底模是 Cosmos-Predict2-2B 衍生（非 Qwen-Image 家族、非 SDXL/SD1.5/Flux） | 高（refuted 原 brief） | HF model card、kohya docs、diffusion-pipe |
| 主訓練路徑 = kohya `anima_train_network.py` + `networks.lora_anima`，可經 ComfyUI 節點 | 高（confirmed） | sd-scripts docs、Civitai 2502969 |
| SDXL kohya 腳本不可用 | 高（confirmed） | 編碼器/VAE/骨幹全不符 |
| ai-toolkit / OneTrainer 尚未支援 Anima | 高 / 中-高（open issue） | #791 / #1278 |
| caption：danbooru+NL 混用、不寫不變身份只寫變動 | 高（原則）/ 中（35% pruning 閾值為工具預設） | model card / neme-anima |
| dim 32 是社群建議（官方範例是 dim 8） | partly-wrong 更正 | kohya docs vs HF #106 |
| LR ~1e-4 中點、1.22e-4 綁 bs1/accum1、官方起點 2e-5 | partly-wrong 更正 | HF #119 / model card |
| ~600-720 曝光甜蜜點 | uncertain（來源查無，勿當硬目標） | HF #106 查無 |
| ~16 epochs 開始 memorize（停損訊號） | 高（confirmed） | HF #106 |
| 身份靠 LoRA+seed+低 denoise img2img；結構靠 Anima-LLLite | 高（confirmed） | kohya/InstantX docs |
| Anima IP-Adapter 節點存在但無確認公開權重 | 中（partly-refuted r3） | comfyui-anima-ipadapter |
| 授權：非商業，商業化需另洽 | 高（confirmed） | CircleStone NCL + NVIDIA OML |
