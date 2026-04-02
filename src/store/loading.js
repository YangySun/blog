import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)
  const progress = ref(0)
  const tip = ref('正在加载...')

  let progressTimer = null

  function start(tipText = '正在加载...') {
    if (progressTimer) {
      clearInterval(progressTimer)
    }
    
    isLoading.value = true
    progress.value = 0
    tip.value = tipText
    
    let currentProgress = 0
    progressTimer = setInterval(() => {
      if (currentProgress < 90) {
        currentProgress += Math.random() * 15
        progress.value = Math.min(Math.round(currentProgress), 90)
      }
    }, 200)
  }

  function setProgress(value, tipText) {
    progress.value = value
    if (tipText) {
      tip.value = tipText
    }
  }

  function finish(tipText = '加载完成!') {
    tip.value = tipText
    progress.value = 100
    
    if (progressTimer) {
      clearInterval(progressTimer)
      progressTimer = null
    }
    
    setTimeout(() => {
      isLoading.value = false
      progress.value = 0
    }, 500)
  }

  function fail(tipText = '加载失败...') {
    tip.value = tipText
    progress.value = 0
    
    if (progressTimer) {
      clearInterval(progressTimer)
      progressTimer = null
    }
    
    setTimeout(() => {
      isLoading.value = false
    }, 1500)
  }

  return {
    isLoading,
    progress,
    tip,
    start,
    setProgress,
    finish,
    fail
  }
})
