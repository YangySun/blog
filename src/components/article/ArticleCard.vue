<template>
  <router-link :to="`/blog/article/${article.id}`" class="article-card">
    <h3 class="article-title">{{ article.title }}</h3>
    <p class="article-description">{{ article.description }}</p>
    <div class="article-meta">
      <span class="article-date">{{ formatDate(article.date) }}</span>
      <span class="article-tags">
        <span v-for="tag in article.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </span>
    </div>
  </router-link>
</template>

<script setup>
import { formatDate } from '../../utils/date'

defineProps({
  article: {
    type: Object,
    required: true
  }
})
</script>

<style scoped lang="scss">
@import '../../assets/styles/variables.scss';

.article-card {
  display: block;
  padding: $spacing-lg;
  background: var(--bg-primary);
  border-radius: $border-radius;
  box-shadow: var(--shadow);
  transition: $transition;
  text-decoration: none;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
  }
}

.article-title {
  font-size: $font-size-lg;
  margin-bottom: $spacing-sm;
  color: var(--text-primary);
}

.article-description {
  color: var(--text-secondary);
  margin-bottom: $spacing-md;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  font-size: $font-size-sm;
}

.article-date {
  color: var(--text-secondary);
}

.article-tags {
  display: flex;
  gap: $spacing-xs;
  flex-wrap: wrap;
}

.tag {
  padding: $spacing-xs $spacing-sm;
  background-color: var(--bg-secondary);
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: $font-size-sm;
}
</style>