# 交付物 1：Character Bible / REF Pack — 星野灯 / hoshino_akari

專案：雨夜偵探社：第七封情書（星野灯線）
角色：星野灯 / hoshino_akari
產出日期：2026-06-13
文件性質：角色基準資料（長期重複使用的單一事實來源）。本文是技術／規劃文件，非劇情本文，CLAUDE.md 的劇情標點與 AI 慣用語黑名單不適用，但全文以繁體中文撰寫。
管線階段：盤點 → 規劃 → 執行整理。**本文不規劃生成新圖**；AI 只負責「可修基底」，最終 approved 由人工清理或合成穩定產出。

---

## 0. 本文與既有檔案的關係（承接，不矛盾）

本文承接並彙整以下既有草案，作為角色層的權威基準。當細節衝突時，以本文為準，並標明信心水準。

- `art_tool/art_review/asset_manifest.draft.json`：既有素材 manifest 草案。本文沿用其 `canonical_design`、`mask_states`、`p0_limits`、`manual_cleanup_policy`、`fix_ready_assets`、`asset_layers`。**注意**：草案 `sprite_plan` 內混入了第二套「casual」衣裝與 `sad_quiet`／`soft` 等表情命名；本文將表情統一鎖定為 §5 的 6 種正規名，並把 casual 衣裝標為「未製作」（見 §3、§D5 的衣裝對齊註記）。
- `art_tool/art_review/ASSET_CLEANUP_REPORT.md`：2026-06-13 整理報告。本文沿用其分類（approved=無、approved_base_draft、needs_manual_cleanup、candidate）與 LoRA 不一致裁定事項。
- `art_tool/art_config/characters.json`：角色設定。本文沿用 `visual_core`／`hair`／`eyes`／`outfit`／`must_keep`／`avoid`，並把「眼色 canon 未鎖」更新為「使用者已定案黑髮＋青綠為預設」（見 §1）。
- `art_tool/art_config/art_styles.json`：畫風設定。`anima_airbrush_editorial` 已同步為 production canonical「D 組」（2026-06-13）；原觸發詞還原版另存為 `anima_airbrush_editorial_sweet_experimental` 備用（見 §8）。

---

## 1. 外觀固定規格

> 已用基準立繪 `20260613051933_225bc2d9`（= `fix_ready/akari_full_mask_off_fix_v001.png`）與最佳臉 `bustup_fix_ready/hq_tests/akari_bustup_neutral_mask_off_hq_FINAL_local.png` 直接視覺判讀核對，以下為定稿規格。

| 項目 | 規格 | 信心 |
|------|------|------|
| 年齡／類型 | 20 歲日本國民偶像；成年女性，**不可有任何未成年外觀** | 凍結（canon A001） |
| 體型 | slender 纖細；肩窄、四肢細長 | 高 |
| 頭身比基準 | 約 6.5–7 頭身（成年纖瘦比例）。**唯一頭身比權威來源 = `225bc2d9` 全身立繪**。所有差分均以此圖頭身比為準 | 高（以基準圖判讀） |
| 臉型 | 清秀、偏小臉、下巴細而柔；輪廓乾淨。偶像氣質但帶藏起的疲憊（眼神略疏離） | 高 |
| 髮型 | long straight pure black hair 黑長直；blunt bangs 齊瀏海（平剪、蓋住眉毛上緣）；中分量、垂順、不蓬 | 凍結（使用者 2026-06-13 定案） |
| 髮質光感 | 純黑帶冷光反射：黑髮中織入冷青藍與少量暖橘的反射光（呼應 §2 環境光主題）。**禁止**整片厚塗黑團、禁止粗大飽和的青色挑染色塊 | 高（風格 negative 已明列） |
| 眼睛 | teal／turquoise 青綠色；雙眼皮 double eyelid；虹膜帶光點反射、眼神安靜 | 使用者已定案為預設（原 canon 標「提案未鎖」，現定為黑髮＋青綠＝預設值） |
| 膚色 | pale cool skin 偏冷的白皙膚色，低飽和；可帶淡淡腮紅 subtle blush。**禁止**暖橘膚色 cast | 高 |
| 神情基調 | quiet／guarded／distant，藏著疲憊；放鬆時眼睛會稍微彎起 | 凍結（canon A030） |

