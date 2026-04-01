<template>
  <div class="articles-page">
    <div class="page-header">
      <h1 class="page-title">文章列表</h1>
      <div class="search-wrapper">
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
        class="timeline-item"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        <div class="timeline-marker">
          <div class="marker-dot"></div>
        </div>
        <router-link :to="`/blog/article/${article.id}`" class="article-card">
          <div class="article-meta">
            <span class="article-date">{{ formatDate(article.date) }}</span>
            <span class="article-category">{{ article.category }}</span>
          </div>
          <h2 class="article-title">{{ article.title }}</h2>
          <p class="article-description">{{ article.description }}</p>
          <div class="article-tags">
            <span v-for="tag in article.tags.slice(0, 3)" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </router-link>
      </div>
    </div>

    <div v-if="filteredArticles.length === 0" class="no-results">
      <p>没有找到匹配的文章</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from '../store'
import { useLoadingStore } from '../store/loading'
import { formatDate } from '../utils/date'

const store = useStore()
const loading = useLoadingStore()

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
  loading.finish('加载完成!')
})
</script>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.articles-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 24px;
  color: var(--text-primary);
  font-weight: 700;
}

.search-wrapper {
  display: flex;
  justify-content: center;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px 20px;
  border: 2px solid var(--border-color);
  border-radius: 50px;
  font-size: 1rem;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.2s ease;

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
  padding-left: 40px;

  &::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, var(--accent-color), var(--border-color));
  }
}

.timeline-item {
  position: relative;
  margin-bottom: 32px;
}

.timeline-marker {
  position: absolute;
  left: -40px;
  top: 20px;
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

.article-card {
  display: block;
  padding: 24px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    transform: translateX(8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: var(--accent-color);

    .article-title {
      color: var(--accent-color);
    }

    .marker-dot {
      transform: scale(1.2);
    }
  }
}

.article-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 14px;
}

.article-date,
.article-category {
  color: var(--text-secondary);
}

.article-title {
  font-size: 1.5rem;
  margin-bottom: 8px;
  color: var(--text-primary);
  transition: color 0.2s ease;
}

.article-description {
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-tags {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 4px 12px;
  background: var(--bg-secondary);
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 13px;
  transition: all 0.2s ease;

  .article-card:hover & {
    background: var(--accent-color);
    color: white;
  }
}

.no-results {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-secondary);
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .articles-page {
    padding: 20px 16px;
  }

  .articles-timeline {
    padding-left: 30px;
  }

  .timeline-marker {
    left: -30px;
  }

  .article-meta {
    flex-direction: column;
    gap: 4px;
  }
}
</style>