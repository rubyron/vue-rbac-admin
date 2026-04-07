import type { UserInfoResI } from '@/types/api'

/** Element Plus 权限树节点：仅叶子节点带 perm，用于勾选保存 */
export interface PermTreeNode {
  id: string
  label: string
  /** 权限点编码；目录节点无此字段 */
  perm?: string
  children?: PermTreeNode[]
}

function titleOf(n: UserInfoResI): string {
  return n.meta?.title ?? n.name ?? n.id
}

/**
 * 将后端菜单树转为「菜单分配」树：目录/菜单为父节点，页面访问与各按钮为叶子权限点。
 */
export function buildPermissionTree(menus: UserInfoResI[]): PermTreeNode[] {
  const walk = (nodes: UserInfoResI[]): PermTreeNode[] => {
    return nodes.map((n) => {
      if (n.type === 'dir' || (n.children && n.children.length > 0)) {
        return {
          id: n.id,
          label: titleOf(n),
          children: walk(n.children ?? []),
        }
      }

      // 菜单：父节点为模块名，子节点为页面权限 + 操作按钮
      const label = titleOf(n)
      const leaves: PermTreeNode[] = []
      const perms = n.perms ?? []
      perms.forEach((p, i) => {
        leaves.push({
          id: `${n.id}__page_${i}`,
          label: perms.length > 1 ? `页面（${p}）` : '页面访问',
          perm: p,
        })
      })
      for (const a of n.actions ?? []) {
        const code = a.perms?.[0]
        if (!code) continue
        leaves.push({
          id: a.id,
          label: a.label,
          perm: code,
        })
      }

      if (leaves.length === 0) {
        return { id: n.id, label, children: undefined }
      }
      return { id: n.id, label, children: leaves }
    })
  }
  return walk(menus)
}

/** 收集树中所有权限编码（叶子） */
export function collectAllPerms(nodes: PermTreeNode[], out = new Set<string>()) {
  for (const n of nodes) {
    if (n.perm) out.add(n.perm)
    if (n.children?.length) collectAllPerms(n.children, out)
  }
  return out
}

/** 根据权限列表计算应勾选的节点 id（用于 setCheckedKeys） */
export function computeCheckedIds(
  nodes: PermTreeNode[],
  granted: string[],
  superAdmin = false
): string[] {
  if (superAdmin || granted.includes('*')) {
    const ids: string[] = []
    const walk = (list: PermTreeNode[]) => {
      for (const n of list) {
        if (n.perm) ids.push(n.id)
        if (n.children?.length) walk(n.children)
      }
    }
    walk(nodes)
    return ids
  }
  const set = new Set(granted)
  const ids: string[] = []
  const walk = (list: PermTreeNode[]) => {
    for (const n of list) {
      if (n.perm && set.has(n.perm)) ids.push(n.id)
      if (n.children?.length) walk(n.children)
    }
  }
  walk(nodes)
  return ids
}