---

## 2. 配色規格（可重複使用色票）

下表為「描述性色票」。**HEX 為近似標的值**（依基準圖視覺判讀估出，信心：中；用於人工修圖與合成時對齊，非像素精確取色）。文字描述（hue family）才是跨圖一致的硬指標。

### 角色本體色票

| 部位 | 描述 | 近似 HEX | 硬指標（不可漂移的 hue） |
|------|------|----------|--------------------------|
| 鴨舌帽 cap | 深黑／極深炭灰，啞光至微亮塑膠質感 | `#1C1F26` | **深黑**。禁止白帽／淺帽（風格 negative 已明列 white cap / pale cap） |
| 連帽衣 hoodie | 淺灰藍 pale grey-blue，oversized | `#C3CDD6` | **淺灰藍**（冷調），不可變成純白或暖米色 |
| 圍巾 scarf | 白／米白 winter scarf | `#EEE9E1` | **白／米白**（暖白偏一點點米，避免與帽形成過硬對比） |
| 下身（褲版） | 黑色窄管褲／黑色緊身褲（實際 render 偏黑 leggings／tights） | `#15171C` | **黑**（見 §3 窄管褲 vs 黑絲襪差分） |
| 鞋 | 白色運動鞋 white sneakers | `#F2F2EF` | **白** |
| 頭髮 | 純黑帶冷光反射 | `#101218`（暗部）／反光 `#3A4654` 冷藍、`#5C4A3E` 暖橘微量 | **純黑**為主，反光僅作點綴 |
| 眼睛 | 青綠 teal／turquoise | `#3FB9AE` ~ `#46C7C0` | **青綠**（teal-to-turquoise 帶），不可變藍、變綠、變灰 |
| 膚 | 冷白皙、低飽和 | `#F0E2DC`（亮）／`#D8C2BC`（陰影） | **冷白皙**，禁暖橘 |
| 呼氣 | 嘴邊白色呼氣 faint visible breath（冬季） | `#F4F6F8` 半透明 | 白半透明（冬季氛圍件，見 canon A070） |

### 環境光主題（場景與後製對齊用）

- **主題：冬夜青 × 店光暖橘。** 整體偏冷白平衡 cool white balance，褪色淡彩 washed-out／pale cool tone。
- 一側為暖黃店光 warm shop light glow（畫面常從一側打入，洗淡肩、袖，輪廓線在強光中淡出）；冷青藍為環境主調。
- 此主題同時體現在髮絲反光（冷青 × 暖橘）與膚色微反光上，**是辨識「灯」氛圍的一部分**，差分圖須維持同一打光方向與冷暖配置。
- 對應 canon A070（冬季：白氣／圍巾／暖黃店光）。

---

## 3. 服裝固定規格

### 主服裝：冬季私服偽裝（disguise_hoodie_scarf）— canonical，已製作

這是唯一已製作、且 canon 凍結為「核心偽裝」的衣裝。各件規格：

| 件 | 規格 | must_keep？ |
|----|------|------------|
| 帽 | 深黑鴨舌帽，**壓低**（遮住眉與部分瀏海上緣） | **是**（核心偽裝三件之一） |
| 上衣 | 寬鬆淺灰藍連帽衣 oversized loose hoodie；袖長、衣襬長過臀 | **是** |
| 圍巾 | 白／米白冬季圍巾，繞頸 | 否（強氛圍件，但下身差分時可微調） |
| 下身 | 黑色窄管褲（預設）。**差分**：高丹數黑絲襪／black tights 作為私服時尚差分（目前未單獨製作，留待 P0 額度內視需要） | — |
| 鞋 | 白色運動鞋 | 否 |
| 氛圍件 | 嘴邊白色呼氣（冬季） | 否（隨 mask 狀態出現，mask_on 時呼氣可隱沒） |

