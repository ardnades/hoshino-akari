# 美術素材整理報告（Asset Cleanup）

**日期：** 2026-06-13
**範圍：** 只整理、不生成、不 adopt、不接劇本、不 commit、不刪圖。
**角色：** 星野灯 / hoshino_akari

---

## 1. 掃描到的美術圖片與 metadata

| 位置 | 內容 |
|------|------|
| `public/assets/generated/` | **170 張 AI candidate PNG**（gitignored，未接遊戲）：character_rough 11、key_visual_portrait 73、transparent_standee 86 |
| `public/assets/generated/metadata.json` | 170 筆；status：candidate 165 / accepted 5 |
| `public/assets/characters/hoshino_akari/` | 整理前有 **5 組 adopted**（PNG+sidecar）；整理後**已清空** |
| `public/assets/cg/` | 空（只有 .gitkeep） |
| `public/assets/backgrounds/` | 不存在 |
| `art_tool/art_config/` | art_styles.json / art_tasks.json / characters.json（設定，非圖） |

## 2. 分類

| 類別 | 內容 |
|------|------|
| **approved** | **無**。目前沒有任何「人工清理後的正式素材」——依新製作方針，AI 圖一律 draft，尚未有 approved。 |
| **approved_base_draft**（基準 draft，待輕清） | `225bc2d9`（mask_off 褲子版基準立繪）、`89f0cdfc`（mask_on 戴正版） |
| **needs_manual_cleanup** | `f2418510`（mask_half 基本差分；白口罩疊白圍巾辨識度需人工修） |
| **candidate / experiment** | `generated/` 內其餘約 167 張（prompt/LoRA/構圖/差分各輪測試），為 gitignored 草案池 |
| **unconfirmed_adopted**（先前 adopt 但非最終） | 5 組：3× character_rough（舊 soft_romance smoke-test，非灯定稿）、`bae649ab`（key visual，改褲子前冬裝版）、`38cad997`（standee，改褲子前，被 225bc2d9 取代） |
| **rejected** | 未逐張標記（167 張草案中失敗的雙眼/錯位/口罩消失等都在 generated/ 草案池，未單獨搬移） |

## 3. 被移到一旁的檔案（mv，未刪除）

→ `art_tool/art_archive/unconfirmed_adopted/`（10 檔）：
```
character_rough_034fe593_v001.{png,json}
character_rough_1920d07d_v001.{png,json}   ← 原為 git tracked，移位後在舊位置顯示 deleted（未 commit）
character_rough_5b98ca66_v001.{png,json}   ← 原為 git tracked，同上
key_visual_portrait_bae649ab_v001.{png,json}
transparent_standee_38cad997_v001.{png,json}
```

→ `art_tool/art_review/needs_manual_cleanup/`（cp，generated/ 原檔保留）：
```
akari_disguise_base_mask_off_DRAFT.png   (源 225bc2d9)  ← 基準/頭身比基準
akari_disguise_mask_on_DRAFT.png         (源 89f0cdfc)
akari_disguise_mask_half_DRAFT.png       (源 f2418510)  ← 需人工修口罩
```

## 4. 仍留在正式素材區的圖
- `public/assets/characters/hoshino_akari/`：**已清空**（無未確認圖殘留）
- `public/assets/cg/`：空
- → 正式素材區目前乾淨、不含任何未確認 AI 圖。新的 approved 素材待人工清理後再放入。

## 5. 是否有遊戲資料引用未確認圖片
**無。** 已 grep `content/`、`public/*.js`、`public/*.html`：玩家端遊戲資料**完全沒有引用**任何 Akari 美術圖（Akari 線目前未接進遊戲）。移動這些圖不會破壞任何引用。

## 6. asset_manifest.draft.json 摘要
`art_tool/art_review/asset_manifest.draft.json`，含：
- `canonical_design`（confirmed：黑長髮/青綠眼/深帽/連帽衣/白圍巾/黑窄管褲/疏離感）
- `style`（D 組 LoRA：gpt-image-2 0.7 + dogma 0.4，排除 NSS/highres/turbo）
- `current_drafts`（上述 3 張 draft 對應 mask 三態）
- `sprite_plan`（8 張 P0 planned 立繪）
- `p0_limits`（立繪≤8/表情≤6/衣裝≤2/姿勢≤2/CG≤4/背景≤5）
- `manual_cleanup_policy`（AI=draft、人工清理後才 approved）

## ⚠️ 需你裁定的關鍵不一致（LoRA）
你本次確認 canonical = **D 組（gpt 0.7 + dogma 0.4，無 NSS）**。
但目前 `art_config/art_styles.json` 的 `anima_airbrush_editorial` 實際是**觸發詞還原版**（gpt 0.75 + **NSS 0.70** + dogma 0.60 + `(kishida mel:0.5)` + 觸發詞）——這是後來追風格時改的，效果上更接近參考圖。
**兩者不一致。** manifest 先按你本次指定的 D 組記錄。本次只整理、**未改 config**。請你裁定哪個為準，下次再同步 config。

## 7. 報告路徑
`art_tool/art_review/ASSET_CLEANUP_REPORT.md`（本檔）

## 8. git status（整理後）
- 新增（untracked）：`art_tool/art_archive/**`、`art_tool/art_review/**`（含本報告、manifest、3 張 draft png、10 個移入的 adopted 檔）
- 變更（tracked，未 commit）：`characters/hoshino_akari/character_rough_{1920d07d,5b98ca66}_v001.*` 顯示為 **deleted**（已移到 unconfirmed_adopted，內容未失，可還原）
- `art_config/*`、`tests/*` 等程式碼：本次**未動**
- generated/ 圖：gitignored，不影響 git status

## 9. 建議
- **暫不 commit**（你已指示）。若日後要把整理結果入版控，建議：
  1. 對 `art_tool/art_archive/**` 與 `art_tool/art_review/needs_manual_cleanup/*.png`（大量/大型 PNG）加 `.gitignore`，只 commit 文字（report + manifest）；
  2. 或整批 commit 為一個「chore: art asset cleanup」。
- **LoRA 不一致**請先裁定（見上）。
- 下一步真正要做素材時，照 manual_cleanup_policy：AI 出 draft → 你人工清理 → approved 才進 `characters/`。
