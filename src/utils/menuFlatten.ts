import type { UserInfoResI } from '@/types/api'

/** 从权限菜单树提取可点击的菜单项（用于工作台「常用入口」） */
export function flattenMenuEntries(
  items: UserInfoResI[]
): { title: string; path: string; icon?: string }[] {
  const out: { title: string; path: string; icon?: string }[] = []
  const walk = (nodes: UserInfoResI[]) => {
    for (const n of nodes) {
      if (n.type === 'menu' && n.path && n.meta?.title) {
        out.push({
          title: n.meta.title as string,
          path: n.path,
          icon: n.meta.icon as string | undefined,
        })
      }
      if (n.children?.length) walk(n.children)
    }
  }
  walk(items)
  return out
}
