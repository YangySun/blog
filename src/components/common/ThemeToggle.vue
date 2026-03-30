<template>
  <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换到亮色主题' : '切换到暗色主题'">
    <span v-if="isDark">☀️</span>
    <span v-else>🌙</span>
  </button>
</template>

<script setup>
import { useStore } from '../../store'

const store = useStore()
const { isDark, toggleTheme } = store
</script>

<style scoped lang="scss">
@import '../../assets/styles/variables.scss';

.theme-toggle {
  font-size: $font-size-xl;
  padding: $spacing-sm;
  border-radius: 50%;
  transition: $transition;
  background-color: var(--bg-secondary);

  &:hover {
    background-color: var(--bg-primary);
    transform: scale(1.1);
  }
}
</style>