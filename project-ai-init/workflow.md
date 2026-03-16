# 项目工作流规则

## 敏感度分级

| 级别 | 示例 | 流程 |
|------|------|------|
| P0-微调 | 改颜色、错别字、1行代码 | coder → tester |
| P1-小改动 | 小bug修复、组件调整 | coder → code-reviewer → tester |
| P2-中改动 | 新增小功能 | 完整流程（跳过 docs） |
| P3-大需求 | 新页面、新功能 | 完整流程 |

## 阶段性触发

- **编码中**：coder 正在写代码 → 不触发任何 agent
- **功能完成**：coder 完成一个功能模块 → 立即触发 tester 测试 → 用户确认
- **编码完成**：所有功能测试通过 → 触发 code-reviewer → project-builder → 集成测试
- **构建完成**：构建成功 → 触发 tester
- **测试完成**：测试通过 → 触发 docs-writer → task-tracker

## 子 Agent 列表

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

## 工作流流程

### P0-微调
```
用户需求 → coder → tester → 完成
```

### P1-小改动
```
用户需求 → coder → code-reviewer → project-builder → tester → 完成
```

### P2-中改动
```
用户需求 → requirements-manager → architect → coder → code-reviewer → project-builder → tester → 完成
```

### P3-大需求
```
用户需求 → requirements-manager → architect → ui-designer → coder → code-reviewer → project-builder → tester → docs-writer → task-tracker → 完成
```

## POC 机制

### 触发场景

| 场景 | 说明 | 调用 agent |
|------|------|-----------|
| 需求不清晰 | 用户描述模糊，先验证理解 | requirements + architect + ui-designer |
| 技术验证 | 不确定技术方案是否可行 | architect + coder |
| 界面验证 | 不确定界面是否符合预期 | ui-designer |
| 改动风险高 | 大量改动已有代码 | 相关阶段 agent |
| 实现不符合预期 | 多次沟通仍不符合 | 相关阶段 agent |

### POC 目录结构

```
project/
├── .poc/                    # POC 独立目录
│   ├── scenario-1/         # 场景1
│   │   ├── SPEC.md        # POC 方案描述
│   │   ├── demo/          # 演示代码
│   │   └── README.md      # 说明
│   └── scenario-2/        # 场景2
├── .opencode/              # 项目交付
├── src/                    # 项目代码
└── ...
```

### POC 工作流程

```
用户/主 agent 判断需要 POC
    ↓
poc-agent 创建 .poc/scenario-N/
    ↓
调用相关 agent 出方案
    ↓
展示方案供用户选择
    ↓
用户确认方案
    ↓
验证（技术/界面/功能）
    ↓
用户确认符合预期 → 合并到项目
            或
         放弃 → 删除 .poc/
```

### POC vs 项目交付

| 维度 | POC | 项目交付 |
|------|-----|----------|
| 目录 | `.poc/` | `.opencode/` + 正式目录 |
| 代码 | 独立，不影响项目 | 合并到正式代码 |
| 状态 | 临时，可放弃 | 持久化 |
| 目的 | 验证理解 | 正式交付 |

## 用户确认节点

大需求（P2/P3）必须等待用户确认后才能进入下一阶段：

| 阶段 | 确认内容 | 确认方式 |
|------|----------|----------|
| 需求规格化 | SPEC.md 需求清单 | 用户明确确认 |
| 技术方案 | 技术选型、架构设计 | 用户明确确认 |
| UI设计 | 设计稿、原型 | 用户明确确认 |
| 功能验收 | 功能测试结果 | 用户明确确认 |

确认方式：AI 输出确认提示，用户回复"确认"或提出修改意见。

---

## 注意事项

- 本工作流规则仅适用于**项目实施**场景
- 通用问答不触发任何子 agent

## 状态持久化

### 保存目录结构

```
project/
├── .opencode/               # opencode 工作目录
│   └── session/
│       ├── CURRENT.md      # 当前工作状态
│       └── HISTORY.md      # 历史记录
```

### 保存内容（CURRENT.md）

```markdown
# 当前会话状态

## 最后活跃时间
2024-01-15 10:30:00

## 当前阶段
coder（编码中）

## 已完成阶段
- requirements-manager: 完成
- architect: 完成
- ui-designer: 完成

## 待办
- [ ] coder 完成当前功能
- [ ] code-reviewer 代码审查

## 关键文件
- src/pages/login.tsx

## 最后用户指令
"给登录页加一个验证码"
```

### 触发时机

| 时机 | 保存内容 |
|------|----------|
| 每个 agent 完成 | 当前阶段、已完成、待办 |
| 用户明确新需求 | 更新当前需求 |
| 每 10 轮对话 | 强制保存 |

### 恢复机制

```
新窗口启动
    ↓
检测 .opencode/session/CURRENT.md
    ↓
有内容 → 展示摘要 → 询问"是否继续当前工作"
    ↓
用户确认 → 读取上下文继续工作
```

### 原则

- 少量对话丢失可接受
- 每个阶段完成后自动保存
- 改动都在代码文件里（git 可追溯）
- 新窗口可以读取 CURRENT.md 恢复上下文
