---
name: skill-creator
description: 创建和优化 skills。用于用户想要创建新 skill、更新或优化现有 skill、运行测试来验证 skill 效果。当用户说"创建一个 skill"、"把这个变成 skill"或"帮我写个 skill"时使用此技能。
license: MIT
metadata:
  author: local
  version: 1.0.0
---

# Skill Creator

帮助你创建、测试和改进 OpenCode skills。

## 创建流程

### 1. 理解意图

首先了解用户想要这个 skill 做什么：
- 这个 skill 要实现什么功能？
- 什么时候触发？（用户说什么/什么场景）
- 期望的输出格式是什么？
- 需要设置测试用例吗？

### 2. 编写 SKILL.md

创建 `<skill-name>/SKILL.md`，包含：

```yaml
---
name: skill名称
description: 触发条件和功能描述
---
```

**description 编写要点：**
- 明确说明什么时候触发
- 包含具体关键词和场景
- 描述 skill 能做什么
- 适度"激进"一些，确保需要时能被调用

### 3. Skill 结构

```
skill-name/
├── SKILL.md (必需)
├── AGENTS.md (推荐) - 智能体详细指令
├── README.md (可选) - 用户文档
├── scripts/ (可选) - 可执行脚本
├── references/ (可选) - 参考文档
└── assets/ (可选) - 资源文件
```

### 4. 可选 - 添加 AGENTS.md

如果 skill 需要更复杂的指令，创建 AGENTS.md 包含：
- 详细的触发条件
- 完整的工作流程
- 代码示例
- 边界情况处理

### 5. 测试

创建 2-3 个测试用例，保存到 `evals/evals.json`

### 6. 运行测试

运行测试用例，评估结果，根据用户反馈改进 skill。

---

## Skills 存放位置

OpenCode 会从以下位置发现 skills：
- 项目配置：项目根目录下的 `AGENTS.md` 中定义的 skills
- 全局配置：`~/.config/opencode/skills/thymed-skills/<name>/SKILL.md`

建议把本地可复用的 skills 放在全局配置目录。

---

## Front Matter 最佳实践

### 必需字段

```yaml
---
name: skill名称
description: 触发条件和功能描述
---
```

### 推荐字段

```yaml
---
name: skill名称
description: 触发条件和功能描述
license: MIT
metadata:
  author: 你的名字
  version: 1.0.0
---
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 技能名称（必须与目录名一致） |
| description | string | 触发条件和功能描述 |
| license | string | 许可证（如 MIT, Apache-2.0） |
| metadata.author | string | 作者 |
| metadata.version | string | 语义化版本号 |

---

## 优化现有 Skill

### 场景

用户想要改进已有的 skill：
- 添加更多功能
- 完善文档
- 添加测试用例

### 工作流程

1. 读取现有 SKILL.md
2. 询问用户想要改进的方面
3. 进行修改
4. 验证修改效果
