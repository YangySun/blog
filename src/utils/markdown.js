import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true
})

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return {
      frontmatter: {},
      body: content
    }
  }

  const frontmatterStr = match[1]
  const body = match[2]
  
  const frontmatter = {}
  const lines = frontmatterStr.split('\n')
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()
      
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''))
      }
      
      frontmatter[key] = value
    }
  }
  
  return { frontmatter, body }
}

export async function loadArticles() {
  const articleModules = import.meta.glob('/src/data/articles/*.md', { query: '?raw', import: 'default' })
  const articles = []
  
  for (const path in articleModules) {
    const content = await articleModules[path]()
    const { frontmatter, body } = parseFrontmatter(content)
    const id = path.match(/\/([^/]+)\.md$/)[1]
    
    articles.push({
      id,
      title: frontmatter.title || 'Untitled',
      date: frontmatter.date || new Date().toISOString(),
      tags: frontmatter.tags || [],
      category: frontmatter.category || '未分类',
      description: frontmatter.description || '',
      content: marked.parse(body)
    })
  }
  
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export async function loadArticle(id) {
  const articleModules = import.meta.glob('/src/data/articles/*.md', { query: '?raw', import: 'default' })
  const path = `/src/data/articles/${id}.md`
  
  if (!articleModules[path]) {
    return null
  }
  
  const content = await articleModules[path]()
  const { frontmatter, body } = parseFrontmatter(content)
  
  return {
    id,
    title: frontmatter.title || 'Untitled',
    date: frontmatter.date || new Date().toISOString(),
    tags: frontmatter.tags || [],
    category: frontmatter.category || '未分类',
    description: frontmatter.description || '',
    content: marked.parse(body)
  }
}