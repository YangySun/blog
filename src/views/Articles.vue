<template>
  <div class="articles-page">
    <h1 class="page-title">文章列表</h1>
    
    <CategoryFilter
      :categories="allCategories"
      :selected-category="selectedCategory"
      @select="setSelectedCategory"
    />
    
    <TagFilter
      :tags="allTags"
      :selected-tag="selectedTag"
      @select="setSelectedTag"
    />
    
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
        v-for="(article, index) in filteredArticles"
        :key="article.id"
        :article="article"
        class="scale-animation"
        :style="{ animationDelay: `${index * 0.1}s` }"
      />
    </div>

    <div v-if="filteredArticles.length === 0" class="no-results">
      <p>没有找到匹配的文章</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from '../store'
import ArticleCard from '../components/article/ArticleCard.vue'
import CategoryFilter from '../components/article/CategoryFilter.vue'
import TagFilter from '../components/article/TagFilter.vue'

const store = useStore()

const allCategories = computed(() => store.allCategories)
const allTags = computed(() => store.allTags)
const filteredArticles = computed(() => store.filteredArticles)
const searchQuery = computed({
  get: () => store.searchQuery,
  set: (val) => store.setSearchQuery(val)
})

function setSelectedCategory(category) {
  store.setSelectedCategory(category)
}

function setSelectedTag(tag) {
  store.setSelectedTag(tag)
}

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
  text-align: center;
}

.filter-section {
  display: flex;
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
  flex-wrap: wrap;
}

.search-bar {
  flex: 1;
  min-width: 300px;
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
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: $spacing-xl;
  margin-bottom: $spacing-xl;
}

.no-results {
  text-align: center;
  padding: $spacing-xl;
  color: var(--text-secondary);
  font-size: $font-size-lg;
}
</style>