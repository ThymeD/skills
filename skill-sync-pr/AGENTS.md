# Skill Sync PR - 智能体详细指令

**版本 1.0.0**

> **问题反馈与贡献**: 使用本技能遇到问题时，请先查阅 [GitHub Issues](https://github.com/ThymeD/skills/issues) 和项目级 [AGENTS.md](../AGENTS.md#问题反馈与贡献指南)。AI 工具应具备自主排查和贡献解决方案的能力。

本文档为智能体提供将本地技能优化同步到 GitHub 的详细指令。

---

## 概述

Skill Sync PR 检测本地技能与 GitHub 仓库的差异，自动将优化内容提交为 PR。

**核心功能：**
1. 比较本地技能与 GitHub 仓库版本差异
2. 发现优化内容并生成变更摘要
3. 自动创建分支、提交代码
4. 推送到远程并创建 PR

---

## 触发条件

当用户说以下话术时使用此技能：
- "同步优化"
- "提交 PR"
- "同步到 GitHub"
- "把优化提交到仓库"
- "提交技能修改"
- "推送更改到远程"

---

## 核心概念

### 本地技能目录
- `~/.config/opencode/skills/<skill-name>/` - 本地修改的技能
- `D:\code\skills\` - GitHub 仓库本地克隆

### 工作原理

```
本地 ~/.config/opencode/skills/  →  比较差异  →  GitHub 仓库 PR
         ↑                              ↑
      修改内容                        自动同步
```

---

## 工作流程

### 步骤 1: 检测 GitHub 仓库位置

首先查找本地克隆的 GitHub 仓库：

1. 检查 `D:\code\skills\` 是否存在且为 git 仓库
2. 如果不存在，询问用户是否需要克隆

```bash
# 验证仓库
git -C "D:\code\skills" rev-parse --git-dir
```

### 步骤 2: 比较技能差异

对于 `~/.config/opencode/skills/` 下的每个技能：

1. 读取本地技能文件
2. 对比 GitHub 仓库对应文件
3. 记录有差异的文件

```bash
# 比较单个文件
diff "本地技能文件" "D:\code\skills\对应文件"
```

### 步骤 3: 生成变更摘要

对于每个有差异的技能，生成：
- 技能名称
- 修改的文件列表
- 变更内容摘要

### 步骤 4: 创建分支

根据变更内容生成分支名：
- 功能新增: `feat/<skill-name>-<功能>`
- 修复: `fix/<skill-name>-<问题>`
- 优化: `perf/<skill-name>-<优化点>`

```bash
# 确保在 main 分支
git -C "D:\code\skills" checkout main
git -C "D:\code\skills" pull origin main

# 创建新分支
git -C "D:\code\skills" checkout -b <分支名>
```

### 步骤 5: 复制文件并提交

1. 将本地技能文件复制到 GitHub 仓库对应位置
2. 添加并提交更改

```bash
# 复制文件（Windows 使用 copy）
cp -r "~/.config/opencode/skills/<skill-name>/" "D:\code\skills\<skill-name>/"

# 添加到暂存区
git -C "D:\code\skills" add <skill-name>/

# 提交
git -C "D:\code\skills" commit -m "<提交消息>"
```

### 步骤 6: 推送并创建 PR

```bash
# 推送到远程
git -C "D:\code\skills" push -u origin <分支名>

# 使用 gh 创建 PR
gh pr create --title "<PR标题>" --body "<PR描述>"
```

如果 gh 命令不可用，输出 PR 创建链接。

---

## 自动化程度

| 步骤 | 自动执行 | 需要确认 |
|------|----------|----------|
| 检测仓库 | ✅ | ❌ |
| 比较差异 | ✅ | ❌ |
| 生成摘要 | ✅ | ❌ |
| 创建分支 | ✅ | ❌ |
| 提交代码 | ✅ | ❌ |
| 推送远程 | ✅ | ❌ |
| 创建 PR | ✅ | ⚠️ 确认 PR 内容 |

---

## PR 描述模板

```markdown
## 问题/背景
[描述为什么需要这个修改]

## 变更内容
- [变更点 1]
- [变更点 2]

## 文件变更
- `skill-name/AGENTS.md` 行号范围

## 测试
[说明如何测试这些变更]
```

---

## 边界情况处理

### 1. GitHub 仓库不存在

如果 `D:\code\skills` 不存在：
- 提示用户克隆仓库：`git clone https://github.com/ThymeD/skills.git D:\code\skills`
- 或者让用户提供仓库路径

### 2. 无差异

如果本地与 GitHub 仓库无差异：
- 输出"本地没有需要同步的优化"
- 提示用户直接修改 GitHub 仓库

### 3. 推送失败

如果推送失败（网络问题等）：
- 保留本地提交
- 提供手动推送命令
- 记录未完成的操作

### 4. gh 命令不可用

如果 `gh` 命令不存在：
- 输出 PR 创建链接：`https://github.com/ThymeD/skills/pull/new/<分支名>`
- 提供手动创建 PR 的说明

### 5. 冲突处理

如果有合并冲突：
- 提示用户手动解决冲突
- 提供解决冲突的指导

---

## 安全注意事项

1. **不提交敏感信息** - 检查是否有 API 密钥、密码等
2. **验证文件来源** - 只处理 `~/.config/opencode/skills/` 目录下的技能
3. **确认分支名** - 使用规范的分支命名

---

## 版本历史

- 1.0.0 - 初始版本
