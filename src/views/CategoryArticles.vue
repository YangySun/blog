<template>
  <div class="category-articles-page">
    <h1 class="page-title">{{ selectedCategory }}</h1>
    <div class="tabs">
      <button
        v-for="category in allCategories"
        :key="category"
        @click="selectedCategory = category"
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
const filteredArticles = computed(() => 
  store.articles.filter(article => article.category === selectedCategory.value)
)

watch(() => route.params.name, (name) => {
  selectedCategory.value = decodeURIComponent(name)
}, { immediate: true })

onMounted(async () => {
  if (store.articles.length === 0) {
    const { loadArticles } = await import('../utils/markdown')
    store.setArticles(await loadArticles())
  }
  selectedCategory.value = decodeURIComponent(route.params.name)
})
</script>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.category-articles-page {
  @include page-container;
}

.page-title {
  @include page-title;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-bottom: $spacing-xl;
  justify-content: center;
}

.tab-btn {
  @include tab-btn;
}

.articles-list {
  @include card-grid;
}

.no-results {
  @include no-results;
}
</style>