# Skill Sync PR - 智能体详细指令

**版本 1.10.0**

> **问题反馈与贡献**: 使用本技能遇到问题时，请先查阅 [GitHub Issues](https://github.com/ThymeD/skills/issues) 和项目级 [AGENTS.md](../AGENTS.md#问题反馈与贡献指南)。AI 工具应具备自主排查和贡献解决方案的能力。

本文档为智能体提供从 GitHub 拉取最新技能的详细指令。

---

## 概述

Skill Sync 从 GitHub 仓库拉取最新技能，检测并合并更新。

**核心功能：**
1. **拉取最新技能**：检测远程更新，自动拉取并合并（主要场景，无需 GitHub 账号）
2. **检查更新**：查看远程有哪些新技能或更新（无需 GitHub 账号）
3. **登记 Issue**：在使用技能遇到问题时，自动登记 Issue 到 GitHub（需要 GitHub 账号）
4. **提交优化**：将本地优化推送到 GitHub（可选，需要 GitHub 账号）

**用户群体定位：**
- 大部分用户：首次安装或偶尔更新技能 → 只需拉取
- 少数用户：想贡献代码或反馈问题 → 需要 GitHub 账号

---

## 触发条件

当用户说以下话术时使用此技能：
- **"从远程更新" - 从远程拉取最新技能**
- **"拉取最新技能" - 更新本地技能到最新版本**
- **"同步技能" - 同步最新技能**
- "检查技能更新" - 检查远程是否有新内容
- "登记问题" - 在 GitHub 登记使用中遇到的问题
- "反馈问题" - 反馈技能使用问题

---

## 核心概念

### 本地技能目录
- OpenCode 技能目录：`~/.config/opencode/skills/thymed-skills/<skill-name>/`
- GitHub 仓库目录：`~/.config/opencode/skills/`（或用户指定的仓库路径）

**注意**：GitHub 仓库和技能目录**可能是不同路径**：
- 技能目录：`~/.config/opencode/skills/thymed-skills/`（OpenCode 读取的位置）
- 仓库目录：可能是 `~/code/skills/` 或其他用户指定的路径

### 跨平台路径规范
所有技能文件必须使用跨平台路径：
- 使用 `~` 代替用户目录
- 使用环境变量如 `${HOME}`、`${USERPROFILE}`
- **禁止硬编码**（如 `C:\Users\用户名\`、`~/code/`）

### 贡献是可选的
**重要**：
- 拉取更新**不需要** GitHub 账号，任何用户都能使用
- 提交代码到 GitHub 是**可选的**，仅适合有 GitHub 账号的高级用户

---

## 工作流程

### 步骤 1: 检测 Git 环境

首先检查 Git 是否安装：

```bash
git --version
```

如果未安装，提示用户安装或跳过。

### 步骤 2: 查找本地仓库

检查 `~/.config/opencode/skills/` 是否为 git 仓库：

```bash
git -C "~/.config/opencode/skills" rev-parse --git-dir
```

如果不存在，提示用户先克隆仓库或只查看更新（只读）。

### 步骤 3: 检测远程更新

```bash
# 拉取远程最新
git -C "~/.config/opencode/skills" fetch origin

# 查看远程新增的提交
git -C "~/.config/opencode/skills" log --oneline origin/main ^main
```

### 步骤 4: 检测破坏性更新

**重要**：检查远程更新是否包含破坏性改动（如目录结构变更、路径变更）。

检测命令：
```bash
# 查看是否有目录重命名
git -C "~/.config/opencode/skills" diff --name-status origin/main ^main | grep "^R"

# 检查是否新增了 thymed-skills 目录（新结构）
git -C "~/.config/opencode/skills" ls-tree -r --name-only origin/main | grep "^thymed-skills"
```

如果检测到破坏性更新：
1. 展示迁移方案（见下方）
2. **必须用户确认后才能继续**
3. 提供手动迁移命令

**破坏性更新迁移方案**：
```markdown
## ⚠️ 破坏性更新

检测到远程有重大结构变更，需要迁移。

### 迁移步骤：

```bash
# 1. 创建新目录
mkdir ~/.config/opencode/skills/thymed-skills

# 2. 移动项目技能
mv openclaw-ops ~/.config/opencode/skills/thymed-skills/
mv skill-manager ~/.config/opencode/skills/thymed-skills/
mv skill-sync-pr ~/.config/opencode/skills/thymed-skills/
# ... 其他技能

# 3. 保留用户自定义技能在原位置
```

### 迁移后结构：
```
~/.config/opencode/skills/
├── thymed-skills/   # 项目技能（可拉取更新）
└── my-skill/       # 用户自定义技能（不受影响）
```

---
### 请确认：
- [ ] 已完成迁移
- [ ] 确认继续拉取更新

请回复"确认迁移"继续，或"取消"终止。
```

### 步骤 5: 展示更新内容

向用户展示远程的更新内容：
- 新增了哪些技能
- 哪些技能有更新

### 步骤 6: 执行拉取（用户确认后）

用户确认后执行拉取：

```bash
git -C "~/.config/opencode/skills" pull origin main
```

---

## 登记 Issue（需要 GitHub 账号）

当用户在使用 skills 项目下的技能遇到问题时，可以自动登记 Issue 到 GitHub。

### 步骤 1: 检测环境

检查 gh CLI 是否安装：

```bash
gh --version
```

如果未安装，提示用户安装：
- Windows: `winget install GitHub.cli`
- macOS: `brew install gh`
- Linux: 見 [GitHub CLI 官方文档](https://github.com/cli/cli#installation)

### 步骤 2: 检测登录状态

```bash
gh auth status
```

如果未登录，引导用户登录：

```bash
gh auth login
```

登录流程：
1. 选择 GitHub.com
2. 选择 HTTPS
3. 登录你的 GitHub 账号

### 步骤 3: 收集问题信息

向用户询问以下信息：
- 遇到什么问题了
- 在哪个技能中遇到的
- 期望行为是什么
- 实际行为是什么
- 已尝试的排查思路

### 步骤 4: 创建 Issue

用户确认后，执行创建：

```bash
gh issue create --repo ThymeD/skills -t "<标题>" -b "<内容>"
```

标题格式：`[技能名] 问题描述`

内容模板：
```markdown
## 问题描述
[用户描述的问题]

## 涉及技能
[技能名称]

## 期望行为 vs 实际行为
- 期望：[期望是什么]
- 实际：[实际发生了什么]

## 环境信息
- 操作系统：
- OpenCode 版本：
- 已尝试的排查：
```

### 步骤 5: 展示结果

展示创建的 Issue 链接，告知用户可以在 Issue 上追踪和回复。

### 贡献解决方案

如果 AI 解决了问题，应在原 Issue 上回复解决方案，并询问用户是否愿意提交 PR 贡献代码。

当用户说"从远程更新"或"推送到远程"时：

#### 5.1 准备环境

```bash
# 确保在 main 分支
git checkout main

# 拉取远程最新
git fetch origin
```

#### 5.2 检测远程更新内容

查看远程有哪些更新：

```bash
# 查看远程新增的提交
git log --oneline origin/main ^main

# 查看具体修改了哪些文件
git diff --name-status origin/main ^main
```

#### 5.3 检测路径差异

检查远程代码是否有需要转换的路径：

```bash
# 检查是否有硬编码路径
grep -r "C:\\\\Users\\\\\|D:\\\\code\\\\\|/home/" --include="*.md" origin/main
```

#### 5.4 路径转换规则

| 远程路径模式 | 转换说明 |
|--------------|----------|
| `D:\code\skills\` | 需要转换为用户实际路径 |
| `C:\Users\<用户名>\` | 需要转换为 `~` |
| `/home/<用户名>/` | 需要转换为 `~` |

**如果发现问题**：
- 在拉取前进行路径转换
- 或提示用户手动处理

#### 5.5 展示变更并确认（重要！）

**根据同步方向，展示不同的内容**：

##### 场景 A: 从远程更新到本地

展示远程的变更内容：

```markdown
## 远程更新内容

| 技能 | 文件 | 变更说明 |
|------|------|----------|
| skill-manager | AGENTS.md | 增加代码审查流程 |
| skill-finder | AGENTS.md | 优化推荐算法 |

### 远程新增提交:
- ff32629 perf: skill-sync-pr 增加代码审查流程
- 95bdb39 feat: 添加 skill-sync-pr 技能

---
### 请确认:
- [ ] 确认要拉取以上更新到本地
- [ ] 选择要更新的技能（可选）

请回复 "确认更新" 继续，或 "取消" 终止操作。
```

##### 场景 B: 推送到远程

展示本地的变更内容：

```markdown
## 待确认的变更

### 技能: skill-manager

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| AGENTS.md | 修改 | 增强缓存不存在时的处理逻辑 |

### 变更详情:
[展示具体的行级差异]

---
### 请确认:
- [ ] 确认以上变更内容正确
- [ ] 确认是否提交到 GitHub 远程仓库

请回复 "确认" 继续，或 "取消" 终止操作。
```

**用户确认后，才执行后续的拉取或推送操作！**

#### 5.6 判断仓库和技能目录关系

首先判断 GitHub 仓库目录和技能目录是否为同一位置：

```bash
# 获取仓库目录
REPO_DIR=$(git rev-parse --show-toplevel)

# 判断是否为同一路径
if [ "$REPO_DIR" = "$HOME/.config/opencode/skills" ]; then
    SAME_PATH=true
else
    SAME_PATH=false
fi
```

#### 5.7 执行拉取/推送操作

根据用户确认的方向，执行相应操作：

##### 场景 A: 从远程更新（用户确认后）

```bash
if [ "$SAME_PATH" = "true" ]; then
    # 同一路径，直接拉取
    git pull origin main
else
    # 不同路径，先拉取到仓库，再复制到技能目录
    git fetch origin
    git checkout origin/main -- .
    cp -r skills/* ~/.config/opencode/skills/thymed-skills/
fi
```

##### 冲突处理

如果拉取时遇到冲突：

```bash
# 检测冲突
git status
```

**检测到冲突时，必须询问用户**：

```markdown
## 检测到冲突

拉取远程更新时遇到冲突。

### 冲突文件:
[列出冲突的文件]

---
### 请选择处理方式:

1. **保留本地** - 用本地版本覆盖远程版本
2. **使用远程** - 用远程版本覆盖本地版本
3. **手动合并** - 展示差异，由用户手动决定

请选择 [1/2/3]:
```

##### 场景 B: 推送到远程（用户确认后）

按照步骤 5.8 执行代码审查和推送。

#### 5.8 代码审查（仅推送时执行）

**在提交到远程前，必须审查代码确保不包含本地路径或敏感信息**：

1. **检查本地路径模式**
2. **检查敏感信息**
3. **检查不适合共享的内容**

#### 5.9 排除缓存文件

**本地缓存文件不应提交到远程仓库**。执行以下检查：

```bash
# 检查是否有缓存文件变更
git diff --name-status | grep "cache.json"

# 如果有缓存文件，从暂存区移除
git reset HEAD skill-manager/cache.json
```

**必须排除的文件：**
- `skill-manager/cache.json` - 本地技能缓存，包含用户特定信息

#### 5.10 验证更新

```bash
# 检查本地技能目录
ls -la ~/.config/opencode/skills/thymed-skills/
```

### 步骤 6: 用户确认后执行

用户确认后，询问是否要推送到远程：

```markdown
## 下一步选择

1. **仅本地提交** - 在本地仓库创建分支和提交，但不推送到远程
2. **提交并推送** - 创建分支、提交、推送到远程（需要 GitHub 账号）
3. **创建 PR** - 推送到远程后创建 Pull Request
4. **取消** - 终止操作

请选择 [1/2/3]:
```

根据用户选择执行相应操作。

### 步骤 7: 完成同步

同步完成后，输出总结：

```markdown
## 同步完成

### 更新结果:
- 已从远程拉取 X 个技能的更新
- 技能列表: [skill-1, skill-2]

### 本地技能状态:
| 技能 | 状态 |
|------|------|
| skill-manager | 已更新 |
| skill-finder | 无变化 |

如需查看详情，可运行: "检查技能更新"
```

---

## 环境初始化流程

### 场景 1: Git 未安装

提供安装指引：

| 平台 | 安装命令 |
|------|----------|
| Windows | `winget install Git.Git` 或下载 [Git for Windows](https://git-scm.com/download/win) |
| macOS | `xcode-select --install` |
| Linux | `sudo apt install git` (Ubuntu/Debian) 或 `sudo yum install git` (RHEL) |

### 场景 2: gh (GitHub CLI) 未安装

| 平台 | 安装命令 |
|------|----------|
| Windows | `winget install GitHub.cli` |
| macOS | `brew install gh` |
| Linux | 見 [GitHub CLI 官方文档](https://github.com/cli/cli#installation) |

### 场景 3: GitHub 未登录

引导用户登录：

```bash
# 交互式登录
gh auth login
```

登录流程：
1. 选择 GitHub.com
2. 选择 HTTPS
3. 登录 GitHub 账号

---

## 仓库初始化流程

### 场景 1: 本地没有代码仓库

询问用户：

```markdown
## 未找到本地代码仓库

没有找到 ThymeD/skills 的本地克隆。

请选择:
1. **克隆仓库** - AI 自动克隆到 `~/.config/opencode/skills/thymed-skills/`
2. **指定路径** - 提供你本地的仓库路径
3. **仅本地使用** - 不需要远程仓库，仅比较差异
```

根据用户选择执行：
- 选项1: `git clone https://github.com/ThymeD/skills.git ~/.config/opencode/skills/thymed-skills/`
- 选项2: 使用用户提供的路径
- 选项3: 仅在本地比较差异，不提交

### 场景 2: 仓库路径未知

可以尝试搜索：

```bash
# 搜索用户目录下的 git 仓库
find ~ -name ".git" -type d 2>/dev/null | grep skills
```

---

## 分支和提交规范

### 分支命名

| 类型 | 格式 | 示例 |
|------|------|------|
| 新功能 | `feat/<skill-name>-<功能>` | `feat/skill-sync-pr-init` |
| 修复 | `fix/<skill-name>-<问题>` | `fix/skill-manager-cache` |
| 优化 | `perf/<skill-name>-<优化点>` | `perf/skill-auditor-speed` |

### 提交消息格式

```
<类型>: <简短描述>

<详细说明（可选）>

- 变更点 1
- 变更点 2
```

---

## 贡献是可选的 - 重要说明

**永远不要强制用户提交到远程仓库**。以下是正确的话术：

### 用户说"比较差异"时
→ 只展示差异，不主动提提交

### 用户说"同步优化"时
→ 展示差异，询问"是否要提交到本地仓库？"（不提远程）

### 用户明确说"提交 PR"或"推送到远程"时
→ 才开始执行提交和推送流程

### 用户拒绝提交
→ 尊重用户选择，输出"好的，已保留本地更改"

---

## 边界情况处理

### 1. 无差异

如果本地与 GitHub 仓库无差异：
- 输出"本地没有需要同步的优化，当前已是最新版本"
- 结束流程

### 2. 推送失败

如果推送失败（网络问题等）：
- 保留本地提交
- 提供手动推送命令
- 输出 PR 创建链接

### 3. 冲突处理

如果有合并冲突：
- 提示用户手动解决冲突
- 提供解决冲突的指导

### 4. 用户取消

用户说"取消"或"不提交"时：
- 保留本地所有更改
- 输出"已取消操作，本地更改已保留"

---

## 安全注意事项

1. **不提交敏感信息** - 检查是否有 API 密钥、密码等
2. **验证文件来源** - 只处理 `~/.config/opencode/skills/` 目录下的技能
3. **确认分支名** - 使用规范的分支命名

---

## 版本历史

- 1.10.0 - 新增登记 Issue 功能：AI 使用技能遇到问题时可自动登记 Issue 到 GitHub
- 1.9.0 - 简化技能定位：聚焦拉取更新，提交代码为可选功能，降低使用门槛
- 1.8.0 - 增加排除缓存文件逻辑，推送前自动移除 cache.json
- 1.7.0 - 修正同步流程逻辑顺序，优化步骤 5 的子步骤（准备环境→检测远程更新→路径差异→展示确认→执行）
- 1.6.0 - 优化同步流程，调整为"先展示变更确认→再执行同步"的顺序，修正步骤编号
- 1.5.0 - 优化从远程更新流程，增加检测远程更新内容步骤，根据同步方向展示不同确认界面
- 1.4.0 - 结合 skill-manager 技能检测本地技能状态，生成完整的技能状态报告，优化同步流程（支持仓库与技能目录不同路径）
- 1.3.0 - 增加从远程同步功能，支持自动拉取最新技能并处理路径差异、增加冲突时用户确认
- 1.2.0 - 增加提交前代码审查流程，确保无本地路径和敏感信息
- 1.1.0 - 增加用户确认流程、自动查找仓库、环境初始化指引、贡献可选
- 1.0.0 - 初始版本
