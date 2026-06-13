# 交付物 2：Sprite Plan — 星野灯 / hoshino_akari

**專案：** 雨夜偵探社：第七封情書（視覺小說，星野灯線）
**角色：** 星野灯 / hoshino_akari（20 歲日本國民偶像，私下偽裝成普通人）
**日期：** 2026-06-13
**範圍：** 盤點 → 規劃 → 執行整理。**本文件不規劃生成新圖**；AI 只負責「可修基底」，最終 approved 由人工清理／overlay 合成穩定產出。
**前置文件：** 本文承接（不矛盾）以下既有檔案：
- `art_tool/art_review/asset_manifest.draft.json`（既有 manifest 草案，將被最終版取代）
- `art_tool/art_review/ASSET_CLEANUP_REPORT.md`（整理報告 2026-06-13）
- `art_tool/art_config/characters.json`（角色視覺設定）
- `art_tool/art_config/art_styles.json`（畫風設定）

---

## 0. 重要前提與信心水準（技術事實基準）

下列技術主張以本任務隨附的 RESEARCH + VERIFICATION 為準。凡 verification 標為 refuted / partly-wrong / uncertain 者，本文照修正後版本撰寫並標明信心水準。

### 0.1 模型架構更正（高信心，已被 verification refuted 原 brief 說法）

- **原 brief 結論「架構屬於 Qwen-Image 家族」= 錯誤（refuted）。** 官方 HF model card 明載：Anima Base v1.0 是 **NVIDIA Cosmos-Predict2-2B-Text2Image 的衍生模型（Derivative Model）**，kohya-ss 文件稱其骨幹為 **MiniTrainDIT**（Rectified Flow 訓練、3D RoPE、LLMAdapter 橋接）。
- Anima **只借用** Qwen-Image 的 VAE（`qwen_image_vae`，16-channel latent）與 Qwen3-0.6B 文字編碼器（`qwen_3_06b_base`）作為外掛元件；**擴散骨幹是 Cosmos 血統，不是 Qwen-Image 的 MMDiT。**
- 正確表述應為：**「Cosmos-Predict2-2B DiT 骨幹 + Qwen-Image VAE + Qwen3-0.6B 文字編碼器」**。
- **絕非 SDXL、非 SD1.5、非 Flux**（此部分 brief 原本就對）。
- **此更正對工具選擇是決定性的：** 不可宣稱「SDXL 流程可直接套用」，也不可假設「Qwen-Image 工具可直接套用」——共用 VAE／TE 不代表 DiT 層的 LoRA／ControlNet／IP-Adapter 能轉移。

### 0.2 取樣設定（高信心，confirmed）

- 官方建議：sampler `er_sde`（中性預設）、steps 30-50、**cfg 4-5**、解析度 512² - 1536²（約 1MP 為甜蜜點）。
- 本專案目前預設 cfg 3.5-4.5、er_sde / simple、832x1216 —— **cfg 略低於官方 4-5 下緣**，這是小幅偏差不是錯誤，建議未來向 4-5 靠攏（信心：高）。

### 0.3 識別一致性（identity）的唯一可靠手段（中-高信心）

對本管線最關鍵的一句話：**Anima 上「角色長相一致」只能靠 LoRA + 底模 + 固定 seed/prompt + 從已定稿基準圖做低 denoise img2img / 局部 inpaint 取得。**

