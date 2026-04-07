# 结构化输出与反馈（summary-qa）

以下约定便于 CLI/TUI 渲染（含鼠标点击选项）。实际输出可用 **Markdown 标题 + 表格/列表**，字段名保持一致。

## 对用户输出的阶段顺序（强制）

与 [SKILL.md](SKILL.md) 一致：**步骤 1** 完成通知 → **步骤 2** 仅题面（无答案；**默认逐题**，勿让用户选答题方式）→ **步骤 3** 表格汇总 + 逐题解析 → **步骤 4** 文章总结 → **步骤 5** 明显问题提醒（可选）。**默认推荐**与用户**明确指令**的优先级见 SKILL「宿主环境与会话形态」。  
`StudyPack` 中的 `questions` 在**步骤 2** 中只展示 `stem`、`options`（及 `type`）；`correct`、`explanation` 仅在**步骤 3** 及之后向用户展示。`questions` **数组顺序**默认与步骤 2 一致：**质量从高到低**（`q1` 对应卷内最高档），见 [rubric.md](rubric.md)「题目呈现顺序」。

## 步骤 3 对用户输出结构（判分与讲评）

1. **总体结果表**：一行，列：总题数、答对、答错、得分率。  
2. **逐题明细表**：列：题号、题型、结果（✓/✗ 等）、完整题干、你的选择（`字母 — 选项全文`）、正确答案（同左）。题干须与步骤 2 完全一致；长文本表优先 HTML `<table>` + 单元格内 `<br>`。  
3. **逐题解析**：在表外，按题号分段，短解析 + 可选出处；不重复贴全文题干。

出题数量约定见 [SKILL.md](SKILL.md) 职责边界与 [rubric.md](rubric.md)「出题数量」；`questions` 数组长度应与步骤 1 中的 N 一致。

## StudyPack（学习包）

```yaml
pack_id: string          # 本次生成批次 ID，如 UUID 或时间戳
source_type: url | file | text
source_ref: string       # URL；或本地路径（工具已成功读取后记录，便于追溯）；或「用户粘贴」等简短说明
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
questions:                 # 默认按质量高→低排列；id/q1 表示全卷第一题（最重要）
  - id: q1
    type: single | boolean
    stem: string
    options:                 # single：A–D；boolean：仅 A、B 两项（如 正确/错误），展示时必须有 A/B 标签
      A: string
      B: string
      C: string              # boolean 题省略 C、D 或留空
      D: string
    correct: A | B | C | D    # 对内存储：判断题也用 A 或 B；命题时须打乱选项顺序，避免正确答案总落在同一字母（见 rubric.md）
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
