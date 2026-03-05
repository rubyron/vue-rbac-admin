
// 定义单个路由项
export interface RouteItem {
  path: string           // 路由的路径
  name?: string          // 路由的名称，通常是可选的
  component?: any        // 路由所对应的组件
  redirect?: string      // 可选的重定向路径
  meta?: {
    title?: string       // 页面标题，通常用于显示在侧边栏或页面的标题
    requiresAuth?: boolean // 是否需要登录才能访问（权限控制）
    icon?: string        // 路由的图标（可选）
    [key: string]: any    // 可以有其他自定义的 meta 信息
  }
  children?: RouteItem[]// 子路由（如果有的话）
}

// 定义路由列表
export type RouteList = RouteItem[]