**窄管褲 vs 高丹數黑絲襪差分說明（重要）：**
- 基準立繪 `225bc2d9` 在實際 render 上，下身偏向「黑色緊身褲／leggings／tights」的視覺讀法，而非清楚的窄管西褲。
- 規格上兩者**同色（黑）、同剪影（細腿）**，差別只在材質讀法（褲布 vs 絲襪光澤）。
- **裁定：以「黑色細腿剪影」為硬指標**；褲 vs 絲襪屬材質層級的可接受差異，不視為身分漂移。若要明確做「高丹數黑絲襪」時尚差分，須在 P0 衣裝額度（≤2 套）內規劃，且本文不主動規劃生成。

### Alt 服裝：偶像舞台服 — **未製作**

- 描述（僅供未來參考）：idol stage costume, sparkling, bright。
- 狀態：**未製作、不在本期範圍**。
- 衣裝額度提醒：P0 上限衣裝 ≤2 套。目前已用 1 套（冬季私服偽裝）。`asset_manifest.draft.json` 草案中出現的第二套「casual」屬**規劃中未定義**，舞台服與 casual **二擇一**佔用剩餘 1 個額度，須使用者裁定後才製作。

---

## 4. 口罩三態定義（mask_off / mask_half / mask_on）

口罩是「偽裝強度」與「心理戒備」的視覺旋鈕。三態語意、用時、視覺特徵如下。三態共用同一張基準臉，僅口罩區域差分（差分以遮罩局部重繪自基準圖製作）。

| 狀態 | 語意（心理） | 何時用 | 視覺特徵 | 基準來源 |
|------|--------------|--------|----------|----------|
| **mask_off**（預設） | 放鬆、卸下戒備、露出真實的她 | 與主角獨處、安心時；Day2 露素顏真笑；Day7 收束 | 無口罩，全臉可見。放鬆時眼睛稍彎 | `225bc2d9` → `akari_full_mask_off_fix_v001.png` |
| **mask_half**（過渡） | 半戒備、過渡狀態、猶豫；剛拉下或正要戴上 | 進店前後、半安心半警戒、Day1 收到關東煮鬆一點點 | 口罩拉到下巴／頸前，露口鼻；口罩有摺線、上下緣 | `f2418510` → `akari_full_mask_half_fix_v001.png` |
| **mask_on**（警戒） | 全戒備、藏起身分、防止被認出 | 公共場合、有人盯著、Day3 店員差點認出時 | 白口罩戴正、覆口鼻、上緣俐落、僅露雙眼 | `89f0cdfc` → `akari_full_mask_on_fix_v001.png` |

### mask_half 的「白口罩疊白圍巾」辨識度問題與解法指引（已用 fix_ready 圖核對確認）

**問題（確認）：** 白口罩拉到下巴後，與白／米白圍巾在同一區域、同色相重疊，導致辨識度低 —— 視覺判讀基準圖時，mask_half 與 mask_off 幾乎難以一眼分辨；mask_on 的白口罩同樣會與白圍巾糊在一起。這正是 `asset_manifest.draft.json` 與整理報告所記錄的問題。

**解法指引（人工修 或 overlay 合成，二擇一；本文不要求 AI 全自動完稿）：**
1. **人工輕修（建議路線）：** 對口罩區域做
   - 口罩冷白化（cool-white）：把口罩白往冷一點點推，與暖白圍巾拉開色溫；
   - 加 contact shadow：在口罩與圍巾／下巴交界補一道接觸陰影，製造前後層次；
   - 補耳掛線 ear loop：畫出口罩耳掛繩，強化「這是口罩」的讀法；
   - 修接縫：清掉口罩與圍巾糊在一起的邊。
2. **overlay 合成（未來路線）：** base sprite（mask_off）＋ mask_half overlay PNG（含 alpha）＋ alpha compositing。可讓口罩成為可開關圖層，三態以同一張臉疊圖產生，最穩定。**本期不實作。**

> 製作政策：mask_half 不要求 AI 全自動完稿；AI 出可修基底 → 人工清理口罩／邊界／耳掛／陰影 → approved。mask_on 的白口罩同理建議比照（冷白化＋contact shadow）以與白圍巾拉開。

