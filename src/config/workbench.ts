import type { Role } from '@/mocks/handlers/rbac'

export const roleDisplayName: Record<Role, string> = {
  super_admin: '超级管理员',
  system_admin: '系统管理员',
  employee: '普通员工',
  support: '客服',
  engineer: '工程师',
}

/** 快捷操作：与当前业务路径对齐，不校验权限（入口展示；无权限路由守卫会拦截） */
export const quickActionsByRole: Record<
  Role,
  { label: string; path: string; type?: 'primary' | 'success' | 'warning' | 'info' }[]
> = {
  super_admin: [
    { label: '用户管理', path: '/system/users', type: 'primary' },
    { label: '角色权限', path: '/system/roles', type: 'primary' },
    { label: '菜单维护', path: '/system/menus', type: 'info' },
    { label: '运营看板', path: '/dashboard/ops', type: 'success' },
  ],
  system_admin: [
    { label: '用户管理', path: '/system/users', type: 'primary' },
    { label: '角色管理', path: '/system/roles', type: 'primary' },
    { label: '权限管理', path: '/system/permissions', type: 'info' },
    { label: '字典维护', path: '/system/dicts', type: 'info' },
    { label: '运营看板', path: '/dashboard/ops', type: 'success' },
  ],
  employee: [
    { label: '新建工单', path: '/tickets/create', type: 'primary' },
    { label: '我的工单', path: '/tickets/my', type: 'success' },
    { label: '工作台', path: '/dashboard/home', type: 'info' },
  ],
  support: [
    { label: '工单列表', path: '/tickets/list', type: 'primary' },
    { label: '待分派', path: '/tickets/dispatch', type: 'warning' },
    { label: '已关闭', path: '/tickets/closed', type: 'info' },
    { label: '数据概览', path: '/dashboard/home', type: 'success' },
  ],
  engineer: [
    { label: '待处理', path: '/tickets/pending', type: 'warning' },
    { label: '我的工单', path: '/tickets/my', type: 'primary' },
    { label: '新建工单', path: '/tickets/create', type: 'info' },
  ],
}

export type WorkbenchTier = 'full' | 'ops' | 'personal'

/** 数据看板展示层级：与 RBAC 中 dashboard:ops 等扩展对齐；当前 mock 以角色划分 */
export function getWorkbenchTier(role: string): WorkbenchTier {
  if (role === 'super_admin' || role === 'system_admin') return 'full'
  if (role === 'support' || role === 'engineer') return 'ops'
  return 'personal'
}
