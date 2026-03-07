# OpenClaw 运维

OpenClaw（小龙虾）Gateway 运维管理。

## 功能

- 安装 OpenClaw
- Gateway 启动/停止/重启/状态查看
- API Key 配置
- 故障排查
- 定时任务管理

## 触发条件

- "启动 Gateway"
- "查看 Gateway 状态"
- "配置 API Key"
- "初始化 OpenClaw"
- "安装 OpenClaw"
- "修复 OpenClaw"
- "小龙虾"

## 快速开始

```bash
# 一句话初始化
初始化 OpenClaw

# 启动 Gateway
openclaw gateway start

# 查看状态
openclaw gateway status
```

## 常用命令

| 操作 | 命令 |
|------|------|
| 启动 | `openclaw gateway start` |
| 停止 | `openclaw gateway stop` |
| 重启 | `openclaw gateway restart` |
| 状态 | `openclaw gateway status` |
| 日志 | `openclaw logs --follow` |
| 面板 | `openclaw dashboard` |

## 版本

1.2.1
