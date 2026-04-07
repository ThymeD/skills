---
name: summary-qa
description: 从文章或文档提炼要点并生成简体中文总结，配套单选/判断题复习关键知识点，附「章节标题+摘录」出处；题后仅在存在明显低级误导时简要提示。在用户阅读文章并提交内容、需要「总结+出题复习」时使用。输入可为 URL（需环境先取得正文）或粘贴文本。
license: MIT
compatibility: opencode
metadata: {"title_zh":"总结与要点测验","primary_goals":"summarize,quiz,review","locale":"zh-CN","compat":"opencode,openclaw"}
---

# summary-qa（总结与要点测验）

## 职责边界

**本 Skill 负责**

- 把输入材料整理成**可复习的学习包**：提炼总结 + **单选题 / 判断题**（按知识性质选用，不强制比例）+ 每题**出处**。
- 当输入为 **URL** 时：明确要求运行环境先**获取该 URL 的有效正文**；若无法获取，说明原因并请用户粘贴正文或导出可读文本后再继续。
- 当输入为**本地或粘贴文本**时：直接基于文本执行总结与出题。
- **题后**按需输出「核对与争议点」：仅当存在**非常低级、明显误导**时再简短提醒，并附依据；**无则省略**。该部分内容**不得用于出题**。
- 引导用户完成**勾选式反馈**（理由可选），并基于历史反馈提出**优化建议**；**写入 `{baseDir}/data/memory.md` 前必须经用户明确确认**。

**本 Skill 不负责**

- 不实现网络请求、登录、渲染、PDF 解析等；这些由运行环境（如 OpenCode、OpenClaw 及配套工具）完成。
- 不以「全文均匀覆盖」为目标；以**文章核心观点与复习价值**为导向。超长或上下文不足时，必须给出**覆盖范围声明**。

---

## 何时加载本 Skill

在以下场景应加载并遵循本 Skill：

- 用户提供**文章链接、粘贴正文、或文档片段**，并希望获得**中文总结 + 测验题**以巩固要点。
- 用户明确提到「总结」「出题」「复习」「单选」「判断」「要点」等与**提炼+测验**相关的需求。

---

## 语言规范

- **Skill 指令与用户可见输出**（说明文字、总结、题干、选项、解析）**默认使用简体中文**。
- **例外**（保留原文或非中文）：代码与命令、专有名词/品牌、API 与字段名、数学与符号、**出处摘录**（保持原文以便核对）、法规编号、用户明确要求使用的语言。
- 专有名词可**首次出现中英并列**，后续以中文叙述为主。

细则见 [rubric.md](rubric.md)。

---

## 三阶段工作流

### 阶段 A：生成学习包（先不展开「核对与争议点」细节）

1. **归纳核心观点与结构化要点**（服务复习，避免事无巨细）。
2. 生成题目：**仅单选、判断**；题型由知识点性质决定。
3. 每题必须包含 **出处**：默认 **章节标题（或小节标题）+ 摘录**（见 [schemas.md](schemas.md)）。
4. 若材料过长或仅能处理部分：输出 **Coverage（覆盖声明）**，说明本次覆盖范围、未覆盖部分及如何继续（见 [schemas.md](schemas.md)）。

### 阶段 B：做题与交互

- 题目应便于 CLI/TUI **鼠标点击**：选项枚举稳定（单选 A/B/C/D；判断 是/否 或 正确/错误）。
- 展示解析时机：可在全部作答后统一展示，或逐题展示（按用户/环境偏好）。

### 阶段 C：题后复盘

1. 公布参考答案与简短解析（复习导向，不钻牛角尖）。
2. **核对与争议点**（可选板块）：**有则展示，无则不展示**。仅在**明显低级误导**时提醒，附「章节标题 + 摘录」；不过度较真。
3. **反馈收集**：按 [schemas.md](schemas.md) 中的 `FeedbackItem` 引导勾选；理由可选。
4. **优化建议**：可基于 `{baseDir}/data/feedback.jsonl` 与本轮反馈列出建议；**仅当用户确认**后，将约定写入 `{baseDir}/data/memory.md`。

---

## 数据文件（均在当前 Skill 目录下）

OpenClaw 约定用 `{baseDir}` 表示本技能文件夹根路径（见 [OpenClaw Skills](https://docs.openclaw.ai/zh-CN/tools/skills)）；其他环境也可用「技能根目录」理解。

| 路径 | 用途 |
|------|------|
| `{baseDir}/data/memory.md` | 用户确认后的长期偏好与约束 |
| `{baseDir}/data/feedback.jsonl` | 每行一条 JSON 反馈记录，追加写入 |
| `{baseDir}/data/cases/` | 高质量题目案例（晋升规则见下） |
| `{baseDir}/data/archive/` | 退役案例归档 |

**案例晋升（简版）**：用户多次正向反馈或明确标记为范例的题目，可摘要写入 `{baseDir}/data/cases/`；过时或多次负向反馈的可移至 `{baseDir}/data/archive/`。

**自定义路径**：当前版本**不支持**更改数据目录；一律使用上述相对路径。

**部署位置提示**：OpenClaw 优先从工作区 `<workspace>/skills/<name>/` 加载（优先级最高）；亦支持 `~/.openclaw/skills`、`~/.agents/skills` 等，详见官方文档。

---

## 与环境的协作（URL）

1. 若输入为 URL：先通过环境能力获取**可读正文**。
2. 若失败：明确告知，并请用户**粘贴正文**或使用其他导出方式。
3. 获取成功后：再执行总结与出题。

---

## 附加资源（按需阅读）

- 出题规范与自检：[rubric.md](rubric.md)
- 输出与反馈结构：[schemas.md](schemas.md)
- 最小示例：[examples.md](examples.md)

---

## Frontmatter 与双平台兼容说明

本文件同时面向 [OpenCode 代理技能](https://opencode.ai/docs/zh-cn/skills/) 与 [OpenClaw Skills](https://docs.openclaw.ai/zh-CN/tools/skills)：

| 项 | OpenCode | OpenClaw |
|----|----------|----------|
| `name` / `description` | 必填；`description` 1–1024 字符 | 必填 |
| `metadata` | 须为**字符串到字符串**的映射；本文件用**单行 JSON**，且**所有值为字符串**（含 `compat`） | 须为**单行 JSON 对象**；未知键可忽略 |
| `license` / `compatibility` | 可选；`compatibility` 常用 `opencode` | 未列出的键一般忽略，不影响加载 |
| 正文路径 | 相对技能根目录即可 | 数据与资源路径建议写 `{baseDir}/...` |

部署目录名须与 `name` 一致（`summary-qa`）。OpenClaw 常见路径为 `<workspace>/skills/summary-qa/`；OpenCode 常见路径为 `.opencode/skills/summary-qa/`。
