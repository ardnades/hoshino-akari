# P0-A：fix_ready → approved 整理 + 去背方案 + 最小遊戲接入 plan

> 日期：2026-06-13。範圍：只把已穩定的 4 張（mask_off / mask_on，全身+半身）推進到 `approved/` `bustup_approved/`，並做遊戲「接入準備」。**不重生、不訓練、不 ControlNet/LLLite、不碰 mask_half、不新表情、不第二衣裝、不改劇本/engine/玩家端 JS、不 commit。**

## 1. 本輪實際處理的 4 張

| 來源（fix_ready） | 輸出（approved，白底） | 模式 | 處理 |
|---|---|---|---|
| `fix_ready/akari_full_mask_off_fix_v001.png` (RGB 832×1216) | `approved/akari_full_neutral_guarded_maskoff_whitebg_v001.png` | byte-identical 複製 | 像素 100% 不變 |
| `fix_ready/akari_full_mask_on_fix_v001.png` (RGBA 832×1216, α全255) | `approved/akari_full_neutral_guarded_maskon_whitebg_v001.png` | 攤平 RGBA→RGB | 像素不變，僅丟棄無意義的全不透明 alpha 通道 |
| `bustup_fix_ready/akari_bustup_neutral_mask_off_fix_v001.png` (RGB 910×904) | `bustup_approved/akari_bust_neutral_guarded_maskoff_whitebg_v001.png` | byte-identical 複製 | 像素 100% 不變 |
| `bustup_fix_ready/akari_bustup_neutral_mask_on_fix_v001.png` (RGB 910×904) | `bustup_approved/akari_bust_neutral_guarded_maskon_whitebg_v001.png` | byte-identical 複製 | 像素 100% 不變 |

未做：去背、AI refine、改臉/髮/帽/圍巾/衣服。fix_ready 來源檔保留未刪。

## 2. Alpha 檢查結論

**4 張皆無可用透明度，全為白底（角落 RGB ≈ 252–253）。** 其中 full mask_on 雖是 RGBA，但 alpha 全 = 255（純不透明白底，不是去背切割）。

因此本輪**不自動強去背**，輸出誠實的白底 `_whitebg_v001` 版，狀態標 `preview_approved` + `background: white` + `approved_for_preview: true` + `needs_alpha_cleanup: true`。**沒有任何檔案謊稱是 alpha。**

## 3. 去背方案與風險（待你決定再做，本輪不做）

目標：白底 → 透明去背 `_alpha`，且**不改角色像素**（臉/髮/帽/圍巾/衣服一個 pixel 都不動）。

**建議路線（保守、可重複、不碰 AI）：**
- **A1 — 色度/亮度門檻去背（推薦先試）：** 對近白背景（>248）做容差選取 → 轉 alpha；只動「判定為背景」的像素，前景不變。風險：**白色圍巾、白運動鞋、淺灰藍 hoodie 高光**與白底同色，易被誤切（白吃白）。需配合邊緣保護 / 手動補回。
- **A2 — 人工/半自動遮罩（最穩，品質最高）：** 在影像軟體用筆刷描邊去背，前景像素零改動。耗人工，但對「白吃白」最安全，適合正式 approved。
- **A3 — 演算法 matting（rembg / SAM 等）：** 自動去背品質高，但屬模型推論、邊緣可能被改、有版權/一致性風險，且與「不改像素」原則有張力。**列為備援，預設不採用。**

**共同風險：**
- 白吃白（圍巾/鞋/hoodie 高光被當背景）。
- 半身是從全身純裁切的，去背需各自做或先對全身去背再裁切（建議**先對全身去背 → 再用同 crop_box 裁出半身**，確保兩者邊緣一致）。
- 去背後務必檢查髮絲邊緣、帽簷、圍巾輪廓無殘留白邊 / 無被啃。

**產物命名（去背完成後）：** `akari_full_neutral_guarded_maskoff_v001_alpha.png` 等（去 `whitebg`、加 `_alpha`），狀態升 `approved`，`needs_alpha_cleanup: false`。

## 4. mask_half 目前狀態

**仍 `fix_ready` / `needs_manual_cleanup: true`，未進 approved。** 白口罩疊白圍巾辨識度低（全身+半身各一張）。長線建議走 **overlay 合成**（mask_off base + mask_half 口罩 overlay PNG + alpha），比每張手修穩定可重複。本輪不處理。

