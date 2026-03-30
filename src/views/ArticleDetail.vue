<template>
  <div class="article-detail">
    <div v-if="article" class="article-container">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <span class="article-date">{{ formatDate(article.date) }}</span>
        <span class="article-tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </span>
      </div>
      <div class="article-content" v-html="article.content"></div>
      
      <div class="article-navigation">
        <router-link
          v-if="prevArticle"
          :to="`/blog/article/${prevArticle.id}`"
          class="nav-link prev"
        >
          ← {{ prevArticle.title }}
        </router-link>
        <router-link
          v-if="nextArticle"
          :to="`/blog/article/${nextArticle.id}`"
          class="nav-link next"
        >
          {{ nextArticle.title }} →
        </router-link>
      </div>
    </div>
    <div v-else class="loading">
      <p>加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '../store'
import { formatDate } from '../utils/date'

const route = useRoute()
const store = useStore()
const article = ref(null)

const articles = computed(() => store.articles)
const currentIndex = computed(() => articles.value.findIndex(a => a.id === route.params.id))

const prevArticle = computed(() => {
  if (currentIndex.value === -1 || currentIndex.value === articles.value.length - 1) return null
  return articles.value[currentIndex.value + 1]
})

const nextArticle = computed(() => {
  if (currentIndex.value <= 0) return null
  return articles.value[currentIndex.value - 1]
})

onMounted(async () => {
  const { loadArticles, loadArticle } = await import('../utils/markdown')
  const articles = await loadArticles()
  store.setArticles(articles)
  article.value = await loadArticle(route.params.id)
})
</script>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.article-detail {
  padding: $spacing-xl 0;
}

.article-container {
  max-width: 800px;
  margin: 0 auto;
}

.article-title {
  font-size: $font-size-xxl;
  margin-bottom: $spacing-md;
  color: var(--text-primary);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
  color: var(--text-secondary);
  font-size: $font-size-sm;
}

.article-tags {
  display: flex;
  gap: $spacing-sm;
}

.tag {
  background-color: var(--bg-secondary);
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius;
  font-size: $font-size-sm;
}

.article-content {
  font-size: $font-size-md;
  line-height: 1.8;
  color: var(--text-primary);

  :deep(h2) {
    font-size: $font-size-xl;
    margin: $spacing-xl 0 $spacing-md;
    color: var(--text-primary);
  }

  :deep(h3) {
    font-size: $font-size-lg;
    margin: $spacing-lg 0 $spacing-sm;
    color: var(--text-primary);
  }

  :deep(p) {
    margin-bottom: $spacing-md;
  }

  :deep(pre) {
    background-color: var(--bg-secondary);
    padding: $spacing-md;
    border-radius: $border-radius;
    overflow-x: auto;
    margin-bottom: $spacing-md;
  }

  :deep(code) {
    background-color: var(--bg-secondary);
    padding: $spacing-xs $spacing-sm;
    border-radius: 4px;
    font-size: $font-size-sm;
  }

  :deep(pre code) {
    background-color: transparent;
    padding: 0;
  }

  :deep(ul),
  :deep(ol) {
    margin-bottom: $spacing-md;
    padding-left: $spacing-lg;
  }

  :deep(li) {
    margin-bottom: $spacing-sm;
  }

  :deep(blockquote) {
    border-left: 4px solid var(--accent-color);
    padding-left: $spacing-md;
    margin-bottom: $spacing-md;
    color: var(--text-secondary);
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: $border-radius;
    margin: $spacing-md 0;
  }
}

.article-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: $spacing-xl;
  padding-top: $spacing-lg;
  border-top: 1px solid var(--border-color);
}

.nav-link {
  flex: 1;
  padding: $spacing-md;
  background-color: var(--bg-secondary);
  border-radius: $border-radius;
  transition: $transition;
  color: var(--text-primary);

  &:hover {
    background-color: var(--bg-primary);
  }

  &.prev {
    text-align: left;
  }

  &.next {
    text-align: right;
  }
}

.loading {
  text-align: center;
  padding: $spacing-xl;
  color: var(--text-secondary);
}
</style>