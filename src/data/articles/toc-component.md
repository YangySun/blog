---
title: 目录组件的实现与代码详解
date: 2024-01-21
tags: [Vue.js, JavaScript, 前端]
category: 前端开发
description: 深入解析博客目录组件的实现原理，包括滚动监听、动态高亮、模糊蒙版效果等技术细节。
---

# 目录组件的实现与代码详解

目录组件是博客文章页面的重要辅助功能，帮助用户快速定位和导航到感兴趣的章节。本文将详细讲解目录组件的实现原理和代码细节。

## 组件功能需求

1. **固定定位** - 位于文章右侧，滑动时保持在导航栏下方
2. **模糊蒙版** - 当前章节高亮显示，其余目录模糊遮盖
3. **动态高亮** - 根据滚动位置自动更新高亮状态
4. **点击跳转** - 点击目录项平滑滚动到对应位置

## 核心数据结构

```javascript
const props = defineProps({
  headings: {
    type: Array,
    default: () => []
  }
})
```

每个 heading 对象的结构：

```javascript
{
  id: 'heading-0',
  text: 'Vue 3 Composition API 入门指南',
  level: 2  // h1-h6 的层级
}
```

## 滚动监听与位置计算

### 节流优化

使用 `requestAnimationFrame` 实现滚动节流，避免性能问题：

```javascript
let ticking = false
function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updatePosition()
      updateActiveHeading()
      ticking = false
    })
    ticking = true
  }
}
```

### 当前位置计算

通过比较滚动位置与每个标题的文档绝对位置来确定当前章节：

```javascript
function updateActiveHeading() {
  const scrollY = window.scrollY
  let current = -1

  props.headings.forEach((heading, index) => {
    const el = document.getElementById(heading.id)
    if (el) {
      const absoluteTop = el.getBoundingClientRect().top + window.pageYOffset
      if (scrollY >= absoluteTop - 150) {
        current = index
      }
    }
  })

  activeIndex.value = current
}
```

## 点击滚动跳转

点击目录项时，平滑滚动到对应标题位置：

```javascript
function scrollToHeading(heading) {
  const element = document.getElementById(heading.id)
  if (element) {
    const rect = element.getBoundingClientRect()
    const absoluteTop = rect.top + window.pageYOffset
    const targetPosition = absoluteTop - 100  // 导航栏高度 + 间距

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    })
  }
}
```

## 固定定位逻辑

### 初始位置

目录组件在文章头部右下角，初始为相对定位：

```css
.floating-toc {
  position: relative;
  right: 40px;
  bottom: 100px;
}
```

### 滚动触发固定

当滚动超过 Hero 区域底部时，切换为固定定位：

```javascript
function updatePosition() {
  const heroBottom = 280  // Hero 区域高度
  isFixed.value = window.scrollY > heroBottom
}
```

### CSS 切换

```css
.floating-toc {
  &.is-fixed {
    position: fixed;
    right: 20px;
    top: 80px;
    bottom: auto;
  }
}
```

## 模糊蒙版效果

### 样式实现

使用 CSS `filter: blur()` 和 `backdrop-filter` 实现毛玻璃效果：

```css
.floating-toc {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
}
```

### 非当前项模糊

```css
.toc-item:not(.active) .toc-link {
  color: var(--text-secondary);
  filter: blur(0.8px);
  opacity: 0.65;
}
```

### 悬停时移除模糊

```css
.floating-toc:hover .toc-item:not(.active) .toc-link {
  filter: blur(0);
  opacity: 0.85;
}
```

## 当前项高亮

### 视觉设计

当前项使用主题色背景和左边框指示器：

```css
.toc-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, ...);

  .toc-indicator {
    height: 20px;
    box-shadow: 0 0 8px rgba(102, 126, 234, 0.4);
  }

  .toc-link {
    color: var(--accent-color);
    font-weight: 600;
  }
}
```

## 自动滚动到可见区域

当高亮项改变时，自动滚动目录使其可见：

```javascript
function scrollToActiveTocItem() {
  const tocItems = tocContentRef.value.querySelectorAll('.toc-item')
  const activeItem = tocItems[activeIndex.value]

  if (activeItem) {
    const container = tocContentRef.value
    const itemTop = activeItem.offsetTop
    const containerHeight = container.clientHeight
    const scrollTop = container.scrollTop

    // 如果当前项在可视区域上方或下方
    if (itemTop < scrollTop + 20) {
      container.scrollTo({ top: itemTop - 20, behavior: 'smooth' })
    } else if (itemTop + itemHeight > scrollTop + containerHeight - 20) {
      container.scrollTo({ top: itemTop + itemHeight - containerHeight + 20, behavior: 'smooth' })
    }
  }
}
```

## 完整模板结构

```html
<template>
  <div class="floating-toc" :class="{ 'is-fixed': isFixed }">
    <div class="toc-header">
      <span class="toc-title">目录</span>
      <span class="toc-count">{{ headings.length }}</span>
    </div>
    <div class="toc-content" ref="tocContentRef">
      <div
        v-for="(heading, index) in headings"
        :key="index"
        :class="['toc-item', { active: activeIndex === index }]"
        @click="scrollToHeading(heading)"
      >
        <span class="toc-indicator"></span>
        <span class="toc-link">{{ heading.text }}</span>
      </div>
    </div>
  </div>
</template>
```

## 总结

目录组件实现的关键技术点：

1. **滚动节流** - 使用 `requestAnimationFrame` 优化性能
2. **位置计算** - 结合 `getBoundingClientRect` 和 `scrollY`
3. **动态类切换** - 根据滚动状态切换固定/相对定位
4. **CSS 模糊效果** - 使用 `filter` 和 `backdrop-filter`
5. **自动滚动** - 确保当前高亮项始终可见

通过这些技术的组合，实现了一个流畅、智能的目录导航组件。
