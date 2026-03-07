---
name: skill-finder
description: |
  发现和推荐热门 AI Agent Skills。用于：
  - 用户询问"有哪些热门 skills"、"top skills"、"推荐 skills"
  - 用户想了解"有没有做 X 的 skill"
  - 用户需要安装新 skill 但不知道选哪个
  - 定期检查 skills.sh 热门榜单
---

# Skill Finder

从 skills.sh 获取热门技能清单，并提供个性化推荐。

## 使用场景

当用户有以下需求时使用此 skill：
1. 询问热门/Top skills 排行
2. 想安装新 skill 但不知道选哪个
3. 询问某个领域有没有相关的 skills
4. 定期了解新出的热门 skills
5. 基于用户现有技术栈推荐合适的 skills

## 工作流程

### 步骤 1: 获取技能列表

使用 WebFetch 获取 skills.sh 榜单：

```bash
# 获取 All Time 榜单（最热门）
https://www.skills.sh/

# 获取 Trending 榜单（24小时趋势）
https://www.skills.sh/trending

# 获取 Hot 榜单（最近热门）
https://www.skills.sh/hot
```

### 步骤 2: 过滤技能列表

获取榜单后，必须按以下规则过滤：

1. **读取已安装技能**：读取 `~/.agents/skills/` 目录，获取本地已安装的技能列表
2. **读取用户偏好**：读取 `~/.config/opencode/skills/thymed-skills/skill-finder/preferences.json` 获取排除的类别和技能
3. **过滤规则**：
   - 移除已安装的技能
   - 移除 excludedCategories 中指定的类别（如 azure、gcp、aws）
   - 移除 excludedSkills 中指定的技能
   - 移除特定 AI 服务（如 qwen、nan-banana 等）
   - 移除安装量低于 10K 的技能

### 步骤 3: 展示推荐

按以下格式展示：

```
## 🔥 Top 技能推荐

| 排名 | 技能名称 | 安装量 | 简要用途 | 适合场景 |
|------|----------|--------|----------|----------|
```

推荐度判断：
- ⭐⭐⭐ 强烈推荐：与用户技术栈完全匹配
- ⭐⭐ 推荐：有一定相关性
- ⭐ 可选：通用技能

## 用户偏好存储

### 偏好文件位置

```
~/.config/opencode/skills/thymed-skills/skill-finder/preferences.json
```

### 偏好数据结构

```json
{
  "version": 1,
  "excludedCategories": ["azure", "gcp", "aws", "qwen", "ERNIE"],
  "excludedSkills": ["azure-ai", "azure-storage"],
  "techStack": ["Python", "pytest"],
  "lastUpdate": "2026-03-06T10:00:00Z"
}
```

### 记住用户偏好的方法

1. **自动记录**：当用户说"不感兴趣"、"不要推荐 X"、"过滤掉 X"时，自动更新偏好文件
2. **手动设置**：用户可以说"以后不要推荐 Azure 相关的 skill"
3. **查看偏好**：用户可以说"查看我的 skill 偏好"

## 过滤规则

### 排除规则

必须按以下优先级过滤：

1. **已安装技能**（最高优先级）：读取 `~/.agents/skills/` 目录，移除所有已安装的技能
2. **用户偏好排除**：根据 `preferences.json` 中的 excludedCategories 和 excludedSkills 过滤
3. **云平台特定技能**：Azure、GCP、AWS 等（除非用户明确使用该云）
4. **特定 AI 服务**：需要特定 API Key 的技能（如 Qwen、文心一言、nano-banana 等）
5. **低安装量**：安装量低于 10K 的技能（除非是通用技能如 pdf、docx）

### 优先推荐
1. **通用技能**：pdf、docx、xlsx、pptx、browser-use 等
2. **开发相关**：与用户技术栈匹配的框架最佳实践
3. **调试/测试**：systematic-debugging、test-driven-development 等

## 用户信息获取

