import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStore = defineStore('main', () => {
  const theme = ref(localStorage.getItem('theme') || 'light')
  const articles = ref([])
  const searchQuery = ref('')

  const isDark = computed(() => theme.value === 'dark')

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  function setArticles(data) {
    articles.value = data
  }

  function setSearchQuery(query) {
    searchQuery.value = query
  }

  const filteredArticles = computed(() => {
    if (!searchQuery.value) return articles.value
    const query = searchQuery.value.toLowerCase()
    return articles.value.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query)
    )
  })

  return {
    theme,
    isDark,
    articles,
    searchQuery,
    filteredArticles,
    toggleTheme,
    setArticles,
    setSearchQuery
  }
})