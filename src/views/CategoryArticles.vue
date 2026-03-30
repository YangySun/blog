<template>
  <div class="category-articles-page">
    <h1 class="page-title">{{ selectedCategory }}分类</h1>
    
    <div class="category-tabs">
      <button
        v-for="category in allCategories"
        :key="category"
        @click="switchCategory(category)"
        :class="['tab-btn', { active: selectedCategory === category }]"
      >
        {{ category }}
      </button>
    </div>
    
    <div class="articles-list">
      <ArticleCard
        v-for="(article, index) in filteredArticles"
        :key="article.id"
        :article="article"
        class="scale-animation"
        :style="{ animationDelay: `${index * 0.1}s` }"
      />
    </div>
    
    <div v-if="filteredArticles.length === 0" class="no-results">
      <p>该分类下暂无文章</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '../store'
import ArticleCard from '../components/article/ArticleCard.vue'

const route = useRoute()
const store = useStore()
const selectedCategory = ref('')

const allCategories = computed(() => store.allCategories)

const filteredArticles = computed(() => {
  if (!selectedCategory.value) return []
  return store.articles.filter(article => article.category === selectedCategory.value)
})

function switchCategory(category) {
  selectedCategory.value = category
}

watch(() => route.params.name, (newName) => {
  selectedCategory.value = decodeURIComponent(newName)
}, { immediate: true })

onMounted(async () => {
  const { loadArticles } = await import('../utils/markdown')
  if (store.articles.length === 0) {
    const articles = await loadArticles()
    store.setArticles(articles)
  }
  selectedCategory.value = decodeURIComponent(route.params.name)
})
</script>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.category-articles-page {
  padding: $spacing-xl 0;
}

.page-title {
  font-size: $font-size-xxl;
  margin-bottom: $spacing-lg;
  color: var(--text-primary);
  text-align: center;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-bottom: $spacing-xl;
  justify-content: center;
}

.tab-btn {
  padding: $spacing-sm $spacing-md;
  border: 1px solid var(--border-color);
  border-radius: $border-radius;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: $font-size-sm;
  cursor: pointer;
  transition: $transition;

  &:hover {
    background: var(--bg-secondary);
    border-color: var(--accent-color);
  }

  &.active {
    background: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
  }
}

.articles-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: $spacing-xl;
}

.no-results {
  text-align: center;
  padding: $spacing-xl;
  color: var(--text-secondary);
  font-size: $font-size-lg;
}
</style>