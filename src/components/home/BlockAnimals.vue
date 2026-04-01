<template>
  <!-- 外层容器，建议由父组件控制其宽高和位置 -->
  <div ref="container" class="figures-component-wrapper">
    <div
      v-for="(figure, index) in figures"
      :key="index"
      :id="figure.id"
      :class="['figure', figure.class]"
      :style="getFigureStyle(index)"
    >
      <div :class="['body', figure.bodyClass]">
        <div class="face-container" :style="getFaceStyle(index)">
          <div class="eyes-container">
            <div 
              v-for="eIndex in 2" 
              :key="eIndex" 
              :class="['eye-orbit', figure.eyeClass]"
            >
              <div :class="['blinking-wrapper', { 'is-blinking': figure.isBlinking }]">
                <div class="pupil" :style="getPupilStyle(index)"></div>
              </div>
            </div>
          </div>
          <!-- 只有定义了口部的角色才渲染 -->
          <div v-if="figure.hasMouth" :class="['mouth', figure.mouthClass]"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue';

// 接收父组件状态
const props = defineProps({
  // 是否触发小橙点头（对应你提到的 6 个 Card 的 hover 状态）
  isNodActive: {
    type: Boolean,
    default: false
  }
});

const container = ref<HTMLElement | null>(null);

// 角色基础配置
const figures = reactive([
  { id: 'blue', class: 'purple-rect', bodyClass: 'purple', eyeClass: 'white-eye', hasMouth: true, mouthClass: 'blue-mouth', isBlinking: false },
  { id: 'orange-target', class: 'orange-blob', bodyClass: 'orange', eyeClass: 'simple-eye', hasMouth: true, mouthClass: 'orange-mouth', isBlinking: false },
  { id: 'black', class: 'black-rect', bodyClass: 'black', eyeClass: 'white-eye', hasMouth: false, mouthClass: '', isBlinking: false },
  { id: 'yellow', class: 'yellow-rounded', bodyClass: 'yellow', eyeClass: 'simple-eye', hasMouth: true, mouthClass: 'yellow-mouth', isBlinking: false },
]);

// 动画内部状态
const state = reactive({
  mouse: { x: 0, y: 0 },
  smoothMouse: { x: 0, y: 0 },
  rect: { width: 0, height: 0, left: 0, top: 0 },
  nodPhase: 0,
});

// 计算角色整体变换
const getFigureStyle = (index: number) => {
  const centerX = state.rect.width / 2;
  const pctX = (state.smoothMouse.x - centerX) / (state.rect.width / 2 || 1);
  const clampedPctX = Math.max(-1.2, Math.min(1.2, pctX));
  
  // 不同角色的侧偏权重
  const skewWeights = [12, 12, 4, 10]; 
  const skewX = clampedPctX * skewWeights[index];
  
  let translateY = 0;
  let scaleY = 1;

  // 小橙 (index 1) 的联动点头逻辑
  if (index === 1 && props.isNodActive) {
    const wave = Math.sin(state.nodPhase);
    translateY = Math.min(0, wave * 25);
    if (wave > 0) scaleY -= wave * 0.08;
  }

  return {
    transform: `translateY(${translateY}px) skewX(${-skewX}deg) scaleY(${scaleY})`,
  };
};

// 计算面部随动
const getFaceStyle = (index: number) => {
  const isOrange = index === 1;
  const centerX = state.rect.width / 2;
  const centerY = state.rect.height / 2;
  const pctX = (state.smoothMouse.x - centerX) / (state.rect.width / 2 || 1);
  const pctY = (state.smoothMouse.y - centerY) / (state.rect.height / 2 || 1);

  const moveX = pctX * (isOrange ? 22 : 15);
  const moveY = pctY * (isOrange ? 15 : 10);

  return {
    transform: `translate(${moveX}px, ${moveY}px)`
  };
};

// 计算瞳孔追踪
const getPupilStyle = (index: number) => {
  const isOrange = index === 1;
  const centerX = state.rect.width / 2;
  const centerY = state.rect.height / 2;
  const pctX = (state.smoothMouse.x - centerX) / (state.rect.width / 2 || 1);
  const pctY = (state.smoothMouse.y - centerY) / (state.rect.height / 2 || 1);

  const range = isOrange ? 12 : 8;
  const pX = Math.max(-1, Math.min(1, pctX)) * range;
  const pY = Math.max(-1, Math.min(1, pctY)) * range;

  return {
    transform: `translate(${pX}px, ${pY}px)`
  };
};

