# 结构化输出与反馈（summary-qa）

以下约定便于 CLI/TUI 渲染（含鼠标点击选项）。实际输出可用 **Markdown 标题 + 表格/列表**，字段名保持一致。

## StudyPack（学习包）

```yaml
pack_id: string          # 本次生成批次 ID，如 UUID 或时间戳
source_type: url | text
source_ref: string       # URL 或「用户粘贴/文件说明」
locale: zh-CN
summary:
  core_thesis: string    # 核心观点（1 段）
  key_points:            # 结构化要点列表
    - id: kp1
      title: string
      bullets: [string]
coverage:                  # 材料过长或部分处理时必填；否则可标注 full 或省略未覆盖
  status: partial | full
  covered_sections: [string]   # 本次覆盖的标题或范围描述
  not_covered: [string]        # 未纳入总结/出题的范围及原因（如非核心、长度限制）
questions:
  - id: q1
    type: single | boolean
    stem: string
    options:                 # 仅 single；boolean 可无或固定 true/false 标签
      A: string
      B: string
      C: string
      D: string
    correct: A | B | C | D | true | false
    explanation: string
    source_ref:
      section_title: string
      excerpt: string          # 保持原文以便核对
post_review:                   # 题后板块；无内容则整段省略
  misleading_alerts:           # 仅非常低级明显误导时填写；否则空数组
    - claim: string            # 材料中的说法摘要
      section_title: string
      excerpt: string
      note: string             # 简短提醒，避免冗长辩论
```

## FeedbackItem（单条反馈，一行 JSON）

写入 `{baseDir}/data/feedback.jsonl`，每行一个 JSON 对象：

```json
{
  "pack_id": "string",
  "question_id": "string",
  "ts": "ISO8601",
  "rating": "up | down | neutral",
  "issue_targets": ["stem", "option_a", "option_b", "option_c", "option_d", "explanation", "source", "other"],
  "issue_types": ["unclear", "too_hard", "too_easy", "mismatch_source", "option_weak", "other"],
  "comment": "",
  "missing_topic": ""
}
```

- `issue_targets`、`issue_types` 可为数组；无勾选则空数组。
- `comment` 可选。
- `missing_topic`：用户认为重要但未出题的要点（可选）。

## Memory（`{baseDir}/data/memory.md`）

经用户确认后，以 Markdown 记录约定，例如：

- 偏好题型侧重（仍仅限单选/判断）。
- 总结长度偏好（简版/标准）。
- 是否默认展示题后「误导提醒」（本 Skill 默认为：有则展示，无则不展示）。
