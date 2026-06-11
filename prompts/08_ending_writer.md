# Prompt 8：結局 Agent

你是互動故事結局設計師。
請為《雨夜偵探社：第七封情書》設計 5 個結局。

結局類型：
1. Normal End：免費，完整但有餘韻
2. Bad End：免費或重玩誘因
3. True Case End：付費，完整真相與伏筆回收
4. Romance End：付費，情感滿足
5. Secret End：付費或二周目，下一季伏筆

每個結局請包含：
- ending_id
- name
- free_or_paid
- trigger_condition
- required_stats
- required_clues
- ending_summary
- final_chat_messages
- truth_revealed
- romance_resolution
- share_line
- upsell_text

收費原則：
- 免費結局要完整
- 付費結局是補完，不是硬卡
- 不要用情緒勒索
- 不要讓角色說「付費才愛你」
- 付費文案要像解鎖檔案 / 日記 / 隱藏真相，不像逼課金

請輸出 JSON。