// 动画循环
let rafId: number;
const animate = () => {
  state.smoothMouse.x += (state.mouse.x - state.smoothMouse.x) * 0.1;
  state.smoothMouse.y += (state.mouse.y - state.smoothMouse.y) * 0.1;

  if (props.isNodActive) {
    state.nodPhase += 0.2;
  } else {
    state.nodPhase = 0;
  }

  rafId = requestAnimationFrame(animate);
};

// 监听鼠标
const onMouseMove = (e: MouseEvent) => {
  state.mouse.x = e.clientX - state.rect.left;
  state.mouse.y = e.clientY - state.rect.top;
};

// 随机眨眼
const blinkIntervals: number[] = [];
const startBlinking = () => {
  figures.forEach((fig, idx) => {
    const runBlink = () => {
      const timer = window.setTimeout(() => {
        fig.isBlinking = true;
        window.setTimeout(() => {
          fig.isBlinking = false;
          runBlink();
        }, 150);
      }, 2000 + Math.random() * 5000);
      blinkIntervals.push(timer);
    };
    runBlink();
  });
};

onMounted(() => {
  if (container.value) {
    const r = container.value.getBoundingClientRect();
    state.rect = { width: r.width, height: r.height, left: r.left, top: r.top };
    state.mouse.x = state.smoothMouse.x = r.width / 2;
    state.mouse.y = state.smoothMouse.y = r.height / 2;
  }
  window.addEventListener('mousemove', onMouseMove);
  rafId = requestAnimationFrame(animate);
  startBlinking();
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove);
  cancelAnimationFrame(rafId);
  blinkIntervals.forEach(clearTimeout);
});
</script>

<style scoped>
.figures-component-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  perspective: 1000px;
  background: transparent;
}

.figure {
  position: absolute;
  bottom: 0;
  transform-origin: bottom center;
  will-change: transform;
}

/* 定位与层级 */
.purple-rect { left: 16%; width: 30%; height: 95%; z-index: 1; }
.orange-blob { left: 2%; width: 45%; height: 38%; z-index: 2; }
.black-rect { left: 42%; width: 19%; height: 69%; z-index: 3; }
.yellow-rounded { left: 58%; width: 24%; height: 44%; z-index: 4; }

.body {
  width: 100%; height: 100%;
  position: relative;
  box-shadow: 0 -5px 20px rgba(0,0,0,0.05);
}

.purple { background: #7158e2; }
.orange { background: #ff9f43; border-radius: 130px 130px 0 0; }
.black { background: #2d3436; }
.yellow { background: #fed330; border-radius: 65px 65px 0 0; }

.face-container {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  display: flex; flex-direction: column; align-items: center;
  will-change: transform;
}

.eyes-container {
  position: absolute; top: 20%; width: 60%;
  display: flex; justify-content: space-around;
}

.orange-blob .eyes-container { top: 30%; width: 55%; }

.eye-orbit {
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
}

.white-eye { background: #ffffff; overflow: hidden; }
.simple-eye { background: transparent; }

.pupil {
  width: 11px; height: 11px; background: #000; border-radius: 50%;
}
.orange-blob .pupil { width: 14px; height: 14px; }

.blinking-wrapper {
  width: 100%; height: 100%;
  display: flex; justify-content: center; align-items: center;
}
.is-blinking { animation: blink-action 0.15s ease-in-out forwards; }
@keyframes blink-action {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.05); }
}

.mouth { position: absolute; background: #000; transition: all 0.3s ease; }
.blue-mouth { top: 38%; width: 30px; height: 4px; border-radius: 2px; }
.yellow-mouth { top: 42%; width: 65px; height: 6px; border-radius: 10px; }

.orange-mouth {
  top: 50%; width: 28px; height: 14px; border-radius: 0 0 40px 40px;
}

/* 点头激活时的嘴巴变化 */
:deep(.nod-active) .orange-mouth {
  width: 16px; height: 16px; border-radius: 50%; top: 55%;
}
</style>