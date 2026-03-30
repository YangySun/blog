---
title: Git版本控制完全教程
date: 2024-01-16
tags: [Git, 工具, 版本控制]
category: 工具使用
heroColor: "#fa709a"
description: 从零开始学习Git版本控制，掌握日常开发中常用的Git命令和工作流程。
---

# Git版本控制完全教程

Git是目前最流行的分布式版本控制系统，被广泛应用于软件开发和团队协作中。

## Git基础概念

### 工作区、暂存区和版本库

- **工作区（Working Directory）**：电脑上实际看到的项目目录
- **暂存区（Stage/Index）**：临时存放要提交的文件
- **版本库（Repository）**：保存项目历史记录的地方

### 基本命令

```bash
# 初始化仓库
git init

# 克隆仓库
git clone https://github.com/user/repo.git

# 添加文件到暂存区
git add filename
git add .

# 提交更改
git commit -m "提交信息"

# 查看状态
git status
```

## 分支管理

### 创建和切换分支

```bash
# 创建新分支
git branch feature-branch

# 切换分支
git checkout feature-branch

# 创建并切换（简化写法）
git checkout -b feature-branch
```

### 合并分支

```bash
# 切换到主分支
git checkout main

# 合并功能分支
git merge feature-branch
```

## 远程操作

### 添加远程仓库

```bash
git remote add origin https://github.com/user/repo.git
git remote -v  # 查看远程仓库
```

### 推送和拉取

```bash
# 推送到远程
git push origin main

# 拉取更新
git pull origin main
```

## 常用技巧

### 暂存更改

```bash
# 暂存当前更改
git stash

# 恢复暂存的更改
git stash pop
```

### 查看历史

```bash
# 查看提交历史
git log

# 查看简略历史
git log --oneline
```

### 撤销操作

```bash
# 撤销工作区的更改
git checkout -- filename

# 撤销暂存区的更改
git reset HEAD filename
```

## Git工作流程

### Git Flow

1. 从main创建开发分支
2. 在开发分支上开发新功能
3. 创建功能分支
4. 合并到开发分支
5. 最终合并到main分支

## 最佳实践

1. **频繁提交**：每次完成一个小功能后就提交
2. **清晰的提交信息**：描述清楚做了什么
3. **使用分支**：新功能在独立分支开发
4. **代码审查**：合并前进行代码审查

## 总结

Git是现代开发不可或缺的工具，掌握好Git可以让你的开发工作更加高效和有序。