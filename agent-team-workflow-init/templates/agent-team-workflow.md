# 多Agent团队协作工作流

## 核心理念

多agent平等协作，通过git管理产出，PM作为协调者，各agent在独立分支工作，committer审核后合入develop，用户验收后合入release。

---

## 两种作业模式

### 模式一：单窗口协同（PM主控）

```
用户窗口（一个窗口）
    ↓
PM（主agent）→ 分发任务 → 子agent1
                     ↓
               子agent2
                     ↓
               子agent3
```

| 特点 | 说明 |
|------|------|
| 架构 | PM作为主agent，调用各子agent |
| 优势 | PM自主分发任务，协作紧密 |
| 劣势 | 对PM能力要求高，容易变成PM自己干活 |
| 适用 | PM能力强，能很好协调的场景 |

**PM主动汇报机制**：
```
PM判断需要用户决策
    ↓
PM主动向用户汇报当前状态
    ↓
用户确认 / 反馈意见
    ↓
继续 / 修改后继续
```

**PM职责**：
- 维护协作文档（collaboration.md）
- 分发任务给子agent
- **不直接做具体工作**
- **主动向用户汇报，需要时请求用户决策**
- **团队管理：招聘新agent、辞退落后agent、改进计划**

**PM团队管理职责**：

### 1. 招聘新agent

| 场景 | 说明 |
|------|------|
| 发现缺少某个角色 | PM分析需求，提出招聘需求 |
| 用户确认招聘 | 用户确认是否招聘 |
| 入职 | PM定义新agent，更新相关文件，通知团队 |

### 2. 处理能力落后的agent

| 方式 | 说明 | 适用场景 |
|------|------|----------|
| 方式一：辞退+招聘 | 直接辞退了，按新要求招聘 | 能力差距大、无法改进 |
| 方式二：改进计划 | 提出改进计划，监督落实 | 有改进空间、需要培养 |

### 3. 团队变动通知

| 变动类型 | 通知内容 |
|----------|----------|
| 入职 | 新agent名称、职责、协作方式 |
| 离职 | 离职agent名称、原因、接替安排 |
| 改进 | 改进措施、时间节点 |

### 4. 相关文件更新

| 变动类型 | 需要更新的文件 |
|----------|---------------|
| 招聘新agent | collaboration.md、项目AGENTS.md |
| 辞退agent | collaboration.md、项目AGENTS.md |
| 改进计划 | collaboration.md（记录改进过程） |

| 节点 | 汇报内容 | 需要用户决策 |
|------|----------|-------------|
| 需求分析后 | 需求是否完整、清晰 | ✅ 确认需求 |
| 技术方案后 | 方案是否可行、合理 | ✅ 确认方案 |
| 设计稿后 | 界面是否符合预期 | ✅ 确认设计 |
| 代码实现后 | 功能是否符合需求，效果如何 | ✅ 确认功能 |
| 合入release前 | 整体功能验收 | ✅ 确认验收 |

**PM主动汇报机制**：
```
PM判断需要用户决策
    ↓
PM主动向用户汇报当前状态
    ↓
用户确认 / 反馈意见
    ↓
继续 / 修改后继续
```

### 模式二：多窗口协同（用户主控）

```
用户窗口1：PM
    ↓ 切换
用户窗口2：coder
    ↓ 切换
用户窗口3：tester
    ↓ 切换
...
```

| 特点 | 说明 |
|------|------|
| 架构 | 用户在各窗口切换，传递任务 |
| 优势 | 各agent独立工作，职责清晰 |
| 劣势 | 用户需要频繁切换窗口 |
| 适用 | 任何场景，尤其PM能力不足时 |

**协作方式**：
- collaboration.md 作为共享状态文件
- 用户在各窗口间切换
- 通过文件传递任务信息

**协作复盘**：
- 每次合入release时，由PM进行总结（用户告知PM各agent表现）
- 记录到 collaboration.md
- 由用户确认总结是否合理

