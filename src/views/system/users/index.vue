<template>
  <div class="user-manage-page">
    <div class="user-manage-page__header">
      <h2>用户管理</h2>
      <p>用于维护系统用户账号、角色绑定与状态。</p>
    </div>

    <BaseTable
      :data="rows"
      :total="total"
      :page="page"
      :page-size="pageSize"
      @page-change="onPageChange"
      @size-change="onSizeChange"
    >
      <template #toolbar>
        <div class="user-manage-page__toolbar">
        <el-input
          v-model="query.keyword"
          placeholder="按用户名/姓名搜索"
          clearable
          class="user-manage-page__search"
          @clear="onSearch"
          @input="onSearch"
        />
        <el-button type="primary" @click="openCreateDialog">新建用户</el-button>
      </div>
      </template>

      
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="username" label="用户名" min-width="140" />
        <el-table-column prop="name" label="姓名" min-width="140" />
        <el-table-column prop="role" label="角色" min-width="120">
          <template #default="{ row }">
            <el-tag>{{ roleLabelMap[row.role] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.status === 'enabled' ? 'success' : 'info'">
              {{ row.status === 'enabled' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="220" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
          </template>
        </el-table-column>
    </BaseTable>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '新建用户'"
      width="520px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formModel" :rules="rules" label-width="90px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formModel.username" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formModel.name" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formModel.role" class="w-full">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formModel.email" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formModel.status">
            <el-radio label="enabled">启用</el-radio>
            <el-radio label="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import BaseTable from '@/components/table/BaseTable.vue'
import { useLocalTable } from '@/composables/useLocalTable'

type UserRole = 'super_admin' | 'system_admin' | 'employee' | 'support' | 'engineer'
type UserStatus = 'enabled' | 'disabled'

interface UserItem {
  id: number
  username: string
  name: string
  role: UserRole
  status: UserStatus
  email: string
}

const roleOptions: Array<{ label: string; value: UserRole }> = [
  { label: '超级管理员', value: 'super_admin' },
  { label: '系统管理员', value: 'system_admin' },
  { label: '普通员工', value: 'employee' },
  { label: '客服', value: 'support' },
  { label: '工程师', value: 'engineer' },
]

const roleLabelMap: Record<UserRole, string> = {
  super_admin: '超级管理员',
  system_admin: '系统管理员',
  employee: '普通员工',
  support: '客服',
  engineer: '工程师',
}

const users = ref<UserItem[]>([
  { id: 1, username: 'root', name: '超级管理员', role: 'super_admin', status: 'enabled', email: 'root@demo.com' },
  { id: 2, username: 'sysadmin', name: '系统管理员', role: 'system_admin', status: 'enabled', email: 'sysadmin@demo.com' },
  { id: 3, username: 'employee', name: '普通员工A', role: 'employee', status: 'enabled', email: 'employee@demo.com' },
])

const {
  query,
  rows,
  total,
  page,
  pageSize,
  onSearch,
  onPageChange,
  onSizeChange,
} = useLocalTable<{ keyword: string }, UserItem>({
  initialQuery: { keyword: '' },
  source: () => users.value,
  filter: (items, q) => {
    const key = q.keyword.trim().toLowerCase()
    if (!key) return items
    return items.filter((u) => u.username.toLowerCase().includes(key) || u.name.toLowerCase().includes(key))
  },
  defaultPageSize: 10,
})

const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const getDefaultForm = () => ({
  username: '',
  name: '',
  role: 'employee' as UserRole,
  status: 'enabled' as UserStatus,
  email: '',
})
const formModel = reactive(getDefaultForm())

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
}

function resetFormModel() {
  Object.assign(formModel, getDefaultForm())
}

function openCreateDialog() {
  isEdit.value = false
  editId.value = null
  resetFormModel()
  dialogVisible.value = true
}

function openEditDialog(row: UserItem) {
  isEdit.value = true
  editId.value = row.id
  Object.assign(formModel, row)
  dialogVisible.value = true
}

async function submitForm() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  if (isEdit.value && editId.value !== null) {
    const idx = users.value.findIndex((u) => u.id === editId.value)
    if (idx >= 0) users.value[idx] = { ...users.value[idx], ...formModel }
    ElMessage.success('用户更新成功')
  } else {
    users.value.unshift({
      id: Date.now(),
      ...formModel,
    })
    ElMessage.success('用户创建成功')
  }

  dialogVisible.value = false
}
</script>

<style scoped lang="scss">
.user-manage-page {
  padding: 16px;
}

.user-manage-page__toolbar {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.user-manage-page__search {
  width: 320px;
}

.user-manage-page__header {
  margin-bottom: 12px;

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

.w-full {
  width: 100%;
}
</style>
