<template>
  <div class="home">
    <section class="hero shine-effect">
      <h1 class="hero-title float-animation">欢迎来到我的博客</h1>
      <p class="hero-subtitle">分享技术，记录生活</p>
    </section>

    <section class="articles-section">
      <div class="section-tabs">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="['tab-btn', { active: selectedCategory === category }]"
        >
          {{ category }}
        </button>
      </div>
      <div class="articles-grid">
        <ArticleCard
          v-for="(article, index) in filteredArticles"
          :key="article.id"
          :article="article"
          class="scale-animation"
          :style="{ animationDelay: `${index * 0.1}s` }"
        />
      </div>
      <div class="view-all">
        <router-link to="/blog/articles" class="btn btn-primary glow-effect">
          查看全部文章
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from '../store'
import ArticleCard from '../components/article/ArticleCard.vue'

const store = useStore()
const latestArticles = ref([])
const selectedCategory = ref('全部')

const categories = computed(() => {
  const cats = new Set(latestArticles.value.map(a => a.category))
  return ['全部', ...Array.from(cats)]
})

const filteredArticles = computed(() => {
  if (selectedCategory.value === '全部') {
    return latestArticles.value.slice(0, 6)
  }
  return latestArticles.value
    .filter(a => a.category === selectedCategory.value)
    .slice(0, 6)
})

onMounted(async () => {
  const { loadArticles } = await import('../utils/markdown')
  const articles = await loadArticles()
  store.setArticles(articles)
  latestArticles.value = articles
})
</script>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.home {
  padding: $spacing-xl 0;
}

.hero {
  text-align: center;
  padding: $spacing-xxl 0;
  background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-hover) 100%);
  border-radius: $border-radius;
  margin-bottom: $spacing-xl;
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-title {
  font-size: $font-size-xxl;
  margin-bottom: $spacing-md;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: $font-size-lg;
  opacity: 0.95;
}

.articles-section {
  margin-bottom: $spacing-xl;
}

.section-tabs {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;
  flex-wrap: wrap;
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

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: $spacing-xl;
  margin-bottom: $spacing-xl;
}

.view-all {
  text-align: center;
  margin-top: $spacing-lg;
}

.view-all .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-md $spacing-xl;
  border-radius: $border-radius;
  font-size: $font-size-lg;
  font-weight: 500;
  transition: $transition;
  cursor: pointer;
  border: none;
  outline: none;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>