import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStore = defineStore('main', () => {
  const theme = ref(localStorage.getItem('theme') || 'light')
  const articles = ref([])
  const searchQuery = ref('')
  const selectedCategory = ref('all')
  const selectedTag = ref('all')

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

  function setSelectedCategory(category) {
    selectedCategory.value = category
  }

  function setSelectedTag(tag) {
    selectedTag.value = tag
  }

  const allCategories = computed(() => {
    const categories = new Set(articles.value.map(a => a.category).filter(Boolean))
    return ['all', ...Array.from(categories)]
  })

  const allTags = computed(() => {
    const tags = new Set(articles.value.flatMap(a => a.tags || []))
    return ['all', ...Array.from(tags)]
  })

  const filteredArticles = computed(() => {
    let filtered = articles.value

    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory.value)
    }

    if (selectedTag.value !== 'all') {
      filtered = filtered.filter(article => article.tags && article.tags.includes(selectedTag.value))
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
      )
    }

    return filtered
  })

  return {
    theme,
    isDark,
    articles,
    searchQuery,
    selectedCategory,
    selectedTag,
    allCategories,
    allTags,
    filteredArticles,
    toggleTheme,
    setArticles,
    setSearchQuery,
    setSelectedCategory,
    setSelectedTag
  }
})