---

### 模式选择

| 场景 | 推荐模式 |
|------|----------|
| PM能力强，能很好协调 | 模式一（单窗口） |
| PM经验不足 | 模式二（多窗口） |
| 复杂项目 | 模式二（多窗口） |
| 简单任务 | 模式一（单窗口） |

> 两种模式可以混合使用，根据实际情况灵活选择。

---

## Git 工作流程

```
release分支（用户验收通过后合入）
    ↑
    ↑ 用户验收
    |
develop分支（各agent产出审核后合入）
    ↑
    ↑ committer审核
    |
feature-{agent}-{任务名}  ← 各agent自己的分支
    ↑
    ↑ 从develop拉取
    |
develop分支（基础分支）
```

### 分支规范

```
{type}-{agent}-{任务名}

type类型：
- feature：新功能开发
- bugfix：Bug修复
- docs：文档编写
- test：测试相关
- refactor：重构
- hotfix：紧急修复（慎用）
```

#### 各agent常用分支类型

| agent | 常用分支类型 |
|-------|-------------|
| coder | feature（新功能）、bugfix（修复） |
| automation-tester | test |
| ui-tester | test |
| docs-writer | docs |
| architect | docs、feature（技术方案） |
| ui-designer | feature（设计稿） |

#### 分支命名示例

```
feature-coder-login-page
bugfix-coder-login-validation
test-automation-tester-login
docs-docs-writer-api
```

### 提交信息规范

```
[{agent}] {动作}: {描述}

示例：
[coder] feat: 实现登录页面
[automation-tester] test: 添加登录功能测试
[ui-designer] feat: 登录页面设计稿
[committer] merge: 登录功能合入develop
```

### 需求与任务的关系

```
用户需求
    ↓
requirements-manager 产出 SPEC.md（需求清单，含需求编号）
    ↓
PM 读取 SPEC.md，从需求拆解为任务
    ↓
collaboration.md（任务清单，关联需求编号）
    ↓
各agent完成任务，产出交付件
    ↓
合入release，对应需求标记为完成
```

#### 文件职责

| 文件 | 维护者 | 用途 |
|------|--------|------|
| SPEC.md | requirements-manager | 需求清单（需求编号、需求描述） |
| collaboration.md | PM | 任务清单（任务、关联需求编号、进度） |

#### 协作流程

1. **需求阶段**：requirements-manager 分析需求 → 产出 SPEC.md → 用户确认
2. **规划阶段**：PM 读取 SPEC.md → 拆解为任务 → 写入 collaboration.md → 用户确认
3. **执行阶段**：各agent执行任务 → 更新 collaboration.md → 标记需求完成

### 工作流程

| 阶段 | 操作者 | 说明 |
|------|--------|------|
| 1. 启动PM | 用户 | 用户启动PM窗口，PM分析需求生成任务清单 |
| 2. 切换agent | 用户 | 用户复制任务内容，切换到对应agent窗口 |
| 3. 创建分支 | agent | 从develop拉取分支，命名符合规范 |
| 4. 完成任务 | agent | 在分支上进行开发、测试、设计等工作 |
| 5. 提交代码 | agent | 本地提交，提交信息符合规范 |
| 6. 汇报完成 | agent | 向用户汇报完成，用户关闭窗口 |
| 7. 切换PM | 用户 | 用户切换到PM窗口，告知任务完成 |
| 8. 更新协作 | PM | PM更新collaboration.md，安排下一步 |
| 9. 审核 | committer | committer审核代码质量，决定是否合入develop |
| 10. 合入 | committer | 将通过审核的分支合入develop |
| 11. 重复 | 用户 | 重复第2-10步，直到任务完成 |
| 12. 验收 | 用户 | develop累积成果后，用户验收 |
| 13. 合入release | 用户 | 验收通过后，合入release分支 |

---

## 任务交接流程

### 交接规则

