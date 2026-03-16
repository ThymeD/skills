# Skill: GitOps

Git 与 GitHub 仓库管理工具 - 负责项目代码的版本控制、提交推送、Issue 管理、PR 提交和标签操作。

## 触发条件

用户提及以下任一关键词时触发：
- "gitops"、"GitOps"
- "提交代码"、"提交到远程"、"推送到 GitHub"
- "拉取最新"、"从远程更新"、"同步代码"
- "登记 Issue"、"创建 Issue"、"反馈问题"
- "提交 PR"、"创建 Pull Request"、"发起合并"
- "打标签"、"创建 Tag"、"发布版本"
- "分支管理"、"创建分支"、"切换分支"
- "git 操作"、"GitHub 操作"

## 核心功能

| 功能 | 说明 |
|------|------|
| **代码提交** | 将本地更改提交并推送到远程仓库 |
| **代码同步** | 从远程拉取最新代码到本地 |
| **Issue 管理** | 创建、查看、关闭 GitHub Issue |
| **PR 管理** | 创建、查看、合并 Pull Request |
| **标签管理** | 创建、查看、删除 Git 标签 |
| **分支管理** | 创建、切换、删除分支 |

## Git 工作流规范

### 分支策略

采用 Git Flow 简化版：

```
main (或 master)  →  主分支受保护，不能直接推送
  ↑
develop            →  开发分支，日常开发在此进行
  ↑
feature/xxx       →  功能分支，从 develop 拉取
  ↑
bugfix/xxx        →  修复分支，从 develop 拉取
```

### 提交信息规范

采用 Conventional Commits 格式：

```
<type>(<scope>): <subject>

可选 body

可选 footer
```

**type 类型**：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构（既不是新功能也不是修复）
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变动

**示例**：
```
feat(yaku): 添加役种详情页显示功能

新增役种点击后展示详细信息弹窗

Closes #123
```

## 常用命令

### 1. 代码提交与推送

```bash
# 查看当前状态
git status

# 查看更改内容
git diff

# 添加所有更改
git add -A

# 提交更改（交互式）
git commit

# 推送到远程
git push

# 推送到远程（设置上游分支）
git push -u origin <branch-name>
```

### 2. 代码同步

```bash
# 拉取并合并远程更改
git pull

# 仅获取远程更新（不合并）
git fetch

# 查看远程分支
git branch -r
```

### 3. 分支管理

```bash
# 查看本地分支
git branch

# 查看所有分支
git branch -a

# 创建并切换到新分支
git checkout -b <branch-name>

# 切换分支
git checkout <branch-name>

# 删除本地分支
git branch -d <branch-name>

# 删除远程分支
git push origin --delete <branch-name>
```

### 4. Issue 管理

```bash
# 查看 Issue 列表
gh issue list

# 创建新 Issue
gh issue create --title "标题" --body "内容"

# 查看单个 Issue
gh issue view <number>

# 关闭 Issue
gh issue close <number>
```

### 5. PR 管理

```bash
# 查看 PR 列表
gh pr list

# 创建新 PR
gh pr create --title "标题" --body "描述" --base main --head <branch>

# 查看 PR
gh pr view <number>

# 合并 PR
gh pr merge <number>

# 检查 PR 状态
gh pr checks <number>
```

### 6. 标签管理

```bash
# 创建轻量标签
git tag <tag-name>

# 创建附注标签（推荐）
git tag -a <tag-name> -m "版本说明"

# 推送标签到远程
git push origin <tag-name>

# 推送所有标签
git push origin --tags

# 删除本地标签
git tag -d <tag-name>

# 删除远程标签
git push origin --delete <tag-name>
```

## 交互流程

### 场景 1: 提交代码到远程

1. **检查状态** - 运行 `git status` 查看更改
2. **确认更改** - 询问用户确认要提交的更改
3. **输入提交信息** - 要求用户输入提交信息（标题+描述）
4. **执行提交** - `git add -A && git commit -m "..."`
5. **推送到远程** - `git push`
6. **返回结果** - 报告提交和推送结果

### 场景 2: 从远程拉取代码

1. **确认分支** - 确认要拉取的分支
2. **执行拉取** - `git pull` 或 `git fetch`
3. **处理冲突** - 如有冲突，提示用户手动解决
4. **返回结果** - 报告拉取结果

### 场景 3: 创建 Issue

1. **收集信息** - 询问 Issue 标题和描述
2. **创建 Issue** - 使用 `gh issue create --body-file`（避免乱码）
3. **返回结果** - 返回 Issue 链接

### 场景 4: 创建 PR

1. **确认分支** - 确认源分支和目标分支
2. **收集信息** - 询问 PR 标题和描述
3. **创建 PR** - 使用 `gh pr create --body-file`（避免乱码）
4. **返回结果** - 返回 PR 链接

### 场景 5: 打标签发布

1. **确认版本** - 询问版本号（如 v1.0.0）
2. **确认信息** - 询问版本说明
3. **创建标签** - `git tag -a v1.0.0 -m "..."`
4. **推送标签** - `git push origin --tags`
5. **返回结果** - 报告标签创建结果

## Issue/PR 防乱码规范

**核心原则**：使用 `--body-file` 而非 `--body` 传多行内容

### 正确做法

```bash
# 正确：将内容写入临时文件
cat > /tmp/issue_body.md << 'EOF'
## 问题描述
...

## 复现步骤
...
EOF
gh issue create --repo owner/repo --title "标题" --body-file /tmp/issue_body.md

# PR 同样
cat > /tmp/pr_body.md << 'EOF'
## 改动说明
...
Closes #123
EOF
gh pr create --repo owner/repo --title "标题" --body-file /tmp/pr_body.md --base main --head <branch>
```

### 错误做法

```bash
# 错误：内容会变成字面量或乱码
gh issue create --repo owner/repo --title "标题" --body "$(cat <<'EOF'
## 问题描述
...
EOF
)"

# 错误：多行内容可能被截断
gh issue create --repo owner/repo --title "标题" --body "第一行\n第二行"
```

**原因**：`--body` 参数直接传多行内容会被截断、转义或变成字面量，使用临时文件可避免此问题。

### 自动处理脚本

提供 Python 辅助脚本自动处理：

```python
from gitops import create_issue, create_pr

# 创建 Issue
create_issue("owner/repo", "标题", "多行内容...")

# 创建 PR
create_pr("owner/repo", "标题", "多行描述...", "main", "feature-branch")
```

## 安全规则

1. **禁止强制推送** - 禁止使用 `git push --force`
2. **禁止直接推送到主分支** - main/master 分支受保护
3. **提交前检查** - 推送前确认没有敏感信息
4. **Issue/PR 关联** - Bug 修复类 PR 需关联 Issue（如 `Closes #123`）

## Issue/PR 提交规范

### Issue 提交

- **Bug 修复类**：需要提交 Issue，描述问题
- **需求类**：不必提交 Issue，可直接提交 PR

### PR 提交

- **Bug 修复类 PR**：
  - 必须关联 Issue（使用 `Closes #123` 或在 body 中包含）
  - 描述问题和修复方案
  
- **需求类 PR**：
  - 不必关联 Issue
  - **必须描述清楚加了什么功能**
  - 使用清晰的标题和详细的 body 说明功能内容

## 注意事项

1. 使用 `gh` 命令进行 GitHub 操作（需安装 GitHub CLI）
2. 提交前先检查 `git status` 和 `git diff`
3. 大改动前建议创建备份分支
4. 推送失败时检查网络连接
5. 定期同步远程更新，避免大规模冲突
