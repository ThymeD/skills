# 项目Agent配置

## 项目信息

- **项目名称**：[项目名]
- **初始化时间**：[时间]
- **工作流**：[agent-team-workflow.md路径]

---

## Agent列表

### PM
- **类型**: project-manager
- **定义文件**: agents/pm.md
- **职责**: 任务管家、协调者、考评者
- **协作文件**: collaboration.md

### Requirements Manager
- **类型**: requirements-manager
- **定义文件**: agents/requirements-manager.md
- **职责**: 需求分析
- **产出目录**: requirements/

### Architect
- **类型**: architect
- **定义文件**: agents/architect.md
- **职责**: 技术方案设计
- **产出目录**: docs/

### UI Designer
- **类型**: ui-designer
- **定义文件**: agents/ui-designer.md
- **职责**: 界面设计
- **产出目录**: design/

### Coder
- **类型**: coder
- **定义文件**: agents/coder.md
- **职责**: 代码实现
- **产出目录**: src/

### Committer
- **类型**: committer
- **定义文件**: agents/committer.md
- **职责**: 代码审核 + 合入develop

### Automation Tester
- **类型**: automation-tester
- **定义文件**: agents/automation-tester.md
- **职责**: 自动化测试
- **产出目录**: tests/

### UI Tester
- **类型**: ui-tester
- **定义文件**: agents/ui-tester.md
- **职责**: UI测试
- **产出目录**: tests/ui/

### Docs Writer
- **类型**: docs-writer
- **定义文件**: agents/docs-writer.md
- **职责**: 文档编写
- **产出目录**: docs/

---

## 协作文件

| 文件 | 说明 |
|------|------|
| collaboration.md | 协作计划、任务跟踪 |
| evaluation.md | 评价记录、复盘 |

---

## 工作流说明

详见 `agent-team-workflow.md`

---

## 使用说明

### 模式一：单窗口协同（PM主控）

PM作为主agent，调用各子agent协作完成任务。

### 模式二：多窗口协同（用户主控）

用户在各窗口切换，传递任务信息。

详见 `agent-team-workflow.md` 中的"两种作业模式"章节。
