---
name: skill-manager
description: |
  管理本地已安装的 AI Agent Skills。
  当用户说以下任何一句话时触发：
  - "检查 skills 更新"、"更新 skills"
  - "查看已安装 skills"、"查看已安装的技能"
  - "看看本地有哪些 skill"、"看看有哪些技能"、"列出本地 skills"
  - "本地有哪些技能"、"当前有哪些技能"
  - "技能管理"、"管理 skills"
  - "安装 skill"、"add skill" - 安装技能后自动刷新缓存
  
  **核心功能**：
  - 列出本地 skills（读取缓存）
  - 安装技能后自动刷新缓存
  - 每周六自动检查更新
  
  **输出格式要求**：必须输出表格，包含列：#、技能、简要用途、类型、最后更新
license: MIT
metadata:
  author: local
  version: 1.1.1
---

# Skill Manager

管理本地已安装的 AI Agent Skills，包括版本检查和更新。

## 缓存机制

**这是核心优化点**：使用本地缓存文件 `cache.json` 存储 skills 信息，显著提升查询效率。

### 缓存文件位置

```
~/.config/opencode/skills/skill-manager/cache.json
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

## 核心功能

| 功能 | 触发场景 | 使用缓存 |
|------|----------|----------|
| **列出本地 skills** | "有哪些技能"、"本地有哪些技能" | ✅ 直接读取缓存 |
| **检查更新** | "检查更新"、"更新 skills" | ❌ 需调用 npx skills check |
| **搜索 skills** | "搜索 XX 技能" | ❌ 需调用 npx skills search |
| **扫描其他位置** | "扫描其他安装位置" | ❌ 需扫描文件系统 |

## 工作流程

### 场景 1: 用户询问"有哪些技能"（高效模式）

**直接读取缓存**，无需调用任何外部命令：

1. 读取 `cache.json` 文件
2. 直接输出表格格式

```bash
# 读取缓存
cat ~/.config/opencode/skills/skill-manager/cache.json
```

输出示例：

```markdown
*缓存最后更新：2026-03-06 03:40:27 UTC*

# 📦 本地已安装 Skills

| # | Skill | 简要用途 | 类型 | 最后更新 |
|---|-------|----------|------|----------|
| 1 | find-skills | 发现和安装 AI Agent 技能 | npx 全局 | 2026-03-05 |
| 2 | xiaohongshu | 小红书内容工具 | npx 全局 | 2026-03-05 |
| 3 | openclaw-ops | Gateway 运维管理 | 手动创建 | 2026-03-05 |
| 4 | skill-creator | 创建和优化 AI Agent 技能 | 手动创建 | 2026-03-05 |
| 5 | skill-manager | 管理本地 Skills | 手动创建 | 2026-03-06 |
| 6 | skill-finder | 热门 Skills 推荐 | 手动创建 | 2026-03-06 |

**共 6 个技能**
```

> **重要**：如果是基于缓存输出，必须在表格前面给出缓存的最后更新时间，格式为 `*缓存最后更新：YYYY-MM-DD HH:MM:SS UTC*`

### 场景 2: 用户要求"检查更新"（完整模式）

需要调用外部命令检查版本：

1. 执行 `npx skills check --timeout 60000`
2. 对比缓存中的版本与最新版本
3. 输出差异报告

```bash
npx skills check --timeout 60000
```

### 场景 3: 用户要求"搜索技能"

需要调用搜索功能：

```bash
npx skills search <关键词>
```

### 场景 4: 安装新技能后

**自动更新缓存**（见下方自动更新机制）

## 自动更新缓存

### 触发条件

**必须更新缓存的场景：**

1. `npx skills add <skill> -g` 安装新技能后 → **立即自动刷新**
2. 用户说"安装 skill"、"add skill" → 执行安装后自动刷新
3. 用户明确要求"刷新缓存"
4. **每周六** → 检查并自动刷新

### 缓存过期检查

- 每次触发 skill-manager 时检查缓存是否过期
- **周六刷新条件（同时满足）**：
  - 当天是周六（weekday == 5）
  - 距离上次周六刷新已超过 7 天（检查 `lastSaturdayRefresh` 字段）
- 刷新后更新 `lastSaturdayRefresh` 为当前周六日期
- 如果不满足刷新条件，提示"上周六已刷新，跳过"

### 刷新缓存脚本

```bash
# 推荐使用 Python 脚本
python ~/.config/opencode/skills/skill-manager/update-cache.py

```

## 注意事项

1. **优先使用缓存** - 列出技能时必须先尝试读取缓存，响应速度更快
2. **缓存更新时机** - 只有安装新技能或用户明确要求时才更新缓存
3. **手动创建的 skills** - 存放在 `~/.config/opencode/skills/`

## 定期维护建议

1. **自动维护**：每周六会自动检查并刷新缓存
2. **手动刷新**：用户可随时说"刷新缓存"手动更新
