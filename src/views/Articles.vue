<template>
  <div class="articles-page">
    <div class="page-header">
      <h1 class="page-title">文章列表</h1>
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 搜索文章..."
          class="search-input"
        />
      </div>
    </div>
    
    <div class="articles-timeline">
      <div
        v-for="(article, index) in filteredArticles"
        :key="article.id"
        class="timeline-item scale-animation"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        <div class="timeline-marker">
          <div class="marker-dot"></div>
          <div class="marker-line"></div>
        </div>
        <router-link :to="`/blog/article/${article.id}`" class="article-card">
          <div class="article-meta">
            <span class="article-date">📅 {{ formatDate(article.date) }}</span>
            <span class="article-category">📁 {{ article.category }}</span>
          </div>
          <h2 class="article-title">{{ article.title }}</h2>
          <p class="article-description">{{ article.description }}</p>
          <div class="article-tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </router-link>
      </div>
    </div>

    <div v-if="filteredArticles.length === 0" class="no-results">
      <div class="no-results-icon">📭</div>
      <p>没有找到匹配的文章</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from '../store'
import { formatDate } from '../utils/date'

const store = useStore()

const filteredArticles = computed(() => store.filteredArticles)
const searchQuery = computed({
  get: () => store.searchQuery,
  set: (val) => store.setSearchQuery(val)
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

.articles-page {
  padding: $spacing-xl 0;
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: $spacing-xxl;
}

.page-title {
  font-size: $font-size-xxl;
  margin-bottom: $spacing-lg;
  color: var(--text-primary);
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, var(--accent-color), var(--accent-hover));
    border-radius: 2px;
  }
}

.search-bar {
  margin-top: $spacing-lg;
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: $spacing-md $spacing-lg;
  border: 2px solid var(--border-color);
  border-radius: 50px;
  font-size: $font-size-md;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: $transition;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.1);
  }

  &::placeholder {
    color: var(--text-secondary);
  }
}

.articles-timeline {
  position: relative;
  padding-left: $spacing-xl;
}

.articles-timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    180deg,
    var(--accent-color) 0%,
    var(--border-color) 100%
  );
}

.timeline-item {
  position: relative;
  margin-bottom: $spacing-lg;
  padding-left: $spacing-lg;
}

.timeline-marker {
  position: absolute;
  left: -2px;
  top: 24px;
  z-index: 1;
}

.marker-dot {
  width: 16px;
  height: 16px;
  background: var(--accent-color);
  border: 3px solid var(--bg-primary);
  border-radius: 50%;
  box-shadow: 0 0 0 2px var(--accent-color);
}

.marker-line {
  display: none;
}

.article-card {
  display: block;
  padding: $spacing-lg;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: $border-radius;
  box-shadow: $shadow;
  transition: $transition;
  text-decoration: none;

  &:hover {
    transform: translateX(8px);
    box-shadow: $shadow-hover;
    border-color: var(--accent-color);
  }
}

.article-meta {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-sm;
  font-size: $font-size-sm;
}

.article-date,
.article-category {
  color: var(--text-secondary);
}

.article-title {
  font-size: $font-size-xl;
  margin-bottom: $spacing-sm;
  color: var(--text-primary);
  transition: $transition;

  .article-card:hover & {
    color: var(--accent-color);
  }
}

.article-description {
  color: var(--text-secondary);
  margin-bottom: $spacing-md;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.tag {
  padding: $spacing-xs $spacing-sm;
  background: var(--bg-secondary);
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: $font-size-sm;
  transition: $transition;

  .article-card:hover & {
    background: var(--accent-color);
    color: white;
  }
}

.no-results {
  text-align: center;
  padding: $spacing-xxl;
  color: var(--text-secondary);
}

.no-results-icon {
  font-size: 64px;
  margin-bottom: $spacing-md;
}

@media (max-width: 768px) {
  .articles-page {
    padding: $spacing-md;
  }

  .articles-timeline {
    padding-left: $spacing-md;
  }

  .article-meta {
    flex-direction: column;
    gap: $spacing-xs;
  }
}
</style>