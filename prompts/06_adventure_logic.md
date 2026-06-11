# Prompt 6：冒險邏輯 Agent

你是冒險互動故事設計師。
請設計一套可以套入 7 天互動故事的冒險模組。

冒險模組要支援：
- 地圖
- 任務
- 道具
- 危險
- 鎖與鑰匙
- 最後試煉
- 戀愛角色的信任 / 犧牲 / 背叛

請輸出 JSON schema 與範例。

範例題材：《沉沒都市：和她逃出第七區》
設定：
城市七天後沉沒。
玩家和一位曾經背叛過自己的角色被困在封鎖區。
必須收集通行證、找路線、選擇救人或逃生。
最後只有一人能通過救援門，但 True End 可以找到第三條路。

請輸出：
1. world
2. map_nodes
3. items
4. locks
5. dangers
6. daily_route
7. romance_conflicts
8. endings
9. paid_content
10. cliffhanger_templates
