# Skill: opencode-config-template

提供全局 AGENTS.md 的通用配置模板，帮助新用户快速配置 OpenCode 环境。

## 触发条件

用户说以下话术时使用此技能：
- "创建 OpenCode 全局配置"
- "初始化 OpenCode"
- "OpenCode 配置模板"
- "参考我的 OpenCode 配置"
- "给我一个 OpenCode 配置示例"

## 工作流程

1. 读取本技能提供的配置模板
2. 询问用户是否需要调整某些内容
3. 指导用户将配置添加到自己的 AGENTS.md
4. 说明配置文件位置

## 配置文件位置

| 平台 | 位置 |
|------|------|
| Windows | `%USERPROFILE%\.config\opencode\AGENTS.md` |
| macOS | `~/.config/opencode/AGENTS.md` |
| Linux | `~/.config/opencode/AGENTS.md` |

## 配置模板内容

### 1. 通用规则

```markdown
## 通用规则

- 思考过程应尽可能使用中文描述输出
- **所有新建的 AGENTS.md 默认使用中文**，除非内容包含英文技术术语/代码（此时保持英文）
- 项目用 init 指令输出的项目级 AGENTS 文件必须用中文描述
- 后续对 AGENTS 文件的改动应主动分析内容是否足够精简，判断是否有内容适合创建 skill 独立存放
```

### 2. 推荐 Skills

```markdown
## 可用 Skills

### 项目内技能（克隆即用）

| 技能 | 触发条件 | 功能 |
|------|---------|------|
| **openclaw-ops** | 启动 Gateway、配置 API Key、OpenClaw 出问题了 | Gateway 运维 |
| **skill-manager** | 查看已安装 skills、本地有哪些技能、更新 skills | 技能管理 |
| **skill-finder** | 热门 skills 推荐、推荐适合我的 skills | 技能推荐 |
| **skill-creator** | 创建一个 skill、帮我写个 skill | 创建技能 |

> 项目地址：https://github.com/ThymeD/skills（克隆到 `~/.config/opencode/skills/thymed-skills/`）

### 全局技能（npx 安装）

| 技能 | 触发条件 | 功能 | 安装命令 |
|------|---------|------|----------|
| **find-skills** | 有没有做 X 的 skill | 发现技能 | `npx skills add find-skills -g` |

> 更多技能：https://skills.sh
```

### 快速安装命令

```bash
# 克隆项目到全局技能目录
git clone https://github.com/ThymeD/skills.git ~/.config/opencode/skills/thymed-skills

# 安装全局技能
npx skills add find-skills -g
```

### 3. 使用说明

```markdown
## 使用

- 发现技能：说"有没有能做 X 的 skill"
- 存放位置：`~/.config/opencode/skills/`（手动创建的技能）
- 技能管理：使用 skill-manager 查看和管理已安装技能
```

### 4. 问题反馈（可选）

```markdown
## 问题反馈

遇到问题时：
1. 先查询相关文档和 Issues
2. 自行排查尝试解决
3. 无法解决时登记 Issue 寻求帮助
```

## 完整示例

将以下内容添加到你的全局 AGENTS.md：

```markdown
# OpenCode 全局配置

## 通用规则

- 思考过程应尽可能使用中文描述输出
- **所有新建的 AGENTS.md 默认使用中文**，除非内容包含英文技术术语/代码（此时保持英文）
- 项目用 init 指令输出的项目级 AGENTS 文件必须用中文描述
- 后续对 AGENTS 文件的改动应主动分析内容是否足够精简，判断是否有内容适合创建 skill 独立存放

## 可用 Skills

### 项目内技能（克隆即用）

| 技能 | 触发条件 | 功能 |
|------|---------|------|
| **openclaw-ops** | 启动 Gateway、配置 API Key、OpenClaw 出问题了 | Gateway 运维 |
| **skill-manager** | 查看已安装 skills、本地有哪些技能、更新 skills | 技能管理 |
| **skill-finder** | 热门 skills 推荐、推荐适合我的 skills | 技能推荐 |
| **skill-creator** | 创建一个 skill、帮我写个 skill | 创建技能 |

### 全局技能（npx 安装）

| 技能 | 触发条件 | 功能 | 安装命令 |
|------|---------|------|----------|
| **find-skills** | 有没有做 X 的 skill | 发现技能 | `npx skills add find-skills -g` |

> 项目地址：https://github.com/ThymeD/skills（克隆到 `~/.config/opencode/skills/thymed-skills/`）
> 更多技能：https://skills.sh

## 使用

- 发现技能：说"有没有能做 X 的 skill"
- 存放位置：`~/.config/opencode/skills/`
- 技能管理：使用 skill-manager 查看和管理已安装技能
- OpenClaw：使用 openclaw-ops 管理 Gateway（首次使用说"初始化 OpenClaw"）

## 本地配置（可选）

> ⚠️ 以下为示例，请根据实际情况修改

- **项目**: `~/your-project`
- **OpenClaw**: `~/.openclaw/`
- **Gateway**: 端口 18789
```

## 输出格式

直接输出配置模板内容，并标注哪些部分可根据个人需求调整。
