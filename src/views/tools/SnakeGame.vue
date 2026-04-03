<template>
  <div class="tool-page">
    <div class="tool-header">
      <router-link to="/blog/tools" class="back-link">← 返回工具箱</router-link>
      <h1 class="tool-title">贪吃蛇</h1>
      <p class="tool-desc">经典贪吃蛇小游戏，休闲一下</p>
    </div>

    <div class="tool-content">
      <div class="game-container">
        <canvas ref="gameCanvas" :width="gridSize * cols" :height="gridSize * rows"></canvas>
        <div class="game-info">
          <p>得分: {{ score }}</p>
          <p>最高分: {{ highScore }}</p>
          <button @click="startGame" :disabled="isPlaying" class="btn btn-primary">
            {{ isPlaying ? '游戏中...' : '开始游戏' }}
          </button>
          <button @click="resetGame" :disabled="!isPlaying" class="btn">重置</button>
        </div>
      </div>
      <div v-if="gameOver" class="game-over-overlay">
        <div class="game-over-content">
          <h2>游戏结束!</h2>
          <p>你的得分: {{ score }}</p>
          <button @click="startGame" class="btn btn-primary">再玩一次</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const gameCanvas = ref(null)
let ctx = null

const gridSize = 20 // 每个方块的大小
const cols = 20 // 列数
const rows = 20 // 行数

const snake = ref([])
const food = ref({})
const direction = ref('right')
const score = ref(0)
const highScore = ref(localStorage.getItem('snakeHighScore') || 0)
const isPlaying = ref(false)
const gameOver = ref(false)

let gameLoopInterval = null
let speed = 150 // 游戏速度 (ms)

const initGame = () => {
  snake.value = [{ x: 10, y: 10 }]
  food.value = generateFood()
  direction.value = 'right'
  score.value = 0
  isPlaying.value = false
  gameOver.value = false
  speed = 150
  draw()
}

const startGame = () => {
  if (isPlaying.value) return
  isPlaying.value = true
  gameOver.value = false
  score.value = 0
  snake.value = [{ x: 10, y: 10 }]
  food.value = generateFood()
  direction.value = 'right'
  speed = 150
  gameLoopInterval = setInterval(gameTick, speed)
}

const resetGame = () => {
  clearInterval(gameLoopInterval)
  initGame()
}

const gameTick = () => {
  if (!isPlaying.value) return

  const head = { ...snake.value[0] }

  switch (direction.value) {
    case 'up': head.y--; break
    case 'down': head.y++; break
    case 'left': head.x--; break
    case 'right': head.x++; break
  }

  // 检查碰撞
  if (
    head.x < 0 || head.x >= cols ||
    head.y < 0 || head.y >= rows ||
    checkCollision(head)
  ) {
    endGame()
    return
  }

  snake.value.unshift(head) // 添加新头部

  if (head.x === food.value.x && head.y === food.value.y) {
    score.value++
    food.value = generateFood()
    updateSpeed()
  } else {
    snake.value.pop() // 移除尾部
  }

  draw()
}

const checkCollision = (head) => {
  for (let i = 1; i < snake.value.length; i++) {
    if (head.x === snake.value[i].x && head.y === snake.value[i].y) {
      return true
    }
  }
  return false
}

const generateFood = () => {
  let newFood
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows)
    }
    let collisionWithSnake = false
    for (const segment of snake.value) {
      if (newFood.x === segment.x && newFood.y === segment.y) {
        collisionWithSnake = true
        break
      }
    }
    if (!collisionWithSnake) {
      return newFood
    }
  }
}

const draw = () => {
  if (!ctx) return

  // 清空画布
  ctx.clearRect(0, 0, cols * gridSize, rows * gridSize)

  // 绘制蛇
  for (const segment of snake.value) {
    ctx.fillStyle = 'green'
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize)
    ctx.strokeStyle = 'darkgreen'
    ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize)
  }

  // 绘制食物
  ctx.fillStyle = 'red'
  ctx.fillRect(food.value.x * gridSize, food.value.y * gridSize, gridSize, gridSize)
  ctx.strokeStyle = 'darkred'
  ctx.strokeRect(food.value.x * gridSize, food.value.y * gridSize, gridSize, gridSize)
}

const endGame = () => {
  isPlaying.value = false
  gameOver.value = true
  clearInterval(gameLoopInterval)
  if (score.value > highScore.value) {
    highScore.value = score.value
    localStorage.setItem('snakeHighScore', highScore.value)
  }
}

const updateSpeed = () => {
  if (score.value % 5 === 0 && speed > 50) { // 每吃5个食物加速
    speed -= 10
    clearInterval(gameLoopInterval)
    gameLoopInterval = setInterval(gameTick, speed)
  }
}

const handleKeyDown = (event) => {
  if (!isPlaying.value && event.key !== ' ') return // 游戏未开始只响应空格键

  const preventDefaultKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' ']
  if (preventDefaultKeys.includes(event.key)) {
    event.preventDefault()
  }

  switch (event.key) {
    case 'ArrowUp':
    case 'w':
      if (direction.value !== 'down') direction.value = 'up'
      break
    case 'ArrowDown':
    case 's':
      if (direction.value !== 'up') direction.value = 'down'
      break
    case 'ArrowLeft':
    case 'a':
      if (direction.value !== 'right') direction.value = 'left'
      break
    case 'ArrowRight':
    case 'd':
      if (direction.value !== 'left') direction.value = 'right'
      break
    case ' ': // 空格键开始/暂停
      if (!isPlaying.value && !gameOver.value) {
        startGame()
      } else if (isPlaying.value) {
        // 暂停功能可以根据需要添加
      }
      break
  }
}

onMounted(() => {
  ctx = gameCanvas.value.getContext('2d')
  initGame()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  clearInterval(gameLoopInterval)
  window.removeEventListener('keydown', handleKeyDown)
})

watch(gameOver, (newVal) => {
  if (newVal) {
    clearInterval(gameLoopInterval)
  }
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
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

canvas {
  border: 2px solid #2d3748;
  background-color: #f0f0f0;
  display: block;
}

.game-info {
  display: flex;
  gap: 20px;
  align-items: center;
}

.game-info p {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
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

.btn:hover:not(:disabled) {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.btn-primary {
  background: #2d3748;
  color: white;
  border-color: #2d3748;
}

.btn-primary:hover:not(:disabled) {
  background: #1a202c;
  border-color: #1a202c;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.game-over-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.game-over-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.game-over-content h2 {
  font-size: 2rem;
  color: #e53e3e;
  margin-bottom: 15px;
}

.game-over-content p {
  font-size: 1.2rem;
  color: #2d3748;
  margin-bottom: 25px;
}
</style>
