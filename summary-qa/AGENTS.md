# summary-qa - 智能体详细指令

> **问题反馈与贡献**: 使用本技能遇到问题时，请先查阅 [GitHub Issues](https://github.com/ThymeD/skills/issues) 和项目级 [AGENTS.md](../AGENTS.md#问题反馈与贡献指南)。AI 工具应具备自主排查和贡献解决方案的能力。

## 概述

summary-qa 技能用于从文章或文档提炼要点，输出简体中文复习包：单选/判断题（含章节标题与摘录出处）与要点总结。

## 触发条件

用户提及以下任一关键词时触发：
- "总结"、"出题"、"复习"、"单选"、"判断"、"要点"
- "summarize"、"quiz"、"MCQ"、"study pack"、"article review"

## 工作流程

1. **获取正文**：用户提供 URL、本地路径或粘贴正文时，先通过环境工具获取可读文本
2. **步骤 0（可选）**：若目标题数 N > 20 或相对材料明显偏高，须先与用户协商题数
3. **步骤 1**：完成通知 - 告知已理解材料并完成出题，共 N 道题
4. **步骤 2**：逐题作答 - 默认每次展示一道题，用户答完再发下一题
5. **步骤 3**：判分与讲评 - 用户全部作答后，输出总体结果表、逐题明细表和解析
6. **步骤 4**：文章总结 - 输出完整学习总结
7. **步骤 5（可选）**：文章明显问题提醒
8. **步骤 6（可选）**：反馈与记忆收集

## 核心规则

- **输出语种**：对用户可见内容默认使用简体中文，无论输入材料语种
- **出题数量**：默认 5～10 道题；N > 20 须先协商
- **题目质量**：每题标注质量等级（高/中/低），按高→中→低排列
- **题面节奏**：默认逐题展示，禁止一次性贴出多题（除非用户主动要求）
- **先考后讲**：答题前不输出答案、解析或完整总结

## 数据文件

`{baseDir}` 指 SKILL.md 所在目录（技能根目录）。

| 路径 | 用途 |
|------|------|
| `{baseDir}/data/memory.md` | 用户确认后的长期偏好与约束 |
| `{baseDir}/data/feedback.jsonl` | 每行一条 JSON 反馈记录 |
| `{baseDir}/data/cases/` | 高质量题目案例 |
| `{baseDir}/data/archive/` | 退役案例归档 |

**落盘降级**：若无写权限或目录不存在且无法创建，则跳过落盘，仅在对话中收集反馈或偏好，并一句说明未写入本地文件。

## 附加资源

- 出题规范与自检：[rubric.md](rubric.md)
- 输出与反馈结构：[schemas.md](schemas.md)
- 最小示例：[examples.md](examples.md)

## 部署位置

- **OpenCode**：`.opencode/skills/summary-qa/`（项目）或 `~/.config/opencode/skills/summary-qa/`（全局）
- **OpenClaw**：`<workspace>/skills/summary-qa/` 或 `~/.openclaw/skills/`
- **Cursor**：`.cursor/skills/summary-qa/`（项目）或 `~/.cursor/skills/summary-qa/`（全局）
