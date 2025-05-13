import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/file-convert',
    name: 'FileConvert',
    component: () => import('../views/FileConvert/FileConvert.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 