| 当前agent | 完成后 → 下一个介入的agent |
|-----------|--------------------------|
| requirements-manager | → architect（需求明确后设计技术方案） |
| architect | → coder（技术方案确定后开始开发） |
| ui-designer | → coder（设计稿完成后开始开发） |
| coder | → committer（开发完成后审核） |
| committer | → automation-tester（审核通过后开始测试） |
| automation-tester | → ui-tester（自动化测试完成后UI测试） |
| automation-tester（发现bug） | → coder（创建bugfix分支修复） |
| ui-tester（发现bug） | → coder（创建bugfix分支修复） |
| ui-tester（通过） | → PM（汇报完成，等待下一步） |

### 交接流程（窗口切换模式）

**核心原则**：交付件直接写入项目目录，不依赖窗口上下文

```
1. Agent A 完成任务
    ↓
2. Agent A 将交付件写入项目约定目录（src/tests/docs等）
    ↓
3. Agent A 向用户汇报完成情况（交付件位置、内容摘要）
    ↓
4. 用户决定是否关闭 Agent A 窗口（可选）
    ↓
5. 用户切换到 PM 窗口
    ↓
6. PM 更新 collaboration.md（交付件已在项目目录）
    ↓
7. PM 判定下一个agent，更新"最新任务"区域
    ↓
8. 用户切换到下一个agent窗口，复制任务内容
    ↓
9. 新agent开始工作（直接使用上一阶段的交付件）
```

### 关键说明

| 要点 | 说明 |
|------|------|
| **交付件位置** | 直接写入项目约定目录，不放在窗口上下文中 |
| **信息不丢失** | collaboration.md 记录交付件位置，切换窗口后仍可查看 |
| **灵活切换** | 用户决定是否立即关闭当前窗口 |
| **承接方式** | 新agent读取 collaboration.md 中的交付件位置，直接使用 |

### 窗口切换与信息传递

| 步骤 | 操作 | 说明 |
|------|------|------|
| 1 | 复制任务 | 用户从 collaboration.md 复制"最新任务"内容 |
| 2 | 切换窗口 | 关闭当前agent窗口，打开新agent窗口 |
| 3 | 粘贴任务 | 把任务内容粘贴给新agent |
| 4 | 继续工作 | agent根据任务内容开始工作 |

### 交接检查清单

| 检查项 | 说明 |
|--------|------|
| 产出文件 | 产出是否已写入约定目录 |
| 合入develop | 代码是否已通过committer审核并合入 |
| collaboration.md | 进度是否已更新 |
| 下一个agent | 是否已收到任务指派 |

### 构建与运行

| 阶段 | 操作者 | 说明 |
|------|--------|------|
| 构建验证 | coder | coder验证代码能否构建通过 |
| 运行展示 | coder | coder运行项目，展示效果给用户确认 |
| 自动化测试 | automation-tester | 运行自动化测试验证功能 |
| 验收阶段 | 用户 | 查看效果、运行项目、验证功能 |

### 构建报错处理

```
coder 构建验证
    ↓
成功 → 继续（展示效果给用户）
    ↓
失败
    ↓
coder 判断：
├── 小问题（自己知道怎么修）→ 直接修复 → 重新构建 → 展示效果
    ↓
└── 大问题（不知道原因/需要讨论）→ 上报PM → PM决定处理方式
```

| 场景 | 操作者 | 说明 |
|------|--------|------|
| 小错误 | coder自己修 | 常见语法、依赖缺失等 |
| 复杂问题 | coder上报PM | 架构问题、依赖冲突等 |
| 构建验证记录 | coder记录 | 记录构建时长、错误类型，便于复盘 |

### 测试用例编写分工

| 测试类型 | 编写者 | 说明 |
|----------|--------|------|
| 简单单元测试 | coder | 基本的断言覆盖 |
| 复杂业务测试 | automation-tester | 需要设计测试用例、边界条件等 |
| UI测试 | ui-tester | 界面交互测试 |

