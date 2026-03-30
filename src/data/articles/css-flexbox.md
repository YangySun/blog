---
title: CSS Flexbox完全指南
date: 2024-01-18
tags: [CSS, 前端, 布局]
category: 前端开发
heroColor: "#4facfe"
description: 掌握CSS Flexbox布局技术，轻松实现各种灵活的页面布局。
---

# CSS Flexbox完全指南

Flexbox是CSS3引入的一种新的布局模式，可以更简单、更高效地实现复杂的页面布局。

## Flexbox基础概念

### 容器和项目

```css
.container {
  display: flex;
}

.item {
  flex: 1;
}
```

### 主轴和交叉轴

- **主轴（main axis）**：flex项目排列的方向
- **交叉轴（cross axis）**：垂直于主轴的方向

## Flex容器属性

### flex-direction

控制项目的排列方向：

```css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

### justify-content

控制主轴上的对齐方式：

```css
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
```

### align-items

控制交叉轴上的对齐方式：

```css
.container {
  align-items: stretch | flex-start | flex-end | center | baseline;
}
```

## Flex项目属性

### flex-grow

定义项目的放大比例：

```css
.item {
  flex-grow: 1;
}
```

### flex-shrink

定义项目的缩小比例：

```css
.item {
  flex-shrink: 0;
}
```

### flex-basis

定义项目的主尺寸：

```css
.item {
  flex-basis: 200px;
}
```

## 实用布局示例

### 居中对齐

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
```

### 响应式导航栏

```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 20px;
}
```

## 浏览器兼容性

Flexbox得到了所有现代浏览器的支持，但在一些旧版浏览器中可能需要添加前缀。

## 总结

Flexbox是现代CSS布局的重要工具，掌握它可以让你的布局代码更加简洁和灵活。