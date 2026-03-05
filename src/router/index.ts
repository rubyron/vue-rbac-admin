import { createRouter, createWebHistory } from 'vue-router'
import LayoutView from '@/layouts/index.vue'
import LoginView from '@/views/Login/index.vue'
import { setupGuards } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },

    {
      path: '/',
      name: 'Layout',
      redirect:'/dashboard',
      component: LayoutView,
      meta: { requiresAuth: true }, // ✅ 整个 Layout 需要登录
      children: [
        // {
        //   path: '/dashboard',
        //   name: 'dashboard',
        //   component: () => import('@/views/HomeView.vue'),
        // },
        //   {
        //     path: 'profile',
        //     name: 'profile',
        //     component: () => import('@/views/profile/index.vue'),
        //   },
      ],
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

setupGuards(router)

export default router