**判断流程**：
```
coder 提交代码
    ↓
committer 判断：
├── 简单测试 → coder补 → 合入
    ↓
└── 复杂测试 → automation-tester写 → 合入
```

### 用户验证时机

| 时机 | 验证内容 | 发起者 |
|------|----------|--------|
| 需求分析后 | 需求是否完整、清晰 | requirements-manager → 用户 |
| 技术方案后 | 方案是否可行、合理 | architect → 用户 |
| 设计稿完成后 | 界面是否符合预期 | ui-designer → 用户 |
| 代码实现后 | 功能是否符合需求 | coder → 用户 |
| 自动化测试后 | 测试是否通过 | automation-tester → 用户 |
| UI测试后 | 界面交互是否正常 | ui-tester → 用户 |
| 合入release前 | 整体功能验收 | PM → 用户 |

> **注**：编码前的产出物（需求、方案、设计）是后续工作的基础，务必在进入下一阶段前确认。

### 验证流程

```
Agent 完成任务
    ↓
向用户展示产出（截图、运行效果、产出文件）
    ↓
用户确认 / 反馈修改意见
    ↓
确认 → 继续下一阶段
    ↓
反馈 → 生成修复任务 → 返回修改
```

> **注**：日常开发中以Agent协作递进为主，用户验证仅在关键节点进行，避免过度打扰。

---

## 角色清单

| agent | 职责 | 产出 |
|-------|------|------|
| **PM** | 任务管家、协调者 | collaboration.md |
| **requirements-manager** | 需求分析 | requirements/SPEC.md |
| **architect** | 技术方案设计 | docs/architecture.md |
| **ui-designer** | 界面设计 | design/*.html, design/*.md |
| **coder** | 代码实现 | src/** |
| **committer** | 代码审核 + 合入develop | 审核意见 |
| **automation-tester** | 自动化测试 | tests/**/*.test.ts |
| **ui-tester** | UI测试（人工复核） | tests/ui/** |
| **docs-writer** | 文档编写 | docs/**/*.md |

---

## 协作文件

### collaboration.md（项目根目录）

```markdown
# 协作计划

## 项目信息
- 项目：[项目名]
- 启动时间：[时间]

---

## 需求进度（引用SPEC.md）

| 需求编号 | 需求描述 | 状态 | 负责人 |
|----------|----------|------|--------|
| #001 | 用户登录 | 进行中 | coder |
| #002 | 用户注册 | 待开始 | - |

---

## 最新任务（用户可直接复制给agent）

### 当前进行中
> 复制以下内容给当前agent：

**[agent名称]**
- 分支：
- 任务：
- 关联需求：SPEC.md #001
- 产出目录：
- 上一阶段产出位置：

### 待执行任务
> 以下任务等待执行，按顺序启动：

1. **[agent名称]** - [任务描述]（关联需求：SPEC.md #001）
2. **[agent名称]** - [任务描述]（关联需求：SPEC.md #002）
3. ...

---

## 进度追踪（完整记录）

### 已完成
- [ ] 完成时间: 2024-01-15 10:30 → requirements-manager: 需求分析 → 关联需求: #001 → 产出: requirements/SPEC.md
- [ ] 完成时间: 2024-01-15 14:20 → architect: 技术方案 → 关联需求: #001 → 产出: docs/architecture.md
- [ ] 完成时间: 2024-01-16 11:00 → coder: 代码实现 → 关联需求: #001 → 分支: feature-coder-xxx → 产出: src/**
- [ ] 完成时间: 2024-01-16 15:30 → committer: 审核 → 关联需求: #001 → 合入develop
- [ ] 完成时间: 2024-01-17 09:45 → automation-tester: 自动化测试 → 关联需求: #001 → 分支: test-automation-tester-xxx → 产出: tests/**

### 进行中
- [ ] ui-tester: UI测试 → 关联需求: #001 → 分支: test-ui-tester-xxx → 产出: tests/ui/**

---

## 产出约定
| 任务 | 产出目录 |
|------|----------|
| requirements | requirements/ |
| architecture | docs/ |
| ui-design | design/ |
| code | src/ |
| automation-test | tests/ |
| ui-test | tests/ui/ |

## 审核流程

### committer 审核清单

| 检查项 | 说明 |
|--------|------|
| 代码规范 | 符合项目编码规范 |
| 功能完整 | 实现需求中的功能 |
| 测试覆盖 | 有对应的自动化测试 |
| 无明显bug | 无明显的逻辑错误 |
| 可读性 | 代码可读性良好 |

### 审核结果

| 结果 | 说明 |
|------|------|
| **通过** | 合入develop，更新collaboration.md |
| **需修改** | 反馈修改意见，agent修改后重新提交 |
| **拒绝** | 说明拒绝理由，任务结束 |

---

## 用户验收

### 验收节点

| 节点 | 说明 |
|------|------|
| 功能完成 | 一个完整功能开发测试完成后 |
| 里程碑 | 多个功能完成后 |
| 发布前 | 准备合入release前 |

### 验收流程

```
develop累积成果
    ↓