---

## 5. 表情種類上限（依 Day1-7 節拍，鎖定 ≤6 種）

依 P0 上限「表情 ≤6」與 Day1-7 情緒節拍，鎖定以下 **6 種正規表情**。命名為單一事實來源，後續檔名與 manifest 一律用這 6 個 id（取代草案 `sprite_plan` 內 `sad_quiet`／`soft`／`neutral` 等舊命名）。

| # | 表情 id | 眉 | 眼 | 嘴 | 用於（Day 節拍） |
|---|---------|----|----|----|------------------|
| 1 | `neutral_guarded` | 平、略微收 | 睜開、眼神安靜略疏離、不彎 | 平、微抿 | 預設；Day1 警戒初遇、各日中性對話 |
| 2 | `troubled` | 內側微皺、眉心略收 | 視線下垂或飄移、帶不安 | 微抿或微張、嘴角略下 | Day3 進店緊張、Day4 晚到焦慮 |
| 3 | `annoyed` | 一邊略挑或皺 | 半瞇、斜睨 | 抿緊或撇嘴（嘴硬掩飾） | Day1 嘴硬、Day4 嘴硬掩飾 |
| 4 | `blush_avert` | 略抬、放鬆中帶尷尬 | 眼神**避開**（move away／不直視）、眼瞼略垂 | 抿、微張，帶不自在 | Day3 看到自己雜誌封面短暫不自在、害羞瞬間 |
| 5 | `small_smile` | 放鬆、平 | **眼睛稍彎**（真笑訊號）、眼神柔 | 嘴角微微帶起的淡淡真笑（小幅，不露齒大笑） | Day1 收到關東煮露一點真笑、Day2 側身拉口罩露素顏真笑 |
| 6 | `soft_final` | 放鬆、舒展 | 眼睛柔和半彎、安靜、帶釋然與一點疲憊 | 平靜柔和、極淡上揚 | Day6／Day7 苦甜收束、口罩後眼睛彎一下、安靜柔和 |

**表情範圍說明：** 這是內斂低調的雙人小品，不是大卡司轉蛋遊戲，故表情範圍刻意小。6 種已覆蓋 Day1-7 全部節拍（含 Day5 未正面登場、不需新表情）。**不可超出這 6 種**；新節拍若出現，優先複用最接近者，而非新增表情。

> 命名對齊註記：`small_smile` 對應草案的 small_smile；`soft_final` 取代草案 `soft`；`troubled` 取代草案 `sad_quiet`／`troubled`；草案中的 `neutral` 一律改寫為 `neutral_guarded`。

---

## 6. 動作／姿勢種類上限

依 P0 上限「姿勢 ≤2」，鎖定 **2 種立繪姿勢**，半身對話框構固定為 1 種。

| 用途 | 姿勢 id | 規格 |
|------|---------|------|
| 全身立繪 A | `standing_front` | 正面站姿，雙手自然垂放／插口袋；重心居中。**= 基準立繪 `225bc2d9` 的姿勢**（頭身比基準） |
| 全身立繪 B | `standing_3q` | 四分之三側身站姿（3/4 view）；對應 Day2「側身拉下口罩」、Day6「並肩走」等略側身節拍。**未製作**，列為 P0 第二姿勢額度 |
| 半身對話 | `bustup_neutral`（框構固定） | 半身對話框構**固定一種**：胸上、正面微側、頭部置中。**製作方式 = 由全身 fix 純裁切**（crop_box x165 y18 455×452 → 2× Lanczos → 910×904，零 AI 漂移），不另起姿勢。所有 mask 三態半身共用同一框構，僅口罩不同 |

**規則：** 立繪姿勢嚴格 ≤2；半身一律用固定框構裁切自全身，不為了表情或口罩另外擺姿勢（避免身分漂移、避免額度爆掉）。

---

## 7. 遊戲實際需要的 sprite 規格表

> 灯線**尚未接進遊戲**（`content/` 無灯的美術引用）。前端為零 API key、零即時 AI。以下為交付規格；命名與目錄交由【交付物 5（D5）】最終定案，本文僅指向。

