> **问题反馈与贡献**: 使用本技能遇到问题时，请先查阅 [GitHub Issues](https://github.com/ThymeD/skills/issues) 和项目级 [AGENTS.md](https://github.com/ThymeD/skills/blob/main/AGENTS.md#问题反馈与贡献指南)。

# Web Fetch Skill - 详细指令

## 触发条件

当用户说以下内容时激活本技能：
- "获取网页"、"拉取内容"、"fetch url"
- "获取链接内容"、"网页内容"
- "teach claude"、"教 claude"
- "为什么 opencode 能获取网页但 xxx 不行"

## 核心原理

OpenCode 内置了 `WebFetch` 工具，可以直接通过 URL 获取网页内容并转换为 Markdown 格式。

## WebFetch 工具使用

### 工具签名
```
WebFetch(url: string, format?: "text" | "markdown" | "html", timeout?: number) -> string
```

### 调用示例
```
WebFetch(url="https://example.com", format="markdown")
```

## 工作流程

### 1. 解释原理

向用户说明：
- OpenCode 内置 WebFetch 工具
- 其他 AI（如 Claude）默认没有此工具
- 原因是安全、成本、商业考量

### 2. 提供解决方案

根据用户需求，推荐适合的方法：

| 方法 | 适用场景 | 难度 |
|------|---------|------|
| Claude Web Search 插件 | 订阅用户快速使用 | 简单 |
| Anthropic API + Tool Use | 开发者需要程序化调用 | 中等 |
| Browser Use | 需要渲染 JavaScript 的页面 | 复杂 |
| Firecrawl | 简单可靠的网页抓取 | 简单 |

### 3. 代码示例

提供所选方法的完整代码示例，确保用户可以直接使用。

## 错误处理

- 如果用户给的 URL 无效，提示检查 URL 格式
- 如果网页抓取失败，尝试更换 format（markdown/html/text）
- 如果是付费 API，提示用户需要获取 API Key

## 跨平台注意事项

- 所有路径使用 `~` 或环境变量
- 代码示例同时提供 Python（跨平台）
