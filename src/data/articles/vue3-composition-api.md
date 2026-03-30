---
title: Vue 3 Composition API 入门指南
date: 2024-01-15
tags: [Vue.js, JavaScript, 前端]
category: 前端开发
description: 学习Vue 3的Composition API，了解如何使用setup、ref、reactive等核心概念。
---

# Vue 3 Composition API 入门指南

Vue 3 引入了 Composition API，这是一种新的组织组件逻辑的方式，提供了更好的代码复用和类型推断。

## setup 函数

`setup` 函数是 Composition API 的入口点，它在组件创建之前执行。

```javascript
import { ref, reactive } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({
      name: 'Vue 3',
      version: '3.0'
    })

    function increment() {
      count.value++
    }

    return {
      count,
      state,
      increment
    }
  }
}
```

## ref 和 reactive

- `ref`：用于创建响应式的基本类型值
- `reactive`：用于创建响应式的对象

```javascript
const count = ref(0)
console.log(count.value)

const user = reactive({
  name: 'John',
  age: 30
})
console.log(user.name)
```

## computed 和 watch

```javascript
import { ref, computed, watch } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})
```

## 生命周期钩子

```javascript
import { onMounted, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('Component mounted')
    })

    onUnmounted(() => {
      console.log('Component unmounted')
    })
  }
}
```

## 总结

Composition API 提供了更灵活的代码组织方式，特别适合大型项目和复杂组件。通过合理使用 ref、reactive、computed 等工具，可以编写出更清晰、更易维护的代码。