| 類型 | 解析度 | 構圖 | 背景 | 目前狀態 | 目錄 |
|------|--------|------|------|----------|------|
| 全身立繪 | 直幅，源生成 832×1216；交付沿用源尺寸 | 全身、`standing_front`（B 姿 `standing_3q` 未製作） | **fix_ready=白底（非 alpha）**；approved 須**去背成 alpha**（去背＝人工／C2 手修，非 AI） | fix_ready 3 張（mask 三態）；approved **空** | `public/assets/characters/hoshino_akari/fix_ready/`（待修）→ `.../approved/`（人工清理後） |
| 半身對話 | 910×904（由全身裁切 ×2 Lanczos） | 胸上、固定框構 `bustup_neutral` | fix_ready=白底；approved 須去背 | bustup_fix_ready 3 張；bustup_approved **空** | `.../bustup_fix_ready/` → `.../bustup_approved/` |
| 最佳臉（refine 實驗） | 升尺寸 | 半身臉部 | 白底 | `akari_bustup_neutral_mask_off_hq_FINAL_local.png`（目前最佳臉） | `.../bustup_fix_ready/hq_tests/` |

**現況檔案（已盤點核對，與 manifest 一致）：**
- 全身 fix_ready：`akari_full_mask_off_fix_v001.png`（源 225bc2d9）、`akari_full_mask_on_fix_v001.png`（源 89f0cdfc）、`akari_full_mask_half_fix_v001.png`（源 f2418510，需人工修口罩）。
- 半身 fix_ready：`akari_bustup_neutral_mask_off/on/half_fix_v001.png`（純裁切，零漂移；half 同需修口罩）。
- approved／bustup_approved：**皆空**（只有 .gitkeep）。政策：AI=draft，人工清理後才 approved。

**命名指向 D5：** 全身採 `akari_full_<expression>_<mask>_fix_vNNN.png`、半身採 `akari_bustup_<expression>_<mask>_fix_vNNN.png` 的既有慣例；表情值取自 §5 的 6 個正規 id，mask 值取自 §4 三態。最終目錄／版號／approved 命名以 D5 為準。

---

## 8. 技術環境註記（模型、工具、身分一致性手段）

> 以下技術主張以本任務的 RESEARCH/VERIFICATION 為準。凡 verification 標為 refuted／partly-wrong／uncertain 者，照修正後版本記錄並標明信心。**不可宣稱 SDXL 流程可直接套用。**

### 8.1 底模架構（重要修正，信心：高）

- 底模 `anima_baseV10.safetensors` = **Anima Base v1.0**（CircleStone Labs × Comfy Org，約 2026-05 釋出），**約 2B 參數的動漫文生圖 DiT**。
- **架構修正：** Anima 的擴散主幹是 **NVIDIA Cosmos-Predict2-2B-Text2Image** 衍生（kohya 稱 MiniTrainDIT，Rectified Flow，3D RoPE，附 LLMAdapter 橋接），**並非 Qwen-Image 家族**。它只是「借用」了 Qwen-Image 的 VAE（`qwen_image_vae.safetensors`，16 通道）與 Qwen3-0.6B 文字編碼器（`qwen_3_06b_base.safetensors`，經 CLIPLoader type=stable_diffusion 載入）。
  - **原專案 brief 把架構歸為「Qwen-Image 家族」是被 verification refuted 的說法，本文據此修正。** 共用 VAE／文字編碼器**不代表** Qwen-Image 的 LoRA／ControlNet 可套用 —— 那些針對的是 Alibaba 另一顆約 20B、用 Qwen2.5-VL 7B 編碼器的 Qwen-Image MMDiT，與 Anima 主幹不同。
- 元件載入（與現有 `base_txt2img_api.json` 一致，信心：高）：DiT 經 UNETLoader、Qwen3-0.6B 經 CLIPLoader、Qwen-Image VAE 經 VAELoader。
- 取樣建議（信心：高）：官方建議 er_sde（中性預設）、30–50 steps、**CFG 4–5**、解析度 512²–1536²（約 1MP 甜蜜點）。
  - **與專案現值的偏差：** 專案目前 CFG 3.5–4.5 略低於官方 4–5 下緣，屬小偏差、非錯誤，建議向 4–5 靠攏。832×1216 在範圍內。
