# AGENTS.md - Skills 仓库

**用途**: 本仓库为 https://github.com/ThymeD/skills 项目的技能集合。克隆到 `~/.config/opencode/skills/thymed-skills/` 后 OpenCode 会自动发现这些技能。

---

## 项目概述

- **类型**: OpenCode 技能集合
- **主要技能**: `openclaw-ops` - OpenClaw Gateway 运维管理
- **语言**: Markdown 文档 (SKILL.md, AGENTS.md)

---

## 构建 / 测试 / 检查命令

这是一个纯文档仓库，没有构建流程。`openclaw-ops` 技能是一个元数据包。

```bash
# 无需构建 - 技能是纯 Markdown 文件

# 测试：验证 Markdown 语法（可选）
# npm install -g markdownlint-cli
# markdownlint **/*.md
```

---

## 代码风格指南

### 通用约定

1. **文件结构**: 每个技能必须包含:
   - `SKILL.md` - 技能简述，用于技能发现
   - `AGENTS.md` - 智能体详细指令

2. **命名规范**:
   - 目录: kebab-case (例如 `openclaw-ops`)
   - 文件: kebab-case (例如 `SKILL.md`, `AGENTS.md`)

3. **元数据**: 技能应包含 YAML frontmatter:
   ```yaml
   ---
   name: skill-name
   description: 简短描述
   license: MIT
   metadata:
     author: local
     version: x.x.x
   ---
   ```

### SKILL.md 编写规范

- 保持 300 行以内
- 包含触发条件（激活技能的用户话术）
- 提供快速参考命令
- 使用表格进行对比

### AGENTS.md 编写规范

- 智能体详细指令
- 包含分步骤工作流
- 记录错误处理
- 跨平台注意事项 (Windows, macOS, Linux)

### Markdown 格式规范

- 使用带语言标识的代码块
- 使用表格展示结构化数据
- 使用标题构建层级 (H1 标题, H2 章节, H3 小节)
- 无尾随空格

### 安全规范

**禁止在技能中包含任何敏感信息**：
- API Key、Token、密钥
- 密码、私钥
- 个人身份信息（PII）

**示例检查**：
```bash
# 检查是否包含敏感信息
grep -r "api_key\|password\|secret\|token\|apikey" --include="*.md"
```

### 交互规范

**决策确认原则**：当用户回复存在歧义时（如"也行吧"、"随便"、"都可以"），应主动确认用户意图，避免自行假设执行。

### 路径规范

**涉及本地路径必须使用跨平台写法**：
- 使用 `~` 代替用户目录（如 `~/.config/opencode/skills/`）
- 使用环境变量（如 `${HOME}`、`${USERPROFILE}`）
- **禁止硬编码**（如 `C:\Users\dzx\`、`/home/username/`）

```bash
# 正确写法
~/.config/opencode/skills/
~/.agents/skills/
${HOME}/.openclaw/

