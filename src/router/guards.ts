import { useUserStore } from '@/stores/user'
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupGuards(router: Router) {

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const authStore = useAuthStore()
  // 1) 如果是登录页，直接放行
  if (to.path === '/login') return next()

  // 2) 检查是否有 token
  const token = String(authStore.token || '')
  if (!token) {
    // 如果没有 token，跳转到登录页
    return next('/login')
  }

  // 3) 检查权限数据是否已经加载
  if (!userStore.menuTree || userStore.menuTree.length === 0) {
      // 如果缓存中没有数据，则通过 token 请求权限信息
      await userStore.initRoutes()
console.log('2',userStore.routes)
    // 动态注册路由
    userStore.routes.forEach(route => {
      router.addRoute('Layout', route)
    })
console.log('3',router)
    // 放行并刷新当前路由
    return next({ ...to, replace: true })
  }


  // 5) 其他正常路由放行
  return next()
})
}
