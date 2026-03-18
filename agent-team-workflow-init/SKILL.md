---
name: agent-team-workflow-init
description: 多Agent团队协作工作流初始化。触发词：初始化工作流、工作流初始化、配置agent团队等。
metadata:
  author: local
  version: 1.0.0
  updated: 2026-03-18
---

# 多Agent团队协作工作流初始化

## 描述

为项目初始化多Agent团队协作工作流，包括：
- 创建协作文件模板（collaboration.md）
- 创建评价文件模板（evaluation.md）
- 创建项目级 AGENTS.md
- 创建各agent定义文件

## 触发词

当用户说以下话术时触发：
- 初始化工作流
- 工作流初始化
- 配置agent团队
- 初始化多agent协作
- 给我项目配置工作流

## 核心职责

### 1. 检测项目状态

- 检测当前目录下是否存在 `AGENTS.md`
- 检测是否存在 `collaboration.md`
- 根据检测结果决定如何初始化

### 2. 初始化项目

#### 2.1 创建协作文件

- 复制 `templates/collaboration.md` 到项目根目录
- 替换项目名称、启动时间

#### 2.2 创建评价文件

- 复制 `templates/evaluation.md` 到项目根目录
- 替换项目名称

#### 2.3 创建项目AGENTS.md

- 复制 `templates/project-AGENTS.md` 到项目根目录为 `AGENTS.md`
- 替换项目名称、初始化时间

#### 2.4 创建agent定义文件

从 `agents/` 目录复制各agent定义文件到项目 `agents/` 目录：
- pm.md
- requirements-manager.md
- architect.md
- ui-designer.md
- coder.md
- committer.md
- automation-tester.md
- ui-tester.md
- docs-writer.md

#### 2.5 创建目录结构

```
项目根目录/
├── collaboration.md      ← 从templates复制
├── evaluation.md         ← 从templates复制
├── AGENTS.md            ← 从templates复制
├── agent-team-workflow.md ← 从templates复制
├── agents/              ← 从skill agents/复制
├── requirements/        ← 需求产出目录（需创建）
├── docs/                ← 架构/文档产出目录（需创建）
├── design/              ← 设计产出目录（需创建）
├── src/                 ← 代码产出目录（需创建）
├── tests/               ← 测试产出目录（需创建）
│   └── ui/              ← UI测试目录（需创建）
└── evaluation/          ← 考核文件目录（需创建）
    ├── daily/           ← 日常评价
    ├── self-summary/    ← 各agent绩效总结
    ├── stage/            ← 阶段考评
    ├── cycle/            ← 周期复盘
    ├── personal/         ← 个人考核
    ├── retrospective/     ← 复盘报告
    └── team/            ← 团队变动
```

### 3. 等待用户确认

输出：
1. 已完成：工作流初始化完成
2. 创建的文件清单
3. 下一步指引

## 文件清单

初始化后会创建以下文件：

| 文件 | 说明 |
|------|------|
| collaboration.md | 协作文件模板 |
| evaluation.md | 评价文件模板 |
| AGENTS.md | 项目级agent配置 |
| agents/pm.md | PM agent定义 |
| agents/requirements-manager.md | 需求分析agent定义 |
| agents/architect.md | 架构设计agent定义 |
| agents/ui-designer.md | 界面设计agent定义 |
| agents/coder.md | 代码实现agent定义 |
| agents/committer.md | 代码审核agent定义 |
| agents/automation-tester.md | 自动化测试agent定义 |
| agents/ui-tester.md | UI测试agent定义 |
| agents/docs-writer.md | 文档编写agent定义 |

## 工作流说明

详见 `agent-team-workflow.md`（原始稿）

## 重要说明

- 本skill只负责初始化，不负责工作流规范的定义
- 工作流规范在 `agent-team-workflow.md` 中定义
- agent定义文件从 `agents/` 目录复制
- 原始稿 `agent-team-workflow.md` 也需要复制到项目（参考用）

## 初始化详细步骤

### Step 1: 检测项目目录

```
检测当前目录是否为有效项目目录
    ↓
检测是否已存在工作流文件
```

### Step 2: 复制模板文件

| 操作 | 源文件 | 目标位置 |
|------|--------|----------|
| 复制 | templates/collaboration.md | 项目根目录/ |
| 复制 | templates/evaluation.md | 项目根目录/ |
| 复制 | templates/project-AGENTS.md | 项目根目录/AGENTS.md |
| 复制 | templates/agent-team-workflow.md | 项目根目录/ |

### Step 3: 替换变量

| 变量 | 替换为 |
|------|--------|
| [项目名] | 当前项目名称 |
| [时间] | 当前时间 |
| [release版本号] | 当前版本（如v1.0.0） |

### Step 4: 创建目录结构

```
项目根目录/
├── collaboration.md      ← 从templates复制
├── evaluation.md         ← 从templates复制
├── AGENTS.md            ← 从templates复制
├── agent-team-workflow.md ← 从templates复制
├── agents/              ← 从skill agents/复制
├── requirements/        ← 需求产出目录（需创建）
├── docs/                ← 架构/文档产出目录（需创建）
├── design/              ← 设计产出目录（需创建）
├── src/                 ← 代码产出目录（需创建）
├── tests/               ← 测试产出目录（需创建）
│   └── ui/              ← UI测试目录（需创建）
└── evaluation/          ← 考核文件目录（需创建）
    ├── daily/           ← 日常评价
    ├── self-summary/    ← 各agent绩效总结
    ├── stage/            ← 阶段考评
    ├── cycle/            ← 周期复盘
    ├── personal/         ← 个人考核
    ├── retrospective/     ← 复盘报告
    └── team/            ← 团队变动
```

### Step 5: 复制agent定义文件

将 `agents/` 目录下的所有agent定义文件复制到项目的 `agents/` 目录。

### Step 6: 输出完成报告

```
已完成：工作流初始化完成
    ↓
创建的文件清单
    ↓
下一步指引
```
