// types.ts

// menu item
export interface MenuItem {
  id:string
  name:string
  icon?: string           // 菋项的图标（可选）
  path: string            // 菜单项对应的路由路径
  children?: MenuItem[]   // 子菜单项，递归引用（如果有的话）
  meta?: {                // 用于存储额外的 meta 信息，如权限、角色等
    requiresAuth?: boolean // 是否需要权限验证
    [key: string]: any     // 其他自定义 meta 信息
  }
}

export interface MenuData {
    admin: MenuItem[];
    user: MenuItem[];
}