- **無可直接套用的 reference adapter（有條件）：** verification 指出 IP-Adapter 不再是「完全不存在」——已出現 `comfyui-anima-ipadapter` 節點（Qwen3-VL embedding + Perceiver Resampler 注入 Anima 28 層 cross-attention）。**但**該 repo 只給整合框架，**未確認有公開可下載的預訓練權重**，端到端可用性未證實。**結論：在確認權重可下載前，identity 仍只靠 LoRA + 基準圖低 denoise img2img/inpaint，不要把 IP-Adapter 當成既有捷徑。**（信心：中）
- **ControlNet 控的是「結構」不是「長相」（高信心）。** 一張 pose/depth/lineart 圖只約束幾何，不決定臉是不是灯。Anima 的架構原生控制法是 **Anima-LLLite**（kohya-ss 專門移植，非一般 SDXL-only 的 LLLite；ComfyUI 節點 `ComfyUI-Anima-LLLite`，標示 experimental、image-only）。本管線**現階段不需要**訓練 LLLite，因為我們是「同一張臉換口罩/表情局部重繪 or overlay」，不是從零擺姿。
- **Qwen-Image-ControlNet-Union（InstantX）與 Qwen-Image-Edit 都跑不動 Anima**（架構推論，高信心；無實測）。它們是針對 Qwen-Image 20B MMDiT，不是 Anima 的 2B Cosmos DiT。**不要下載它們期望驅動 Anima。** 特別注意：Qwen-Image-Edit-2511 雖然是做「換口罩/表情差分」的理想指令編輯工具，但**它無法在 Anima 上運行**——若硬要用它，就等於離開 Anima 的 LoRA/identity，兩條路互斥。

> 信心標記說明：本節技術主張中，架構更正與「ControlNet 控結構不控長相」為**高信心**（官方 model card + kohya 文件 + verification confirmed）；IP-Adapter 可用性、img2img denoise 數值帶為**中信心**（一般 latent-diffusion 通則或時效性「未找到/剛找到」結果，非 Anima 官方規格）。

### 0.4 識別差分的執行原則（identity-safe，本管線核心）

凡是「必須保持是同一個人」的差分（mask_off → mask_half / mask_on、小幅表情變化）：

- **不要從零重生（regenerate）。**
- 做法 A（推薦）：對已定稿基準圖做**低 denoise img2img**（denoise 約 0.2-0.45，數值為通則非 Anima 規格，需實測）。
- 做法 B（推薦）：只對改變區域做**局部 inpaint**（口罩/嘴/眼），其餘像素不動。
- 做法 C（mask_half 專用，最穩）：**overlay 合成**——base sprite（mask_off）+ mask_half overlay PNG + alpha 合成，幾乎零 AI 漂移。
- denoise > 0.6 開始漂移 identity，避免。

---

## 1. Canonical 設定承接（與既有檔案一致）

| 項目 | 內容 | 狀態 |
|------|------|------|
| 年齡/身分 | 20 歲成年國民偶像；公開耀眼完美，私下偽裝普通人 | 凍結 canon A001/A030 |
| 頭髮 | `long straight pure black hair, blunt bangs`（黑長直＋齊瀏海） | 使用者定案（2026-06-13） |
| 眼睛 | `turquoise green eyes, double eyelid`（青綠/teal） | canon 標「提案未鎖」；使用者已定案為預設 |
| 冬季私服偽裝 | 深色/黑鴨舌帽壓低、寬鬆淺灰藍連帽衣、白/米色冬季圍巾、黑色窄管褲（實際 render 偏黑緊身褲/leggings）、白運動鞋、嘴邊白色呼氣 | 凍結 canon A070（冬季：白氣/圍巾/暖黃店光） |
| 口罩三態 | `mask_off`（放鬆，預設）/ `mask_half`（拉到下巴，過渡）/ `mask_on`（戴正，警戒） | 確定 |
| 氣質 | 安靜、警戒、疏離、藏著疲憊；放鬆時眼睛稍微彎起 | 確定 |
| 經理人 | 非反派 | 凍結 canon A091 |

**must_keep：** 成年 20 歲（無未成年感）；核心偽裝 帽+口罩+連帽衣；清秀偶像氣質但帶藏起來的疲憊。
**avoid：** nsfw、未成年/loli/teen、可辨識真實藝人臉、壞手、過度成熟/妖豔。

### 1.1 畫風 LoRA：canonical = D 組（已同步 config，2026-06-13 拍板）

