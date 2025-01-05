<script setup lang="ts">
import type { Theme } from '../types/card'
import { themes } from '../config/themes'

defineProps<{
  value: Theme
}>()

const emit = defineEmits<{
  (e: 'update:value', value: Theme): void
}>()
</script>

<template>
  <div class="theme-grid">
    <div
      v-for="theme in themes"
      :key="theme.name"
      class="theme-option"
      :class="{ active: value.name === theme.name }"
      :style="{ background: theme.gradient }"
      @click="emit('update:value', theme)"
    >
      <span class="theme-name" :style="{ color: theme.textColor }">
        {{ theme.name }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.theme-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.theme-option {
  aspect-ratio: 1.6/1;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  text-align: center;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.theme-option:hover {
  transform: translateY(-2px);
}

.theme-option.active {
  outline: 3px solid #4CAF50;
  outline-offset: 2px;
}

.theme-name {
  font-size: 0.85rem;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

@media (max-width: 1200px) {
  .theme-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style> 