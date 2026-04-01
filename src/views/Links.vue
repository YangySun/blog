<template>
  <div class="links-page">
    <div class="links-container">
      <header class="links-header">
        <h1 class="page-title">友情链接</h1>
        <p class="page-subtitle">交换友链可以在留言区留言</p>
      </header>

      <div class="links-grid" v-if="links.length > 0">
        <a
          v-for="link in links"
          :key="link.url"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="link-card"
        >
          <div class="link-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <div class="link-content">
            <h3 class="link-name">{{ link.name }}</h3>
            <p class="link-description">{{ link.description }}</p>
          </div>
          <span v-if="link.category" class="link-category">{{ link.category }}</span>
        </a>
      </div>

      <div v-else class="no-results">
        <p>暂无友链</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLoadingStore } from '../store/loading'

const loading = useLoadingStore()
const links = ref([])

onMounted(async () => {
  try {
    const response = await import('../data/links.json')
    links.value = response.default.links
  } catch (error) {
    console.log('使用默认友链数据')
    links.value = []
  }
  loading.finish('加载完成!')
})
</script>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.links-page {
  @include page-container;
}

.links-container {
  max-width: 900px;
  margin: 0 auto;
}

.links-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: $spacing-sm;
}

.page-subtitle {
  font-size: $font-size-lg;
  color: var(--text-secondary);
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $spacing-lg;
}

.link-card {
  display: flex;
  flex-direction: column;
  padding: $spacing-lg;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: $shadow;
  transition: $transition;
  text-decoration: none;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent-color), var(--accent-hover));
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-hover;

    &::before {
      transform: scaleX(1);
    }

    .link-icon {
      background: var(--accent-color);
      color: white;
    }
  }
}

.link-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: 12px;
  color: var(--text-secondary);
  margin-bottom: $spacing-md;
  transition: $transition;

  svg {
    width: 24px;
    height: 24px;
  }
}

.link-content {
  flex: 1;
}

.link-name {
  font-size: $font-size-lg;
  color: var(--text-primary);
  margin-bottom: $spacing-sm;
}

.link-description {
  color: var(--text-secondary);
  font-size: $font-size-sm;
  line-height: 1.6;
  margin-bottom: $spacing-md;
}

.link-category {
  display: inline-block;
  align-self: flex-start;
  padding: $spacing-xs $spacing-sm;
  background: var(--bg-secondary);
  border-radius: $border-radius;
  font-size: 12px;
  color: var(--text-secondary);
}

.no-results {
  @include no-results;
}
</style>