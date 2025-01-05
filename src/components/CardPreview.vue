<template>
  <div class="preview-container">
    <div 
      class="social-card"
      ref="cardRef"
      :style="{ 
        '--card-gradient': cardData.theme.gradient,
        '--text-color': cardData.theme.textColor
      }"
    >
      <div class="card-background"></div>
      <div class="card-content">
        <div class="main-content">
          <div class="header">
            <div class="author-section">
              <div class="author-avatar">
                <img 
                  :src="avatarDataUrl || cardData.avatar || '/default-avatar.png'"
                  alt="作者头像"
                  crossorigin="anonymous"
                >
              </div>
              <div class="author-info" :style="{ color: cardData.theme.textColor }">
                <span class="author-name">{{ cardData.author || '佚名' }}</span>
              </div>
            </div>
            <div 
              v-if="cardData.showQRCode && qrCodeDataUrl" 
              class="qr-code-wrapper"
            >
              <img 
                :src="qrCodeDataUrl"
                alt="二维码"
                class="qr-image"
              >
              <span class="scan-text" :style="{ color: cardData.theme.textColor + '99' }">
                扫码阅读
              </span>
            </div>
          </div>
          <div class="content-wrapper">
            <h3 class="title" :style="{ color: cardData.theme.textColor }">
              {{ cardData.title || '未设置标题' }}
            </h3>
            <div class="description-container">
              <p class="description" :style="{ color: cardData.theme.textColor + 'CC' }">
                {{ cardData.description || '未设置描述' }}
              </p>
            </div>
            <div class="divider">
              <span class="date" :style="{ color: cardData.theme.textColor + '99' }">
                {{ currentDate }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <button 
        class="download-btn" 
        @click="downloadCard"
        :style="{
          background: cardData.theme.gradient,
          color: cardData.theme.textColor
        }"
      >
        下载卡片
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import type { CardData } from '../types/card'

const props = defineProps<{
  cardData: CardData
}>()

const qrCodeDataUrl = ref('')
const avatarDataUrl = ref('')

// 将图片转换为 base64
const convertImageToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (err) {
    console.error('Image conversion failed:', err)
    return ''
  }
}

// 监听头像变化
watch(
  () => props.cardData.avatar,
  async (newAvatar) => {
    if (newAvatar) {
      avatarDataUrl.value = await convertImageToBase64(newAvatar)
    }
  },
  { immediate: true }
)

// 生成二维码时使用对比色
const generateQRCode = async (url: string) => {
  if (!url) return ''
  try {
    // 根据背景色计算对比色
    const getContrastColor = (textColor: string) => {
      // 将十六进制颜色转换为 RGB
      const hex = textColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      
      // 计算亮度
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      
      // 根据亮度选择黑色或白色作为对比色
      return brightness > 128 ? '#000000' : '#FFFFFF'
    }

    const options = {
      width: 200,
      margin: 1,
      color: {
        dark: getContrastColor(props.cardData.theme.textColor),
        light: '#FFFFFF'
      }
    }
    return await QRCode.toDataURL(url, options)
  } catch (err) {
    console.error('QR Code generation failed:', err)
    return ''
  }
}

// 监听 URL 和主题变化，重新生成二维码
watch(
  () => [props.cardData.url, props.cardData.theme],
  async () => {
    qrCodeDataUrl.value = await generateQRCode(props.cardData.url)
  },
  { immediate: true }
)

// 下载卡片
const downloadCard = async () => {
  const card = document.querySelector('.social-card') as HTMLElement
  if (!card) return

  try {
    const canvas = await html2canvas(card, {
      scale: 2,
      backgroundColor: null,
      logging: false,
      useCORS: true, // 允许跨域
      allowTaint: true // 允许图片污染画布
    })

    const link = document.createElement('a')
    link.download = 'social-card.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (err) {
    console.error('Card export failed:', err)
  }
}

// 格式化当前日期
const currentDate = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}).format(new Date())
</script>

<style scoped>
.social-card {
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  width: 533px;
  height: auto;
  margin: 0 auto;
  font-family: 'Source Han Sans CN', sans-serif;
}

.card-background {
  position: absolute;
  inset: 0;
  background: var(--card-gradient);
  opacity: 0.95;
}

.card-content {
  position: relative;
  z-index: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.author-section {
  height: 48px;
  width: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  padding: 0 12px;
  border-radius: var(--border-radius);
  backdrop-filter: blur(8px);
  box-sizing: border-box;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info {
  flex: 0 1 auto;
  min-width: 0;
  display: flex;
}

.author-name {
  font-weight: 500;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
  font-family: 'Source Han Sans CN', sans-serif;
}

.qr-code-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  background: rgba(255, 255, 255, 0.15);
  padding: 5px;
  border-radius: var(--border-radius);
  backdrop-filter: blur(8px);
  box-sizing: border-box;
}

.qr-image {
  width: 26px;
  height: 26px;
  padding: 2px;
  background: #FFFFFF;
  border-radius: calc(var(--border-radius) - 2px);
  flex-shrink: 0;
}

.scan-text {
  font-size: 0.45rem;
  white-space: nowrap;
  font-family: 'Source Han Sans CN', sans-serif;
  font-weight: 500;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  padding-bottom: 8px;
}

.title {
  height: auto;
  margin: 0;
  font-size: 1.10rem;
  font-weight: 600;
  line-height: 1.2;
  padding: 6px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  display: -moz-box;
  display: box;
  -webkit-box-orient: vertical;
  -moz-box-orient: vertical;
  box-orient: vertical;
  -webkit-line-clamp: 1;
  -moz-line-clamp: 1;
  line-clamp: 1;
  font-family: var(--font-heading);
  font-weight: normal;
}

.description-container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  padding: 11px;
  backdrop-filter: blur(8px);
  height: auto;
  margin-bottom: 4px;
}

.description {
  font-size: 0.80rem;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  display: -moz-box;
  display: box;
  -webkit-box-orient: vertical;
  -moz-box-orient: vertical;
  box-orient: vertical;
  -webkit-line-clamp: unset;
  -moz-line-clamp: unset;
  line-clamp: unset;
  overflow: visible;
  font-family: var(--font-body);
  font-weight: normal;
}

@media (max-width: 600px) {
  .social-card {
    width: 100%;
  }

  .divider {
    height: 16px;
    padding-top: 6px;
  }

  .date {
    font-size: 0.55rem;
    padding: 0 10px;
  }
}

.actions {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.download-btn {
  padding: 8px 24px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-family: var(--font-accent);
  font-weight: normal;
  transition: opacity 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.download-btn:hover {
  opacity: 0.9;
}

.divider {
  position: relative;
  text-align: center;
  height: 20px;
  margin-top: auto;
  padding-top: 8px;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.3) 20%,
    rgba(255, 255, 255, 0.3) 40%,
    transparent 45%,
    transparent 55%,
    rgba(255, 255, 255, 0.3) 60%,
    rgba(255, 255, 255, 0.3) 80%,
    transparent
  );
}

.date {
  top: -6px;
  position: relative;
  z-index: 1;
  background: inherit;
  padding: 0 12px;
  font-size: 0.75rem;
  font-family: var(--font-accent);
  font-weight: normal;
  backdrop-filter: blur(4px);
}
</style>