<template>
  <div class="article-detail">
    <div v-if="article" class="article-container">
      <div class="article-hero" :style="{ backgroundColor: article.heroColor || '#667eea' }">
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
      </div>
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

.article-detail {
  margin: -20px;
}

.article-container {
  max-width: 100%;
}

.article-hero {
  position: relative;
  padding: 120px 20px 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  margin: 0;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
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