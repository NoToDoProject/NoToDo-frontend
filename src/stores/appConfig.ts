import { defineStore } from 'pinia'

// 有关系统配置的store
export const appConfig = defineStore('appConfig', {
  state: () => ({
    locale: 'zhCN',
    theme: 'auto',
    collapsed: true,
    isMobile: false,
  }),
  getters: {
    getLocale: (state) => state.locale,
    getTheme: (state) => state.theme,
    getcollapsed: (state) => state.collapsed,
    getIsMobile: (state) => state.isMobile,
  },
  actions: {
    setLocale(locale: string) {
      this.locale = locale
    },
    setTheme(theme: string) {
      this.theme = theme
    },
    setcollapsed(collapsed: boolean) {
      this.collapsed = collapsed
    },
    setIsMobile(isMobile: boolean) {
      this.isMobile = isMobile
    }
  },
  persist: true,
})
