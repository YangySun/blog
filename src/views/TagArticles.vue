<template>
  <div class="tag-articles-page">
    <h1 class="page-title">{{ selectedTag }}</h1>
    <div class="tabs">
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="selectedTag = tag"
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
import { useLoadingStore } from '../store/loading'
import ArticleCard from '../components/article/ArticleCard.vue'

const route = useRoute()
const store = useStore()
const loading = useLoadingStore()
const selectedTag = ref('')

const allTags = computed(() => store.allTags)
const filteredArticles = computed(() => 
  store.articles.filter(article => article.tags?.includes(selectedTag.value))
)

watch(() => route.params.name, (name) => {
  selectedTag.value = decodeURIComponent(name)
}, { immediate: true })

onMounted(async () => {
  if (store.articles.length === 0) {
    const { loadArticles } = await import('../utils/markdown')
    store.setArticles(await loadArticles())
  }
  selectedTag.value = decodeURIComponent(route.params.name)
  loading.finish('加载完成!')
})
</script>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.tag-articles-page {
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