<template>
  <div class="container">
    <div class="editor-section">
      <div class="editor-container">
        <h2>编辑卡片</h2>
        <CardEditor
          v-model="cardData"
          :show-themes="false"
          class="card-editor"
        />
      </div>
    </div>
    <div class="preview-section">
      <div class="preview-container">
        <h2>预览效果</h2>
        <div class="preview-content">
          <CardPreview
            :card-data="cardData"
            class="card-preview"
          />
        </div>
      </div>
    </div>
    <div class="theme-section">
      <div class="theme-container">
        <h2>主题风格</h2>
        <ThemeSelector
          :value="cardData.theme"
          @update:value="theme => cardData.theme = theme"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CardEditor from './components/CardEditor.vue'
import CardPreview from './components/CardPreview.vue'
import ThemeSelector from './components/ThemeSelector.vue'
import type { CardData } from './types/card'
import { themes } from './config/themes'

const cardData = ref<CardData>({
  title: '',
  description: '',
  avatar: 'https://avatars.githubusercontent.com/u/10126623?v=4',
  theme: themes[0],
  author: '小鑫同学',
  url: 'https://github.com/OSpoon',
  showQRCode: false
})
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: minmax(320px, 350px) minmax(580px, 1fr) minmax(240px, 280px);
  gap: 24px;
  padding: 24px;
  margin: 0 auto;
  box-sizing: border-box;
  max-width: 100%;
  min-height: 100vh;
}

.editor-section,
.theme-section,
.preview-section {
  min-width: 0;
  width: 100%;
}

.editor-container,
.theme-container,
.preview-container {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.preview-container {
  background: #f5f5f5;
}

.preview-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow: hidden;
}

.card-preview {
  max-width: 100%;
}

h2 {
  margin: 0 0 24px;
  font-size: 1.5rem;
  text-align: center;
  color: #333;
}

@media (max-width: 1200px) {
  .container {
    grid-template-columns: 1fr;
    max-width: 800px;
  }

  .editor-section,
  .preview-section,
  .theme-section {
    width: 100%;
  }

  /* .preview-container {
    padding: 24px;
  }

  .preview-content {
    padding: 0;
  } */
}
</style>