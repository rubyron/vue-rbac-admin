import type { UserInfoResI } from '@/types/api'

export type Role =
  | 'super_admin'
  | 'system_admin'
  | 'employee'
  | 'support'
  | 'engineer'

type MockUser = {
  username: string
  password: string
  role: Role
  token: string
  displayName: string
}

export const mockUsers: MockUser[] = [
  { username: 'root', password: '123456', role: 'super_admin', token: 'super-admin-token', displayName: '超级管理员' },
  { username: 'sysadmin', password: '123456', role: 'system_admin', token: 'system-admin-token', displayName: '系统管理员' },
  { username: 'employee', password: '123456', role: 'employee', token: 'employee-token', displayName: '普通员工' },
  { username: 'support', password: '123456', role: 'support', token: 'support-token', displayName: '客服' },
  { username: 'engineer', password: '123456', role: 'engineer', token: 'engineer-token', displayName: '工程师' },
]

export const rolePermissions: Record<Role, string[]> = {
  super_admin: ['*'],

  system_admin: [
    'dashboard:view',
    'dashboard:ops',
    'system:access',
    'user:read',
    'user:create',
    'user:update',
    'role:read',
    'role:create',
    'role:update',
    'permission:read',
    'permission:create',
    'permission:update',
    'menu:read',
    'menu:create',
    'menu:update',
    'dict:read',
    'dict:create',
    'dict:update',
  ],

  employee: [
    'dashboard:view',
    'ticket:my',
    'ticket:create-page',
    'ticket:detail',
    'message:read',
    'ticket:create',
    'ticket:edit',
    'ticket:revoke',
    'ticket:supplement',
    'ticket:evaluate',
  ],

  support: [
    'dashboard:view',
    'ticket:my',
    'ticket:list',
    'ticket:create-page',
    'ticket:dispatch-page',
    'ticket:closed-page',
    'ticket:detail',
    'report:partial',
    'ticket:accept',
    'ticket:assign',
    'ticket:priority',
    'ticket:close',
    'ticket:urge',
    'b_ticket_assign',
  ],

  engineer: [
    'dashboard:view',
    'ticket:pending-page',
    'ticket:my',
    'ticket:detail',
    'ticket:take',
    'ticket:process',
    'ticket:hold',
    'ticket:collaborate',
    'ticket:finish',
  ]
}

