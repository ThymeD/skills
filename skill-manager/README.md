# Skill Manager

管理本地已安装的 AI Agent Skills。

## 功能

- 列出本地 skills
- 检查 skills 更新
- 搜索 skills
- 安装技能后自动刷新缓存

## 触发条件

- "查看已安装 skills"
- "本地有哪些技能"
- "技能管理"
- "安装 skill"

## 快速开始

```bash
# 查看已安装技能
本地有哪些技能？

# 刷新缓存
python ~/.config/opencode/skills/skill-manager/update-cache.py
```

## 缓存机制

技能列表存储在 `~/.config/opencode/skills/skill-manager/cache.json`，提升查询效率。

## 版本

1.1.1
