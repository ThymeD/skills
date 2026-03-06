# Skill Finder - 智能体详细指令

**版本 1.0.0**

> **问题反馈与贡献**: 使用本技能遇到问题时，请先查阅 [GitHub Issues](https://github.com/ThymeD/skills/issues) 和项目级 [AGENTS.md](../AGENTS.md#问题反馈与贡献指南)。AI 工具应具备自主排查和贡献解决方案的能力。

本文档为智能体提供执行 skill-finder 技能的详细指令。

---

## 概述

Skill Finder 从 skills.sh 获取热门技能榜单，并根据用户偏好和技术栈提供个性化推荐。

## 核心工作流程

### 1. 检测用户意图

用户可能通过以下方式触发此技能：
- "有哪些热门 skills"
- "top skills"
- "推荐 skills"
- "有没有做 X 的 skill"
- "我需要安装新 skill"

### 2. 获取榜单数据

使用 WebFetch 获取最新榜单：

| 榜单类型 | URL | 用途 |
|----------|-----|------|
| All Time | https://www.skills.sh/ | 最热门技能 |
| Trending | https://www.skills.sh/trending | 24小时趋势 |
| Hot | https://www.skills.sh/hot | 最近热门 |

### 3. 读取本地数据

必须读取以下文件：

1. **已安装技能列表**
   ```
   ~/.agents/skills/
   ```

2. **用户偏好配置**
   ```
   ~/.config/opencode/skills/skill-finder/preferences.json
   ```

3. **项目技术栈**（如适用）
   ```
   读取项目根目录的 package.json, requirements.txt, Cargo.toml 等
   ```

4. **全局 AGENTS.md**
   ```
   ~/.config/opencode/AGENTS.md
   ```

### 4. 过滤逻辑

按优先级执行过滤：

```
优先级 1: 已安装技能 → 从榜单中移除
优先级 2: 用户排除的类别 → excludedCategories
优先级 3: 用户排除的技能 → excludedSkills
优先级 4: 特定 AI 服务 → qwen, nano-banana, ERNIE 等
优先级 5: 低安装量 → < 10K（通用技能除外）
```

### 5. 生成输出

根据用户意图选择输出格式：

| 用户意图 | 输出格式 |
|----------|----------|
| "top 50" | 完整榜单表格 |
| "推荐适合我的" | 个性化推荐（带推荐理由） |
| "有没有做 X 的" | 搜索结果 |

### 6. 记住偏好

当用户明确表达偏好时，自动更新 preferences.json：

| 用户表达 | 记录位置 |
|----------|----------|
| "不感兴趣" | excludedSkills |
| "不要推荐 X" | excludedSkills |
| "过滤掉 Azure" | excludedCategories |
| "我只用 Python" | techStack |

## 数据结构

### preferences.json 格式

```json
{
  "version": 1,
  "excludedCategories": ["azure", "gcp", "aws"],
  "excludedSkills": ["find-skills", "skill-auditor"],
  "techStack": ["Python", "TypeScript"],
  "lastUpdate": "2026-03-06T12:00:00Z"
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| version | number | 配置文件版本 |
| excludedCategories | string[] | 排除的技能类别 |
| excludedSkills | string[] | 排除的具体技能名 |
| techStack | string[] | 用户技术栈 |
| lastUpdate | string | 最后更新时间 |

## 输出模板

### 模板 1: 完整榜单

```markdown
## 🔥 Top 50 热门技能

| 排名 | 技能名称 | 安装量 | 简要用途 |
|------|----------|--------|----------|
| 1 | skill-name | 100K | 用途描述 |
...
```

### 模板 2: 个性化推荐

```markdown
# ⭐ 个性化技能推荐

基于你的技术栈（{techStack}）：

## 🔥 强烈推荐
| 技能 | 用途 | 推荐理由 |
|------|------|----------|
...

## ⭐ 可选
| 技能 | 用途 |
|------|------|
...

## ⚠️ 已过滤
| 技能 | 原因 |
|------|------|
...
```

## 边界情况处理

### 1. 网络失败

如果无法获取 skills.sh：
- 尝试备用 URL
- 返回缓存数据（如有）
- 告知用户手动检查

### 2. 无偏好数据

如果 preferences.json 不存在：
- 使用默认过滤规则（排除 Azure、Qwen 等）
- 不显示个性化推荐

### 3. 用户技术栈未知

如果无法确定用户技术栈：
- 只推荐通用技能
- 询问用户偏好

### 4. 所有技能都已安装

如果筛选后无技能可推荐：
- 提示用户已安装所有热门技能
- 建议查看其他榜单（Trending/Hot）

## 安全注意事项

1. **不缓存敏感信息** - preferences.json 不应包含 API 密钥
2. **验证外部链接** - 检查 skills.sh 返回的数据格式
3. **防止注入** - 技能名称应作为字符串处理，不执行

## 维护

- 每月检查一次 skills.sh 榜单更新
- 保持过滤规则与时俱进
- 定期清理过期的用户偏好

## 版本历史

- 1.0.0 - 初始版本
