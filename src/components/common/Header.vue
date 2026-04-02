<template>
  <header class="header" :class="{ 'header--transparent': isArticlePage && !isScrolled, 'header--scrolled': isScrolled }">
    <div class="header-container">
      <div class="header-left">
        <router-link to="/blog/" class="logo">
          <span class="logo-text">眠羊</span>
          <span class="logo-hover-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </span>
        </router-link>
      </div>

      <div class="header-center" v-if="isArticlePage && isScrolled">
        <span class="article-title">{{ articleTitle }}</span>
      </div>
      <nav class="nav" v-else>
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

      <div class="header-right">
        <button @click="toggleSearch" class="header-btn" title="搜索文章">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </button>
        <button @click="goRandomArticle" :class="['header-btn', { spinning: isSpinning }]" title="随机文章">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 3h5v5"/>
            <path d="M4 20L21 3"/>
            <path d="M21 16v5h-5"/>
            <path d="M15 15l6 6"/>
            <path d="M4 4l5 5"/>
          </svg>
        </button>
        <ThemeToggle />
        <button
          v-if="showBackToTop"
          @click="scrollToTop"
          class="back-to-top-btn"
          title="回到顶部"
        >
          ↑
        </button>
        <button @click="toggleMobileMenu" class="mobile-menu-btn">
          <span class="hamburger" :class="{ 'is-active': showMobileMenu }"></span>
        </button>
      </div>

      <div class="search-overlay" v-if="showSearch" @click.self="toggleSearch">
        <div class="search-modal">
          <input
            ref="searchInput"
            v-model="searchQuery"
            @keyup.enter="searchArticles"
            placeholder="搜索文章..."
            class="search-input"
          />
          <div v-if="searchResults.length > 0" class="search-results">
            <router-link
              v-for="article in searchResults"
              :key="article.id"
              :to="`/blog/article/${article.id}`"
              class="search-result-item"
              @click="toggleSearch"
            >
              <span class="result-title">{{ article.title }}</span>
              <span class="result-category">{{ article.category }}</span>
            </router-link>
          </div>
          <p v-else-if="searchQuery && !searching" class="search-empty">未找到相关文章</p>
        </div>
      </div>

      <Transition name="slide">
        <div v-if="showMobileMenu" class="mobile-nav-overlay" @click.self="toggleMobileMenu">
          <nav class="mobile-nav">
            <div class="mobile-nav-header">
              <span class="mobile-nav-title">菜单</span>
              <button @click="toggleMobileMenu" class="mobile-nav-close">×</button>
            </div>
            <router-link to="/blog/" class="mobile-nav-link" @click="toggleMobileMenu">首页</router-link>
            <router-link to="/blog/articles" class="mobile-nav-link" @click="toggleMobileMenu">文章列表</router-link>
            <router-link to="/blog/categories" class="mobile-nav-link" @click="toggleMobileMenu">分类列表</router-link>
            <router-link to="/blog/tags" class="mobile-nav-link" @click="toggleMobileMenu">标签列表</router-link>
            <router-link to="/blog/about" class="mobile-nav-link" @click="toggleMobileMenu">关于</router-link>
            <router-link to="/blog/links" class="mobile-nav-link" @click="toggleMobileMenu">友链</router-link>
          </nav>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'
import { useStore } from '../../store'

const route = useRoute()
const router = useRouter()
const store = useStore()
const isScrolled = ref(false)
const isArticlePage = ref(false)
const articleTitle = ref('')
const showBackToTop = ref(false)
const showMobileMenu = ref(false)

