<template>
  <div class="tool-page">
    <div class="tool-header">
      <router-link to="/blog/tools" class="back-link">← 返回工具箱</router-link>
      <h1 class="tool-title">Base64 转换</h1>
      <p class="tool-desc">字符串与 Base64 编码之间的互相转换</p>
    </div>

    <div class="tool-content">
      <div class="tool-section">
        <label>普通字符串</label>
        <textarea v-model="plainText" @input="convertToBase64" placeholder="在此输入普通文本..."></textarea>
      </div>

      <div class="tool-section">
        <label>Base64 编码</label>
        <textarea v-model="base64Text" @input="convertToPlainText" placeholder="在此输入 Base64 编码..."></textarea>
      </div>

      <div v-if="error" class="error-msg">{{ error }}</div>

      <div class="action-bar">
        <button @click="clearAll" class="btn">清空所有</button>
        <button @click="copyBase64" class="btn" v-if="base64Text">复制 Base64</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const plainText = ref('')
const base64Text = ref('')
const error = ref('')

const convertToBase64 = () => {
  error.value = ''
  try {
    base64Text.value = btoa(unescape(encodeURIComponent(plainText.value)))
  } catch (e) {
    error.value = '转换失败: ' + e.message
  }
}

const convertToPlainText = () => {
  error.value = ''
  try {
    plainText.value = decodeURIComponent(escape(atob(base64Text.value)))
  } catch (e) {
    if (base64Text.value) {
      error.value = '无效的 Base64 编码'
    }
  }
}

const clearAll = () => {
  plainText.value = ''
  base64Text.value = ''
  error.value = ''
}

const copyBase64 = async () => {
  try {
    await navigator.clipboard.writeText(base64Text.value)
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

.tool-section {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #4a5568;
}

textarea {
  width: 100%;
  height: 150px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  resize: vertical;
}

.action-bar {
  display: flex;
  gap: 12px;
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

.error-msg {
  color: #e53e3e;
  background: #fff5f5;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 0.9rem;
}
</style>
