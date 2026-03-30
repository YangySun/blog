<template>
  <header class="header" :class="{ 'header--article-scrolled': isArticleScrolled }">
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
              <span class="item-icon">☰</span>
              <span>文章列表</span>
            </router-link>
            <router-link to="/blog/categories" class="dropdown-item">
              <span class="item-icon">▣</span>
              <span>分类列表</span>
            </router-link>
            <router-link to="/blog/tags" class="dropdown-item">
              <span class="item-icon">⚿</span>
              <span>标签列表</span>
            </router-link>
          </div>
        </div>
        <router-link to="/blog/about" class="nav-link">关于</router-link>
        <router-link to="/blog/links" class="nav-link">友链</router-link>
      </nav>
      <ThemeToggle />
    </div>
    <transition name="slide-fade">
      <div v-if="isArticleScrolled" class="article-title-bar">
        <span class="article-title">{{ currentArticleTitle }}</span>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'

const route = useRoute()
const isArticleScrolled = ref(false)
const currentArticleTitle = ref('')

function handleScroll() {
  const isArticlePage = route.path.includes('/article/')
  isArticleScrolled.value = isArticlePage && window.scrollY > 100
}

watch(() => route.params.id, async (newId) => {
  if (newId) {
    const { loadArticle } = await import('../../utils/markdown')
    const article = await loadArticle(newId)
    currentArticleTitle.value = article?.title || ''
  } else {
    currentArticleTitle.value = ''
  }
}, { immediate: true })

watch(() => route.path, () => {
  handleScroll()
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
@import '../../assets/styles/variables.scss';

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
    transition: color 0.4s ease;
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
  display: flex;
  justify-content: center;

  &:hover .dropdown-menu {
    display: flex;
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(10px);
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
  color: var(--text-secondary);
}

.dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: $border-radius;
  box-shadow: $shadow-hover;
  width: max-content;
  padding: $spacing-xs;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: row;
  gap: $spacing-xs;
  z-index: 1000;
}

.dropdown-item {
  padding: $spacing-sm $spacing-md;
  color: var(--text-primary);
  text-decoration: none;
  transition: $transition;
  font-size: $font-size-sm;
  text-align: center;
  border-radius: $border-radius;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: $spacing-sm;

  .item-icon {
    font-size: 16px;
    opacity: 0.7;
  }

  &:hover {
    background: var(--bg-secondary);
    color: var(--accent-color);

    .item-icon {
      opacity: 1;
    }
  }
}

.article-title-bar {
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: $spacing-sm $spacing-lg;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 99;
}

.article-title {
  font-size: $font-size-md;
  color: var(--text-primary);
  font-weight: 600;
  max-width: 800px;
  margin: 0 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .nav {
    display: none;
  }
}
</style>