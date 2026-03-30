<template>
  <div class="articles-page">
    <h1 class="page-title">文章列表</h1>
    
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索文章..."
        class="search-input"
      />
    </div>

    <div class="articles-grid">
      <ArticleCard
        v-for="article in filteredArticles"
        :key="article.id"
        :article="article"
      />
    </div>

    <div v-if="filteredArticles.length === 0" class="no-results">
      <p>没有找到匹配的文章</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from '../store'
import ArticleCard from '../components/article/ArticleCard.vue'

const store = useStore()
const searchQuery = ref('')

const filteredArticles = computed(() => {
  if (!searchQuery.value) return store.articles
  const query = searchQuery.value.toLowerCase()
  return store.articles.filter(article =>
    article.title.toLowerCase().includes(query) ||
    article.description.toLowerCase().includes(query)
  )
})

onMounted(async () => {
  const { loadArticles } = await import('../utils/markdown')
  const articles = await loadArticles()
  store.setArticles(articles)
})
</script>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.articles-page {
  padding: $spacing-xl 0;
}

.page-title {
  font-size: $font-size-xxl;
  margin-bottom: $spacing-lg;
  color: var(--text-primary);
}

.search-bar {
  margin-bottom: $spacing-lg;
}

.search-input {
  width: 100%;
  padding: $spacing-md;
  border: 1px solid var(--border-color);
  border-radius: $border-radius;
  font-size: $font-size-md;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: $transition;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;
}

.no-results {
  text-align: center;
  padding: $spacing-xl;
  color: var(--text-secondary);
}
</style>