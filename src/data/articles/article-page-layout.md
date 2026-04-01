---
title: 文章页面布局思路与具体实现
date: 2024-01-20
tags: [Vue.js, CSS, 前端]
category: 前端开发
description: 深入解析博客文章页面的布局设计，包括Hero区域、导航栏交互、内容与目录的排版实现。
---

# 文章页面布局思路与具体实现

博客文章页面是用户阅读内容的核心页面，一个良好的布局设计能够显著提升用户体验。本文将详细讲解博客文章页面的布局思路与具体实现。

## 整体布局架构

文章页面采用了「三明治」式的整体结构：

```
┌─────────────────────────────────┐
│         Hero 渐变背景            │
│  (分类/标签 | 标题 | 日期/字数)   │
├─────────────────────────────────┤
│                                 │
│   文章内容    │    目录浮窗       │
│   (主体)      │    (固定定位)     │
│                                 │
└─────────────────────────────────┘
```

## Hero 区域设计

Hero 区域是文章页面的「门面」，负责展示文章的元信息。

### 背景渐变实现

```css
.article-hero {
  margin-top: -64px;  /* 覆盖导航栏区域 */
  padding: 80px 20px 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

通过负 margin 让背景延伸到导航栏下方，形成无缝的视觉效果。

### 三段式信息布局

```html
<div class="hero-meta-row">
  <span class="article-category">📁 {{ article.category }}</span>
  <div class="article-tags">
    <span v-for="tag in article.tags">{{ tag }}</span>
  </div>
</div>
<h1 class="article-title">{{ article.title }}</h1>
<div class="hero-info-row">
  <span class="article-date">📅 {{ formatDate(article.date) }}</span>
  <span class="article-words">{{ article.wordCount }} 字</span>
</div>
```

## 导航栏的动态效果

文章页面的导航栏需要随着滚动改变状态：

### 透明到白色的过渡

```javascript
function handleScroll() {
  if (isArticlePage.value) {
    isScrolled.value = window.scrollY > 0
  }
}
```

### 滚动时显示文章标题

```html
<div class="header-center" v-if="isArticlePage && isScrolled">
  <span class="article-title">{{ articleTitle }}</span>
</div>
```

使用 CSS Grid 实现三栏布局，各部分独立变化互不影响：

```css
.header-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
}
```

## 内容区域布局

采用 Flexbox 布局，内容与目录并排显示：

```css
.article-layout {
  display: flex;
  gap: 0;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.article-main {
  flex: 1;
  min-width: 0;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 40px;
}
```

## 波浪分隔线

Hero 区域底部的波浪效果使用多层 SVG 实现：

```html
<div class="wave-separator">
  <svg class="wave wave-1">...</svg>
  <svg class="wave wave-2">...</svg>
  <svg class="wave wave-3">...</svg>
  <svg class="wave wave-4">...</svg>
</div>
```

每层波浪设置不同的透明度和动画时长：

```css
.wave-1 { opacity: 0.08; animation: waveMove1 10s ease-in-out infinite; }
.wave-2 { opacity: 0.15; animation: waveMove2 12s ease-in-out infinite; }
```

## 响应式设计

大屏幕显示目录，小屏幕隐藏：

```css
@media (max-width: 1400px) {
  .floating-toc-wrapper,
  .floating-toc {
    display: none;
  }
}
```

## 总结

文章页面布局的核心要点：

1. **Hero 负 margin 技巧** - 实现背景延伸到导航栏区域
2. **CSS Grid 三栏布局** - 左右固定，中间自适应
3. **滚动状态监听** - 实现导航栏动态效果
4. **多层 SVG 波浪** - 增添视觉层次感
5. **响应式断点** - 适配不同屏幕尺寸

通过这些技术的组合，实现了一个既美观又实用的文章阅读页面。
