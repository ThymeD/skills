# Skill Manager - 智能体详细指令

**版本 1.3.0**

> **问题反馈与贡献**: 使用本技能遇到问题时，请先查阅 [GitHub Issues](https://github.com/ThymeD/skills/issues) 和项目级 [AGENTS.md](../AGENTS.md#问题反馈与贡献指南)。AI 工具应具备自主排查和贡献解决方案的能力。

本文档为智能体提供管理本地已安装 AI Agent Skills 的详细指令。

---

## 概述

Skill Manager 管理本地已安装的 AI Agent Skills，包括版本检查和更新。

**核心功能：**
1. 列出本地 skills
2. 检查 skills 更新
3. 搜索 skills
4. 维护缓存
5. **安装技能后自动刷新缓存**

---

## 触发条件

当用户说以下话术时使用此技能：
- "检查 skills 更新"、"更新 skills"
- "查看已安装 skills"、"查看已安装的技能"
- "看看本地有哪些 skill"、"看看有哪些技能"、"列出本地 skills"
- "本地有哪些技能"、"当前有哪些技能"
- "技能管理"、"管理 skills"
- **"安装 skill"、"add skill"、"安装一个 skill"** - 安装技能后自动刷新缓存

### 重要：安装技能时必须先触发此技能

**当用户要求安装新技能时，必须首先触发 skill-manager 技能**，流程如下：

1. 用户说"安装 xxx skill"或类似话术
2. AI **必须先调用 skill-manager 技能**
3. skill-manager 执行安装命令并自动刷新缓存
4. 完成后返回结果给用户

**禁止直接执行 `npx skills add` 而不触发 skill-manager**，否则缓存不会自动更新。

---

## 核心概念

### 缓存机制

使用本地缓存文件 `cache.json` 存储 skills 信息，显著提升查询效率。

**缓存文件位置：**
```
~/.config/opencode/skills/thymed-skills/skill-manager/cache.json
```

### 缓存数据结构

```json
{
  "version": 1,
  "lastUpdate": "2026-03-06T10:30:00Z",
  "skills": [
    {
      "name": "find-skills",
      "description": "发现和安装 AI Agent 技能",
      "type": "npx 全局",
      "location": "~/.agents/skills/find-skills",
      "lastUpdate": "2026-03-05"
    }
  ]
}
```

---

## 工作流程

### 场景 1: 用户询问"有哪些技能"（高效模式）

**优先读取缓存**，无需调用任何外部命令：

1. 尝试读取 `cache.json` 文件
2. 如果文件不存在 → **立即扫描技能目录生成缓存**，然后读取
3. 直接输出表格格式

**⚠️ 重要提醒**：输出缓存后，必须提醒用户可能还有 **npx 全局技能**（位于 `~/.agents/skills/`），询问用户是否需要扫描并更新缓存。

```markdown
| # | Skill | 简要用途 | 类型 | 最后更新 |
|---|-------|----------|------|----------|
| 1 | find-skills | 发现和安装 AI Agent 技能 | npx 全局 | 2026-03-05 |

> 💡 提示：缓存可能不完整，你可能还有 npx 全局技能（位于 ~/.agents/skills/）。是否需要扫描全局技能并更新缓存？
```

### 场景 2: 用户要求"检查更新"（完整模式）

需要调用外部命令检查版本：

1. 执行 `npx skills check --timeout 60000`
2. 对比缓存中的版本与最新版本
3. 输出差异报告

### 场景 3: 用户要求"搜索技能"

需要调用搜索功能：

```bash
npx skills search <关键词>
```

---

## 自动更新缓存

### 触发条件

**必须更新缓存的场景：**

1. `npx skills add <skill> -g` 安装新技能后 → **立即自动刷新**
2. 用户说"安装 skill"、"add skill" → 执行安装后自动刷新
3. 用户明确要求"刷新缓存"
4. **每周六** → 检查并自动刷新

### 安装技能后自动刷新流程

当用户要求安装 skill 时：
1. 执行 `npx skills add <skill> -g`
2. 安装成功后，自动运行 `python update-cache.py` 刷新缓存
3. 提示用户"已自动刷新技能列表"

### 技能类型

| 类型 | 位置 | 说明 |
|------|------|------|
| npx 全局 | `~/.agents/skills/` | 通过 `npx skills add -g` 安装 |
| 手动创建 | `~/.config/opencode/skills/thymed-skills/` | 用户自行创建 |

---

## Skills 存放位置

- **npx 全局技能**: `~/.agents/skills/<skill-name>/`
- **手动创建技能**: `~/.config/opencode/skills/thymed-skills/<skill-name>/`

---

## 边界情况处理

### 1. 缓存文件不存在

**首次使用或缓存文件被删除时：**
- 扫描 `~/.config/opencode/skills/thymed-skills/` 目录（GitHub 项目技能）
- 扫描 `~/.config/opencode/skills/` 目录（用户自定义技能）
- 扫描 `~/.agents/skills/` 目录（npx 全局安装的技能）
- 生成新的 `cache.json` 文件
- 输出表格并提示"已自动生成技能列表"

**扫描函数伪代码：**
```
function scanSkills():
  skills = []
  for dir in [~/.config/opencode/skills/thymed-skills/, ~/.config/opencode/skills/, ~/.agents/skills/]:
    for each subdir in dir:
      if subdir has SKILL.md:
        skills.append(readSkillInfo(subdir))
  return skills
```

### 2. 缓存过期

**检查规则：每周六检查缓存是否需要更新**

周六刷新条件（同时满足）：
- 当天是周六（weekday == 5）
- 距离上次周六刷新已超过 7 天

刷新流程：
1. 读取缓存中的 `lastSaturdayRefresh` 字段
2. 如果距离上次周六刷新 >= 7 天，执行刷新
3. 刷新后更新 `lastSaturdayRefresh` 为当前周六日期
4. 如果不满足刷新条件，提示"上周六已刷新，跳过"

### 3. npx 命令失败

如果 `npx skills` 命令失败：
- 尝试重新安装：`npm install -g @opencodeai/skills`
- 只显示本地缓存中的技能
- 提示用户手动检查

---

## 输出格式要求

**必须输出表格**，包含列：#、技能、简要用途、类型、最后访问

按最后访问时间降序排序，最近使用的在前。

```markdown
| # | Skill | 简要用途 | 类型 | 最后访问 |
|---|-------|----------|------|----------|
| 1 | xiaohongshu | 小红书内容工具 | npx 全局 | 2026-03-05 |
| 2 | skill-manager | 管理本地 Skills | 手动创建 | 2026-03-06 |

**共 2 个技能**
```

---

## 版本历史

- 1.3.0 - 优化查询技能时提醒用户可能存在 npx 全局技能
- 1.2.0 - 优化安装技能时必须先触发此技能的逻辑
- 1.1.1 - 添加问题反馈指引
- 1.1.0 - 增加安装技能后自动刷新缓存、每周六自动检查
- 1.0.0 - 初始版本