/** 完整菜单/权限定义，用于角色权限树等（不随角色过滤） */
export const allMenus: UserInfoResI[] = [
  {
    id: 'd_dashboard',
    type: 'dir',
    path: '/dashboard',
    name: 'DashboardRoot',
    redirect: '/dashboard/home',
    perms: ['dashboard:view'],
    meta: { title: '工作台', icon: 'DataBoard', order: 1 },
    children: [
      {
        id: 'm_dashboard_home',
        type: 'menu',
        path: '/dashboard/home',
        name: 'DashboardHome',
        component: 'dashboard',
        perms: ['dashboard:view'],
        meta: { title: '工作台首页', icon: 'House', order: 1 },
      },
      {
        id: 'm_dashboard_ops',
        type: 'menu',
        path: '/dashboard/ops',
        name: 'DashboardOps',
        component: 'dashboard/ops',
        perms: ['dashboard:ops'],
        meta: { title: '运营看板', icon: 'TrendCharts', order: 2 },
      },
    ],
  },
  {
    id: 'd_system',
    type: 'dir',
    path: '/system',
    name: 'SystemRoot',
    perms: ['system:access'],
    meta: { title: '系统管理', icon: 'Setting', order: 90 },
    children: [
      {
        id: 'm_system_users',
        type: 'menu',
        path: '/system/users',
        name: 'SystemUsers',
        component: 'system/users',
        perms: ['user:read'],
        actions: [
          { id: 'b_user_create', type: 'button', perms: ['user:create'], label: '新建用户' },
          { id: 'b_user_edit', type: 'button', perms: ['user:update'], label: '编辑用户' },
        ],
        meta: { title: '用户管理', icon: 'User', order: 1 },
      },
      {
        id: 'm_system_roles',
        type: 'menu',
        path: '/system/roles',
        name: 'SystemRoles',
        component: 'system/roles',
        perms: ['role:read'],
        actions: [
          { id: 'b_role_create', type: 'button', perms: ['role:create'], label: '新建角色' },
          { id: 'b_role_edit', type: 'button', perms: ['role:update'], label: '编辑角色' },
        ],
        meta: { title: '角色管理', icon: 'Avatar', order: 2 },
      },
      {
        id: 'm_system_permissions',
        type: 'menu',
        path: '/system/permissions',
        name: 'SystemPermissions',
        component: 'system/permissions',
        perms: ['permission:read'],
        actions: [
          { id: 'b_perm_create', type: 'button', perms: ['permission:create'], label: '新建权限' },
          { id: 'b_perm_edit', type: 'button', perms: ['permission:update'], label: '编辑权限' },
        ],
        meta: { title: '权限管理', icon: 'Lock', order: 3 },
      },
      {
        id: 'm_system_menus',
        type: 'menu',
        path: '/system/menus',
        name: 'SystemMenus',
        component: 'system/menus',
        perms: ['menu:read'],
        actions: [
          { id: 'b_menu_create', type: 'button', perms: ['menu:create'], label: '新建菜单' },
          { id: 'b_menu_edit', type: 'button', perms: ['menu:update'], label: '编辑菜单' },
        ],
        meta: { title: '菜单维护', icon: 'Menu', order: 4 },
      },
      {
        id: 'm_system_dict',
        type: 'menu',
        path: '/system/dicts',
        name: 'SystemDicts',
        component: 'system/dicts',
        perms: ['dict:read'],
        actions: [
          { id: 'b_dict_create', type: 'button', perms: ['dict:create'], label: '新增字典' },
          { id: 'b_dict_edit', type: 'button', perms: ['dict:update'], label: '编辑字典' },
        ],
        meta: { title: '字典维护', icon: 'Tickets', order: 5 },
      },
    ],
  },
  {
    id: 'd_tickets',
    type: 'dir',
    path: '/tickets',
    name: 'TicketRoot',
    perms: ['ticket:detail'],
    meta: { title: '工单中心', icon: 'Document', order: 10 },
    children: [
      {
        id: 'm_ticket_my',
        type: 'menu',
        path: '/tickets/my',
        name: 'MyTickets',
        component: 'tickets/list',
        perms: ['ticket:my'],
        meta: { title: '我的工单', icon: 'Document', order: 1 },
      },
      {
        id: 'm_ticket_create_page',
        type: 'menu',
        path: '/tickets/create',
        name: 'CreateTicket',
        component: 'tickets/form',
        perms: ['ticket:create-page'],
        actions: [
          { id: 'b_ticket_create', type: 'button', perms: ['ticket:create'], label: '创建' },
          { id: 'b_ticket_edit', type: 'button', perms: ['ticket:edit'], label: '编辑' },
          { id: 'b_ticket_revoke', type: 'button', perms: ['ticket:revoke'], label: '撤销' },
          { id: 'b_ticket_supplement', type: 'button', perms: ['ticket:supplement'], label: '补充' },
          { id: 'b_ticket_evaluate', type: 'button', perms: ['ticket:evaluate'], label: '评价' },
        ],
        meta: { title: '新建工单', icon: 'EditPen', order: 2 },
      },
      {
        id: 'm_ticket_list',
        type: 'menu',
        path: '/tickets/list',
        name: 'TicketList',
        component: 'tickets/list',
        perms: ['ticket:list'],
        actions: [
          { id: 'b_ticket_accept', type: 'button', perms: ['ticket:accept'], label: '受理' },
          { id: 'b_ticket_assign', type: 'button', perms: ['ticket:assign'], label: '分派' },
          { id: 'b_ticket_priority', type: 'button', perms: ['ticket:priority'], label: '调优先级' },
          { id: 'b_ticket_close', type: 'button', perms: ['ticket:close'], label: '关闭' },
          { id: 'b_ticket_urge', type: 'button', perms: ['ticket:urge'], label: '催办' },
        ],
        meta: { title: '工单列表', icon: 'List', order: 3 },
      },
      {
        id: 'm_ticket_pending',
        type: 'menu',
        path: '/tickets/pending',
        name: 'PendingTickets',
        component: 'tickets/list',
        perms: ['ticket:pending-page'],
        actions: [
          { id: 'b_ticket_take', type: 'button', perms: ['ticket:take'], label: '接单' },
          { id: 'b_ticket_process', type: 'button', perms: ['ticket:process'], label: '处理' },
          { id: 'b_ticket_hold', type: 'button', perms: ['ticket:hold'], label: '挂起' },
          { id: 'b_ticket_collaborate', type: 'button', perms: ['ticket:collaborate'], label: '协作' },
          { id: 'b_ticket_finish', type: 'button', perms: ['ticket:finish'], label: '完成' },
        ],
        meta: { title: '待处理', icon: 'Clock', order: 4 },
      },
      {
        id: 'm_ticket_dispatch',
        type: 'menu',
        path: '/tickets/dispatch',
        name: 'TicketDispatch',
        component: 'tickets/list',
        perms: ['ticket:dispatch-page'],
        meta: { title: '待分派', icon: 'Position', order: 5 },
      },
      {
        id: 'm_ticket_closed',
        type: 'menu',
        path: '/tickets/closed',
        name: 'TicketClosed',
        component: 'tickets/list',
        perms: ['ticket:closed-page'],
        meta: { title: '已关闭', icon: 'CircleCheck', order: 6 },
      }
    ],
  },
  // {
  //   id: 'm_message_center',
  //   type: 'menu',
  //   path: '/message',
  //   name: 'MessageCenter',
  //   component: 'dashboard',
  //   perms: ['message:read'],
  //   meta: { title: '消息中心', icon: 'Bell', order: 20 },
  // },
  // {
  //   id: 'd_reports',
  //   type: 'dir',
  //   path: '/reports',
  //   name: 'ReportsRoot',
  //   perms: ['report:partial'],
  //   meta: { title: '报表分析', icon: 'PieChart', order: 30 },
  //   children: [
  //     {
  //       id: 'm_report_ticket',
  //       type: 'menu',
  //       path: '/reports/tickets',
  //       name: 'TicketReports',
  //       component: 'dashboard',
  //       perms: ['report:partial'],
  //       meta: { title: '工单报表', icon: 'Histogram', order: 1 },
  //     },
  //   ],
  // },
]

function hasPermission(required: string[] | undefined, granted: string[]) {
  if (!required || required.length === 0) return true
  if (granted.includes('*')) return true
  return required.some((perm) => granted.includes(perm))
}

function filterMenuTree(nodes: UserInfoResI[], granted: string[]): UserInfoResI[] {
  return nodes
    .filter((node) => hasPermission(node.perms, granted))
    .map((node) => {
      const children = node.children ? filterMenuTree(node.children, granted) : undefined
      const actions = node.actions?.filter((action) => hasPermission(action.perms, granted))
      return { ...node, children, actions }
    })
    .filter((node) => (node.type === 'dir' ? !!node.children && node.children.length > 0 : true))
}

export function getMenusByRole(role: Role): UserInfoResI[] {
  // console.log('rolePermissions[role]',filterMenuTree(allMenus, rolePermissions[role] || []))
  return filterMenuTree(allMenus, rolePermissions[role] || [])
}
