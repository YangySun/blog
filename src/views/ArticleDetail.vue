<template>
  <div class="article-page">
    <div class="article-hero" :style="{ backgroundColor: article?.heroColor || '#667eea' }" v-if="article">
      <div class="hero-content">
        <div class="hero-meta-row">
          <span class="article-category">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
            </svg>
            {{ article.category }}
          </span>
          <div class="article-tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="hero-info-row">
          <span class="article-date">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {{ formatDate(article.date) }}
          </span>
          <span class="article-words">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            {{ article.wordCount || 0 }} 字
          </span>
        </div>
      </div>
      <div class="wave-separator">
        <svg class="wave wave-1" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1350,90 1440,60 L1440,120 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
        </svg>
        <svg class="wave wave-2" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,80 C240,20 480,100 720,60 C960,20 1200,80 1440,40 L1440,120 L0,120 Z" fill="rgba(255,255,255,0.15)"/>
        </svg>
        <svg class="wave wave-3" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,50 C360,100 720,20 1080,70 C1260,90 1380,70 1440,50 L1440,120 L0,120 Z" fill="rgba(255,255,255,0.25)"/>
        </svg>
        <svg class="wave wave-4" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,70 C240,30 600,90 900,50 C1140,20 1320,60 1440,40 L1440,120 L0,120 Z" fill="rgba(255,255,255,0.35)"/>
        </svg>
      </div>
    </div>
    <div class="article-layout" v-if="article">
      <div class="article-main">
        <div class="article-content" ref="contentRef" v-html="article.content"></div>
        <div class="article-navigation">
          <router-link
            v-if="prevArticle"
            :to="`/blog/article/${prevArticle.id}`"
            class="nav-link prev"
          >
            ← {{ prevArticle.title }}
          </router-link>
          <router-link
            v-if="nextArticle"
            :to="`/blog/article/${nextArticle.id}`"
            class="nav-link next"
          >
            {{ nextArticle.title }} →
          </router-link>
        </div>
      </div>
      <aside class="article-toc">
        <FloatingToc :headings="headings" />
      </aside>
    </div>
    <div v-else class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '../store'
import { formatDate } from '../utils/date'
import FloatingToc from '../components/article/FloatingToc.vue'

const route = useRoute()
const store = useStore()
const article = ref(null)
const contentRef = ref(null)
const headings = ref([])

const articles = computed(() => store.articles)
const currentIndex = computed(() => articles.value.findIndex(a => a.id === route.params.id))

const prevArticle = computed(() => {
  if (currentIndex.value === -1 || currentIndex.value === articles.value.length - 1) return null
  return articles.value[currentIndex.value + 1]
})

const nextArticle = computed(() => {
  if (currentIndex.value <= 0) return null
  return articles.value[currentIndex.value - 1]
})

function extractHeadings() {
  if (!contentRef.value) return

  const elements = contentRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6')
  headings.value = Array.from(elements).map((el, index) => {
    const text = el.textContent.trim()
    el.id = `heading-${index}`
    return {
      id: `heading-${index}`,
      text,
      level: parseInt(el.tagName.charAt(1))
    }
  })
}

onMounted(async () => {
  const { loadArticles, loadArticle } = await import('../utils/markdown')
  if (store.articles.length === 0) {
    const articles = await loadArticles()
    store.setArticles(articles)
    sessionStorage.setItem('articles', JSON.stringify(articles))
  } else {
    sessionStorage.setItem('articles', JSON.stringify(store.articles))
  }
  article.value = await loadArticle(route.params.id)

  await nextTick()
  extractHeadings()
})

watch(() => route.params.id, async (newId) => {
  const { loadArticle } = await import('../utils/markdown')
  article.value = await loadArticle(newId)

  await nextTick()
  extractHeadings()
})
</script>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.article-page {
  width: 100%;
  min-height: 100vh;
}

.article-hero {
  margin-top: -64px;
  padding: 160px 20px 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  overflow: hidden;
  margin-bottom: 0;
  position: relative;
}

.hero-content {
  position: relative;
  z-index: 2;
  margin: 0 auto;
  padding-left: 60px;
  text-align: left;
}

.wave-separator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
}

.wave-1 {
  opacity: 0.08;
  animation: waveMove1 10s ease-in-out infinite;
}

.wave-2 {
  opacity: 0.15;
  animation: waveMove2 12s ease-in-out infinite;
}

.wave-3 {
  opacity: 0.25;
  animation: waveMove3 8s ease-in-out infinite;
}

.wave-4 {
  opacity: 0.35;
  animation: waveMove4 14s ease-in-out infinite;
}

@keyframes waveMove1 {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-40%); }
}

@keyframes waveMove2 {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-45%); }
}

@keyframes waveMove3 {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-35%); }
}

@keyframes waveMove4 {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-50%); }
}

.article-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: $spacing-md;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-align: left;
}

.hero-meta-row {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
  flex-wrap: wrap;
  font-size: $font-size-md;
}

.hero-info-row {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  font-size: $font-size-md;
  opacity: 0.9;
}

.article-category {
  color: white;
  font-size: $font-size-md;
}

.article-tags {
  display: flex;
  gap: $spacing-sm;
  flex-wrap: wrap;
}

.article-date,
.article-words {
  color: rgba(255, 255, 255, 0.9);
}

.tag {
  background-color: rgba(255, 255, 255, 0.2);
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius;
  font-size: $font-size-md;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 4px;
}

.article-layout {
  display: flex;
  gap: 0;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative;
  z-index: 1;
}

.article-main {
  flex: 1;
  min-width: 0;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.article-toc {
  width: 280px;
  flex-shrink: 0;
  padding-left: 30px;
}

.article-content {
  font-size: $font-size-md;
  line-height: 1.8;
  color: var(--text-primary);

  :deep(h2) {
    font-size: $font-size-xl;
    margin: $spacing-xl 0 $spacing-md;
    color: var(--text-primary);
  }

  :deep(h3) {
    font-size: $font-size-lg;
    margin: $spacing-lg 0 $spacing-sm;
    color: var(--text-primary);
  }

  :deep(p) {
    margin-bottom: $spacing-md;
  }

  :deep(pre) {
    background-color: var(--bg-secondary);
    padding: $spacing-md;
    border-radius: $border-radius;
    overflow-x: auto;
    margin-bottom: $spacing-md;
  }

  :deep(code) {
    background-color: var(--bg-secondary);
    padding: $spacing-xs $spacing-sm;
    border-radius: 4px;
    font-size: $font-size-sm;
  }

  :deep(pre code) {
    background-color: transparent;
    padding: 0;
  }

  :deep(ul),
  :deep(ol) {
    margin-bottom: $spacing-md;
    padding-left: $spacing-lg;
  }

  :deep(li) {
    margin-bottom: $spacing-sm;
  }

  :deep(blockquote) {
    border-left: 4px solid var(--accent-color);
    padding-left: $spacing-md;
    margin-bottom: $spacing-md;
    color: var(--text-secondary);
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: $border-radius;
    margin: $spacing-md 0;
  }
}

.article-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: $spacing-xl;
  padding-bottom: $spacing-xl;
}

.nav-link {
  flex: 1;
  padding: $spacing-md;
  background-color: var(--bg-secondary);
  border-radius: $border-radius;
  transition: $transition;
  color: var(--text-primary);

  &:hover {
    background-color: var(--bg-primary);
  }

  &.prev {
    text-align: left;
  }

  &.next {
    text-align: right;
  }
}

.loading {
  text-align: center;
  padding: $spacing-xxl;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto $spacing-md;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>