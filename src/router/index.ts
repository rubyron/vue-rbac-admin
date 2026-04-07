import { createRouter, createWebHashHistory } from 'vue-router'
import LayoutView from '@/layouts/index.vue'
import LoginView from '@/views/Login/index.vue'
import TicketDetailPage from '@/views/tickets/detail/index.vue'
import { setupGuards } from './guards'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
        {
          path: '/tickets/detail/:id',
          name: 'TicketDetail',
          component: TicketDetailPage,
          meta: {
            requiresAuth: true,
            permissionCode: 'page:ticket:detail',
            hideInMenu: true
          }
        },
        // {
        //   path: '/dashboard',
        //   name: 'dashboard',
        //   component: () => import('@/views/dashboard/index.vue'),
        // }
      ],
    },
  ],
})

setupGuards(router)

export default router
