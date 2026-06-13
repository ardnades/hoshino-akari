draft/ — 草案層（指標目錄，刻意不放重檔）
============================================================

本目錄是 5 個狀態目錄（draft / fix_ready / approved / rejected / archive）之一，
代表「AI 剛產出、尚未挑選的原始候選圖」這一層的語意位置。

但實際的草案候選池並不放在這裡，而在：

    public/assets/generated/

原因：
- generated/ 已收錄約 170 張 AI candidate PNG（character_rough 11 / key_visual_portrait 73 /
  transparent_standee 86），對應 metadata.json 共 182 筆紀錄（status 多為 candidate，少數 accepted）。
- generated/ 已被 .gitignore 忽略（不入版控），是專案既定的「草案／實驗池」。
- 為避免重複佔用磁碟與版控，本 draft/ 不複製那 170 張重檔；本檔僅作指標。

工作流程定位（管線方向）：
    generated/（草案池，本目錄指向它）
        -> fix_ready/（被挑中、待人工修圖的可修基底）
        -> approved/（人工清理＋去背後、可穩定重複使用的正式素材）
    旁支：rejected/（明確不採用）、archive/（被取代的歷史版本）

權威清單與每張圖狀態，請見：
    ../manifest.json
    art_tool/character_pipeline/hoshino_akari/05_asset_pipeline.md

政策（凍結）：AI 產出一律 draft；人工清理後才 approved。
本目錄之後若要放東西，只放「指向 generated/ 內特定 asset_id 的小型挑選清單／符號連結」，
不要把 generated/ 的大圖整批複製進來。
