<template>
  <div class="role-perm-page">
    <div class="role-perm-page__header">
      <h2>角色管理</h2>
      <p>选择角色后，在右侧通过「菜单分配」树勾选该角色可访问的菜单与操作权限。</p>
    </div>

    <div class="role-perm-page__body">
      <el-card shadow="never" class="role-perm-page__roles">
        <template #header>
          <span>角色列表</span>
        </template>
        <el-input
          v-model="roleKeyword"
          placeholder="搜索角色"
          clearable
          class="role-perm-page__role-search"
        />
        <el-scrollbar max-height="calc(100vh - 240px)">
          <ul class="role-perm-page__role-list">
            <li
              v-for="r in filteredRoleOptions"
              :key="r.code"
              :class="['role-item', { 'is-active': r.code === selectedRole }]"
              @click="selectRole(r.code)"
            >
              <div class="role-item__name">{{ r.name }}</div>
              <div class="role-item__code">{{ r.code }}</div>
            </li>
          </ul>
        </el-scrollbar>
      </el-card>

      <el-card shadow="never" class="role-perm-page__tree-card">
        <div class="role-perm-page__tree-head">
          <div class="role-perm-page__tree-title">
            <span class="label">菜单</span>
            <span class="title">菜单分配</span>
            <el-tag v-if="selectedRole === 'super_admin'" type="warning" size="small">全部权限</el-tag>
          </div>
          <div class="role-perm-page__tree-tools">
            <el-input
              v-model="filterText"
              placeholder="搜索权限"
              clearable
              :prefix-icon="Search"
              class="role-perm-page__filter-input"
            />
            <el-button type="primary" :disabled="selectedRole === 'super_admin'" @click="savePermissions">
              保存
            </el-button>
          </div>
        </div>

        <el-alert
          v-if="selectedRole === 'super_admin'"
          type="info"
          :closable="false"
          show-icon
          class="role-perm-page__alert"
          title="超级管理员固定拥有全部权限，无需配置。"
        />

        <el-tree
          v-if="treeData.length"
          ref="treeRef"
          class="role-perm-page__tree"
          :data="treeData"
          node-key="id"
          show-checkbox
          :props="treeProps"
          :default-expand-all="true"
          :filter-node-method="filterNode"
          :disabled="selectedRole === 'super_admin'"
          highlight-current
        />
        <el-empty v-else description="暂无权限树数据" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { ElTree } from 'element-plus'
import type { Role } from '@/mocks/handlers/rbac'
import { allMenus, rolePermissions } from '@/mocks/handlers/rbac'
import {
  buildPermissionTree,
  computeCheckedIds,
  type PermTreeNode,
} from '@/utils/permissionTree'

const STORAGE_KEY = 'rbac_role_perm_overrides_v1'

const roleOptions: { code: Role; name: string; description: string }[] = [
  { code: 'super_admin', name: '超级管理员', description: '系统全部权限' },
  { code: 'system_admin', name: '系统管理员', description: '系统管理与部分工作台' },
  { code: 'employee', name: '普通员工', description: '工单与消息中心' },
  { code: 'support', name: '客服', description: '工单处理与报表' },
  { code: 'engineer', name: '工程师', description: '待处理与工单执行' },
]

const selectedRole = ref<Role>('system_admin')
const roleKeyword = ref('')
const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()

const treeProps = { label: 'label', children: 'children' }

const filteredRoleOptions = computed(() => {
  const q = roleKeyword.value.trim().toLowerCase()
  if (!q) return roleOptions
  return roleOptions.filter(
    (r) => r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q)
  )
})

/** 合并默认 mock 与本地保存的覆盖 */
function loadMergedPermissions(): Record<Role, string[]> {
  const base = { ...rolePermissions } as Record<Role, string[]>
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Record<Role, string[]>>
      for (const k of Object.keys(parsed) as Role[]) {
        if (parsed[k]) base[k] = parsed[k]!
      }
    }
  } catch {
    /* ignore */
  }
  return base
}

const permByRole = ref<Record<Role, string[]>>(loadMergedPermissions())

const treeData = computed<PermTreeNode[]>(() => buildPermissionTree(allMenus))
console.log('treeData',treeData)
function currentGranted(): string[] {
  return permByRole.value[selectedRole.value] ?? []
}

function applyCheckedKeys() {
  const granted = currentGranted()
  const superAdmin = selectedRole.value === 'super_admin'
  const keys = computeCheckedIds(treeData.value, granted, superAdmin)
  nextTick(() => {
    treeRef.value?.setCheckedKeys(keys)
  })
}

function selectRole(code: Role) {
  selectedRole.value = code
}

watch(selectedRole, () => {
  applyCheckedKeys()
})

watch(filterText, (val) => {
  treeRef.value?.filter(val)
})

function filterNode(value: string, data: PermTreeNode) {
  if (!value) return true
  return data.label.toLowerCase().includes(value.toLowerCase())
}

function savePermissions() {
  if (selectedRole.value === 'super_admin') {
    ElMessage.warning('超级管理员无需保存')
    return
  }
  const nodes = treeRef.value?.getCheckedNodes(false, false) ?? []
  const perms = [
    ...new Set(
      nodes
        .map((n: any) => n.perm ?? n.data?.perm)
        .filter((p): p is string => typeof p === 'string' && p.length > 0)
    ),
  ]
  permByRole.value = {
    ...permByRole.value,
    [selectedRole.value]: perms,
  }
  try {
    const toSave: Partial<Record<Role, string[]>> = {}
    for (const r of Object.keys(permByRole.value) as Role[]) {
      if (r === 'super_admin') continue
      toSave[r] = permByRole.value[r]
    }
    console.log('save',toSave)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch {
    /* ignore */
  }
  ElMessage.success('权限已保存（本地演示，刷新后仍可从本地读取）')
}

onMounted(() => {
  applyCheckedKeys()
})
</script>

<style scoped lang="scss">
.role-perm-page {
  padding: 16px;
}

.role-perm-page__header {
  margin-bottom: 16px;

  h2 {
    margin: 0 0 6px;
    font-size: 20px;
    color: #303133;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: #909399;
  }
}

.role-perm-page__body {
  display: flex;
  gap: 16px;
  align-items: stretch;
}

.role-perm-page__roles {
  width: 280px;
  flex-shrink: 0;
}

.role-perm-page__tree-card {
  flex: 1;
  min-width: 0;
}

.role-perm-page__role-search {
  margin-bottom: 12px;
}

.role-perm-page__role-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.role-item {
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: #f5f7fa;
  }

  &.is-active {
    background: #ecf5ff;
    border-color: #b3d8ff;
  }
}

.role-item__name {
  font-weight: 500;
  color: #303133;
  font-size: 14px;
}

.role-item__code {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.role-perm-page__tree-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.role-perm-page__tree-title {
  display: flex;
  align-items: center;
  gap: 10px;

  .label {
    font-size: 13px;
    color: #909399;
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }
}

.role-perm-page__tree-tools {
  display: flex;
  align-items: center;
  gap: 10px;
}

.role-perm-page__filter-input {
  width: 220px;
}

.role-perm-page__alert {
  margin-bottom: 12px;
}

.role-perm-page__tree {
  max-height: calc(100vh - 280px);
  overflow: auto;
  padding: 8px 0;
}
</style>
