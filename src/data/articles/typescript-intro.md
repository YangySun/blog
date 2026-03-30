---
title: TypeScript入门与实战
date: 2024-01-14
tags: [TypeScript, JavaScript, 前端]
category: 前端开发
heroColor: "#30cfd0"
description: 学习TypeScript的基础知识，了解类型系统，并通过实战案例掌握在实际项目中的应用。
---

# TypeScript入门与实战

TypeScript是JavaScript的超集，为JavaScript添加了静态类型检查和面向对象编程特性。

## 为什么使用TypeScript

1. **类型安全**：编译时就能发现类型错误
2. **更好的IDE支持**：智能提示和代码补全
3. **更易维护**：代码文档化，更容易理解
4. **面向对象**：支持接口、泛型等高级特性

## 基础类型

### 基本类型

```typescript
let name: string = "John";
let age: number = 25;
let isActive: boolean = true;
```

### 数组和元组

```typescript
let numbers: number[] = [1, 2, 3];
let mixed: [string, number] = ["age", 25];
```

### 接口

```typescript
interface User {
  name: string;
  age: number;
  email?: string;  // 可选属性
  readonly id: number;  // 只读属性
}

const user: User = {
  name: "John",
  age: 25,
  id: 1
};
```

## 函数类型

### 函数声明

```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

### 函数表达式

```typescript
const multiply = (a: number, b: number): number => a * b;
```

### 可选参数和默认参数

```typescript
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}
```

## 泛型

### 泛型函数

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const result = identity<string>("hello");
```

### 泛型接口

```typescript
interface Container<T> {
  value: T;
  getValue(): T;
}
```

## 实战案例

### React + TypeScript

```typescript
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};
```

## 总结

TypeScript可以显著提高代码质量和开发效率，特别适合大型项目和团队协作。