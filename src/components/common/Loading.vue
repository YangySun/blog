<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="loadingStore.isLoading" class="loading-overlay">
        <div class="loading-content">
          <div class="loading-logo">眠羊</div>
          <div class="progress-container">
            <div class="progress-bar" :style="{ width: loadingStore.progress + '%' }"></div>
          </div>
          <div class="progress-text">{{ loadingStore.progress }}%</div>
          <div class="loading-tips">{{ loadingStore.tip }}</div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useLoadingStore } from '../../store/loading'

const loadingStore = useLoadingStore()
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-logo {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 40px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.98); }
}

.progress-container {
  width: 300px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
  margin: 0 auto 16px;
}

.progress-bar {
  height: 100%;
  background: white;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  font-variant-numeric: tabular-nums;
}

.loading-tips {
  font-size: 0.9rem;
  opacity: 0.8;
  min-height: 1.5em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
