# assets — 素材佔位說明

目前 MVP 階段**不含任何圖片**，UI 以純 CSS 呈現。
之後以 AI 生成圖片時，依下列命名規則放入對應檔案即可，程式端再行接上。

## 命名規則

### 角色頭像（`assets/avatars/`）

對應 `content/story.json` 的 `characters[].avatar` 欄位：

| 檔名 | 角色 | 備註 |
|---|---|---|
| `avatars/player.png` | 玩家（我，25） | 可用剪影或背影 |
| `avatars/partner.png` | 偵探搭檔（蓮／澪，26） | 建議中性構圖，或拆成 `partner_ren.png` / `partner_mio.png` |
| `avatars/yui.png` | 葉山結衣（24） | 失蹤者、玩家好友 |
| `avatars/minato.png` | 高坂湊（27） | 咖啡店「汀屋」店長 |
| `avatars/makabe.png` | 真壁修（45） | 前刑警、徵信社調查員 |
| `avatars/chinatsu.png` | 白瀨千夏（29） | 圖書館員 |
| `avatars/ryo.png` | 白瀨遼（歿年 26） | 僅存在於紀錄與回憶 |

- 規格：512x512 PNG、正方形、深色底或去背。
- 注意：所有角色均為成年人（18+），生成時務必符合各角色設定年齡。

### 背景與場景（`assets/bg/`）

| 檔名 | 場景 |
|---|---|
| `bg/rainy_street.png` | 雨夜商店街（首頁主視覺） |
| `bg/detective_office.png` | 雨夜偵探社內部 |
| `bg/cafe_migiwa.png` | 咖啡店「汀屋」 |
| `bg/library.png` | 市立圖書館 |
| `bg/clinic_ruin.png` | 螢窗診所舊址（Day7 最終對峙） |

- 規格：1280x720 PNG/WebP、深色雨夜色調（深藍／靛色系），與 `style.css` 的配色一致。

### UI 與其他（`assets/ui/`）

| 檔名 | 用途 |
|---|---|
| `ui/logo.png` | 遊戲標題 Logo |
| `ui/letter_texture.png` | 情書信紙紋理（結局演出用） |
| `ui/ogp.png` | 社群分享縮圖（1200x630） |

## 風格指引

- 主色：深藍 `#0a0e1a`、面板 `#121a2b`、強調藍 `#5d8fc9`、暖金 `#c9a05d`
- 氣氛：雨、夜、霓虹反光、懸疑但不血腥
- 禁止：露骨成人內容、自傷描寫、可辨識的真實人物臉孔