- production canonical 風格 = **D 組：`gpt-image-2_anima-base1_v1` @0.7 + `dogma_animaV1.6` @0.4，不含 NSS，cfg 4.0，保留 `@gpt-image-2` 觸發詞。** 已寫入 `art_styles.json` 的 `anima_airbrush_editorial`（`production_default: true`）。
- **原「觸發詞還原版」保留為獨立備用 style：** `anima_airbrush_editorial_sweet_experimental`：`gpt-image-2 @0.75 + AnimaNEWNSS8 @0.70 + dogma @0.60 + (kishida mel:0.5)` + 觸發詞 `@gpt-image-2 / @sw33t`，cfg 3.5，標 `production_default: false`、`commercial_review_required: true`。Sweet/commercial/NSS-era 實驗用，非遊戲 production 預設，未刪除。
- **狀態：** 經 A/B 視覺驗證（2026-06-13）使用者拍板採 D 組為 production；manifest 與 config 已一致（manifest draft 的 `_config_discrepancy_note`、cleanup report 第 6/⚠ 節原為「待裁定」，現已落定並同步更新）。
- 排除（不進 production D 組）：`AnimaNEWNSS8`（僅存在於 sweet experimental 備用 style）、`anima-highres-aesthetic-boost`、`anima-turbo-lora-v0.2`。

---

## 2. 需求總覽（最小可用素材集，不無限擴張）

這是**內斂低調的雙人小品**，不是大卡司轉蛋遊戲。表情範圍刻意小。整體素材以「保持像同一個人」優先於「變化多」。

- 全身立繪：`mask_off` / `mask_on` / `mask_half`（共 3，達 P0 上限）。
- 半身對話圖表情：`neutral` / `troubled` / `annoyed` / `blush_avert` / `small_smile` / `soft_final`（6 種表情，達 P0 上限）。
- 每個表情只保留「劇本真正需要」的口罩狀態（依 Day1-7 節拍推導，不是每表情都三態）。
- 衣裝 ≤ 2、姿勢 ≤ 2。

---

## 3. 表情 × 口罩狀態 × Day × 理由（核心對照表）

下表是「每個表情只保留劇本真正需要的口罩狀態」的推導。**口罩狀態語意（凍結）：** mask_on=戴正/警戒、mask_half=拉到下巴/過渡、mask_off=放鬆/卸下偽裝。表情選用哪個口罩，由該節拍灯的心理狀態決定。

| # | 表情 expression | 口罩狀態 | 出現在哪些 Day | 理由（依 Day1-7 情緒節拍） | 優先級 |
|---|-----------------|----------|----------------|------------------------------|--------|
| E1 | neutral / guarded | **mask_on** | Day1（初遇警戒）、Day3（進店緊張）、Day4（晚到/焦慮起手） | 灯的「對外預設臉」：戴正口罩、安靜警戒、觀察四周。出現最頻繁，是對話圖的主臉。 | **P0** |
| E2 | small genuine smile | **mask_off** | Day1（收關東煮露一點真笑）、Day2（拉下口罩露素顏+真笑）、Day3（甜點櫃前懷舊一閃） | 「卸下偽裝才露的真笑」必須在 mask_off：劇情核心是她對主角卸防。Day2「你是唯一什麼都沒做的人」此刻臉。 | **P0** |
| E3 | troubled / anxious | **mask_on** | Day3（看到自己雜誌封面短暫不自在、店員差點認出）、Day4（焦慮、不接經理人電話） | 不安/警戒升高時她會把口罩戴回去當屏障，故配 mask_on。表達「想躲」。 | **P0** |
| E4 | annoyed（嘴硬） | **mask_half** | Day1（嘴硬開玩笑）、Day4（嘴硬掩飾真心） | 嘴硬是「半卸防」狀態：嘴露出來才看得到嘴硬的口型/撇嘴，但還沒完全卸防，故 mask_half（拉到下巴）。 | **P1** |
| E5 | blush + avert（臉紅別開視線） | **mask_half** | Day4（小真心「想確認自己還會想吃什麼」）、Day6（口罩後眼睛彎一下、苦甜，並肩走） | 臉紅要看得到臉頰，但又是害羞/別開的半防禦，配 mask_half。Day6 並肩的曖昧。 | **P1** |
| E6 | soft / quiet final | **mask_off** | Day6（苦甜收束）、Day7（最終傍晚「你今天看著我了」、安靜柔和收束） | 結局的安靜柔和必須完全卸防，mask_off。情感最開放的一刻。 | **P0**（結局必需） |

