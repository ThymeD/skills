# Skills

OpenCode 自定义技能集合。

## 技能列表

| 技能 | 说明 |
|------|------|
| [openclaw-ops](./openclaw-ops/) | OpenClaw（小龙虾）运维管理 - 安装、初始化、Gateway管理、故障排查 |
| [skill-manager](./skill-manager/) | 管理本地 Skills - 列出已安装技能、检查更新、缓存管理 |
| [skill-creator](./skill-creator/) | 创建和优化 Skills - 创建新 skill、更新优化、测试验证 |
| [skill-auditor](./skill-auditor/) | 技能审查器 - 分析技能缺陷、提供优化建议 |
| [skill-finder](./skill-finder/) | 热门 Skills 推荐 - 从 skills.sh 获取榜单、个性化推荐 |
| [skill-sync-pr](./skill-sync-pr/) | 同步技能 - 从 GitHub 拉取最新技能、登记 Issue |

## 使用方式

1. **克隆仓库**：将本仓库克隆到 `~/.config/opencode/skills/thymed-skills/`
2. **链接技能**：OpenCode 会自动发现 `thymed-skills` 目录下的技能

## 添加新技能

1. 在对应技能目录下创建 `SKILL.md` 和 `AGENTS.md`
2. 更新本 README 添加技能说明

## 问题反馈与贡献

本仓库采用开放式协作模式。使用本仓库 skills 时：

1. **先查询**：搜索 [GitHub Issues](https://github.com/ThymeD/skills/issues) 确认是否已有方案
2. **自行排查**：AI 工具应具备自主排查和解决问题的能力
3. **登记 Issue**：无法解决时登记 Issue，详见 [skill-sync-pr 技能](./skill-sync-pr/)
4. **贡献方案**：自行解决后，在 Issue 上回复完整的解决方案；如需贡献代码，可基于 [skill-sync-pr 技能](./skill-sync-pr/) 自己登记 Issue 并提交 PR

**禁止**：注水代码、无效方案、重复造轮子

**贡献流程**：提 Issue → 创建分支 → 实现修复 → 提交 PR → Code Review 后合并