- **絕非 SDXL、非 SD1.5、非 Flux。** SDXL／SD1.5 的 LoRA、ControlNet、kohya `sdxl_train_network.py` 在架構上不相容（不同 VAE 通道數、不同文字編碼器、不同主幹），不可直接套用。

### 8.2 canonical 風格「D 組」已同步至 art_styles.json（2026-06-13 拍板）

- production canonical 風格 = **D 組**：`gpt-image-2_anima-base1_v1.safetensors` @0.7 + `dogma_animaV1.6.safetensors` @0.4，**不含 NSS**，cfg 4.0，保留 `@gpt-image-2` 觸發詞。已寫入 `art_config/art_styles.json` 的 `anima_airbrush_editorial`（`production_default: true`）。
- **原觸發詞還原版保留為獨立備用 style：** `anima_airbrush_editorial_sweet_experimental` —— gpt @0.75 + **AnimaNEWNSS8 @0.70** + dogma @0.60 + `(kishida mel:0.5)` + 觸發詞 `@gpt-image-2`／`@sw33t`，cfg 3.5，標 `production_default: false`、`commercial_review_required: true`。Sweet／commercial／NSS-era 實驗用，非遊戲 production 預設，未刪除。
- **狀態：** 經 A/B 視覺驗證（2026-06-13）後使用者拍板採 D 組為 production；manifest 與 config 已一致。

### 8.3 身分一致性（identity）與結構（structure）的分工（信心：高）

這決定「如何在不重生整張圖的前提下做差分」，與 §4／§5／§6 直接相關：

- **身分（誰）只能靠：** 底模 + 角色／風格 LoRA（現有 D 組）+ 固定 seed + 提示詞 + **從已正確的基準立繪做低去噪 img2img／局部 inpaint**。
  - Anima 主幹目前**沒有**可直接下載的成熟 IP-Adapter／Redux／reference-only 權重可保證身分（社群有 `comfyui-anima-ipadapter` 整合框架，但**未確認有公開預訓練權重**，信心：中）。故跨圖一致性主要靠 LoRA + 固定 seed + 低去噪 img2img/inpaint。
- **結構（姿勢／構圖／框構）靠：** Anima-LLLite（kohya 專為 Anima 移植的 ControlNet-LLLite，架構原生；經 `ComfyUI-Anima-LLLite` 節點），可鎖姿勢、框構、構圖、inpaint 遮罩。**ControlNet／LLLite 控制的是幾何結構，不是臉的身分。**
- **對本管線的實務結論：**
  - mask 三態與表情差分 = **低去噪 img2img（denoise 約 0.2–0.45）或對口罩／眼／嘴局部 inpaint**，**不是從頭重生**，更不是 ControlNet 身分問題。
  - mask_half 的白口罩問題 = 局部 inpaint／img2img 或 overlay 合成的活，見 §4。
  - **不要**下載 InstantX Qwen-Image ControlNet 或 Qwen-Image-Edit 期待它們能驅動 Anima（架構不相容，信心：高，推論非實測）。
- **授權提醒（信心：高）：** Anima 採 CircleStone Labs 非商業授權，且經 Cosmos 衍生繼承 NVIDIA Open Model License。若本視覺小說日後商業化，整套 D 組 LoRA 受此限制，需聯絡 CircleStone Labs 取得商業授權。

---

## 9. 收尾三清單（最關鍵）

### 【必須固定】identity-critical，跨所有圖一致

