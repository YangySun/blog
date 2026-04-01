<template>
  <div class="toc" v-if="headings.length > 0">
    <h3 class="toc-title">目录</h3>
    <ul class="toc-list">
      <li
        v-for="(heading, index) in headings"
        :key="index"
        :class="['toc-item', { active: activeIndex === index }]"
      >
        <a
          href="javascript:void(0)"
          @click="scrollToHeading(heading.id)"
          :style="{ paddingLeft: `${(heading.level - 1) * 16}px` }"
        >
          {{ heading.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  headings: {
    type: Array,
    default: () => []
  }
})

const activeIndex = ref(-1)

function scrollToHeading(id) {
  const element = document.getElementById(id)
  if (element) {
    const headerOffset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

function updateActiveHeading() {
  if (!props.headings || props.headings.length === 0) return

  const headingIds = props.headings.map(h => h.id)
  const elements = headingIds.map(id => document.getElementById(id)).filter(Boolean)

  let current = -1
  const scrollY = window.scrollY
  const windowHeight = window.innerHeight

  elements.forEach((el, index) => {
    const rect = el.getBoundingClientRect()
    const offsetTop = rect.top + scrollY

    if (scrollY >= offsetTop - 150) {
      current = index
    }
  })

  activeIndex.value = current
}

let ticking = false
function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateActiveHeading()
      ticking = false
    })
    ticking = true
  }
}

watch(() => props.headings, () => {
  setTimeout(updateActiveHeading, 100)
}, { immediate: true })

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  updateActiveHeading()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped lang="scss">
@import '../../assets/styles/variables.scss';

.toc {
  width: 260px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: $border-radius;
  padding: $spacing-lg;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
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

  &:hover {
    background: var(--bg-secondary);
    color: var(--accent-color);
  }
}

.toc-item.active a {
  background: var(--accent-color);
  color: white;
  font-weight: 500;
}

@media (max-width: 1200px) {
  .toc {
    display: none;
  }
}
</style>