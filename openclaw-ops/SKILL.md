---
name: openclaw-ops
description: OpenClaw（小龙虾）运维管理。用于安装 OpenClaw、初始化 OpenClaw、Gateway 启动/停止/重启/状态查看、API Key 配置、故障排查、定时任务管理。当用户说"启动 Gateway"、"查看 Gateway 状态"、"配置 API Key"、"排查 401 错误"、"查看定时任务"、"OpenClaw 出问题了"、"初始化 OpenClaw"、"配置 OpenClaw"、"新电脑配置 OpenClaw"、"安装 OpenClaw"、"修复 OpenClaw"、"小龙虾"或"openclaw"时使用此技能。
license: MIT
metadata:
  author: local
  version: 1.2.1
---

# OpenClaw 运维

## 一句话初始化 OpenClaw（推荐）

新电脑配置好 opencode 后，一句话完成 OpenClaw 初始化：

```
初始化 OpenClaw
```

或

```
新电脑配置 OpenClaw
```

或

```
安装 OpenClaw
```

或

```
修复 OpenClaw
```

### 初始化流程（自动执行）

1. **检测 OpenClaw** - 检查是否已安装，如未安装则提示安装
2. **已安装** - 询问是否需要重新配置或修复
3. **未安装** - 自动执行 `npm install -g openclaw`
4. **初始化配置** - 运行 `openclaw setup` 创建基础配置
5. **复用 OpenCode 模型配置** - 读取 `~/.local/share/opencode/auth.json` 的 API Key，自动配置到 OpenClaw
6. **启动 Gateway** - 自动启动并配置浏览器访问
7. **验证功能** - 检查 Gateway 状态，确认可正常对话

### 初始化完成后

- OpenClaw 已自动打开浏览器访问界面（如果没有自动打开，可运行 `openclaw dashboard`）
- 端口以实际配置为准，默认 18789
- 付费模型配置：说"配置付费模型"引导完成

---

## 手动初始化命令

如需手动执行初始化，按以下步骤：

### 1. 安装 OpenClaw（如未安装）
```bash
npm install -g openclaw
```

### 2. 初始化配置
```bash
openclaw setup
```

### 3. 配置免费模型（MiniMax Portal）
```bash
# 查看模型状态
openclaw models status

# MiniMax Portal 使用 OAuth 登录，会自动打开浏览器授权
# 免费额度：M2.1 / M2.5 模型可用
```

### 4. 启动 Gateway
```bash
openclaw gateway start
# 或指定端口
openclaw gateway --port 18789
```

### 5. 自动打开浏览器访问
```bash
openclaw dashboard
```

---

## 免费模型对比

如果 OpenCode 未配置模型，可选择：

| 方案 | 说明 |
|------|------|
| **MiniMax Portal** | OAuth 授权后免费使用 M2.1/M2.5，无限额 |
| **其他厂商** | 智谱GLM、阿里Qwen、百度文心等，需注册获取 API Key |

**推荐**：优先复用 OpenCode 配置，简单快捷。

## Gateway 管理命令

### 启动 Gateway
```bash
openclaw gateway start
```

### 重启 Gateway
```bash
openclaw gateway restart
```

### 停止 Gateway
```bash
openclaw gateway stop
```

### 查看 Gateway 状态
```bash
openclaw gateway status
```

### 查看日志
```bash
openclaw logs --follow
```

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

## API Key 配置（重要）

API Key 配置分散在**多个位置**：

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

所有平台统一使用：`~/.openclaw/`（跨平台通用）

| 平台 | 实际路径 |
|------|----------|
| Windows | `C:\Users\<用户>\.openclaw\` |
| macOS | `/Users/<用户>/.openclaw/` |
| Linux | `/home/<用户>/.openclaw/` |

---

## 跨平台说明

| 功能 | Windows | macOS | Linux |
|------|---------|-------|-------|
| 安装 | ✅ `npm install -g openclaw` | ✅ 同左 | ✅ 同左 |
| Gateway | ✅ | ✅ | ✅ |
| 定时任务 | PowerShell 计划任务 | launchd | systemd |
| 浏览器 | ✅ | ✅ | ✅ |

---

## 定时任务

### Windows

使用任务计划程序（taskschd.msc）或 PowerShell：

```powershell
# 创建定时任务
$action = New-ScheduledTaskAction -Execute 'node' -Argument 'gateway --port 18789'
$trigger = New-ScheduledTaskTrigger -AtLogOn
Register-ScheduledTask -TaskName 'OpenClaw Gateway' -Action $action -Trigger $trigger -RunLevel Highest
```

### macOS/Linux

使用 launchd 或 systemd：

```bash
# macOS: 创建 plist 文件
~/Library/LaunchAgents/com.openclaw.gateway.plist

# Linux: 创建 systemd 服务
/etc/systemd/system/openclaw-gateway.service
```

### 查看命令
```powershell
# Windows: 查看 OpenClaw 相关任务
Get-ScheduledTask | Where-Object {$_.TaskName -like "*OpenClaw*"}
Get-ScheduledTask -TaskName "OpenClaw Gateway" | Get-ScheduledTaskInfo
Get-Content ~/openclaw_monitor.log -Tail 20
```

```bash
# macOS: 查看 launchd 任务
launchctl list | grep openclaw

# Linux: 查看 systemd 状态
systemctl status openclaw-gateway
journalctl -u openclaw-gateway -n 20
```

---

## 边界情况处理

### 1. Gateway 无法启动
- 检查端口是否被占用：`netstat -ano | findstr 18789`
- 检查 Node.js 是否安装正确
- 查看日志：`openclaw logs`

### 2. 401 认证错误
- 确认使用的模型
- 检查三处配置是否一致（Auth > Agent > 全局）
- 验证 baseUrl 是否正确

### 3. 定时任务不执行
- 检查任务是否启用
- 检查执行策略
- 手动运行任务测试

---

## 版本历史

- v1.2.0 - 增加安装/修复触发词、检测已安装状态、小龙虾代称
- v1.1.0 - 增加 OpenClaw 一句话初始化功能
- v1.0.0 - 初始版本
