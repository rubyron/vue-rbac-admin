import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo } from '@/api/user' // 假设这个接口会返回角色和权限数据
import type { RouteRecordRaw } from 'vue-router'
import { getRole } from '@/utils/token'
import type {UserInfoResI, ActionI} from '@/types/api.ts'

const viewModules = import.meta.glob('@/views/**/*.vue')

function resolveComponent(path?: string) {
  if (!path) return undefined
  const key = `/src/views/${path}/index.vue`
  console.log('viewModules',key,viewModules)
  return viewModules[key] || (() => import('@/views/error/NotFound.vue'))
}

function buildRoutes(tree: UserInfoResI[]): RouteRecordRaw[] {
  return tree.map(n => ({
    path: n.path,
    name: n.name,
    component: resolveComponent(n.component),
    meta: {
      title:n.name,
      icon: n.icon,
      permissions: n.permissions
    },
    children: n.children ? buildRoutes(n.children) : []
  }))
}


function collectPermissions(
  tree: UserInfoResI[],
  pagePermsMap: Map<string, Set<string>> = new Map()
) {
  const walk = (n: UserInfoResI) => {
    if (n.type === "menu" && n.name) {
      const set = pagePermsMap.get(n.name) ?? new Set<string>();

      // 按钮 perms
      n.actions && n.actions?.forEach((action:ActionI) => {
        action.perms?.forEach((p:string)=> set.add(p));
      });

      n.actions && pagePermsMap.set(n.name, set);
    }

    n.children?.forEach(walk);
  };

  tree.forEach(walk);
  return pagePermsMap;
}

export const useUserStore = defineStore('user', () => {
  const routes = ref<RouteRecordRaw[]>([])
  const menuTree = ref<UserInfoResI[]>([])
  const pagePermissionMap = ref<Map<string, Set<string>>>(new Map())

  // function hasPerm(code: string) {
  //   return permissionSet.value.has(code)
  // }

  // 获取用户权限数据
  async function initRoutes() {
    const role=getRole()
    const res = await getUserInfo(role) // 假设这个接口需要 token 来获取权限数据
    menuTree.value = res.data
    routes.value = buildRoutes(res.data)
    pagePermissionMap.value = collectPermissions(res.data)
    console.log('permissionSet',pagePermissionMap.value)
  }

const clearMenuTree=()=> {
    menuTree.value = []
  }
  return {
    routes,
    menuTree,
    pagePermissionMap,
    // hasPerm,
    initRoutes,
    clearMenuTree
  }
})
