<template>
  <div class="links-page">
    <h1 class="page-title">友情链接</h1>
    
    <div class="links-grid">
      <a
        v-for="link in links"
        :key="link.url"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="link-card"
      >
        <div class="link-icon">🔗</div>
        <h3 class="link-name">{{ link.name }}</h3>
        <p class="link-description">{{ link.description }}</p>
        <span v-if="link.category" class="link-category">{{ link.category }}</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const links = ref([])

onMounted(async () => {
  try {
    const response = await import('../data/links.json')
    links.value = response.default.links
  } catch (error) {
    console.log('使用默认友链数据')
    links.value = [
      {
        name: '示例网站',
        url: 'https://example.com',
        description: '这是一个示例网站',
        category: '技术'
      }
    ]
  }
})
</script>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.links-page {
  padding: $spacing-xl 0;
}

.page-title {
  font-size: $font-size-xxl;
  margin-bottom: $spacing-xl;
  text-align: center;
  color: var(--text-primary);
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $spacing-lg;
}

.link-card {
  display: block;
  padding: $spacing-lg;
  background: var(--bg-primary);
  border-radius: $border-radius;
  box-shadow: var(--shadow);
  transition: $transition;
  text-decoration: none;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
  }
}

.link-icon {
  font-size: $font-size-xl;
  margin-bottom: $spacing-md;
}

.link-name {
  font-size: $font-size-lg;
  margin-bottom: $spacing-sm;
  color: var(--text-primary);
}

.link-description {
  color: var(--text-secondary);
  margin-bottom: $spacing-md;
  line-height: 1.6;
}

.link-category {
  display: inline-block;
  padding: $spacing-xs $spacing-sm;
  background-color: var(--bg-secondary);
  border-radius: $border-radius;
  font-size: $font-size-sm;
  color: var(--text-secondary);
}
</style>