**口罩三態各被哪些表情用到（去重後）：**
- mask_on：E1（neutral）、E3（troubled）
- mask_off：E2（small_smile）、E6（soft_final）
- mask_half：E4（annoyed）、E5（blush_avert）

> 說明：Day2 有「側身拉下口罩露素顏」的特寫動作，視覺上由 E2（small_smile / mask_off）半身圖承擔即可；不需另開「拉口罩動作」的姿勢差分（避免吃掉 poses ≤ 2 額度）。Day5 灯未正面登場（用圖/收據暗號交流），**不需任何立繪/半身圖**——這是省素材的關鍵節拍，務必不要為 Day5 多做圖。

---

## 4. 優先級分層（P0 / P1 / P2）

優先級定義：**P0 = Day1-3 + 結局必需；P1 = Day4-7 補；P2 = 錦上添花。**

### P0（必做：Day1-3 開場可玩 + Day7 結局成立）

**全身立繪（3）：**
- A. `akari_full_mask_off`（Day7 結局、放鬆預設、頭身比基準） — 已有 fix_ready ✔
- B. `akari_full_mask_on`（Day1 初遇警戒） — 已有 fix_ready ✔
- C. `akari_full_mask_half`（過渡） — 已有 fix_ready（需手修，見 §6） ⚠

**半身對話圖表情（4）：**
- E1 `bustup_neutral_mask_on`（Day1/3/4 主臉） — 已有 fix_ready（裁切版，neutral）✔
- E2 `bustup_small_smile_mask_off`（Day1/2/3 真笑） — 待製作（從 mask_off 基準臉局部重繪）
- E3 `bustup_troubled_mask_on`（Day3/4 不安） — 待製作（從 mask_on 臉局部重繪）
- E6 `bustup_soft_final_mask_off`（Day6/7 結局） — 待製作（從 mask_off 基準臉局部重繪）

### P1（次做：Day4-7 完整體驗）

**半身對話圖表情（2）：**
- E4 `bustup_annoyed_mask_half`（Day1/4 嘴硬） — 待製作（依賴 mask_half 基底先修好）
- E5 `bustup_blush_avert_mask_half`（Day4/6 害羞） — 待製作（同上）

> 註：E4 雖在 Day1 也用得到（嘴硬開玩笑），但 Day1 的警戒主軸由 E1（neutral/mask_on）承擔即可，嘴硬瞬間可用文字+E1 過關，故 E4 列 P1 不影響 Day1 可玩性。

### P2（錦上添花，非必要，受 P0 上限約束）

- 第二套衣裝 `casual`（偶像舞台服 或 私服時尚差分如高丹數黑絲襪）。**目前未定義、未製作。** outfit 上限為 2，這是第 2 套的保留額度。**建議延後**——雙人小品在單一冬季偽裝裡發生，換裝會稀釋「同一個人」的一致性。
- 第二姿勢（如 Day6 並肩走的側身/行走 pose）。poses 上限 2，保留 1 個額度。**建議延後**：並肩走可用背景/運鏡敘事，不一定要新姿勢立繪。
- mask_half 改 overlay 合成系統化（base + overlay PNG + alpha），取代每張手修。屬流程優化，非素材本身。

---

## 5. 硬性數量上限與半身圖總張數

### 5.1 P0 上限（凍結，與 manifest draft / cleanup report 一致）

| 類別 | 上限 | 本計畫用量 |
|------|------|-----------|
| 全身立繪 sprites | ≤ 8（本案再收緊為 ≤ 3） | **3**（mask_off/on/half） |
| 表情 expressions | ≤ 6 | **6**（neutral/troubled/annoyed/blush_avert/small_smile/soft_final） |
| 衣裝 outfits | ≤ 2 | **1**（disguise_hoodie_scarf；第 2 套保留，建議不做） |
| 姿勢 poses | ≤ 2 | **1**（standing_front；第 2 姿勢保留，建議不做） |
| CG | ≤ 4 | 不在本文件範圍 |
| 背景 backgrounds | ≤ 5 | 不在本文件範圍 |

