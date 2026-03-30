<template>
  <div class="tag-articles-page">
    <h1 class="page-title">{{ selectedTag }}标签</h1>
    
    <div class="tag-tabs">
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="switchTag(tag)"
        :class="['tab-btn', { active: selectedTag === tag }]"
      >
        {{ tag }}
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
      <p>该标签下暂无文章</p>
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
const selectedTag = ref('')

const allTags = computed(() => store.allTags.filter(tag => tag !== 'all'))

const filteredArticles = computed(() => {
  if (!selectedTag.value) return []
  return store.articles.filter(article => 
    article.tags && article.tags.includes(selectedTag.value)
  )
})

function switchTag(tag) {
  selectedTag.value = tag
}

watch(() => route.params.name, (newName) => {
  selectedTag.value = decodeURIComponent(newName)
}, { immediate: true })

onMounted(async () => {
  const { loadArticles } = await import('../utils/markdown')
  if (store.articles.length === 0) {
    const articles = await loadArticles()
    store.setArticles(articles)
  }
  selectedTag.value = decodeURIComponent(route.params.name)
})
</script>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.tag-articles-page {
  padding: $spacing-xl 0;
}

.page-title {
  font-size: $font-size-xxl;
  margin-bottom: $spacing-lg;
  color: var(--text-primary);
  text-align: center;
}

.tag-tabs {
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