<template>
  <div class="tool-page">
    <div class="tool-header">
      <router-link to="/blog/tools" class="back-link">← 返回工具箱</router-link>
      <h1 class="tool-title">时间戳转换</h1>
      <p class="tool-desc">Unix 时间戳与北京时间之间的互相转换</p>
    </div>

    <div class="tool-content">
      <div class="current-time-section">
        <div class="current-time-item">
          <label>当前北京时间</label>
          <div class="current-value">{{ currentDateTime }}</div>
        </div>
        <div class="current-time-item">
          <label>当前 Unix 时间戳 (秒)</label>
          <div class="current-value">{{ Math.floor(currentTimestamp / 1000) }}</div>
        </div>
        <button @click="toggleRunning" class="pause-btn">
          {{ isRunning ? '暂停刷新' : '恢复刷新' }}
        </button>
      </div>

      <div class="converter-sections">
        <!-- Timestamp to Date -->
        <div class="converter-card">
          <h2 class="card-title">时间戳 转 时间</h2>
          <div class="input-row">
            <input type="text" v-model="inputTimestamp" placeholder="输入 Unix 时间戳 (秒或毫秒)" />
            <select v-model="timestampUnit">
              <option value="s">秒 (s)</option>
              <option value="ms">毫秒 (ms)</option>
            </select>
            <button @click="convertToDate" class="btn btn-primary">转换</button>
          </div>
          <div v-if="dateResult" class="result-row">
            <label>结果：</label>
            <div class="result-value">{{ dateResult }}</div>
            <button @click="copy(dateResult)" class="copy-btn">复制</button>
          </div>
        </div>

        <!-- Date to Timestamp -->
        <div class="converter-card">
          <h2 class="card-title">时间 转 时间戳</h2>
          <div class="input-row">
            <input type="text" v-model="inputDate" placeholder="YYYY-MM-DD HH:mm:ss" />
            <button @click="convertToTimestamp" class="btn btn-primary">转换</button>
          </div>
          <div v-if="timestampResult" class="result-row">
            <label>结果：</label>
            <div class="result-value">{{ timestampResult }}</div>
            <button @click="copy(timestampResult)" class="copy-btn">复制</button>
          </div>
        </div>
      </div>

      <div v-if="error" class="error-msg">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentTimestamp = ref(Date.now())
const currentDateTime = ref('')
const isRunning = ref(true)
let timer = null

const inputTimestamp = ref('')
const timestampUnit = ref('s')
const dateResult = ref('')

const inputDate = ref('')
const timestampResult = ref('')
const error = ref('')

const updateCurrentTime = () => {
  if (!isRunning.value) return
  const now = new Date()
  currentTimestamp.value = now.getTime()
  currentDateTime.value = now.toLocaleString('zh-CN', { hour12: false })
}

const toggleRunning = () => {
  isRunning.value = !isRunning.value
}

const convertToDate = () => {
  error.value = ''
  if (!inputTimestamp.value) return
  try {
    const ts = parseInt(inputTimestamp.value)
    if (isNaN(ts)) throw new Error('请输入有效的数字')
    const date = new Date(timestampUnit.value === 's' ? ts * 1000 : ts)
    if (date.toString() === 'Invalid Date') throw new Error('无效的时间戳')
    dateResult.value = date.toLocaleString('zh-CN', { hour12: false })
  } catch (e) {
    error.value = '转换失败: ' + e.message
    dateResult.value = ''
  }
}

const convertToTimestamp = () => {
  error.value = ''
  if (!inputDate.value) return
  try {
    const date = new Date(inputDate.value)
    if (date.toString() === 'Invalid Date') throw new Error('无效的时间格式，请使用 YYYY-MM-DD HH:mm:ss')
    timestampResult.value = Math.floor(date.getTime() / 1000)
  } catch (e) {
    error.value = '转换失败: ' + e.message
    timestampResult.value = ''
  }
}

const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('已复制: ' + text)
  } catch (err) {
    alert('复制失败')
  }
}

onMounted(() => {
  updateCurrentTime()
  timer = setInterval(updateCurrentTime, 1000)
  
  // Set default input date
  const now = new Date()
  inputDate.value = now.toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.tool-page {
  max-width: 800px;
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

.current-time-section {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 24px;
  align-items: flex-end;
  padding-bottom: 32px;
  border-bottom: 1px solid #edf2f7;
  margin-bottom: 32px;
}

.current-time-item label {
  display: block;
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 8px;
  font-weight: 500;
}

.current-value {
  font-family: monospace;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.pause-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  cursor: pointer;
  font-size: 0.875rem;
}

.pause-btn:hover {
  background: #f7fafc;
}

.converter-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.converter-card {
  padding: 24px;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #edf2f7;
}

.card-title {
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 16px;
  font-weight: 600;
}

.input-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.input-row input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: monospace;
  font-size: 1rem;
}

.input-row select {
  padding: 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-family: inherit;
}

.result-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.result-row label {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.result-value {
  flex: 1;
  font-family: monospace;
  font-weight: 600;
  color: #2d3748;
}

.btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #2d3748;
  color: white;
  border: 1px solid #2d3748;
}

.btn-primary:hover {
  background: #1a202c;
}

.copy-btn {
  padding: 4px 12px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #718096;
  font-size: 0.75rem;
  cursor: pointer;
}

.copy-btn:hover {
  background: #edf2f7;
  color: #2d3748;
}

.error-msg {
  margin-top: 24px;
  color: #e53e3e;
  background: #fff5f5;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .current-time-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .input-row {
    flex-direction: column;
  }
}
</style>
