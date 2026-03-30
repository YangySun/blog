<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
    <BackToTop />
  </div>
</template>

<script setup>
import Header from './components/common/Header.vue'
import Footer from './components/common/Footer.vue'
import BackToTop from './components/common/BackToTop.vue'
</script>

<style>
html, body {
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
}
</style>

<style scoped>
.page-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>