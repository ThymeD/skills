---
name: skill-feedback-manager
description: 技能看板/skill看板/技能管理/skill反馈 - 启动本地Skill反馈管理工具，自动扫描全局skills清单，提供可视化页面进行分类管理、星级评价、使用计数和文字反馈。
---

# 技能看板（Skill Feedback Manager）

本地 Skill 反馈管理工具。启动方式：

```bash
wscript ~/.claude/skills/skill-feedback-manager/start-silent.vbs
```

固定端口 **6641**。端口被占用时自动打开已有页面。

## 注意事项

- 使用 VBS 脚本静默启动，Node 进程脱离终端独立运行，关闭终端不会停止服务
- `start-silent.vbs` 调用 `WScript.Shell.Run` 以隐藏窗口方式启动 `server.cjs`
- 固定端口 `6641`，如果端口已被占用说明服务已运行，会自动打开浏览器而不会启动新实例
- 页面加载时自动扫描 `~/.claude/skills/` 目录获取最新 skill 清单
