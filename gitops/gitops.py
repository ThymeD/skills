#!/usr/bin/env python3
"""
GitOps Helper Script
提供 Git 和 GitHub 操作的辅助功能
"""

import subprocess
import sys
import json
import os
import tempfile
from datetime import datetime


def run_command(cmd, cwd=None):
    """执行 shell 命令并返回结果"""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return -1, "", "Command timed out"
    except Exception as e:
        return -1, "", str(e)


def get_git_status():
    """获取 Git 状态"""
    code, stdout, stderr = run_command("git status --porcelain")
    if code != 0:
        return None, stderr
    return stdout, ""


def get_current_branch():
    """获取当前分支"""
    code, stdout, stderr = run_command("git branch --show-current")
    if code != 0:
        return None, stderr
    return stdout.strip(), ""


def get_remote_info():
    """获取远程仓库信息"""
    code, stdout, stderr = run_command("git remote -v")
    if code != 0:
        return None, stderr
    
    remotes = {}
    for line in stdout.strip().split('\n'):
        if line:
            parts = line.split()
            if len(parts) >= 2:
                name = parts[0]
                url = parts[1]
                remotes[name] = url
    return remotes, ""


def create_backup_branch(base_branch, backup_name=None):
    """创建备份分支"""
    if not backup_name:
        backup_name = f"backup-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    
    code, stdout, stderr = run_command(f"git branch {backup_name}")
    if code != 0:
        return None, f"Failed to create backup: {stderr}"
    return backup_name, ""


def get_commit_history(limit=10):
    """获取提交历史"""
    code, stdout, stderr = run_command(f"git log -{limit} --oneline")
    if code != 0:
        return None, stderr
    return stdout.strip().split('\n'), ""


def write_temp_file(content, suffix=".md"):
    """写入临时文件，避免乱码问题"""
    fd, path = tempfile.mkstemp(suffix=suffix, text=True)
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as f:
            f.write(content)
        return path
    except Exception:
        os.close(fd)
        raise


def create_issue(repo, title, body):
    """
    创建 GitHub Issue（自动使用 --body-file 避免乱码）
    
    Args:
        repo: 仓库名，如 "owner/repo"
        title: Issue 标题
        body: Issue 正文内容
    
    Returns:
        (success: bool, message: str)
    """
    try:
        body_file = write_temp_file(body, ".md")
        cmd = f'gh issue create --repo {repo} --title "{title}" --body-file "{body_file}"'
        code, stdout, stderr = run_command(cmd)
        
        os.unlink(body_file)
        
        if code == 0:
            return True, stdout.strip()
        else:
            return False, stderr
    except Exception as e:
        return False, str(e)


def create_pr(repo, title, body, base, head):
    """
    创建 GitHub PR（自动使用 --body-file 避免乱码）
    
    Args:
        repo: 仓库名，如 "owner/repo"
        title: PR 标题
        body: PR 正文内容
        base: 目标分支，如 "main"
        head: 源分支，如 "feature-branch"
    
    Returns:
        (success: bool, message: str)
    """
    try:
        body_file = write_temp_file(body, ".md")
        cmd = f'gh pr create --repo {repo} --title "{title}" --body-file "{body_file}" --base {base} --head {head}'
        code, stdout, stderr = run_command(cmd)
        
        os.unlink(body_file)
        
        if code == 0:
            return True, stdout.strip()
        else:
            return False, stderr
    except Exception as e:
        return False, str(e)


def create_tag(tag_name, message):
    """
    创建 Git 标签
    
    Args:
        tag_name: 标签名，如 "v1.0.0"
        message: 标签说明
    
    Returns:
        (success: bool, message: str)
    """
    cmd = f'git tag -a "{tag_name}" -m "{message}"'
    code, stdout, stderr = run_command(cmd)
    
    if code == 0:
        return True, f"Created tag: {tag_name}"
    else:
        return False, stderr