PM向用户汇报当前进度
    ↓
用户验收（查看产出、运行项目）
    ↓
通过 → 合入release
    ↓
不通过 → 生成修复任务 → 继续开发
```

---

## 目录结构

```
project/
├── collaboration.md      ← 协调文件
├── requirements/         ← 需求产出
│   └── SPEC.md
├── docs/                 ← 架构/文档产出
│   └── architecture.md
├── design/               ← 设计产出
│   └── *.html
├── src/                 ← 代码产出
├── tests/               ← 测试产出
│   ├── *.test.ts        ← 自动化测试
│   └── ui/              ← UI测试
└── ...
```

---

## 各agent独立工作说明（窗口切换模式）

### 通用规则

1. **开始工作前**：
   - 用户切换到agent窗口
   - 用户提供任务内容（从collaboration.md复制）
   - 从develop拉取新分支，命名符合规范
2. **工作过程中**：
   - 定期提交，保持提交历史清晰
3. **完成后**：
   - 确保代码可运行
   - 向用户汇报完成情况
   - 用户关闭当前窗口
4. **等待交接**：
   - 用户切换到PM窗口，告知完成情况
   - PM更新collaboration.md，安排下一步

### PM 职责

- 分析用户需求，生成任务清单，写入 collaboration.md
- 指派任务给合适的agent（通过用户切换窗口传递）
- 跟踪进度，更新collaboration.md
- 每次agent完成后进行进度更新
- 向用户汇报进度，建议下一步启动哪个agent

### PM 感知与通知机制

#### 感知任务完成

| 感知方式 | 说明 |
|----------|------|
| **用户告知** | 用户切换到PM窗口时告知某个任务已完成 |
| **用户指令** | 用户告知PM"Agent A 完成了" |

#### 通知下一个agent介入

| 通知方式 | 说明 |
|----------|------|
| **更新文件** | PM更新 collaboration.md，写入下一个agent的任务内容 |
| **汇报用户** | PM向用户汇报："建议启动 [Agent B]，任务内容在 collaboration.md" |
| **用户转达** | 用户复制任务内容，切换到对应agent窗口 |

#### PM 工作流程（窗口切换模式）

```
1. 用户切换到 PM 窗口
    ↓
2. 用户告知："[Agent A] 已完成"
    ↓
3. PM 更新 collaboration.md（当前任务 → 已完成）
    ↓
4. PM 判定下一个agent，更新"最新任务"区域
    ↓
5. PM 向用户汇报：
   - "已完成：[Agent A] 的任务"
   - "建议下一步：启动 [Agent B]"
   - "任务内容已在 collaboration.md 中"
    ↓
6. 用户复制任务内容，切换到对应agent窗口
    ↓
