<template>
  <div class="categories-page">
    <h1 class="page-title">分类</h1>
    <div class="categories-grid">
      <router-link
        v-for="(count, category) in categoriesWithCount"
        :key="category"
        :to="`/blog/category/${encodeURIComponent(category)}`"
        class="category-card"
      >
        <div class="category-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
          </svg>
        </div>
        <div class="category-info">
          <h3>{{ category }}</h3>
          <p>{{ count }} 篇文章</p>
        </div>
      </router-link>
    </div>
    <div v-if="Object.keys(categoriesWithCount).length === 0" class="no-results">
      <p>暂无分类</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from '../store'
import { useLoadingStore } from '../store/loading'

const store = useStore()
const loading = useLoadingStore()

const categoriesWithCount = computed(() => {
  const counts = {}
  store.articles.forEach(article => {
    if (article.category) {
      counts[article.category] = (counts[article.category] || 0) + 1
    }
  })
  return counts
})

onMounted(async () => {
  if (store.articles.length === 0) {
    const { loadArticles } = await import('../utils/markdown')
    store.setArticles(await loadArticles())
  }
  loading.finish('加载完成!')
})
</script>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.categories-page {
  @include page-container;
}

.page-title {
  @include page-title;
}

.categories-grid {
  @include card-grid;
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
  width: 48px;
  height: 48px;
  color: var(--text-secondary);

  svg {
    width: 100%;
    height: 100%;
  }
}

.category-info {
  flex: 1;
  h3 { font-size: $font-size-lg; color: var(--text-primary); margin-bottom: $spacing-sm; }
  p { color: var(--text-secondary); font-size: $font-size-sm; }
}

.no-results {
  @include no-results;
}
</style>