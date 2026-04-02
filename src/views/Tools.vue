<template>
  <div class="tools-container">
    <div class="page-header">
      <h1 class="page-title">在线工具箱</h1>
      <p class="page-subtitle">简单好用的开发辅助工具，提高工作效率</p>
    </div>

    <div class="tools-grid">
      <div 
        v-for="tool in tools" 
        :key="tool.id" 
        class="tool-card"
        @click="goToTool(tool.path)"
      >
        <div class="tool-icon">
          <component :is="getIconComponent(tool.icon)" />
        </div>
        <div class="tool-info">
          <h3 class="tool-name">{{ tool.name }}</h3>
          <p class="tool-description">{{ tool.description }}</p>
        </div>
        <div class="tool-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import toolsData from '../data/tools.json'

const router = useRouter()
const tools = ref(toolsData)

const goToTool = (path) => {
  router.push(path)
}

// 定义黑白风格的 SVG 图标
const getIconComponent = (iconName) => {
  const icons = {
    json: h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('polyline', { points: '16 18 22 12 16 6' }),
      h('polyline', { points: '8 6 2 12 8 18' })
    ]),
    base64: h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('polyline', { points: '14 2 14 8 20 8' }),
      h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
      h('line', { x1: '16', y1: '17', x2: '8', y2: '17' }),
      h('polyline', { points: '10 9 9 9 8 9' })
    ]),
    link: h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' }),
      h('path', { d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' })
    ]),
    clock: h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('polyline', { points: '12 6 12 12 16 14' })
    ]),
    palette: h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('circle', { cx: '13.5', cy: '6.5', r: '.5' }),
      h('circle', { cx: '17.5', cy: '10.5', r: '.5' }),
      h('circle', { cx: '8.5', cy: '7.5', r: '.5' }),
      h('circle', { cx: '6.5', cy: '12.5', r: '.5' }),
      h('path', { d: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.71-.77 1.71-1.71 0-.43-.17-.83-.46-1.13-.29-.29-.46-.69-.46-1.12 0-.94.77-1.71 1.71-1.71H16c3.31 0 6-2.69 6-6 0-5.5-4.5-10-10-10z' })
    ])
  }
  return icons[iconName] || icons.json
}
</script>

<style scoped>
.tools-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-title {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 12px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #718096;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.tool-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
  border-color: #2d3748;
}

.tool-icon {
  min-width: 56px;
  height: 56px;
  background: #f7fafc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2d3748;
  transition: all 0.3s ease;
}

.tool-card:hover .tool-icon {
  background: #2d3748;
  color: white;
}

.tool-info {
  flex: 1;
}

.tool-name {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 6px;
  font-weight: 600;
}

.tool-description {
  font-size: 0.9rem;
  color: #718096;
  line-height: 1.5;
}

.tool-arrow {
  color: #cbd5e0;
  transition: transform 0.3s ease, color 0.3s ease;
}

.tool-card:hover .tool-arrow {
  transform: translateX(4px);
  color: #2d3748;
}

@media (max-width: 640px) {
  .page-title {
    font-size: 2rem;
  }
  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>
