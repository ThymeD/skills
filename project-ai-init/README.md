# Project AI Init

项目级 AI 环境初始化。

## 功能

- 在项目根目录创建 AGENTS.md
- 包含完整的工作流规则配置
- 为项目提供 AI 工作流能力

## 触发条件

- 创建项目
- 新项目
- 项目初始化
- 初始化项目

## 使用流程

1. 用户触发 skill
2. 检测项目是否已有 AGENTS.md
3. 如果没有，读取 skill 内的 AGENTS.md 模板
4. 替换项目路径和日期
5. 写入项目根目录

## 子 Agent 配置

本 skill 包含以下子 agent 定义文件：

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

### 配置方法

将 `agents/` 目录下的文件复制到您的 agent 配置目录：
- **Windows**: `%USERPROFILE%\.config\opencode\agent\`
- **Mac/Linux**: `~/.config/opencode/agent/`

**注意**：如果没有配置子 agent，工作流将无法自动调用各环节的 agent，需要人工处理。

## 文件说明

```
project-ai-init/
├── SKILL.md              # 主逻辑
├── AGENTS.md             # 项目 AGENTS.md 模板
├── agents/               # 子 agent 定义文件
│   ├── architect.md
│   ├── coder.md
│   └── ...
└── docs/
    └── README.md
```

## 重要说明

- 只负责创建 AGENTS.md，不负责其他初始化
- 子 agent 需要用户手动配置
