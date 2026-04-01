<template>
  <footer class="footer">
    <div class="container footer-content">
      <p>&copy; {{ currentYear }} My Blog. All rights reserved.</p>
      <div class="footer-links">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped lang="scss">
@import '../../assets/styles/variables.scss';

.footer {
  background-color: var(--bg-secondary);
  padding: $spacing-lg 0;
  margin-top: auto;
  transition: background-color 0.3s ease;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-links {
  display: flex;
  gap: $spacing-lg;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: $spacing-md;
    text-align: center;
  }
}
</style>