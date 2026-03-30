<template>
  <div class="article-page">
    <div class="article-hero" :style="{ backgroundColor: article?.heroColor || '#667eea' }" v-if="article">
      <div class="hero-content">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <span class="article-date">📅 {{ formatDate(article.date) }}</span>
          <span class="article-category">📁 {{ article.category }}</span>
        </div>
        <div class="article-tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">
            {{ tag }}
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
    <div class="article-container" v-if="article">
      <div class="article-body">
        <div class="article-content" ref="contentRef" v-html="article.content"></div>
        <TableOfContents :headings="headings" @navigate="scrollToHeading" />
      </div>
      
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
import TableOfContents from '../components/article/TableOfContents.vue'

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

function scrollToHeading(id) {
  const element = document.getElementById(id)
  if (element) {
    const headerOffset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

onMounted(async () => {
  const { loadArticles, loadArticle } = await import('../utils/markdown')
  if (store.articles.length === 0) {
    const articles = await loadArticles()
    store.setArticles(articles)
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
}

.article-hero {
  position: relative;
  padding: 140px 20px 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  overflow: hidden;
  min-height: 300px;
  width: 100%;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
}

.wave-separator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
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
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: $spacing-md;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.article-meta {
  display: flex;
  justify-content: center;
  gap: $spacing-lg;
  margin-bottom: $spacing-md;
  font-size: $font-size-sm;
  opacity: 0.95;
}

.article-tags {
  display: flex;
  justify-content: center;
  gap: $spacing-sm;
  flex-wrap: wrap;
}

.tag {
  background-color: rgba(255, 255, 255, 0.2);
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius;
  font-size: $font-size-sm;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.article-container {
  max-width: 1200px;
  margin: 0 auto;
}

.article-body {
  display: flex;
  gap: $spacing-xl;
  align-items: flex-start;
  padding: $spacing-xl 20px;
  background: var(--bg-primary);
  position: relative;
  z-index: 3;
}

.article-content {
  flex: 1;
  min-width: 0;
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
  padding: $spacing-lg 20px $spacing-xl;
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