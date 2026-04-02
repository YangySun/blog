<template>
  <div class="tool-page">
    <div class="tool-header">
      <router-link to="/blog/tools" class="back-link">← 返回工具箱</router-link>
      <h1 class="tool-title">JSON 格式化</h1>
      <p class="tool-desc">美化 JSON 代码，支持压缩和校验</p>
    </div>

    <div class="tool-content">
      <div class="input-area">
        <textarea 
          v-model="inputJson" 
          placeholder="在此粘贴 JSON 代码..."
          spellcheck="false"
        ></textarea>
      </div>

      <div class="action-bar">
        <button @click="formatJson" class="btn btn-primary">格式化</button>
        <button @click="minifyJson" class="btn">压缩</button>
        <button @click="clearInput" class="btn">清空</button>
        <button @click="copyOutput" class="btn" v-if="outputJson">复制结果</button>
      </div>

      <div v-if="error" class="error-msg">
        {{ error }}
      </div>

      <div v-if="outputJson" class="output-area">
        <pre><code>{{ outputJson }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputJson = ref('')
const outputJson = ref('')
const error = ref('')

const formatJson = () => {
  error.value = ''
  if (!inputJson.value.trim()) return
  try {
    const obj = JSON.parse(inputJson.value)
    outputJson.value = JSON.stringify(obj, null, 2)
  } catch (e) {
    error.value = '无效的 JSON 格式: ' + e.message
    outputJson.value = ''
  }
}

const minifyJson = () => {
  error.value = ''
  if (!inputJson.value.trim()) return
  try {
    const obj = JSON.parse(inputJson.value)
    outputJson.value = JSON.stringify(obj)
  } catch (e) {
    error.value = '无效的 JSON 格式: ' + e.message
    outputJson.value = ''
  }
}

const clearInput = () => {
  inputJson.value = ''
  outputJson.value = ''
  error.value = ''
}

const copyOutput = async () => {
  try {
    await navigator.clipboard.writeText(outputJson.value)
    alert('已复制到剪贴板')
  } catch (err) {
    alert('复制失败')
  }
}
</script>

<style scoped>
.tool-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.tool-header {
  margin-bottom: 30px;
}

.back-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 15px;
}

.tool-title {
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 8px;
}

.tool-desc {
  color: #718096;
}

.tool-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

textarea {
  width: 100%;
  height: 300px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  resize: vertical;
  margin-bottom: 20px;
}

.action-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.btn {
  padding: 8px 20px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  background: #f7fafc;
}

.btn-primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-primary:hover {
  background: #5a67d8;
}

.error-msg {
  color: #e53e3e;
  background: #fff5f5;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.output-area {
  background: #f7fafc;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}

pre {
  margin: 0;
  font-family: monospace;
  font-size: 0.9rem;
  color: #2d3748;
}
</style>