### 5.2 半身圖總張數硬上限 = **6 張**

**硬上限：半身對話圖總張數 ≤ 6 張**（= 6 種表情 × 各 1 個選定口罩狀態，見 §3 對照表，不做笛卡兒積）。

**為何 6 張就夠（解釋）：**

1. **不做「表情 × 口罩」笛卡兒積。** 6 表情 × 3 口罩 = 18 張是錯誤的擴張。每個表情依劇本心理只綁定**一個**口罩狀態（§3 已逐一推導理由），故 6 表情 = 6 張，不是 18。
2. **Day1-7 的每個情緒節拍都已被這 6 張覆蓋**（見 §3「出現在哪些 Day」欄）：Day5 不登場（0 張）、其餘每個節拍都落在這 6 張之一。沒有任何一個節拍找不到對應半身圖。
3. **半身圖張數越多 → 同一張臉越難維持一致。** 本管線 identity 一致性靠「同一張基準臉局部重繪/overlay」（§0.3、§0.4）。每多一張，AI 漂移/手修偏差的累積風險就多一份。6 張是「覆蓋全劇本 × 維持同一人」的最小集合。
4. **這是內斂雙人小品。** 玩家視線長時間停在灯一個人臉上，臉部一致性的價值遠高於表情花樣。表情過多反而會讓玩家覺得「不像同一個遊戲/同一個人」。

> 半身圖一律由全身 fix 的同一張臉衍生（裁切 + 局部重繪 or overlay），不獨立從零生成，以確保 6 張都是同一張臉。既有 `akari_bustup_neutral_*` 正是「全身 fix 純裁切（crop_box x165 y18 455x452，2x Lanczos → 910x904，零 AI 漂移）」產出，後續表情差分沿用此基準臉。

---

## 6. 對照現有素材：已有 / 待製作 / 製作手法

### 6.1 已有 fix_ready（白底，非 alpha；去背=人工/C2 步驟）

實體檔案已在磁碟確認存在：

| 素材 | 檔案 | 源 asset | 狀態 |
|------|------|----------|------|
| 全身 mask_off neutral | `public/assets/characters/hoshino_akari/fix_ready/akari_full_mask_off_fix_v001.png` | 20260613051933_225bc2d9（褲子版基準、頭身比基準，由 d0d576e0 腿部重繪） | fix_ready ✔ |
| 全身 mask_on neutral | `.../fix_ready/akari_full_mask_on_fix_v001.png` | 20260613112352_89f0cdfc | fix_ready ✔ |
| 全身 mask_half neutral | `.../fix_ready/akari_full_mask_half_fix_v001.png` | 20260613122401_f2418510 | fix_ready，**需手修** ⚠ |
| 半身 neutral mask_off | `.../bustup_fix_ready/akari_bustup_neutral_mask_off_fix_v001.png` | 純裁切自 mask_off 全身 fix（零漂移） | fix_ready ✔ |
| 半身 neutral mask_on | `.../bustup_fix_ready/akari_bustup_neutral_mask_on_fix_v001.png` | 純裁切自 mask_on 全身 fix | fix_ready ✔ |
| 半身 neutral mask_half | `.../bustup_fix_ready/akari_bustup_neutral_mask_half_fix_v001.png` | 純裁切自 mask_half 全身 fix | fix_ready，**需手修** ⚠ |
| 最佳臉（實驗 FINAL） | `.../bustup_fix_ready/hq_tests/akari_bustup_neutral_mask_off_hq_FINAL_local.png` | upscale/denoise refine 實驗，目前最佳臉 | 候選基準臉 |

`approved/` 與 `bustup_approved/` 目前皆空（政策：AI=draft，人工清理後才 approved）。

### 6.2 待製作半身表情（5 張；皆「同一張臉局部重繪 or overlay」，不重生）

