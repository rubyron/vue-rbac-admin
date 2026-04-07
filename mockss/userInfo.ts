import type { UserInfoResI } from '@/types/api'
import type{ MockMethod } from 'vite-plugin-mock'
const adminMenu:UserInfoResI[]=[
  {
    "id": "m_dashboard",
    "type": "menu",
    "path": "/dashboard",
    "name": "Dashboard",
    "component": "dashboard",
    "perms": ["dashboard:view"],
    "meta": {
      "title": "工作台",
      "icon": "Dashboard",
      "order": 1,
      "keepAlive": true
    }
  },
  {
    "id": "d_ticket",
    "type": "dir",
    "path": "/tickets",
    "name": "TicketsManage",
    "perms": ["ticket:read"],
    "meta": {
      "title": "工单管理",
      "icon": "Tickets",
      "order": 2
    },
    "children": [
      {
        "id": "m_ticket_list",
        "type": "menu",
        "path": "/tickets/list",
        "name": "TicketList",
        "component": "tickets/list",
        "perms": ["ticket:read"],
        "actions": [
          { "id": "b_ticket_create", "type": "button", "perms": ["ticket:create"], "label": "新建工单" },
          { "id": "b_ticket_edit", "type": "button", "perms": ["ticket:update"], "label": "编辑工单" },
          { "id": "b_ticket_assign", "type": "button", "perms": ["ticket:assign"], "label": "指派" },
          { "id": "b_ticket_close", "type": "button", "perms": ["ticket:close"], "label": "关闭" },
          { "id": "b_ticket_export", "type": "button", "perms": ["ticket:export"], "label": "导出" }
        ],
        "meta": {
          "title": "工单列表",
          "icon": "List",
          "order": 1,
          "keepAlive": true
        }
      },
      {
        "id": "m_ticket_detail",
        "type": "menu",
        "path": "/tickets/detail/:id",
        "name": "TicketDetail",
        "component": "tickets/detail",
        "perms": ["ticket:read"],
        "meta": {
          "title": "工单详情",
          "hidden": true,
          "activeMenu": "/tickets/list"
        }
      },
      {
        "id": "m_ticket_create",
        "type": "menu",
        "path": "/tickets/create",
        "name": "TicketCreate",
        "component": "tickets/form",
        "perms": ["ticket:create"],
        "meta": {
          "title": "新建工单",
          "hidden": true,
          "activeMenu": "/tickets/list"
        }
      },
      {
        "id": "m_ticket_edit",
        "type": "menu",
        "path": "/tickets/edit/:id",
        "name": "TicketEdit",
        "component": "tickets/form",
        "perms": ["ticket:update"],
        "meta": {
          "title": "编辑工单",
          "hidden": true,
          "activeMenu": "/tickets/list"
        }
      }
    ]
  },
  {
    "id": "d_customer",
    "type": "dir",
    "path": "/customers",
    "name": "CustomersRoot",
    "perms": ["customer:read"],
    "meta": {
      "title": "客户管理",
      "icon": "Users",
      "order": 3
    },
    "children": [
      {
        "id": "m_customer_list",
        "type": "menu",
        "path": "/customers/list",
        "name": "CustomerList",
        "component": "customers/list",
        "perms": ["customer:read"],
        "actions": [
          { "id": "b_customer_create", "type": "button", "perms": ["customer:create"], "label": "新建客户" },
          { "id": "b_customer_edit", "type": "button", "perms": ["customer:update"], "label": "编辑客户" },
          { "id": "b_customer_tag", "type": "button", "perms": ["customer:tag"], "label": "打标签" }
        ],
        "meta": {
          "title": "客户列表",
          "icon": "List",
          "order": 1,
          "keepAlive": true
        }
      },
      {
        "id": "m_customer_detail",
        "type": "menu",
        "path": "/customers/detail/:id",
        "name": "CustomerDetail",
        "component": "customers/detail",
        "perms": ["customer:read"],
        "meta": {
          "title": "客户详情",
          "hidden": true,
          "activeMenu": "/customers/list"
        }
      }
    ]
  },
  {
    "id": "d_system",
    "type": "dir",
    "path": "/system",
    "name": "SystemRoot",
    "perms": ["system:access"],
    "meta": {
      "title": "系统管理",
      "icon": "Setting",
      "order": 99
    },
    "children": [
      {
        "id": "m_user_mgmt",
        "type": "menu",
        "path": "/system/users",
        "name": "UserMgmt",
        "component": "system/users",
        "perms": ["user:read"],
        "actions": [
          { "id": "b_user_create", "type": "button", "perms": ["user:create"], "label": "新建用户" },
          { "id": "b_user_edit", "type": "button", "perms": ["user:update"], "label": "编辑用户" },
          { "id": "b_user_resetpwd", "type": "button", "perms": ["user:resetpwd"], "label": "重置密码" }
        ],
        "meta": {
          "title": "用户管理",
          "icon": "User",
          "order": 1
        }
      },
      {
        "id": "m_role_mgmt",
        "type": "menu",
        "path": "/system/roles",
        "name": "RoleMgmt",
        "component": "system/roles",
        "perms": ["role:read"],
        "actions": [
          { "id": "b_role_create", "type": "button", "perms": ["role:create"], "label": "新建角色" },
          { "id": "b_role_edit", "type": "button", "perms": ["role:update"], "label": "编辑角色" },
          { "id": "b_role_perm", "type": "button", "perms": ["role:grant"], "label": "配置权限" }
        ],
        "meta": {
          "title": "角色管理",
          "icon": "Shield",
          "order": 2
        }
      },
      {
        "id": "m_menu_mgmt",
        "type": "menu",
        "path": "/system/menus",
        "name": "MenuMgmt",
        "component": "system/menus",
        "perms": ["menu:read"],
        "actions": [
          { "id": "b_menu_create", "type": "button", "perms": ["menu:create"], "label": "新建菜单" },
          { "id": "b_menu_edit", "type": "button", "perms": ["menu:update"], "label": "编辑菜单" }
        ],
        "meta": {
          "title": "菜单管理",
          "icon": "Menu",
          "order": 3
        }
      }
    ]
  }
]


                    const userMenu:UserInfoResI[]=[
  {
    "id": "m_dashboard",
    "type": "menu",
    "path": "/dashboard",
    "name": "Dashboard",
    "component": "dashboard",
    "perms": ["dashboard:view"],
    "meta": {
      "title": "工作台",
      "icon": "Dashboard",
      "order": 1,
      "keepAlive": true
    }
  },
  {
    "id": "d_ticket",
    "type": "dir",
    "path": "/tickets",
    "name": "TicketsManage",
    "perms": ["ticket:read"],
    "meta": {
      "title": "工单管理",
      "icon": "Tickets",
      "order": 2
    },
    "children": [
      {
        "id": "m_ticket_list",
        "type": "menu",
        "path": "/tickets/list",
        "name": "TicketList",
        "component": "tickets/list",
        "perms": ["ticket:read"],
        "actions": [
          { "id": "b_ticket_create", "type": "button", "perms": ["ticket:create"], "label": "新建工单" },
          { "id": "b_ticket_edit", "type": "button", "perms": ["ticket:update"], "label": "编辑工单" },
          { "id": "b_ticket_close", "type": "button", "perms": ["ticket:close"], "label": "关闭" }
        ],
        "meta": {
          "title": "工单列表",
          "icon": "List",
          "order": 1,
          "keepAlive": true
        }
      },
      {
        "id": "m_ticket_detail",
        "type": "menu",
        "path": "/tickets/detail/:id",
        "name": "TicketDetail",
        "component": "tickets/detail",
        "perms": ["ticket:read"],
        "meta": {
          "title": "工单详情",
          "hidden": true,
          "activeMenu": "/tickets/list"
        }
      }
    ]
  }
]


                    type Role = 'admin' | 'user'

// ✅ 给 query 做一个类型（并允许缺省）
type Query = {
  role?: Role
}
export default [
    {
        url: '/api/userInfo',
        method: 'get',
        response: ({query}:{query:Query}):{ code: number; data: UserInfoResI[] } => {
 const role = query?.role ?? 'user'
             return {
                "code": 200,
                "data": role === 'admin' ? adminMenu : userMenu
            }
        }
    }
] as MockMethod[]
