<template>
  <router-link :to="`/blog/article/${article.id}`" class="article-card">
    <div class="card-cover" :style="{ backgroundColor: article.heroColor || '#667eea' }">
      <div class="cover-gradient"></div>
      <span class="cover-category">{{ article.category }}</span>
    </div>
    <div class="card-content">
      <h3 class="article-title">{{ article.title }}</h3>
      <p class="article-description">{{ article.description }}</p>
      <div class="article-footer">
        <div class="article-tags">
          <span v-for="tag in article.tags.slice(0, 3)" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
        <span class="article-date">{{ formatDate(article.date) }}</span>
      </div>
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
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: $border-radius;
  box-shadow: var(--shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  overflow: hidden;
  height: 100%;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: var(--accent-color);

    .card-cover {
      height: 160px;
    }

    .article-title {
      color: var(--accent-color);
    }
  }
}

.card-cover {
  height: 180px;
  position: relative;
  transition: height 0.3s ease;
  overflow: hidden;
}

.cover-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
}

.cover-category {
  position: absolute;
  top: $spacing-md;
  right: $spacing-md;
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-primary);
  padding: $spacing-xs $spacing-sm;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.card-content {
  flex: 1;
  padding: $spacing-md;
  display: flex;
  flex-direction: column;
}

.article-title {
  font-size: $font-size-lg;
  margin-bottom: $spacing-sm;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-description {
  color: var(--text-secondary);
  margin-bottom: $spacing-sm;
  line-height: 1.5;
  font-size: $font-size-sm;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.article-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-sm;
  margin-top: auto;
}

.article-tags {
  display: flex;
  gap: $spacing-xs;
  flex-wrap: wrap;
  flex: 1;
}

.tag {
  padding: 2px $spacing-sm;
  background-color: var(--bg-secondary);
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 12px;
}

.article-date {
  color: var(--text-secondary);
  font-size: 12px;
  white-space: nowrap;
}
</style>