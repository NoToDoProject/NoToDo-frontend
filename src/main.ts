import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 数据持久化
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

// 引入全局样式
import './assets/main.css'

/* toastification */
import Toast from "vue-toastification"
import type { PluginOptions } from "vue-toastification"
/* toastification css */
import "vue-toastification/dist/index.css"

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const Toastoptions: PluginOptions = {
    timeout: 3000,
}
app.use(Toast, Toastoptions)

app.use(pinia)
app.use(router)

app.mount('#app')
