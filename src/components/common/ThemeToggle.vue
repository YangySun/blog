<template>
  <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换到亮色主题' : '切换到暗色主题'">
    <span v-if="isDark" class="sun-icon">☀</span>
    <span v-else class="moon-icon">☾</span>
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
  font-size: $font-size-lg;
  padding: $spacing-sm;
  border-radius: 50%;
  transition: $transition;
  background-color: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;

  &:hover {
    background-color: var(--bg-primary);
    transform: scale(1.1);
  }
}

.sun-icon,
.moon-icon {
  color: var(--text-primary);
  font-weight: normal;
}
</style>