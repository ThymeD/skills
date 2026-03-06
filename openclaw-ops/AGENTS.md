# OpenClaw 运维 - 智能体详细指令

**版本 1.2.1**

> **问题反馈与贡献**: 使用本技能遇到问题时，请先查阅 [GitHub Issues](https://github.com/ThymeD/skills/issues) 和项目级 [AGENTS.md](../AGENTS.md#问题反馈与贡献指南)。AI 工具应具备自主排查和贡献解决方案的能力。

本文档为智能体提供 OpenClaw Gateway 运维管理的详细指令。

---

## 概述

OpenClaw 运维技能用于管理 OpenClaw（小龙虾）安装、初始化、Gateway 启动/停止/重启/状态查看、API Key 配置、故障排查、定时任务管理。

---

## 触发条件

当用户说以下话术时使用此技能：
- "启动 Gateway"
- "停止 Gateway"
- "重启 Gateway"
- "查看 Gateway 状态"
- "Gateway 日志"
- "配置 API Key"
- "排查 401 错误"
- "查看定时任务"
- "OpenClaw 出问题了"
- "初始化 OpenClaw"
- "配置 OpenClaw"
- "新电脑配置 OpenClaw"
- "一键配置 OpenClaw"
- "安装 OpenClaw"
- "修复 OpenClaw"
- "小龙虾"
- "openclaw"

---

## OpenClaw 一句话初始化（核心功能）

### 触发条件

当用户说以下话术时，**自动执行完整初始化流程**：
- "初始化 OpenClaw"
- "配置 OpenClaw"
- "新电脑配置 OpenClaw"
- "一键配置 OpenClaw"
- "setup OpenClaw"
- "安装 OpenClaw"
- "修复 OpenClaw"

### 初始化流程（按顺序执行）

**第一步：检测 OpenClaw 是否已安装**

```bash
openclaw --version
```

- 如果已安装 → 提示已安装，询问是否需要重新配置或修复
- 如果未安装 → 提示用户安装：`npm install -g openclaw`

- 如果已安装，继续第二步
- 如果未安装，提示用户安装：`npm install -g openclaw`

**第二步：初始化基础配置**

```bash
openclaw setup
```

- 这是交互式命令，可能需要回答几个问题
- 建议选择默认选项

**第三步：复用 OpenCode 的模型配置（推荐）**

OpenCode 已经配置好了大模型，可以直接复用：

1. 读取 OpenCode 的 API Key：
   ```bash
   # 读取 OpenCode 的认证配置
   cat ~/.local/share/opencode/auth.json
   ```

2. 将读取到的 provider 和 API Key 配置到 OpenClaw：

   编辑 `~/.openclaw/openclaw.json`，添加 provider 配置：

   ```json
   {
     "models": {
       "providers": {
         "<provider-name>": {
           "baseUrl": "<对应的API端点>",
           "apiKey": "<从auth.json读取的key>",
           "api": "anthropic-messages",
           "authHeader": true,
           "models": [
             {
               "id": "<model-id>",
               "name": "<model-name>",
               "reasoning": <true/false>,
               "contextWindow": 200000,
               "maxTokens": 8192
             }
           ]
         }
       }
     },
     "agents": {
       "defaults": {
         "model": {
           "primary": "<provider-name>/<model-id>"
         }
       }
     }
   }
   ```

   **注意**：将 `<provider-name>`、`<API端点>`、`<从auth.json读取的key>`、`<model-id>`、`<model-name>` 替换为实际读取到的值。

3. 或者使用命令配置：
   ```bash
   openclaw configure --section model
   ```

**第四步：启动 Gateway**

```bash
# 启动 Gateway（默认端口 18789）
openclaw gateway start

# 或者前台运行查看日志
openclaw gateway
```

**第五步：验证 Gateway 状态**

```bash
# 检查 Gateway 是否正常运行
openclaw gateway status

# 或健康检查
openclaw health

# 自动打开浏览器（端口以实际配置为准，默认 18789）
openclaw dashboard
```

**初始化完成后窗口提示示例：**
> ✅ OpenClaw 初始化完成！
> 
> 🌐 请在浏览器中访问：`http://localhost:18789` 开始使用
> 
> （如未自动打开浏览器，可运行 `openclaw dashboard` 打开）

---

## 免费模型说明

如果 OpenCode 未配置模型，可以选择：

| 方案 | 说明 |
|------|------|
| **MiniMax Portal** | OAuth 授权后免费使用 M2.1/M2.5，无限额 |
| **其他厂商** | 智谱GLM、阿里Qwen、百度文心等，需注册获取 API Key |

**推荐**：优先复用 OpenCode 配置，简单快捷。

### Gateway 管理

| 操作 | 命令 |
|------|------|
| 启动 | `openclaw gateway start` |
| 重启 | `openclaw gateway restart` |
| 停止 | `openclaw gateway stop` |
| 状态 | `openclaw gateway status` |
| 日志 | `openclaw logs --follow` |

### 其他常用命令

```bash
# 检查模型配置状态
openclaw models status

# 健康检查
openclaw doctor

# 打开 Web UI
openclaw dashboard
```

---

## API Key 配置

API Key 配置分散在**三个位置**，按优先级生效：

### 1. 全局配置
路径: `~/.openclaw/openclaw.json`

### 2. Agent 级别配置
路径: `~/.openclaw/agents/main/agent/models.json`

### 3. Auth 配置文件
路径: `~/.openclaw/agents/main/agent/auth-profiles.json`

**优先级:** Auth > Agent > 全局

---

## 故障排查

### 401 认证错误

1. **确认使用的模型** - 查看 `agents.defaults.model.primary`

2. **确定对应的 provider:**
   - `MiniMax-M2.1` / `MiniMax-M2.5` → `minimax-portal`
   - `MiniMax-M2.5-highspeed` → `minimax`

3. **检查三处配置是否一致**

4. **验证 baseUrl:**
   - 错误: `https://api.minimax.io/anthropic`
   - 正确: `https://api.minimaxi.com/anthropic`

### 验证 API 端点

```bash
curl -s -X POST "https://api.minimaxi.com/anthropic/v1/messages" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "MiniMax-M2.5", "max_tokens": 10, "messages": [{"role": "user", "content": "hi"}]}'
```

---

## 本地配置位置

- **配置目录**: `~/.openclaw/`（跨平台通用）
- **Windows**: `C:\Users\<用户>\.openclaw\`
- **macOS**: `~/.openclaw/`
- **Linux**: `~/.openclaw/`

---

## 定时任务

### Windows

使用任务计划程序（taskschd.msc）或 PowerShell。

### macOS

使用 launchd：
```bash
# 创建 plist 文件
~/Library/LaunchAgents/com.openclaw.gateway.plist
```

### Linux

使用 systemd：
```bash
# 创建服务文件
/etc/systemd/system/openclaw-gateway.service
```

本地计划任务配置示例（仅供参考）：

### 1. OpenClaw Gateway
| 属性 | 值 |
|------|-----|
| 任务名称 | OpenClaw Gateway |
| 触发条件 | 用户登录时自动启动 (LogonTrigger) |
| 端口 | 默认 18789 |

### 2. OpenClawGatewayMonitor
| 属性 | 值 |
|------|-----|
| 任务名称 | OpenClawGatewayMonitor |
| 触发条件 | 每 10 分钟执行一次 |

### 隐藏任务不弹窗方案

如需创建隐藏的定时任务（不弹出窗口），使用以下方式：

```powershell
# 方式1: 修改现有任务
schtasks /Change /TN "任务名称" /TR "powershell -WindowStyle Hidden -File 脚本路径"

# 方式2: 创建新任务（需管理员）
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-WindowStyle Hidden -File 脚本路径'
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 10)
Register-ScheduledTask -TaskName '任务名' -Action $action -Trigger $trigger -RunLevel Highest -Force
```

**任务计划程序设置**：打开 `taskschd.msc`，右键任务 → 属性 → 勾选"隐藏"

### 查看命令

```powershell
# 查看 OpenClaw 相关任务
Get-ScheduledTask | Where-Object {$_.TaskName -like "*OpenClaw*"}

# 查看任务详情
Get-ScheduledTask -TaskName "OpenClaw Gateway" | Get-ScheduledTaskInfo

# 查看监控日志
Get-Content ~/openclaw_monitor.log -Tail 20
```

---

## 边界情况处理

### 1. Gateway 无法启动

1. 检查端口是否被占用：`netstat -ano | findstr 18789`
2. 检查 Node.js 是否安装正确
3. 查看日志：`openclaw logs`

### 2. 401 错误

按照上方"故障排查"步骤逐一检查三处配置是否一致。

### 3. 定时任务不执行

1. 检查任务是否启用：`Get-ScheduledTask -TaskName "OpenClaw Gateway" | Get-ScheduledTaskInfo`
2. 检查执行策略：`Get-ExecutionPolicy`
3. 手动运行任务：`Start-ScheduledTask -TaskName "OpenClaw Gateway"`

---

## 版本历史

- 1.2.0 - 增加安装/修复触发词、检测已安装状态、小龙虾代称
- 1.1.0 - 增加 OpenClaw 一句话初始化功能
- 1.0.0 - 初始版本
