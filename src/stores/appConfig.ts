import { defineStore } from 'pinia'

// 有关系统配置的store
export const appConfig = defineStore('appConfig', {
  state: () => ({
    locale: 'zhCN',
    theme: 'auto',
    sider: true,
    isMobile: false,
  }),
  getters: {
    getLocale: (state) => state.locale,
    getTheme: (state) => state.theme,
    getSider: (state) => state.sider,
    getIsMobile: (state) => state.isMobile,
  },
  actions: {
    setLocale(locale: string) {
      this.locale = locale
    },
    setTheme(theme: string) {
      this.theme = theme
    },
    setSider(sider: boolean) {
      this.sider = sider
    },
    setIsMobile(isMobile: boolean) {
      this.isMobile = isMobile
    }
  },
  persist: true,
})
