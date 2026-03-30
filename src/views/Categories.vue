<template>
  <div class="categories-page">
    <h1 class="page-title">分类</h1>
    
    <div v-if="categories.length > 0" class="categories-grid">
      <router-link
        v-for="(count, category) in categoriesWithCount"
        :key="category"
        :to="`/blog/category/${encodeURIComponent(category)}`"
        class="category-card"
      >
        <div class="category-icon">📁</div>
        <div class="category-info">
          <h3 class="category-name">{{ category }}</h3>
          <p class="category-count">{{ count }} 篇文章</p>
        </div>
      </router-link>
    </div>
    
    <div v-else class="no-results">
      <p>暂无分类</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from '../store'

const store = useStore()

const categoriesWithCount = computed(() => {
  const counts = {}
  store.articles.forEach(article => {
    if (article.category) {
      counts[article.category] = (counts[article.category] || 0) + 1
    }
  })
  return counts
})

const categories = computed(() => Object.keys(categoriesWithCount.value))

onMounted(async () => {
  const { loadArticles } = await import('../utils/markdown')
  if (store.articles.length === 0) {
    const articles = await loadArticles()
    store.setArticles(articles)
  }
})
</script>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.categories-page {
  padding: $spacing-xl 0;
}

.page-title {
  font-size: $font-size-xxl;
  margin-bottom: $spacing-xl;
  color: var(--text-primary);
  text-align: center;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $spacing-lg;
}

.category-card {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-lg;
  background: var(--bg-primary);
  border-radius: $border-radius;
  box-shadow: $shadow;
  transition: $transition;
  text-decoration: none;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-hover;
  }
}

.category-icon {
  font-size: 48px;
}

.category-info {
  flex: 1;
}

.category-name {
  font-size: $font-size-lg;
  margin-bottom: $spacing-sm;
  color: var(--text-primary);
}

.category-count {
  color: var(--text-secondary);
  font-size: $font-size-sm;
}

.no-results {
  text-align: center;
  padding: $spacing-xl;
  color: var(--text-secondary);
  font-size: $font-size-lg;
}
</style>