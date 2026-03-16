# 项目工作流配置

## 项目信息

- **项目路径**：[项目根目录]
- **初始化时间**：[日期]

## 工作流规则

### 敏感度分级

| 级别 | 示例 | 流程 |
|------|------|------|
| P0-微调 | 改颜色、错别字、1行代码 | coder → tester |
| P1-小改动 | 小bug修复、组件调整 | coder → code-reviewer → tester |
| P2-中改动 | 新增小功能 | 完整流程（跳过 docs） |
| P3-大需求 | 新页面、新功能 | 完整流程 |

### 阶段性触发

- **编码中**：coder 正在写代码 → 不触发任何 agent
- **功能完成**：coder 完成一个功能模块 → 立即触发 tester 测试 → 用户确认
- **编码完成**：所有功能测试通过 → 触发 code-reviewer → project-builder → 集成测试
- **构建完成**：构建成功 → 触发 tester
- **测试完成**：测试通过 → 触发 docs-writer → task-tracker

### 子 Agent 列表

| Agent | 职责 | 触发条件 |
|-------|------|----------|
| requirements-manager | 需求管理、变更评估 | 大需求（P2/P3） |
| architect | 技术方案、架构设计 | 大需求（P2/P3） |
| ui-designer | 界面设计、HTML原型 | 需要 UI 的需求 |
| coder | 代码实现 | 所有需求 |
| code-reviewer | 代码审查 | P1 及以上 |
| project-builder | 构建验证 | P1 及以上 |
| tester | 测试框架、测试用例、测试执行 | 所有需求 |
| docs-writer | 文档编写 | 大需求完成后（P2/P3） |
| task-tracker | 任务跟踪 | 可选 |
| poc-agent | POC验证、独立环境验证 | 用户或主agent判断需要时 |

### 工作流流程

#### P0-微调
```
用户需求 → coder → tester → 完成
```

#### P1-小改动
```
用户需求 → coder → code-reviewer → project-builder → tester → 完成
```

#### P2-中改动
```
用户需求 → requirements-manager → architect → coder → code-reviewer → project-builder → tester → 完成
```

#### P3-大需求
```
用户需求 → requirements-manager → architect → ui-designer → coder → code-reviewer → project-builder → tester → docs-writer → task-tracker → 完成
```

### POC 机制

#### 触发场景

| 场景 | 说明 | 调用 agent |
|------|------|-----------|
| 需求不清晰 | 用户描述模糊，先验证理解 | requirements + architect + ui-designer |
| 技术验证 | 不确定技术方案是否可行 | architect + coder |
| 界面验证 | 不确定界面是否符合预期 | ui-designer |
| 改动风险高 | 大量改动已有代码 | 相关阶段 agent |
| 实现不符合预期 | 多次沟通仍不符合 | 相关阶段 agent |

#### 目录结构
```
project/
├── .poc/                    # POC 独立目录
│   ├── scenario-1/         # 场景1
│   └── scenario-2/        # 场景2
├── .opencode/              # 项目交付
└── src/                    # 项目代码
```

### 用户确认节点

大需求（P2/P3）必须等待用户确认后才能进入下一阶段：

| 阶段 | 确认内容 | 确认方式 |
|------|----------|----------|
| 需求规格化 | SPEC.md 需求清单 | 用户明确确认 |
| 技术方案 | 技术选型、架构设计 | 用户明确确认 |
| UI设计 | 设计稿、原型 | 用户明确确认 |
| 功能验收 | 功能测试结果 | 用户明确确认 |

### 状态持久化

#### 目录结构
```
project/
├── .opencode/               # opencode 工作目录
│   └── session/
│       ├── CURRENT.md      # 当前工作状态
│       └── HISTORY.md      # 历史记录
```

#### 保存内容

```markdown
# 当前会话状态

## 最后活跃时间
[时间]

## 当前阶段
[阶段]

## 已完成阶段
- [agent]: 完成

## 待办
- [ ] [任务]

## 最后用户指令
"[指令]"
```

#### 触发时机

| 时机 | 保存内容 |
|------|----------|
| 每个 agent 完成 | 当前阶段、已完成、待办 |
| 用户明确新需求 | 更新当前需求 |
| 每 10 轮对话 | 强制保存 |

### 主agent直接改代码的适用范围

主agent可以直接执行代码修改（不调用子agent），仅适用于以下场景：

| 范围 | 说明 | 是否可直接改代码 |
|------|------|-----------------|
| 微小优化 | 改颜色、错别字、1行代码调整、样式微调 | ✅ 可以 |
| Bug修复（小） | 简单逻辑修复，不涉及功能变更 | ✅ 可以 |
| 新增功能 | 需求变更、UI变更、逻辑变更 | ❌ 必须走工作流 |

### 走工作流时的要求

调用子agent走工作流时，代码修改后必须同步更新相关配套文件：

| 改动类型 | 需要更新/检查的配套文件 |
|----------|------------------------|
| 需求变动 | requirements/SPEC.md |
| UI变动 | 设计稿或UI文档 |
| 逻辑/函数变动 | tests/ 测试用例 |
| 接口变动 | docs/API文档 |
| 依赖变动 | package.json 等配置文件 |

如果缺少配套文件，需要先创建再继续开发。

### 持续测试机制

- 每完成一个功能模块，立即调用 tester 进行测试
- 测试通过后才能进入下一个功能
- 测试失败则返回 coder 修复
