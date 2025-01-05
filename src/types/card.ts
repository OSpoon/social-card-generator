export interface Theme {
  name: string
  gradient: string
  textColor: string
}

export interface CardData {
  title: string
  description: string
  avatar: string
  theme: Theme
  author: string
  url: string
  showQRCode: boolean
}