# 错误写法
C:\Users\dzx\.config\opencode/skills/
/home/dzx/.config/opencode/skills/
```

### 文档规范

- 语言: 用户面向内容使用中文 (简体中文)
- 代码注释: 使用英文
- 命令示例: 使用平台适当的语法
  - Windows: PowerShell 命令
  - macOS/Linux: Bash 命令

---

## 添加新技能

1. 创建目录: `mkdir new-skill-name`
2. 创建 `SKILL.md`，包含 frontmatter 和简要内容
3. 创建 `AGENTS.md`，包含详细指令
4. 更新 `README.md` 添加技能说明

**每个技能的 AGENTS.md 顶部必须添加问题反馈指引**：
```markdown
> **问题反馈与贡献**: 使用本技能遇到问题时，请先查阅 [GitHub Issues](https://github.com/ThymeD/skills/issues) 和项目级 [AGENTS.md](../AGENTS.md#问题反馈与贡献指南)。AI 工具应具备自主排查和贡献解决方案的能力。
```

---

## 问题反馈与贡献指南

本仓库采用开放式协作模式，所有使用此技能仓库的 AI 工具和使用者都应具备自主解决问题和贡献方案的能力。

### 使用本地技能时的优化流程

当 AI 工具使用 thymed-skills 中的技能遇到问题时：

1. **识别问题**：发现技能描述不清晰、缺少示例、路径错误等问题
2. **直接修复**：在 thymed-skills 目录下修改对应技能文件
3. **验证有效**：确认修复有效后提交到 GitHub
4. **同步本地**：本地通过 skill-sync-pr 技能同步更新

**仓库路径**：`~/.config/opencode/skills/thymed-skills/`（Git 仓库 + 技能目录）
**用户自定义技能**：`~/.config/opencode/skills/<其他>/`（不受 thymed-skills 更新影响）

### 遇到问题时的处理流程

1. **先查询，再提问**: 使用技能前，先查阅 [GitHub Issues](https://github.com/ThymeD/skills/issues) 和本文档，确认是否已有解决方案

2. **主动登记 Issue**: 遇到无法自行解决的问题时，应在 GitHub 项目上主动登记 Issue，包含：
   - 清晰的错误描述和环境信息
   - 复现步骤（最小化、可直接执行的步骤）
   - 期望行为 vs 实际行为
   - 已尝试的排查思路和结果

3. **自行解决后的贡献**: 如果通过排查确认了有效的解决方案，应在原 Issue 上回复并包含：
   - 问题根因分析
   - 可复现的解决方案（完整步骤和关键代码/配置）
   - 适用条件和注意事项

### 代码与方案贡献规范

**禁止行为**:
- 注水代码：无实际功能、仅为了提交而提交的代码
- 无效方案：未经验证、或无法复现的"解决思路"
- 重复造轮子：已有成熟方案却另起炉灶

**正确流程**:
1. 先提 Issue 描述问题和建议的修复方案
2. 创建分支 `fix/issue-{编号}` 或 `feat/issue-{编号}`
3. 实现经测试验证的修复
4. 提交 PR 并关联对应 Issue
5. 经 Code Review 后合并

### AI 工具的自主能力要求

使用本仓库技能的 AI 工具应具备以下能力：
- 主动搜索 GitHub Issues 和文档寻找解决方案
- 遇到新问题时自主排查并尝试解决
- 确认解决方案有效后主动在 Issue 上回复贡献方案
- 发现技能本身的缺陷时主动提 Issue 和提交 PR

---

## 配置位置

- **GitHub 项目技能**: `~/.config/opencode/skills/thymed-skills/`
- **用户自定义技能**: `~/.config/opencode/skills/<其他>/`
- **OpenClaw 配置**: `~/.openclaw/`
- **OpenCode 配置**: `~/.local/share/opencode/`

---

## OpenCode 全局规则推荐

> 以下规则可添加到 OpenCode 全局配置中，提升 AI 与用户的交互质量。建议根据个人需求选择采纳。

### 交互规则

| 规则 | 说明 |
|------|------|
| 决策确认 | 当用户回复存在歧义时（如"也行吧"、"随便"、"都可以"），应主动确认用户意图，避免自行假设执行 |

### 如何添加到本地

1. 找到 OpenCode 配置文件（通常在 `~/.local/share/opencode/` 或项目根目录）
2. 在 AGENTS.md 中添加上述规则
3. 重启 OpenCode 使配置生效

---

## 常见任务

### 测试新技能
技能放置到技能目录后会自动加载，无需测试。

### 检查 Markdown 文件
```bash
npm install -g markdownlint-cli
markdownlint **/*.md
```

### 版本更新
1. 更新 `package.json` 中的版本
2. 更新 `SKILL.md` frontmatter 中的版本
3. 更新 `AGENTS.md` 头部版本
4. 需要时更新 `README.md`

---

## 参考资料

- 现有技能: `openclaw-ops/` (良好的结构参考)
- OpenCode 官方文档 - 技能格式规范
