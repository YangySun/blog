<template>
  <div class="tags-page">
    <h1 class="page-title">标签</h1>
    
    <div v-if="tags.length > 0" class="tags-cloud">
      <router-link
        v-for="tag in tags"
        :key="tag.name"
        :to="`/blog/tag/${encodeURIComponent(tag.name)}`"
        class="tag-item"
        :style="{ fontSize: `${tag.size}px` }"
      >
        {{ tag.name }}
        <span class="tag-count">{{ tag.count }}</span>
      </router-link>
    </div>
    
    <div v-else class="no-results">
      <p>暂无标签</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from '../store'

const store = useStore()

const tagsWithCount = computed(() => {
  const counts = {}
  store.articles.forEach(article => {
    if (article.tags && Array.isArray(article.tags)) {
      article.tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1
      })
    }
  })
  return counts
})

const tags = computed(() => {
  const tagArray = Object.entries(tagsWithCount.value).map(([name, count]) => ({
    name,
    count,
    size: Math.max(14, Math.min(32, 14 + count * 4))
  }))
  return tagArray.sort((a, b) => b.count - a.count)
})

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

.tags-page {
  padding: $spacing-xl 0;
}

.page-title {
  font-size: $font-size-xxl;
  margin-bottom: $spacing-xl;
  color: var(--text-primary);
  text-align: center;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
  justify-content: center;
  padding: $spacing-lg;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: $border-radius;
  color: var(--text-primary);
  text-decoration: none;
  transition: $transition;

  &:hover {
    background: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
  }
}

.tag-count {
  font-size: 12px;
  padding: 2px 6px;
  background: var(--bg-secondary);
  border-radius: 10px;
  color: var(--text-secondary);
}

.tag-item:hover .tag-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.no-results {
  text-align: center;
  padding: $spacing-xl;
  color: var(--text-secondary);
  font-size: $font-size-lg;
}
</style>