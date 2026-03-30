<template>
  <div class="category-filter">
    <h3 class="filter-title">分类</h3>
    <div class="filter-buttons">
      <button
        v-for="category in categories"
        :key="category"
        @click="selectCategory(category)"
        :class="['filter-btn', { active: selectedCategory === category }]"
        class="pulse-animation"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  selectedCategory: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['select'])

function selectCategory(category) {
  emit('select', category)
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/variables.scss';

.category-filter {
  margin-bottom: $spacing-lg;
}

.filter-title {
  font-size: $font-size-lg;
  margin-bottom: $spacing-md;
  color: var(--text-primary);
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.filter-btn {
  padding: $spacing-sm $spacing-md;
  border: 1px solid var(--border-color);
  border-radius: $border-radius;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: $font-size-sm;
  cursor: pointer;
  transition: $transition;

  &:hover {
    background: var(--bg-secondary);
    border-color: var(--accent-color);
  }

  &.active {
    background: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
  }
}
</style>