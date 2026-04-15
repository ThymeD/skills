# 多Agent团队协作工作流初始化

## 概述

本skill用于为项目初始化多Agent团队协作工作流。

## 文件结构

```
agent-team-workflow-init/
├── SKILL.md              # skill主文件
├── docs/
│   └── README.md         # 说明文档（本文件）
├── templates/
│   ├── collaboration.md     # 协作文件模板
│   ├── project-AGENTS.md    # 项目级AGENTS.md模板
│   └── agent-team-workflow.md # 工作流规范模板
└── agents/               # agent定义文件
    ├── pm.md
    ├── requirements-manager.md
    ├── architect.md
    ├── ui-designer.md
    ├── coder.md
    ├── committer.md
    ├── automation-tester.md
    ├── ui-tester.md
    └── docs-writer.md
```

## 初始化内容

### 1. 协作文件（collaboration.md）

协作文件是整个工作流的核心，包含：
- 项目信息
- 需求进度
- 最新任务
- 进度追踪
- 产出约定

### 2. Agent定义文件

每个agent有独立的定义文件，包含：
- 角色名称
- 职责描述
- 产出要求
- 协作规范
- Git操作规范
- 验证节点

## Agent列表

| agent | 职责 |
|-------|------|
| PM | 任务管家、协调者 |
| requirements-manager | 需求分析 |
| architect | 技术方案设计 |
| ui-designer | 界面设计 |
| coder | 代码实现 |
| committer | 代码审核 + 合入develop |
| automation-tester | 自动化测试 |
| ui-tester | UI测试 |
| docs-writer | 文档编写 |

## 工作流说明

详见 `agent-team-workflow.md`（原始稿）

## 使用方法

### 触发skill

当用户说以下话术时触发：
- 初始化工作流
- 工作流初始化
- 配置agent团队
- 初始化多agent协作
- 给我项目配置工作流

### 初始化流程

1. 检测项目状态
2. 创建协作文件（collaboration.md）
3. 复制agent定义文件到agents/目录
4. 创建项目级AGENTS.md
5. 用户确认完成

## 后续步骤

初始化完成后：

1. 阅读 `collaboration.md` 了解项目结构
2. 阅读各agent定义文件了解职责
3. 参考 `agent-team-workflow.md` 了解工作流规范
4. 开始使用工作流

## 注意事项

- 本skill只负责初始化，不负责工作流规范的定义
- 工作流规范在 `agent-team-workflow.md` 中定义
- agent定义文件需要根据项目实际情况调整
