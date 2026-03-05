import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'

export function setupGuards(router: Router) {
    //if login page && token, go dashboard
    //if no token && not logi page  then back to login page
    // router.beforeEach(async(to,from,next) => {
    //     console.log('route to', to)
    //     const userStore = useUserStore()
    //      const authStore = useAuthStore()
    //     const hasToken = !!authStore.token
    //     // const token = computed(() => userStore.state.token)

    //     console.log('hasToken', authStore.token, hasToken)
    //     if (!hasToken && to.path !== '/login') {
    //         return { path: '/login', query: { redirect: to.fullPath } }
    //     }
    //     if (hasToken && to.path === '/login') {
    //         return { path: '/dashboard' }
    //     }

    //      if (hasToken && !userStore.menuTree?.length) {
    //   try {
    //     // 从API获取用户权限信息
    //     await userStore.generateUserInfoByRole('admin')
        
    //     // 动态添加路由
    //     // accessedRoutes.forEach(route => {
    //     //   router.addRoute(route)
    //     // })
        
    //     // 重新导航到目标路由
    //     next({ ...to, replace: true })
    //   } catch (error) {
    //     console.error('获取权限失败:', error)
    //     // 清除token并跳转到登录页
    //     authStore.logout()
    //     next({
    //       path: '/login',
    //       query: { redirect: to.fullPath }
    //     })
    //   }
    // } else {
    // //   next()
    // }
    //      return next()



    // })
    router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  if (to.path === '/login') return next()

  const token = localStorage.getItem('TOKEN')
  if (!token) return next('/login')

//   if (!userStore.inited) {
//     const restored = userStore.restore()

//     if (!restored) {
//       const role = localStorage.getItem('ROLE') as 'admin' | 'user'
//       await userStore.init(role)
//     }

//     userStore.routes.forEach(r => {
//       router.addRoute('Layout', r)
//     })

//     return next({ ...to, replace: true })
//   }

  // 页面级权限控制
//   const required = to.meta.permissions as string[] | undefined
//   if (required?.length) {
//     const ok = required.every(p => userStore.hasPerm(p))
//     if (!ok) return next('/403')
//   }

  next()
})

}
