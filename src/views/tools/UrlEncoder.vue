<template>
  <div class="tool-page">
    <div class="tool-header">
      <router-link to="/blog/tools" class="back-link">← 返回工具箱</router-link>
      <h1 class="tool-title">URL 编码/解码</h1>
      <p class="tool-desc">对 URL 进行编码或解码，处理特殊字符</p>
    </div>

    <div class="tool-content">
      <div class="input-section">
        <label>输入</label>
        <textarea v-model="inputText" placeholder="在此输入需要编码或解码的文本..."></textarea>
      </div>

      <div class="action-bar">
        <button @click="encodeUrl" class="btn btn-primary">URL 编码</button>
        <button @click="decodeUrl" class="btn btn-primary">URL 解码</button>
        <button @click="clearAll" class="btn">清空</button>
        <button @click="copyOutput" class="btn" v-if="outputText">复制结果</button>
      </div>

      <div v-if="error" class="error-msg">{{ error }}</div>

      <div v-if="outputText" class="output-section">
        <label>结果</label>
        <div class="output-area">
          <pre>{{ outputText }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputText = ref('')
const outputText = ref('')
const error = ref('')

const encodeUrl = () => {
  error.value = ''
  if (!inputText.value.trim()) return
  try {
    outputText.value = encodeURIComponent(inputText.value)
  } catch (e) {
    error.value = '编码失败: ' + e.message
  }
}

const decodeUrl = () => {
  error.value = ''
  if (!inputText.value.trim()) return
  try {
    outputText.value = decodeURIComponent(inputText.value)
  } catch (e) {
    error.value = '解码失败: ' + e.message
  }
}

const clearAll = () => {
  inputText.value = ''
  outputText.value = ''
  error.value = ''
}

const copyOutput = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
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
  color: #2d3748;
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
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.input-section, .output-section {
  margin-bottom: 24px;
}

label {
  display: block;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 0.875rem;
  text-transform: uppercase;
}

textarea {
  width: 100%;
  height: 180px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: monospace;
  font-size: 1rem;
  resize: vertical;
}

.action-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.btn {
  padding: 10px 24px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.btn-primary {
  background: #2d3748;
  color: white;
  border-color: #2d3748;
}

.btn-primary:hover {
  background: #1a202c;
  border-color: #1a202c;
}

.error-msg {
  color: #e53e3e;
  background: #fff5f5;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 0.875rem;
}

.output-area {
  background: #f7fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #edf2f7;
  overflow-x: auto;
}

pre {
  margin: 0;
  font-family: monospace;
  font-size: 1rem;
  color: #2d3748;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