## 5. 遊戲接入機制盤點（engine / story data 是否支援 sprite/bg/cg）

**支援，且已預留乾淨接入點。**

- **唯一接入檔：** `projects/hoshino-akari/play/data/assets.js`（`window.HOSHINO.assets`）。其註解明言「未來接真實立繪/CG/背景時，只改本檔，不動引擎」。
- **欄位：**
  - `characters[who][expr] = "相對路徑.png"` — 立繪。`who` = `akari` / `manager`；`expr` = day 資料裡的中文表情字串。
  - `cg[cgKey] = path`、`background[mood] = path`、`bgm`/`se`（音訊預設關）。
- **引擎解析（`engine.js`）：** `setSprite(who, expr)` → 查 `assets.characters[who][expr]`；有值就 `<img class="sprite" src=… onerror=隱藏>`；**查無 → 隱藏 → fallback 到 inline SVG（art.js）/ CSS。缺素材永不報錯、不壞遊戲。**
- **現況：** `assets.js` 的 `characters/cg/background` 全空（註解狀態），玩家端**零外部圖片引用**（art.js 全 inline SVG）。
- **路徑慣例：** 建議素材放 `play/assets/characters/…`，路徑相對 `play/index.html`。**注意：** 我們的 approved 檔在 `public/assets/characters/hoshino_akari/`，與 `play/` 不同根；接入時需決定用相對路徑或把選定檔複製/連結到 `play/assets/`（見下，待你定）。

## 6. 關鍵落差：expr 軸 ≠ mask/expression 軸

day 資料用**約 62 種自由中文 `expr` 字串**（87 行有 expr），例：`素顏微笑`×4、`壓低帽簷`、`口罩圍巾`×3、`藏不住的笑`×4、`別過視線`×3、`紅到耳朵`、`警戒`…。這與 manifest 的 `(mask_state × expression)` 不是同一軸，且我們目前**只有 neutral_guarded 一種臉**。

→ 接入需要一層 **expr → sprite 映射**，且現階段只能保守：把少數「與 neutral_guarded 相容」的 expr 接到 2 張半身，其餘一律留空走 SVG fallback（安全）。

## 7. 最小接入 plan（待你看過 approved 後再執行，本輪不動）

1. **先決條件：** 完成去背 `_alpha`（§3）。去背前不正式接入（白底會在深色場景露白框）。
2. **只改一個檔：** `play/data/assets.js` 的 `characters.akari`。不動 engine.js / dayN.js / 任何玩家端 JS。
3. **保守 expr 映射（建議首批，僅這幾個與 neutral_guarded 相容）：**
   | day 的 expr 字串 | 接到 | 理由 |
   |---|---|---|
   | `口罩圍巾`、`壓低帽簷`、`拉低帽簷`、`喘氣帽簷低`、`警戒`、`戒備遮臉`、`看玻璃門眼神警戒` | **bust maskon** | 遮臉/警戒態，與 mask_on neutral_guarded 相容 |
   | `素顏`、`素顏微笑`、`素顏感笑`、`無表情`、`遠目` | **bust maskoff** | 素顏中性，與 mask_off neutral_guarded 相容 |
   | 其餘情緒明確的 expr（`藏不住的笑`、`紅到耳朵`、`慌`、`瞪`…） | **不接（留 SVG）** | 我方尚無對應表情；硬接會「中性臉配大笑台詞」出戲。等 P1 表情圖。 |
   - 全身立繪 `full` 暫不接（engine 單一 sprite 槽以 expr 為鍵，半身為對話用立繪；全身可留作預覽/未來 scene 立繪）。
   - `background` / `cg`：本輪不涉及（art.js 已有 SVG，無破圖風險）。
4. **驗收：** 接完用 `tools/story_inspector.html` 看 Day1-7、確認無 404（`onerror` 也會自動隱藏）。
5. **不做：** 不改劇本台詞、不新增/改 expr 字串、不開 bgm/se、不接 manager 立繪。

> 本檔只做盤點與規劃；§3 去背與 §7 接入皆**待你看過 `approved/` `bustup_approved/` 的白底預覽後再決定**。
