<template>
  <div class="tool-page">
    <div class="tool-header">
      <router-link to="/blog/tools" class="back-link">← 返回工具箱</router-link>
      <h1 class="tool-title">颜色转换器</h1>
      <p class="tool-desc">HEX、RGB、HSL 颜色格式之间的互相转换</p>
    </div>

    <div class="tool-content">
      <div class="color-preview-section">
        <div class="color-box" :style="{ backgroundColor: hexColor }"></div>
        <div class="color-info">
          <input type="color" v-model="hexColor" class="color-picker" @input="handleHexInput" />
          <span class="color-hex-display">{{ hexColor.toUpperCase() }}</span>
        </div>
      </div>

      <div class="converter-grid">
        <div class="input-group">
          <label>HEX</label>
          <div class="input-with-btn">
            <input type="text" v-model="hexColor" @input="handleHexInput" placeholder="#FFFFFF" />
            <button @click="copy(hexColor)" class="copy-btn">复制</button>
          </div>
        </div>

        <div class="input-group">
          <label>RGB</label>
          <div class="input-with-btn">
            <input type="text" v-model="rgbColor" @input="handleRgbInput" placeholder="rgb(255, 255, 255)" />
            <button @click="copy(rgbColor)" class="copy-btn">复制</button>
          </div>
        </div>

        <div class="input-group">
          <label>HSL</label>
          <div class="input-with-btn">
            <input type="text" v-model="hslColor" @input="handleHslInput" placeholder="hsl(0, 0%, 100%)" />
            <button @click="copy(hslColor)" class="copy-btn">复制</button>
          </div>
        </div>
      </div>

      <div v-if="error" class="error-msg">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const hexColor = ref('#667eea')
const rgbColor = ref('rgb(102, 126, 234)')
const hslColor = ref('hsl(229, 76%, 66%)')
const error = ref('')

const handleHexInput = () => {
  error.value = ''
  let hex = hexColor.value
  if (!hex.startsWith('#')) hex = '#' + hex
  
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    hexColor.value = hex
    updateFromHex(hex)
  } else if (hex.length > 7) {
    error.value = '无效的 HEX 颜色格式'
  }
}

const handleRgbInput = () => {
  error.value = ''
  const match = rgbColor.value.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)
  if (match) {
    const r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3])
    if (r <= 255 && g <= 255 && b <= 255) {
      updateFromRgb(r, g, b)
    } else {
      error.value = 'RGB 数值必须在 0-255 之间'
    }
  }
}

const handleHslInput = () => {
  error.value = ''
  const match = hslColor.value.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i)
  if (match) {
    const h = parseInt(match[1]), s = parseInt(match[2]), l = parseInt(match[3])
    if (h <= 360 && s <= 100 && l <= 100) {
      updateFromHsl(h, s, l)
    } else {
      error.value = 'HSL 数值超出范围'
    }
  }
}

const updateFromHex = (hex) => {
  let r = 0, g = 0, b = 0
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16)
    g = parseInt(hex[2] + hex[2], 16)
    b = parseInt(hex[3] + hex[3], 16)
  } else {
    r = parseInt(hex.slice(1, 3), 16)
    g = parseInt(hex.slice(3, 5), 16)
    b = parseInt(hex.slice(5, 7), 16)
  }
  rgbColor.value = `rgb(${r}, ${g}, ${b})`
  
  // Convert RGB to HSL
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  hslColor.value = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

const updateFromRgb = (r, g, b) => {
  const toHex = (n) => n.toString(16).padStart(2, '0')
  hexColor.value = `#${toHex(r)}${toHex(g)}${toHex(b)}`
  updateFromHex(hexColor.value)
}

const updateFromHsl = (h, s, l) => {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const r = Math.round(255 * f(0));
  const g = Math.round(255 * f(8));
  const b = Math.round(255 * f(4));
  updateFromRgb(r, g, b)
}

const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('已复制: ' + text)
  } catch (err) {
    alert('复制失败')
  }
}
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

.color-preview-section {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
  padding-bottom: 32px;
  border-bottom: 1px solid #edf2f7;
}

.color-box {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}

.color-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.color-picker {
  width: 60px;
  height: 32px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.color-hex-display {
  font-family: monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.converter-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-with-btn {
  display: flex;
  gap: 12px;
}

input[type="text"] {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: monospace;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input[type="text"]:focus {
  outline: none;
  border-color: #2d3748;
}

.copy-btn {
  padding: 0 20px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.error-msg {
  margin-top: 24px;
  color: #e53e3e;
  background: #fff5f5;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.875rem;
}
</style>