通过以下方式了解用户技术栈和已安装技能：
1. 读取项目配置文件（package.json、requirements.txt、Cargo.toml 等）
2. 读取 `~/.agents/skills/` 目录了解已安装技能
3. 读取 `~/.config/opencode/skills/thymed-skills/skill-finder/preferences.json` 了解用户偏好
4. 读取 AGENTS.md 了解项目配置

## 输出示例

### 完整榜单输出

当用户询问"top skills"或"热门技能"时，展示过滤后的 Top 50：

```markdown
# 🔥 Skills.sh Top 50 热门技能（未安装）

> 数据来源：skills.sh All Time 榜单
> 更新时间：{当前日期}
> 已过滤：已安装技能、Azure 云服务、特定 AI 服务（Qwen 等）

## 分类统计

| 类别 | 数量 | 代表技能 |
|------|------|----------|
| 前端开发 | 12 | vercel-react-best-practices, frontend-design |
| AI/媒体 | 8 | ai-image-generation, ai-video-generation |
| 浏览器自动化 | 3 | browser-use, agent-browser |
| 文档处理 | 4 | pdf, pptx, docx, xlsx |
| 营销/SEO | 10 | seo-audit, copywriting |
| 开发工具 | 5 | skill-creator, systematic-debugging |
| 数据库 | 3 | supabase-postgres-best-practices |

## 完整榜单

| 排名 | 技能名称 | 安装量 | 用途 | 适合场景 |
|------|----------|--------|------|----------|
| 1 | vercel-react-best-practices | 176.7K | React 最佳实践 | 前端开发 |
| 2 | web-design-guidelines | 137.3K | Web 设计指南 | UI/UX 设计 |
...
```

### 个性化推荐输出

当用户说"推荐一些适合我的 skills"时：

```markdown
# ⭐ 个性化技能推荐

基于你的技术栈（Python + pytest）和已有技能（已安装：find-skills, xiaohongshu）：

## 🔥 强烈推荐（强烈建议安装）

| 技能 | 用途 | 推荐理由 |
|------|------|----------|
| systematic-debugging | 系统化调试 | Python 项目必备，配合 pytest 使用 |
| test-driven-development | TDD 测试驱动 | 提升测试质量 |
| pdf | PDF 处理 | 通用文档处理 |
| docx | Word 文档 | 通用文档处理 |

## ⭐ 可选安装

| 技能 | 用途 | 适用场景 |
|------|------|----------|
| pptx | PPT 制作 | 需要制作演示文稿时 |
| brainstorming | 头脑风暴 | 需要创意灵感时 |
| copywriting | 文案撰写 | 需要营销文案时 |

## ⚠️ 不推荐（已过滤）

| 技能 | 原因 |
|------|------|
| vercel-react-best-practices | 非前端项目 |
| azure-* | 非 Azure 用户 |
| qwen-* | 特定 AI 服务 |
```

## 维护建议

1. **定期更新**：每月检查一次热门榜单
2. **过滤噪音**：排除不相关的云平台技能
3. **个性化**：始终基于用户实际需求推荐
4. **记住偏好**：当用户表示不感兴趣时，自动记录到 preferences.json
5. **显示过滤**：每次展示清单时，清晰提示哪些类别被过滤掉了
6. **简洁展示**：不要一次性展示太多，优先推荐最相关的 5-10 个

## 用户偏好管理

### 记住用户偏好

当用户说以下话术时，自动更新偏好：
- "不感兴趣"、"不需要" → 记录到 excludedSkills
- "不要推荐 X" → 记录到 excludedCategories 或 excludedSkills
- "过滤掉 Azure" → 把 azure 添加到 excludedCategories
- "我只用 Python" → 更新 techStack

### 更新偏好文件

```bash
# 读取当前偏好
cat ~/.config/opencode/skills/thymed-skills/skill-finder/preferences.json

# 添加排除的类别
# 编辑 preferences.json 添加新的 excludedCategories
```

### 清除偏好

用户可以说"清除 skill 偏好"来重置偏好文件。