| 素材 | 優先級 | 來源基準臉 | 建議手法 |
|------|--------|------------|----------|
| E2 small_smile / mask_off | P0 | mask_off 基準臉（225bc2d9 / hq_FINAL_local） | **局部 inpaint 眼+嘴**（讓眼睛微彎、嘴角真笑），其餘不動。或低 denoise img2img 0.2-0.35 + prompt「small genuine smile, eyes slightly curved」。 |
| E3 troubled / mask_on | P0 | mask_on 半身（89f0cdfc 裁切） | **局部 inpaint 眉+眼**（眉微蹙、視線下移），口罩區不動（戴正不需改）。 |
| E6 soft_final / mask_off | P0 | mask_off 基準臉 | **局部 inpaint 眼+嘴**（柔和、眼神放軟、淡淡微笑收束）。與 E2 差異在「真笑開朗」vs「安靜柔和」，重繪幅度小。 |
| E4 annoyed / mask_half | P1 | mask_half 基底（先修好，見 6.3） | 在修好的 mask_half 基底上 **局部 inpaint 嘴+眉**（撇嘴/挑眉的嘴硬感，嘴露在口罩外才看得到）。 |
| E5 blush_avert / mask_half | P1 | mask_half 基底（先修好） | **局部 inpaint 臉頰（加 blush）+ 眼（視線別開）**。依賴 mask_half 基底先穩定。 |

### 6.3 已知問題：mask_half（白口罩疊白圍巾辨識度低）

**問題（承接 manifest draft / cleanup report）：** `f2418510` 系列（全身 + 裁切半身）白口罩疊在白/米色圍巾上，辨識度低。

**這是 inpaint/img2img-on-region 或 overlay-composite 的工作，不是 ControlNet identity 問題，也不是從零重生問題。**（§0.3 verification 明確指出。）

**修法（擇一，前兩者人工，第三者系統化）：**
1. **人工修圖**：口罩冷白化（與暖白圍巾拉出冷暖對比）、加 contact shadow（口罩壓在圍巾上的接觸陰影）、補耳掛線、修接縫。
2. **局部 inpaint**：只對口罩區域低 denoise inpaint，引導「light blue/grey surgical mask, soft shadow against scarf」拉出對比。
3. **overlay 合成（建議的最終穩定解，P2 系統化）**：base sprite（mask_off）+ 一張獨立 mask_half overlay PNG（含 alpha）合成。**這是最不漂移、最可重複的解**，因為 base 像素完全不動，口罩是貼上去的圖層。manifest draft 的 `mask_half_note` 已預留此方向（本次不實作，列 P2）。

> **mask_half 製作順序：** 先把 mask_half 基底（全身 + 半身）的辨識度問題修好（上述 1 或 2），再在其上做 E4/E5 表情差分。不要在有問題的基底上疊表情。

### 6.4 一致性原則彙總（哪些重生、哪些局部重繪/overlay）

| 情境 | 手法 | 理由 |
|------|------|------|
| 全身 mask_off | 已定稿（基準），不動 | 頭身比與 identity 的錨點 |
| 全身 mask_on / mask_half | 已從基準遮罩局部重繪而來 | 同一張臉換口罩 |
| 半身 neutral 三態 | 純裁切自全身 fix（零漂移）| 已完成 |
| 半身其餘 5 表情 | **局部 inpaint / 低 denoise img2img**（從同一基準臉）| identity-safe，避免重生漂移 |
| mask_half 辨識度 | 人工修 或 **overlay 合成** | 白疊白問題，overlay 最穩 |
| **不採用** | 從零 txt2img 重生每張表情 | 會漂移，破壞「同一個人」 |
| **不採用** | InstantX Qwen-Image ControlNet / Qwen-Image-Edit 驅動 Anima | 架構不相容（Cosmos 2B ≠ Qwen-Image 20B），跑不動 |
| **不採用（現階段）** | 訓練 Anima-LLLite 擺姿 | 本管線是換臉/換口罩，不擺新姿勢，不需要 |

---

## 7. 製作順序建議（roadmap）

