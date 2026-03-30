<template>
  <div class="tag-filter">
    <h3 class="filter-title">标签</h3>
    <div class="filter-buttons">
      <button
        v-for="tag in tags"
        :key="tag"
        @click="selectTag(tag)"
        :class="['filter-btn', { active: selectedTag === tag }]"
        class="pulse-animation"
      >
        {{ tag }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  tags: {
    type: Array,
    required: true
  },
  selectedTag: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['select'])

function selectTag(tag) {
  emit('select', tag)
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/variables.scss';

.tag-filter {
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
  gap: $spacing-xs;
}

.filter-btn {
  padding: $spacing-xs $spacing-sm;
  border: 1px solid var(--border-color);
  border-radius: $border-radius;
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: $font-size-sm;
  cursor: pointer;
  transition: $transition;

  &:hover {
    background: var(--bg-secondary);
    border-color: var(--accent-color);
    color: var(--accent-color);
  }

  &.active {
    background: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
  }
}
</style>