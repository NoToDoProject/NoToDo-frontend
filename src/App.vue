<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { zhCN, dateZhCN, NConfigProvider, enUS, dateEnUS, lightTheme, darkTheme } from "naive-ui"
// 引入系统配置store
import { appConfig } from '@/stores/appConfig'
import { storeToRefs } from 'pinia'
const config = appConfig()

// 配置的响应式数据
const settings = reactive({
  locale: zhCN,
  dateLocale: dateZhCN,
  theme: lightTheme,
})

// naiveui的全局主题配置
const themeOverrides = {
  common: {},
  Button: {}
}

// 设置本土化
const localeHandler = (locale: string) => {
  switch (locale) {
    case 'zh-CN':
      settings.locale = zhCN
      settings.dateLocale = dateZhCN
      break
    case 'en-US':
      settings.locale = enUS
      settings.dateLocale = dateEnUS
      break
    default:
      settings.locale = zhCN
      settings.dateLocale = dateZhCN
      break
  }
}
// 设置主题
const themeHandler = (theme: string) => {
  switch (theme) {
    case 'dark':
      settings.theme = darkTheme
      break
    case 'light':
      settings.theme = lightTheme
      break
    case 'auto':
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        settings.theme = darkTheme
      } else {
        settings.theme = lightTheme
      }
      break
    default:
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        settings.theme = darkTheme
      } else {
        settings.theme = lightTheme
      }
      break
  }
}
const { locale, theme } = storeToRefs(config)
localeHandler(locale.value)
themeHandler(theme.value)


onMounted(() => {
  // 监听主题变化
  window.onmessage = (e) => {
    console.log(e.data)
    const themelist = ['dark', 'light', 'auto']
    if (themelist.includes(e.data)) {
      themeHandler(e.data)
      theme.value = e.data
    }
  }
})

</script>

<template>
  <n-config-provider :locale="settings.locale" :date-locale="settings.dateLocale" :theme-overrides="themeOverrides"
    :theme="settings.theme" inline-theme-disabled>
    <RouterView />
  </n-config-provider>
</template>
