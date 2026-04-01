<template>
  <div class="floating-toc-wrapper" ref="wrapperRef">
    <div class="floating-toc" v-if="headings.length > 0" :class="{ 'is-fixed': isFixed }" :style="tocStyle">
      <div class="toc-header">
        <svg class="toc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 6h16M4 12h16M4 18h12"/>
        </svg>
        <span class="toc-title">目录</span>
        <span class="toc-count">{{ headings.length }}</span>
      </div>
      <div class="toc-content" ref="tocContentRef">
        <div
          v-for="(heading, index) in headings"
          :key="index"
          :class="['toc-item', { active: activeIndex === index }]"
          @click="scrollToHeading(heading)"
        >
          <span class="toc-indicator"></span>
          <span class="toc-link" :style="{ paddingLeft: `${(heading.level - 1) * 14 + 12}px` }">
            {{ heading.text }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'

const props = defineProps({
  headings: {
    type: Array,
    default: () => []
  }
})

const wrapperRef = ref(null)
const tocContentRef = ref(null)
const activeIndex = ref(-1)
const isFixed = ref(false)
const initialTop = ref(0)
const initialRight = ref(0)

const tocStyle = computed(() => {
  if (isFixed.value) {
    return {
      position: 'fixed',
      top: '80px',
      right: `${initialRight.value}px`,
      width: '260px'
    }
  }
  return {
    position: 'relative',
    top: 'auto',
    right: 'auto',
    width: '260px'
  }
})

function scrollToHeading(heading) {
  const element = document.getElementById(heading.id)
  if (element) {
    const rect = element.getBoundingClientRect()
    const absoluteTop = rect.top + window.pageYOffset
    const targetPosition = absoluteTop - 100

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    })
  }
}

function updateActiveHeading() {
  if (!props.headings || props.headings.length === 0) return

  const scrollY = window.scrollY
  let current = -1

  props.headings.forEach((heading, index) => {
    const el = document.getElementById(heading.id)
    if (el) {
      const rect = el.getBoundingClientRect()
      const absoluteTop = rect.top + window.pageYOffset
      if (scrollY >= absoluteTop - 150) {
        current = index
      }
    }
  })

  if (activeIndex.value !== current) {
    activeIndex.value = current
    scrollToActiveTocItem()
  }
}

function scrollToActiveTocItem() {
  if (!tocContentRef.value || activeIndex.value < 0) return

  const tocItems = tocContentRef.value.querySelectorAll('.toc-item')
  const activeItem = tocItems[activeIndex.value]
  
  if (activeItem) {
    const container = tocContentRef.value
    const itemTop = activeItem.offsetTop
    const itemHeight = activeItem.offsetHeight
    const containerHeight = container.clientHeight
    const scrollTop = container.scrollTop

    if (itemTop < scrollTop + 20) {
      container.scrollTo({
        top: itemTop - 20,
        behavior: 'smooth'
      })
    } else if (itemTop + itemHeight > scrollTop + containerHeight - 20) {
      container.scrollTo({
        top: itemTop + itemHeight - containerHeight + 20,
        behavior: 'smooth'
      })
    }
  }
}

function updatePosition() {
  if (!wrapperRef.value) return

  const rect = wrapperRef.value.getBoundingClientRect()

  if (!isFixed.value && initialTop.value === 0) {
    initialTop.value = rect.top + window.scrollY
    initialRight.value = window.innerWidth - rect.right
  }

  const triggerPoint = initialTop.value - 80
  isFixed.value = window.scrollY > triggerPoint
}

let ticking = false
function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updatePosition()
      updateActiveHeading()
      ticking = false
    })
    ticking = true
  }
}

function initPosition() {
  if (wrapperRef.value) {
    const rect = wrapperRef.value.getBoundingClientRect()
    initialTop.value = rect.top + window.scrollY
    initialRight.value = window.innerWidth - rect.right
    updatePosition()
  }
}

watch(() => props.headings, async () => {
  await nextTick()
  setTimeout(() => {
    initPosition()
    updateActiveHeading()
  }, 200)
}, { immediate: true })

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', initPosition)
  setTimeout(initPosition, 300)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', initPosition)
})
</script>

<style scoped lang="scss">
@import '../../assets/styles/variables.scss';

.floating-toc-wrapper {
  width: 260px;
  flex-shrink: 0;
  min-height: 1px;
}

.floating-toc {
  width: 260px;
  max-height: calc(100vh - 100px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.08),
    0 1px 2px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  overflow: hidden;
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.12),
      0 2px 4px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    transform: translateY(-2px);

    .toc-item:not(.active) .toc-link {
      filter: blur(0);
      opacity: 0.85;
    }
  }
}

.toc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%);

  .toc-icon {
    width: 16px;
    height: 16px;
    color: var(--accent-color);
  }

  .toc-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: 0.5px;
    flex: 1;
  }

  .toc-count {
    font-size: 11px;
    color: var(--text-secondary);
    background: var(--bg-secondary);
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: 500;
  }
}

.toc-content {
  max-height: 450px;
  overflow-y: auto;
  padding: 8px 0;
  position: relative;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 8px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, var(--accent-color) 0%, rgba(102, 126, 234, 0.5) 100%);
    border-radius: 4px;

    &:hover {
      background: var(--accent-color);
    }
  }
}

.toc-item {
  position: relative;
  cursor: pointer;
  transition: all 0.25s ease;
  margin: 2px 8px;
  border-radius: 8px;

  .toc-indicator {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    background: var(--accent-color);
    border-radius: 2px;
    transition: all 0.25s ease;
  }

  &.active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.08) 100%);

    .toc-indicator {
      height: 20px;
      box-shadow: 0 0 8px rgba(102, 126, 234, 0.4);
    }

    .toc-link {
      color: var(--accent-color);
      font-weight: 600;
      filter: blur(0);
      opacity: 1;
    }
  }

  &:not(.active) {
    .toc-link {
      color: var(--text-secondary);
      filter: blur(0.8px);
      opacity: 0.65;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.03);

      .toc-link {
        filter: blur(0);
        opacity: 1;
        color: var(--text-primary);
      }
    }
  }
}

.toc-link {
  display: block;
  padding: 10px 12px 10px 20px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-primary);
  transition: all 0.25s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 1400px) {
  .floating-toc-wrapper,
  .floating-toc {
    display: none;
  }
}
</style>