1. **P0-a（已完成）：** 全身 mask_off / mask_on fix_ready + 半身 neutral 三態裁切。
2. **P0-b：** 修好 mask_half 基底辨識度（§6.3 手法 1 或 2；overlay 系統化列 P2）。
3. **P0-c：** 由基準臉局部重繪出 3 張 P0 半身表情 → E2 small_smile / E3 troubled / E6 soft_final。
4. **P0-d：** 人工清理 + 去背，把 P0 全身（3）+ P0 半身（neutral + E2/E3/E6）推進 `approved/` 與 `bustup_approved/`。Day1-3 與 Day7 結局即可成立。
5. **P1：** 在修好的 mask_half 基底上做 E4 annoyed / E5 blush_avert（2 張）→ 補齊 Day4-7。
6. **P2（建議延後/不做）：** 第二衣裝、第二姿勢、overlay 合成系統化。

---

## 8. 不做清單（明確避免擴張）

- ❌ 不為 Day5 做任何圖（灯未正面登場，用圖/收據暗號）。
- ❌ 不做「表情 × 口罩」18 張笛卡兒積（每表情只綁 1 口罩，共 6 張半身）。
- ❌ 不做第二衣裝/第二姿勢（除非劇本後續硬需求；保留額度但建議不動，以維持同一人感）。
- ❌ 不從零 txt2img 重生表情差分（一律從同一基準臉局部重繪/overlay）。
- ❌ 不下載 InstantX Qwen-Image ControlNet 或 Qwen-Image-Edit 期望驅動 Anima（架構不相容）。
- ❌ 不假設 IP-Adapter 既可用（節點存在但未確認公開權重；identity 仍靠 LoRA+基準圖 img2img）。
- ❌ 不在本管線生成新底圖作為「最終 approved」——AI 只出可修基底，approved 由人工/overlay 穩定產出。

---

## 9. 與既有檔案的關係（承接，不矛盾）

- **承接** `asset_manifest.draft.json` 的 `canonical_design`、`p0_limits`、`manual_cleanup_policy`、`fix_ready_assets`、`asset_layers`。
- **修正/收斂** draft 的 `sprite_plan` 段：原 draft 把 sprite_plan 列為「全身立繪 8 張（含 casual 第二衣裝、含 sad_quiet 表情）」。本文件依「Day1-7 節拍推導 + 半身圖 ≤ 6」收斂為：**全身 3（僅 disguise 衣裝、僅口罩三態）+ 半身表情 6（每表情綁 1 口罩）**，並把 casual 衣裝降為 P2 建議不做。表情集亦與 draft 對齊但正規化為 §3 的 6 種（neutral/troubled/annoyed/blush_avert/small_smile/soft_final；draft 的 `sad_quiet` 併入 `troubled`/`soft_final` 語意，`soft` = `soft_final`）。
- **承接** ASSET_CLEANUP_REPORT 的 LoRA 不一致待裁定項（§1.1），按使用者指定的 D 組記錄，未改 config。
- **更正** characters.json / 既有文件中「Qwen-Image 家族」的架構描述為「Cosmos-Predict2-2B DiT 骨幹 + Qwen-Image VAE + Qwen3-0.6B TE」（§0.1，verification refuted 原說法）。建議後續同步 canon/brief 文件。

---

## 10. 一頁速查（TL;DR）

- **全身 3：** mask_off ✔、mask_on ✔、mask_half ✔（需手修）。
- **半身 6（硬上限）：** neutral/mask_on ✔、small_smile/mask_off、troubled/mask_on、soft_final/mask_off（以上 P0）；annoyed/mask_half、blush_avert/mask_half（P1）。
- **每表情只綁 1 口罩**（依劇本心理），不做 18 張笛卡兒積。Day5 不登場、0 圖。
- **identity 一致性 = LoRA(D 組) + 基準臉 + 局部 inpaint / 低 denoise img2img / overlay**；ControlNet 控結構不控長相；不要用 Qwen-Image 工具驅動 Anima。
- **mask_half 白疊白** = inpaint/overlay 修圖工作，最穩解是 overlay 合成（P2 系統化）。
- **AI 只出可修基底；approved 由人工/overlay 穩定產出。**
