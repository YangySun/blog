<template>
  <header class="header">
    <div class="container header-container">
      <router-link to="/blog/" class="logo">
        <h1>My Blog</h1>
      </router-link>
      <nav class="nav">
        <router-link to="/blog/" class="nav-link">首页</router-link>
        <div class="dropdown">
          <router-link to="/blog/articles" class="nav-link dropdown-toggle">
            文库
            <span class="dropdown-arrow">▼</span>
          </router-link>
          <div class="dropdown-menu">
            <router-link to="/blog/articles" class="dropdown-item">
              📚 文章列表
            </router-link>
            <router-link to="/blog/categories" class="dropdown-item">
              📁 分类
            </router-link>
            <router-link to="/blog/tags" class="dropdown-item">
              🏷️ 标签
            </router-link>
          </div>
        </div>
        <router-link to="/blog/about" class="nav-link">关于</router-link>
        <router-link to="/blog/links" class="nav-link">友链</router-link>
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
  box-shadow: $shadow;
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
  align-items: center;
  gap: $spacing-lg;
}

.nav-link {
  color: var(--text-primary);
  font-weight: 500;
  transition: $transition;
  text-decoration: none;

  &:hover,
  &.router-link-active {
    color: var(--accent-color);
  }
}

.dropdown {
  position: relative;

  &:hover .dropdown-menu {
    display: block;
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  cursor: pointer;
}

.dropdown-arrow {
  font-size: 10px;
  transition: transform 0.3s ease;
}

.dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-10px);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: $border-radius;
  box-shadow: $shadow-hover;
  min-width: 400px;
  padding: $spacing-sm;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: row;
  gap: $spacing-xs;
}

.dropdown-item {
  flex: 1;
  padding: $spacing-sm $spacing-md;
  color: var(--text-primary);
  text-decoration: none;
  transition: $transition;
  font-size: $font-size-sm;
  text-align: center;
  border-radius: $border-radius;

  &:hover {
    background: var(--bg-secondary);
    color: var(--accent-color);
  }
}

@media (max-width: 768px) {
  .nav {
    display: none;
  }
}
</style>