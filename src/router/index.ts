import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const subtitle: string = "NoToDo"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home'
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.title && typeof to.meta.title === 'string') {
    document.title = to.meta.title + ' - ' + subtitle
  }
  next()
})


export default router