function handleScroll() {
  if (isArticlePage.value) {
    isScrolled.value = window.scrollY > 0
    showBackToTop.value = window.scrollY > 0
  } else {
    isScrolled.value = window.scrollY > 10
    showBackToTop.value = window.scrollY > 300
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
  if (showMobileMenu.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const showSearch = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const isSpinning = ref(false)
const searchInput = ref(null)

async function toggleSearch() {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    if (store.articles.length === 0) {
      await loadArticles()
    }
    searchQuery.value = ''
    searchResults.value = []
    await nextTick()
    searchInput.value?.focus()
  }
}

async function loadArticles() {
  if (store.articles.length > 0) return
  const { loadArticles } = await import('../../utils/markdown')
  const articles = await loadArticles()
  store.setArticles(articles)
}

function searchArticles() {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  const query = searchQuery.value.toLowerCase()
  searchResults.value = store.articles.filter(article =>
    article.title.toLowerCase().includes(query) ||
    article.category.toLowerCase().includes(query) ||
    article.tags?.some(tag => tag.toLowerCase().includes(query))
  ).slice(0, 10)
}

async function goRandomArticle() {
  if (isSpinning.value) return
  isSpinning.value = true

  if (store.articles.length === 0) {
    await loadArticles()
  }

  const currentArticleId = route.params.id
  let randomArticle
  let attempts = 0

  do {
    const randomIndex = Math.floor(Math.random() * store.articles.length)
    randomArticle = store.articles[randomIndex]
    attempts++
    await new Promise(resolve => setTimeout(resolve, 100))
  } while (randomArticle.id === currentArticleId && attempts < 10 && store.articles.length > 1)

  await new Promise(resolve => setTimeout(resolve, 300))
  router.push(`/blog/article/${randomArticle.id}`)
}

watch(searchQuery, () => {
  searchArticles()
})

watch(() => route.params.id, (newId) => {
  isArticlePage.value = !!newId
  if (!newId) {
    articleTitle.value = ''
  }
}, { immediate: true })

watch(() => route.path, () => {
  handleScroll()
  isSpinning.value = false
  showMobileMenu.value = false
  document.body.style.overflow = ''
})

watch(() => route.params.id, (id) => {
  if (id) {
    const articles = JSON.parse(sessionStorage.getItem('articles') || '[]')
    const article = articles.find(a => a.id === id)
    if (article) {
      articleTitle.value = article.title
    }
  }
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
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

  &--transparent {
    background: transparent;
    box-shadow: none;

    .logo .logo-text {
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.95);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

      &:hover,
      &.router-link-active {
        color: white;
      }
    }

    .dropdown-arrow {
      color: rgba(255, 255, 255, 0.9);
    }

    .dropdown-menu {
      background: rgba(255, 255, 255, 0.98);
      border-color: rgba(0, 0, 0, 0.1);

      .dropdown-item {
        color: var(--text-primary);

        &:hover {
          background: var(--bg-secondary);
          color: var(--accent-color);
        }
      }
    }

    .theme-toggle {
      background-color: rgba(255, 255, 255, 0.2);

      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      .sun-icon,
      .moon-icon {
        color: white;
      }
    }

    .back-to-top-btn {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;

      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    }

    .mobile-menu-btn {
      .hamburger {
        background-color: white;

        &::before,
        &::after {
          background-color: white;
        }
      }
    }
  }

  &--scrolled {
    background: var(--bg-primary);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    .logo .logo-text {
      color: var(--text-primary);
    }

    .nav-link {
      color: var(--text-primary);

      &:hover,
      &.router-link-active {
        color: var(--accent-color);
      }
    }

    .dropdown-arrow {
      color: var(--text-secondary);
    }

    .back-to-top-btn {
      background-color: var(--bg-secondary);
      color: var(--text-primary);

      &:hover {
        background-color: var(--accent-color);
        color: white;
      }
    }
  }
}

.header-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 64px;
  padding: 0 40px;

  @include mobile {
    padding: 0 16px;
  }
}

.header-left {
  display: flex;
  align-items: center;
}

.header-center {
  text-align: center;
  padding: 0 20px;

  .article-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
}

.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.header-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: $border-radius;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: var(--bg-secondary);
    color: var(--accent-color);
  }

  &.spinning {
    animation: spin 0.5s linear infinite;

    svg {
      animation: shuffle 0.2s ease-in-out infinite;
    }
  }

  @include mobile {
    width: 44px;
    height: 44px;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes shuffle {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px) rotate(-5deg); }
  75% { transform: translateX(2px) rotate(5deg); }
}

.mobile-menu-btn {
  display: none;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  @include mobile {
    display: flex;
  }
}

.hamburger {
  position: relative;
  width: 24px;
  height: 2px;
  background-color: var(--text-primary);
  transition: all 0.3s ease;
  border-radius: 1px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background-color: var(--text-primary);
    transition: all 0.3s ease;
    border-radius: 1px;
    left: 0;
  }

  &::before {
    top: -8px;
  }

  &::after {
    top: 8px;
  }

  &.is-active {
    background-color: transparent;

    &::before {
      top: 0;
      transform: rotate(45deg);
    }

    &::after {
      top: 0;
      transform: rotate(-45deg);
    }
  }
}

.mobile-nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
}

.mobile-nav {
  width: 280px;
  height: 100%;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.mobile-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.mobile-nav-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.mobile-nav-close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
}

.mobile-nav-link {
  padding: 16px 20px;
  font-size: 16px;
  color: var(--text-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-secondary);
    color: var(--accent-color);
  }

  &.router-link-active {
    color: var(--accent-color);
    background: var(--bg-secondary);
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 120px;
}

.search-modal {
  width: 100%;
  max-width: 600px;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  margin: 0 20px;

  @include mobile {
    margin: 0 16px;
  }
}

.search-input {
  width: 100%;
  padding: 20px 24px;
  font-size: $font-size-lg;
  border: none;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  outline: none;

  &::placeholder {
    color: var(--text-secondary);
  }

  @include mobile {
    padding: 16px;
    font-size: $font-size-md;
  }
}

.search-results {
  max-height: 400px;
  overflow-y: auto;

  @include mobile {
    max-height: 60vh;
  }
}

.search-result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  text-decoration: none;
  transition: background 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--bg-secondary);
  }

  .result-title {
    color: var(--text-primary);
    font-weight: 500;
  }

  .result-category {
    font-size: $font-size-sm;
    color: var(--text-secondary);
  }

  @include mobile {
    padding: 14px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

.search-empty {
  padding: 24px;
  text-align: center;
  color: var(--text-secondary);
}

.logo {
  text-decoration: none;
  position: relative;
  display: flex;
  align-items: center;

  .logo-text {
    font-size: $font-size-xl;
    color: var(--text-primary);
    transition: all 0.3s ease;
    width: 60px;
    text-align: center;
  }

  .logo-hover-icon {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 60px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--accent-color);
    color: white;
    border-radius: $border-radius;
    opacity: 0;
    transition: all 0.3s ease;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  &:hover {
    .logo-text {
      opacity: 0;
    }

    .logo-hover-icon {
      opacity: 1;
    }
  }
}

.nav {
  display: flex;
  align-items: center;
  gap: 40px;

  @include mobile {
    display: none;
  }
}

.nav-link {
  color: var(--text-primary);
  font-weight: 500;
  font-size: $font-size-md;
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

.back-to-top-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  @include mobile {
    width: 44px;
    height: 44px;
  }
}
</style>