7. 重复第1步
```

### committer 职责

- 审核各agent提交的代码
- 检查代码质量、功能完整性、测试覆盖
- **判断是否需要测试用例，决定由谁编写**
- 决定是否合入develop
- 合入后更新 collaboration.md

### 各agent配置文件

各agent的详细职责定义在各自的配置文件中，窗口切换时直接读取：

| agent | 配置文件 |
|-------|----------|
| PM | agents/pm.md |
| requirements-manager | agents/requirements-manager.md |
| architect | agents/architect.md |
| ui-designer | agents/ui-designer.md |
| coder | agents/coder.md |
| committer | agents/committer.md |
| automation-tester | agents/automation-tester.md |
| ui-tester | agents/ui-tester.md |
| docs-writer | agents/docs-writer.md |

> **注**：各agent配置文件在窗口切换时读取，职责定义不在本文件中重复维护。

---

## 优势

| 优势 | 说明 |
|------|------|
| **独立并行** | 各agent在独立分支工作，互不干扰 |
| **可追溯** | git历史记录每个agent的贡献 |
| **可回退** | 任意版本可以回退 |
| **质量把控** | committer审核 + 用户验收 |
| **职责清晰** | 各agent术业专攻，边界明确 |
| **灵活协作** | PM协调，用户最终决策 |

---

## 使用说明

### 一、文件定位

| 文件 | 定位 | 是否参与交付 |
|------|------|-------------|
| **agent-team-workflow.md** | 流程规范原始稿，定义协作规则 | ❌ 仅用于定义规则 |
| **agents/*.md** | agent执行配置，由原始稿生成 | ✅ 参与实际交付 |
| **工作流层AGENTS.md** | 工作流本身的agent配置 | 工作流自身使用 |
| **项目层AGENTS.md** | 从工作流生成的，用于实际项目 | ✅ 项目配置 |

### 二、生成关系

```
agent-team-workflow.md（原始稿）
    ↓ 提取agent角色和职责
agents/*.md（各agent定义文件）
    ↓ 配置路径
项目层 AGENTS.md（项目级配置）
```

### 三、信息分配

| 内容 | agent-team-workflow.md | agents/*.md | 项目AGENTS.md |
|------|------------------------|-------------|---------------|
| 协作流程规范 | ✅ 完整定义 | 简要提及 | 引用 |
| 角色职责 | 简要说明 | ✅ 详细定义 | 引用 |
| 触发条件 | ✅ 完整定义 | - | 引用 |
| 产出目录约定 | ✅ 完整定义 | 详细 | - |
| Git规范 | ✅ 完整定义 | 简要重复 | - |

### 四、agents/*.md 内容结构

每个agent文件应包含：

| 内容 | 说明 |
|------|------|
| 角色名称 | agent的标识 |
| 职责描述 | 详细的工作职责 |
| 产出要求 | 产出目录、格式要求 |
| 协作规范 | 与其他agent的协作方式 |
| Git操作规范 | 分支命名、提交信息规范 |
| 验证节点 | 用户验证时机 |

### 五、迭代优化流程

```
实践中发现问题
    ↓
更新 agent-team-workflow.md（规范层）
    ↓
同步更新 agents/*.md（执行层）
    ↓
重新生成 项目AGENTS.md
    ↓
测试验证
    ↓
循环迭代
```

### 六、当前工作项

基于本原始稿，需要生成以下文件：

1. **agents/pm.md** - PM agent定义
2. **agents/requirements-manager.md** - 需求分析agent定义
3. **agents/architect.md** - 架构设计agent定义
4. **agents/ui-designer.md** - 界面设计agent定义
5. **agents/coder.md** - 代码实现agent定义
6. **agents/committer.md** - 代码审核agent定义
7. **agents/automation-tester.md** - 自动化测试agent定义
8. **agents/ui-tester.md** - UI测试agent定义
9. **agents/docs-writer.md** - 文档编写agent定义
10. **项目AGENTS.md** - 项目级配置（引用agents/*.md）
