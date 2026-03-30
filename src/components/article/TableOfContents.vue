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
          :href="`#${heading.id}`"
          @click.prevent="scrollToHeading(heading.id, index)"
          :style="{ paddingLeft: `${heading.level * 16}px` }"
        >
          {{ heading.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const headings = ref([])
const activeHeading = ref(-1)

function extractHeadings() {
  const parser = new DOMParser()
  const doc = parser.parseFromString(props.content, 'text/html')
  const headingElements = doc.documentElement.querySelectorAll('h1, h2, h3, h4, h5, h6')
  
  headings.value = Array.from(headingElements).map((el, index) => {
    const text = el.textContent.trim()
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5]/g, '')
    el.id = id
    return {
      id,
      text,
      level: parseInt(el.tagName.charAt(1))
    }
  })
}

function scrollToHeading(id, index) {
  activeHeading.value = index
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function handleScroll() {
  const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id
        const index = headings.value.findIndex(h => h.id === id)
        if (index !== -1) {
          activeHeading.value = index
        }
      }
    })
  }, { threshold: 0.5 })

  headingElements.forEach(el => observer.observe(el))
}

onMounted(() => {
  extractHeadings()
  setTimeout(handleScroll, 100)
})

onUnmounted(() => {
  const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  headingElements.forEach(el => {
    el.removeAttribute('id')
  })
})
</script>

<style scoped lang="scss">
@import '../../assets/styles/variables.scss';

.toc {
  position: sticky;
  top: 80px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: $border-radius;
  padding: $spacing-lg;
  box-shadow: var(--shadow);
  max-width: 300px;
  z-index: 50;
  transition: $transition;
}

.toc-title {
  font-size: $font-size-lg;
  margin-bottom: $spacing-md;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-color);
  padding-bottom: $spacing-sm;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin-bottom: $spacing-sm;
}

.toc-item a {
  display: block;
  color: var(--text-secondary);
  text-decoration: none;
  padding: $spacing-xs 0;
  border-radius: $border-radius;
  transition: $transition;
  font-size: $font-size-sm;
  line-height: 1.5;

  &:hover {
    background: var(--bg-secondary);
    color: var(--accent-color);
  }

  &.active {
    background: var(--accent-color);
    color: white;
    font-weight: 500;
  }
}

@media (max-width: 768px) {
  .toc {
    display: none;
  }
}
</style>