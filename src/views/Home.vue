<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-left">
        <div class="hero-content">
          <h1 class="hero-title">欢迎来到眠羊的博客</h1>
          <p class="hero-subtitle">分享技术，记录生活</p>
          <p class="hero-credit">本项目由 Vibe Coding 生成，感谢 Trae CN</p>
        </div>
        <div class="hero-categories">
          <router-link
            v-for="(count, category, index) in topCategories"
            :key="category"
            :to="`/blog/category/${encodeURIComponent(category)}`"
            :class="['category-item', `category-${index + 1}`]"
            @mouseenter="setHoverState(true)"
            @mouseleave="setHoverState(false)"
          >
            <span class="category-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
              </svg>
            </span>
            <span class="category-name">{{ category }}</span>
            <span class="category-count">{{ count }} 篇</span>
          </router-link>
        </div>
      </div>
      <div class="hero-right">
        <BlockAnimals  :isNodActive="isHoveringCard"/>
      </div>
    </section>

    <section class="articles-section">
      <div class="section-header">
        <div class="section-tabs">
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            @mouseenter="setHoverState(true)"
            @mouseleave="setHoverState(false)"
            :class="['tab-btn', { active: selectedCategory === category }]"
          >
            {{ category || '全部文章' }}
          </button>
        </div>
      </div>
      <div class="articles-grid">
        <ArticleCard
          v-for="(article, index) in filteredArticles"
          :key="article.id"
          :article="article"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @mouseenter="setHoverState(true)"
          @mouseleave="setHoverState(false)"
        />
      </div>
      <div class="view-all">
        <router-link
          to="/blog/articles"
          class="btn-primary"
          @mouseenter="setHoverState(true)"
          @mouseleave="setHoverState(false)"
        >
          查看全部文章 →
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from '../store'
import { useLoadingStore } from '../store/loading'
import ArticleCard from '../components/article/ArticleCard.vue'
import BlockAnimals from '../components/home/BlockAnimals.vue'

const store = useStore()
const loading = useLoadingStore()
const latestArticles = ref([])
const selectedCategory = ref('')
const isHoveringCard = ref(false)

const setHoverState = (state) => {
  isHoveringCard.value = state
}

const categories = computed(() => {
  const cats = new Set(latestArticles.value.map(a => a.category))
  return ['', ...Array.from(cats)]
})

const topCategories = computed(() => {
  const counts = {}
  latestArticles.value.forEach(article => {
    if (article.category) {
      counts[article.category] = (counts[article.category] || 0) + 1
    }
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {})
})

const filteredArticles = computed(() => {
  if (!selectedCategory.value) {
    return latestArticles.value.slice(0, 6)
  }
  return latestArticles.value
    .filter(a => a.category === selectedCategory.value)
    .slice(0, 6)
})

onMounted(async () => {
  const { loadArticles } = await import('../utils/markdown')
  const articles = await loadArticles()
  store.setArticles(articles)
  latestArticles.value = articles
  loading.finish('加载完成!')
})
</script>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.home-page {
  min-height: calc(100vh - 64px);
}

.hero-section {
  display: flex;
  align-items: stretch;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 0;
  gap: 40px;
}

.hero-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-right {
  flex: 1;
  background: var(--bg-secondary);
  border-radius: 16px;
  overflow: hidden;

  :deep(.figures-component-wrapper) {
    height: 100%;
  }
}

.hero-content {
  padding: 50px 40px;
  background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-hover) 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-height: 240px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-title {
  font-size: 2rem;
  margin-bottom: 12px;
  font-weight: 700;
  color: white;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
}

.hero-credit {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 16px;
  font-style: italic;
}

.hero-categories {
  display: flex;
  gap: 12px;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 20px;
  border-radius: 12px;
  color: white;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &.category-1 {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.category-2 {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  &.category-3 {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }

  &:hover {
    flex: 1.5;
    transform: scale(1.02);

    ~ .category-item {
      flex: 0.7;
      opacity: 0.7;
    }

    &::before {
      width: 100%;
    }

    .category-name {
      padding-left: 8px;
    }
  }

  &:not(:hover) {
    flex: 0.8;
    opacity: 0.75;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background: rgba(255, 255, 255, 0.2);
    transition: width 0.3s ease;
  }

  .category-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .category-name {
    font-weight: 500;
    font-size: 15px;
    transition: padding-left 0.3s ease;
    white-space: nowrap;
  }

  .category-count {
    font-size: 13px;
    opacity: 0.85;
    white-space: nowrap;
  }
}

.hero-right {
  width: 300px;
  background: var(--bg-secondary);
  border-radius: 16px;
}

.articles-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0 60px;
}

.section-header {
  margin-bottom: 32px;
}

.section-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.tab-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }

  &.active {
    background: var(--accent-color);
    color: white;
  }
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.view-all {
  text-align: center;
}

.btn-primary {
  display: inline-block;
  padding: 12px 32px;
  background: var(--accent-color);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
  }
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    padding: 20px;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .hero-categories {
    grid-template-columns: 1fr;
  }

  .hero-right {
    display: none;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>