# 个人博客

基于 Vue 3 + Vite + Markdown 构建的个人博客系统，支持白色科技风和暗色主题切换。

## 技术栈

- **Vue 3** - 使用 Composition API
- **Vite** - 快速的开发服务器和构建工具
- **Vue Router** - 路由管理
- **Pinia** - 状态管理
- **Markdown** - 文章内容存储格式
- **Highlight.js** - 代码高亮
- **SCSS** - 样式预处理

## 功能特性

- 📝 文章列表和详情展示
- 👤 个人信息展示
- 🔗 友情链接
- 🎨 主题切换（亮色/暗色）
- 🔍 文章搜索功能
- 📱 响应式设计
- ⚡ 快速构建和热更新

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看博客。

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
blog/
├── public/                 # 静态资源
│   ├── images/            # 图片资源
│   └── vite.svg
├── src/
│   ├── assets/            # 资源文件
│   │   └── styles/        # 样式文件
│   ├── components/        # 组件
│   │   ├── common/        # 通用组件
│   │   ├── article/       # 文章相关组件
│   │   ├── personal/      # 个人模块组件
│   │   └── links/         # 友链组件
│   ├── views/             # 页面视图
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── utils/             # 工具函数
│   ├── data/              # 数据文件
│   │   ├── articles/      # Markdown文章
│   │   ├── profile.json   # 个人信息
│   │   └── links.json     # 友链数据
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── .github/               # GitHub配置
│   └── workflows/
│       └── deploy.yml     # 自动部署配置
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 添加文章

在 `src/data/articles/` 目录下创建新的 Markdown 文件：

```markdown
---
title: 文章标题
date: 2024-01-01
tags: [标签1, 标签2]
description: 文章摘要
---

# 文章内容

这里是文章的正文内容...
```

## 修改个人信息

编辑 `src/data/profile.json` 文件：

```json
{
  "name": "你的名字",
  "bio": "个人简介",
  "email": "your.email@example.com",
  "github": "https://github.com/yourusername",
  "skills": ["Vue.js", "JavaScript"],
  "experience": [...]
}
```

## 添加友情链接

编辑 `src/data/links.json` 文件：

```json
{
  "links": [
    {
      "name": "网站名称",
      "url": "https://example.com",
      "description": "网站描述",
      "category": "分类"
    }
  ]
}
```

## 部署到 GitHub Pages

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 配置 GitHub Actions 自动部署（已包含在 `.github/workflows/deploy.yml`）
4. 推送到 main 分支将自动触发部署

## 自定义主题

在 `src/assets/styles/global.scss` 中修改 CSS 变量来自定义主题颜色：

```scss
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --accent-color: #2196f3;
  --accent-hover: #1976d2;
  --border-color: #e0e0e0;
}
```

## 许可证

MIT License