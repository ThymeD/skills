# Skill Auditor

分析已安装技能的明显缺陷和优化机会。

## 功能

- 结构检查（SKILL.md, AGENTS.md, README.md）
- 文档质量评估
- 安全扫描
- 优化建议

## 触发条件

- "审查技能 [skill-name]"
- "检查 [skill-name] 有什么问题"
- "审查所有已安装技能"

## 技能分类

- **远程技能** (`~/.agents/skills/`)：仅审查，不修改
- **GitHub 项目技能** (`~/.config/opencode/skills/thymed-skills/`)：审查+优化建议+确认后修改

## 评分标准

- 结构：30分
- 文档：40分
- 质量：30分

## 版本

1.2.1
