---
name: project-ai-init
description: 项目级 AI 环境初始化。触发词：创建项目、新项目、项目初始化等。
metadata:
  author: local
  version: 1.0.0
---

# Project AI Init Skill

## 描述

在项目根目录创建 AGENTS.md，让 AI 重启后能读取项目配置。

## 触发词

当用户说以下话术时触发：
- 创建项目
- 新项目
- 项目初始化
- 初始化项目

## 核心职责

### 1. 检测项目状态

- 检测当前目录下是否存在 `AGENTS.md`
- 不存在 → 开始创建
- 存在 → 检查是否已有工作流描述
  - 有 → 提示：已有工作流，跳过
  - 没有 → 询问是否添加工作流描述

### 2. 创建/更新项目级 AGENTS.md

- 不存在 → 读取 skill 目录下的 AGENTS.md 模板，替换项目路径为当前目录，替换日期为当前时间，写入项目根目录
- 存在但无工作流 → 询问是否添加工作流描述
- 存在且有工作流 → 跳过

### 3. 等待用户确认

输出：
1. 已完成：项目级 AGENTS.md 已创建
2. 提醒：请复制/备份好您的需求内容
3. 子 agent 配置（可选）：打开目录 `%USERPROFILE%\.config\opencode\skills\thymed-skills\project-ai-init\`，将 agents/ 和 workflow.md 复制到 agent 配置目录。如果没有配置子 agent，工作流将无法自动调用各环节的 agent，需要人工处理。
4. 下一步：关闭窗口，重启 OpenCode

用户确认后 → 结束

## 重要说明

- 只负责创建 AGENTS.md，不负责其他初始化
- 除非用户明确说"不需要"，否则创建项目时都会触发
- 子 agent 需要用户手动配置，详见 docs/README.md