1. 成年 20 歲偶像氣質，帶藏起的疲憊（不可未成年化）。
2. 黑長直髮 + **齊瀏海 blunt bangs**（平剪、蓋眉上緣）。
3. **青綠 teal／turquoise 眼**、雙眼皮。
4. **深黑鴨舌帽**、壓低。
5. **淺灰藍寬鬆連帽衣** oversized hoodie。
6. 白／米白圍巾。
7. 黑色細腿剪影下身（窄管褲／黑絲襪同剪影）。
8. 冷白皙膚色、低飽和。
9. 頭身比 = 基準立繪 `225bc2d9`（約 6.5–7 頭身、slender）。
10. 環境光主題：冬夜青 × 店光暖橘（冷白平衡 + 一側暖光），含髮絲冷青×暖橘反光。
11. 神情基調 quiet／guarded／distant，放鬆時眼睛稍彎。
12. 核心偽裝三件不可缺：帽 + 口罩（可掛下巴）+ 連帽衣。

### 【可變動】容許差分

1. 表情：§5 的 6 種（`neutral_guarded`／`troubled`／`annoyed`／`blush_avert`／`small_smile`／`soft_final`），不超出。
2. 口罩三態：`mask_off`（預設）／`mask_half`（過渡）／`mask_on`（警戒）。
3. 姿勢：`standing_front`（已製作）／`standing_3q`（未製作）；半身固定框構 `bustup_neutral`（裁切）。
4. 下身材質讀法：窄管褲 vs 高丹數黑絲襪（同黑、同細腿剪影，屬可接受差異）。
5. 呼氣白霧的有無與濃淡（隨 mask 狀態、構圖）。
6. 光線強弱與洗白程度、輪廓線在強光中淡出的程度（風格內可變）。
7. 構圖留白量、半身 vs 全身。

### 【禁止漂移】會讓她不像同一人，或破壞偽裝設定

1. **髮色變**（變棕／金／白／粉等任何非純黑）。
2. **瀏海消失或變形**（齊瀏海是辨識核心，不可分線露額或改成空氣瀏海）。
3. **帽變白／變淺色**（風格 negative 已明列 white cap／pale cap）。
4. **眼色變**（變藍、變綠、變灰、變棕 —— 必須維持青綠 teal/turquoise）。
5. **未成年化／幼態**（loli／child／teen）。
6. **mask_on 時口罩消失**（mask_on 必須覆口鼻、僅露雙眼，否則破壞警戒語意）。
7. 膚色暖橘化 cast、整片厚塗黑髮團、粗大飽和青色挑染色塊（風格 negative 已明列）。
8. 連帽衣變純白／暖米、或不再 oversized。
9. 頭身比偏離基準（變高挑成熟模特兒比例、或變矮頭大的 chibi）。
10. 過度成熟／妖豔風格、cleavage、性感賣弄（avoid 清單）。
11. 可辨識的真實藝人臉孔（avoid；連帶：LoRA 訓練與 trigger 命名都不可用真實偶像名／臉作參考）。
12. nsfw、壞手／多指／缺指。

---

## 10. 信心與待裁定事項彙整

| 項目 | 狀態／信心 |
|------|-----------|
| 黑長直齊瀏海、青綠眼、冬季私服偽裝、頭身比基準 225bc2d9 | 凍結／高（已視覺核對） |
| 眼色青綠＝預設 | 使用者已定案（原 canon 標「提案未鎖」，本文更新為已定） |
| 色票 HEX | 近似標的、信心中（文字 hue 描述為硬指標） |
| 底模 = Anima（Cosmos-Predict2 衍生，非 Qwen-Image 家族） | 高（修正原 brief 說法） |
| mask_half 白口罩疊白圍巾辨識度低 | 已視覺核對確認，附解法指引 |
| 表情鎖 6 種、姿勢鎖 2 種 | 依 P0 上限與 Day1-7 節拍鎖定 |
| **✅ 已裁定 1：LoRA D 組 = production（已同步 config，2026-06-13）** | `anima_airbrush_editorial`=D 組（`production_default: true`）；觸發詞還原版另存 `anima_airbrush_editorial_sweet_experimental` 備用 |
| **待裁定 2：第二套衣裝＝舞台服 or casual（P0 剩 1 額度，二擇一）** | 使用者裁定後才製作 |
| 商業授權（Anima 非商業 + NVIDIA OML） | 若日後商業化須處理 |