def push_tag(tag_name):
    """
    推送标签到远程
    
    Args:
        tag_name: 标签名
    
    Returns:
        (success: bool, message: str)
    """
    cmd = f'git push origin "{tag_name}"'
    code, stdout, stderr = run_command(cmd)
    
    if code == 0:
        return True, f"Pushed tag: {tag_name}"
    else:
        return False, stderr


def push_tags():
    """
    推送所有标签到远程
    
    Returns:
        (success: bool, message: str)
    """
    cmd = 'git push origin --tags'
    code, stdout, stderr = run_command(cmd)
    
    if code == 0:
        return True, "Pushed all tags"
    else:
        return False, stderr


def main():
    if len(sys.argv) < 2:
        print("Usage: gitops.py <command> [args...]")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "status":
        status, err = get_git_status()
        if err:
            print(f"Error: {err}")
            sys.exit(1)
        print(status if status else "Working tree clean")
    
    elif command == "branch":
        branch, err = get_current_branch()
        if err:
            print(f"Error: {err}")
            sys.exit(1)
        print(branch if branch else "Not on any branch")
    
    elif command == "remote":
        remotes, err = get_remote_info()
        if err:
            print(f"Error: {err}")
            sys.exit(1)
        print(json.dumps(remotes, indent=2))
    
    elif command == "backup":
        branch = get_current_branch()[0]
        if branch:
            backup, err = create_backup_branch(branch)
            if err:
                print(f"Error: {err}")
                sys.exit(1)
            print(f"Created backup branch: {backup}")
        else:
            print("Error: Not on any branch")
            sys.exit(1)
    
    elif command == "log":
        history, err = get_commit_history(int(sys.argv[2]) if len(sys.argv) > 2 else 10)
        if err:
            print(f"Error: {err}")
            sys.exit(1)
        for item in history:
            print(item)
    
    elif command == "issue":
        # gitops.py issue "owner/repo" "title" "body"
        if len(sys.argv) < 5:
            print("Usage: gitops.py issue <repo> <title> <body>")
            sys.exit(1)
        repo, title, body = sys.argv[2], sys.argv[3], sys.argv[4]
        success, msg = create_issue(repo, title, body)
        if success:
            print(msg)
        else:
            print(f"Error: {msg}")
            sys.exit(1)
    
    elif command == "pr":
        # gitops.py pr "owner/repo" "title" "body" "base" "head"
        if len(sys.argv) < 7:
            print("Usage: gitops.py pr <repo> <title> <body> <base> <head>")
            sys.exit(1)
        repo, title, body, base, head = sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6]
        success, msg = create_pr(repo, title, body, base, head)
        if success:
            print(msg)
        else:
            print(f"Error: {msg}")
            sys.exit(1)
    
    elif command == "tag":
        # gitops.py tag "v1.0.0" "message"
        if len(sys.argv) < 4:
            print("Usage: gitops.py tag <tag_name> <message>")
            sys.exit(1)
        tag_name, message = sys.argv[2], sys.argv[3]
        success, msg = create_tag(tag_name, message)
        if success:
            print(msg)
        else:
            print(f"Error: {msg}")
            sys.exit(1)
    
    elif command == "push-tag":
        # gitops.py push-tag "v1.0.0"
        if len(sys.argv) < 3:
            print("Usage: gitops.py push-tag <tag_name>")
            sys.exit(1)
        tag_name = sys.argv[2]
        success, msg = push_tag(tag_name)
        if success:
            print(msg)
        else:
            print(f"Error: {msg}")
            sys.exit(1)
    
    elif command == "push-tags":
        success, msg = push_tags()
        if success:
            print(msg)
        else:
            print(f"Error: {msg}")
            sys.exit(1)
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()


__all__ = [
    'run_command',
    'get_git_status',
    'get_current_branch',
    'get_remote_info',
    'create_backup_branch',
    'get_commit_history',
    'create_issue',
    'create_pr',
    'create_tag',
    'push_tag',
    'push_tags',
]
