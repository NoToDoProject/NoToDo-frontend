import { defineStore } from 'pinia'

// 有关系统配置的store
export const appConfig = defineStore('appConfig', {
  state: () => ({
    locale: 'zhCN',
    theme: 'auto',
  }),
  getters: {
    getLocale: (state) => state.locale,
    getTheme: (state) => state.theme,
  },
  actions: {
    setLocale(locale: string) {
      this.locale = locale
    },
    setTheme(theme: string) {
      this.theme = theme
    },
  },
  persist: true,
})
