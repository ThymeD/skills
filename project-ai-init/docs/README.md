# 子 Agent 使用说明

本 skill 包含项目开发所需的子 agent 定义文件和工作流规则。

## 文件说明

### agents/ 目录

包含以下子 agent 定义文件：

| 文件 | 职责 |
|------|------|
| architect.md | 技术方案、架构设计 |
| coder.md | 代码实现 |
| requirements-manager.md | 需求管理 |
| ui-designer.md | 界面设计 |
| code-reviewer.md | 代码审查 |
| project-builder.md | 构建验证 |
| tester.md | 测试 |
| docs-writer.md | 文档编写 |
| task-tracker.md | 任务跟踪 |
| poc-agent.md | POC 验证 |

### workflow.md

项目工作流规则，包含敏感度分级、POC 机制、用户确认节点等。

## 使用方式

### 方式一：复制到全局 agent 目录

将 agents/ 目录下的文件复制到您的 agent 配置目录：

- **Windows**: `C:\Users\<用户名>\.config\opencode\agent\`
- **Mac/Linux**: `~/.config/opencode/agent/`

将 workflow.md 复制到同一目录。

### 方式二：复制到项目目录

如果您只需要在特定项目中使用，可以将 agents/ 复制到项目目录的 `.opencode/agent/` 下。

## 工作流简介

项目开发采用敏感度分级：

- **P0**：微小改动（改颜色、错别字）→ coder → tester
- **P1**：小改动（小 bug 修复）→ coder → code-reviewer → tester
- **P2**：中改动（新增功能）→ 完整流程
- **P3**：大需求（新页面）→ 完整流程 + docs

## 注意事项

- 这些文件是模板，您可以根据项目需求修改
- 建议先初始化全局 agent 配置，后续项目可以直接复用
