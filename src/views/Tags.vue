<template>
  <div class="tags-page">
    <h1 class="page-title">标签</h1>
    <div class="tags-cloud">
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
    <div v-if="tags.length === 0" class="no-results">
      <p>暂无标签</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from '../store'
import { useLoadingStore } from '../store/loading'

const store = useStore()
const loading = useLoadingStore()

const tags = computed(() => {
  const counts = {}
  store.articles.forEach(article => {
    article.tags?.forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1
    })
  })
  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      size: Math.max(14, Math.min(32, 14 + count * 4))
    }))
    .sort((a, b) => b.count - a.count)
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

.tags-page {
  @include page-container;
}

.page-title {
  @include page-title;
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

    .tag-count {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
  }
}

.tag-count {
  font-size: 12px;
  padding: 2px 6px;
  background: var(--bg-secondary);
  border-radius: 10px;
  color: var(--text-secondary);
}

.no-results {
  @include no-results;
}
</style>