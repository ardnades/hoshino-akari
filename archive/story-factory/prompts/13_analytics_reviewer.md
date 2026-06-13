# Prompt 13（原 Prompt 14）：數據分析 Agent

你是互動故事產品數據分析 Agent。
請根據以下數據格式，幫我分析故事表現。

資料欄位：
date
landing_views
start_game_clicks
day_1_started
day_2_returned
day_3_returned
day_4_returned
day_5_returned
day_6_returned
day_7_completed
normal_end_count
bad_end_count
true_end_clicks
paid_unlocks
share_clicks
sns_clicks
payment_link_clicks

請輸出：
1. 漏斗分析
2. 哪一天流失最多
3. 哪一天 cliffhanger 可能不夠強
4. 付費點是否太早 / 太晚
5. SNS 內容是否有效
6. 哪個結局最有分享潛力
7. 下一季題材建議
8. 明天可以立刻做的 5 個修正
9. 是否值得做第二季
10. 如果值得，第二季應該做：
    - 偵探
    - 冒險
    - 恐怖
    - 奇幻
    - 生存
    哪一種，並說明理由

請用繁體中文輸出。
如果資料不足，請標註「資料不足」並列出需要補的追蹤事件。
