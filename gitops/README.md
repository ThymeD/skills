# GitOps Skill

Git 与 GitHub 仓库管理工具，负责项目代码的版本控制、提交推送、Issue 管理、PR 提交和标签操作。

## 功能列表

- 代码提交与推送
- 从远程拉取同步代码
- GitHub Issue 增删改查
- Pull Request 创建与管理
- Git 标签创建与发布
- 分支创建与切换

## 依赖

- Git
- GitHub CLI (`gh`)

## 安装

此为手动安装的 skill，放置在 `~/.config/opencode/skills/thymed-skills/skill-gitops/`

## 使用示例

```
用户: 帮我把代码提交到 GitHub
→ 执行 git status 检查更改，然后引导用户完成提交流程

用户: 从远程拉取最新代码
→ 执行 git pull 并处理合并

用户: 创建一个 Issue
→ 使用 gh issue create 创建 Issue

用户: 打个 v1.0.0 标签
→ 创建标签并推送到远程
```

## 文档

详见 [SKILL.md](./SKILL.md)
