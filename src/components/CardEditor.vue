<template>
  <div class="form-group">
    <label>标题</label>
    <input
      type="text"
      :value="modelValue.title"
      @input="e => updateField('title', (e.target as HTMLInputElement).value)"
      placeholder="输入标题..."
    >
  </div>

  <div class="form-group">
    <label>作者</label>
    <input
      type="text"
      :value="modelValue.author"
      @input="e => updateField('author', (e.target as HTMLInputElement).value)"
      placeholder="输入作者名称..."
    >
  </div>

  <div class="form-group">
    <label>作者头像 URL</label>
    <input
      type="text"
      :value="modelValue.avatar"
      @input="e => updateField('avatar', (e.target as HTMLInputElement).value)"
      placeholder="输入头像图片 URL..."
    >
  </div>

  <div class="form-group">
    <label>描述</label>
    <textarea
      :value="modelValue.description"
      @input="e => updateField('description', (e.target as HTMLInputElement).value)"
      placeholder="输入描述..."
      rows="4"
    />
  </div>

  <div class="form-group">
    <label>链接地址</label>
    <input
      type="text"
      :value="modelValue.url"
      @input="e => updateField('url', (e.target as HTMLInputElement).value)"
      placeholder="输入要生成二维码的链接..."
    >
  </div>

  <div class="form-group">
    <label class="checkbox-label">
      <input
        type="checkbox"
        :checked="modelValue.showQRCode"
        @change="e => updateField('showQRCode', (e.target as HTMLInputElement).checked)"
      >
      显示二维码
    </label>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { CardData } from '../types/card'

const props = defineProps<{
  modelValue: CardData,
  showThemes?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: CardData): void
}>()

const updateField = (field: keyof CardData, value: any) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  })
}
</script>

<style scoped>
.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
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

@media (max-width: 640px) {
  .editor-container {
    padding: 16px;
  }

  .theme-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
}
</style>