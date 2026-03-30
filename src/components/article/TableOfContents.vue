<template>
  <div class="toc" v-if="headings.length > 0">
    <h3 class="toc-title">目录</h3>
    <ul class="toc-list">
      <li
        v-for="(heading, index) in headings"
        :key="index"
        :class="['toc-item', { active: activeHeading === index }]"
      >
        <a
          href="javascript:void(0)"
          @click.prevent="$emit('navigate', heading.id)"
          :style="{ paddingLeft: `${(heading.level - 1) * 16}px` }"
        >
          {{ heading.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  headings: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['navigate'])

const activeHeading = ref(-1)

function updateActiveHeading() {
  const elements = document.querySelectorAll('.article-content h1, .article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6')
  
  let currentIndex = -1
  elements.forEach((el, index) => {
    const rect = el.getBoundingClientRect()
    if (rect.top < 120) {
      currentIndex = index
    }
  })
  
  activeHeading.value = currentIndex
}

watch(() => props.headings, () => {
  setTimeout(updateActiveHeading, 100)
})

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', updateActiveHeading)
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/variables.scss';

.toc {
  position: sticky;
  top: 80px;
  background: rgba(var(--bg-primary-rgb, 255, 255, 255), 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  border-radius: $border-radius;
  padding: $spacing-lg;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 280px;
  min-width: 200px;
  z-index: 50;
  transition: all 0.3s ease;

  &:hover {
    background: var(--bg-primary);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
}

.toc-title {
  font-size: $font-size-md;
  font-weight: 600;
  margin-bottom: $spacing-md;
  color: var(--text-primary);
  border-bottom: 2px solid var(--accent-color);
  padding-bottom: $spacing-sm;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin-bottom: 2px;
}

.toc-item a {
  display: block;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 13px;
  line-height: 1.4;
  cursor: pointer;
  opacity: 0.7;

  &:hover {
    background: var(--bg-secondary);
    color: var(--accent-color);
    opacity: 1;
    transform: translateX(4px);
  }

  &.active {
    background: var(--accent-color);
    color: white;
    font-weight: 500;
    opacity: 1;
  }
}

@media (max-width: 1024px) {
  .toc {
    display: none;
  }
}
</style>