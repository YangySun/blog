<template>
  <header class="header">
    <div class="container header-container">
      <router-link to="/" class="logo">
        <h1>My Blog</h1>
      </router-link>
      <nav class="nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/articles" class="nav-link">文章</router-link>
        <router-link to="/about" class="nav-link">关于</router-link>
        <router-link to="/links" class="nav-link">友链</router-link>
      </nav>
      <ThemeToggle />
    </div>
  </header>
</template>

<script setup>
import ThemeToggle from './ThemeToggle.vue'
</script>

<style scoped lang="scss">
@import '../../assets/styles/variables.scss';

.header {
  background-color: var(--bg-primary);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s ease;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  h1 {
    font-size: $font-size-xl;
    color: var(--accent-color);
    margin: 0;
  }
}

.nav {
  display: flex;
  gap: $spacing-lg;
}

.nav-link {
  color: var(--text-primary);
  font-weight: 500;
  transition: $transition;

  &:hover,
  &.router-link-active {
    color: var(--accent-color);
  }
}

@media (max-width: 768px) {
  .nav {
    display: none;
  }
}
</style>