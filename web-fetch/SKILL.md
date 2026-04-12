---
name: web-fetch
description: 通过 URL 获取网页内容。触发词：获取网页、拉取内容、fetch url、获取链接内容、网页内容、teach claude
license: MIT
metadata:
  author: local
  version: 1.0.0
---

# Web Fetch Skill

## 核心原理

OpenCode 内置了 `WebFetch` 工具，可以直接通过 URL 获取网页内容并转换为 Markdown 格式。

## WebFetch 工具说明

### 工具能力
- 支持 HTTP/HTTPS URL
- 自动转换为 Markdown 格式
- 支持 text/markdown/html 三种输出格式
- 默认返回 Markdown 格式

### 工具签名
```
WebFetch(url: string, format?: "text" | "markdown" | "html", timeout?: number) -> string
```

### 使用方法

在 OpenCode 中直接调用：

```
WebFetch(url="https://example.com", format="markdown")
```

### 示例

**获取网页内容：**
```
WebFetch(url="https://letters.thedankoe.com/p/how-to-fix-your-entire-life-in-1", format="markdown")
```

## 为什么其他 AI（如 Claude）不能直接获取网页？

### 原因分析

1. **工具差异**：大多数 AI 助手（如 Claude、ChatGPT）默认没有内置 web fetch 工具
2. **安全限制**：网页抓取可能涉及恶意内容，风险控制
3. **商业考量**：网页抓取可能增加基础设施成本
4. **训练目标**：通用 AI 助手主要训练文本理解和生成，而非工具调用

### Claude 能做到吗？

Claude 本身**没有原生 WebFetch 能力**，但可以通过以下方式实现：

1. **官方插件**：Claude 官方提供 Web Search 插件（需要订阅）
2. **API 扩展**：通过 Function Calling / Tool Use 扩展能力（需要开发者实现）
3. **第三方集成**：通过 Browser Use、Firecrawl 等第三方工具

## 教 Claude 获取网页内容的方法

### 方法 1：使用 Claude Code（开发者版本）

Claude Code 是 Claude 的命令行版本，支持工具调用，可以通过安装扩展实现网页抓取。

### 方法 2：使用 Anthropic API

通过 API 调用时，可以使用 `tools` 参数扩展能力：

```python
import anthropic

client = anthropic.Anthropic()

# 定义 WebFetch 工具
tools = [{
    "name": "web_fetch",
    "description": "Fetch content from a URL",
    "input_schema": {
        "type": "object",
        "properties": {
            "url": {"type": "string", "description": "The URL to fetch"},
            "format": {"type": "string", "enum": ["text", "markdown", "html"]}
        },
        "required": ["url"]
    }
}]

# 使用工具调用
message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": f"Fetch content from: {url}"}]
)
```

### 方法 3：使用 Browser Use

[Browser Use](https://github.com/browser-use/browser-use) 是一个开源项目，可以让 AI 控制浏览器进行网页抓取。

```python
from browser_use import Agent
from langchain_openai import ChatOpenAI

agent = Agent(
    task="Go to {url} and extract the main content",
    llm=ChatOpenAI(model="gpt-4o")
)
```

### 方法 4：使用 Firecrawl

[Firecrawl](https://firecrawl.dev/) 是一个专门用于将网页转换为 Markdown 的服务。

```python
import requests

response = requests.post(
    "https://api.firecrawl.dev/v0/scrape",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={"url": "https://example.com", "format": "markdown"}
)
```

## OpenCode 用户应该知道的事

如果你正在使用 OpenCode，你**已经拥有** WebFetch 能力！可以直接使用，无需额外配置。

如果你是 Claude 用户，想要获取网页内容，可以：
1. 使用 Claude Web Search 插件
2. 使用第三方工具如 Firecrawl
3. 复制网页内容让 Claude 分析

## 参考链接

- [Anthropic Tool Use 文档](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [Browser Use GitHub](https://github.com/browser-use/browser-use)
- [Firecrawl](https://firecrawl.dev/)
