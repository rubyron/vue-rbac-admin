<template>
  <div class="page">
    <div class="page__header">
      <h2>菜单维护</h2>
      <p>维护菜单名称、路径和组件路径。</p>
    </div>
    <el-card shadow="never">
      <div class="page__toolbar">
        <el-input v-model="keyword" placeholder="按菜单名/路径搜索" clearable class="page__search" />
        <el-button type="primary" @click="openCreateDialog">新建菜单</el-button>
      </div>
      <el-table :data="filteredRows" border stripe row-key="id">
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="name" label="菜单名称" min-width="180" />
        <el-table-column prop="path" label="路由路径" min-width="220" />
        <el-table-column prop="component" label="组件路径" min-width="220" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑菜单' : '新建菜单'" width="560px" destroy-on-close>
      <el-form ref="formRef" :model="formModel" :rules="rules" label-width="90px">
        <el-form-item label="菜单名称" prop="name"><el-input v-model="formModel.name" /></el-form-item>
        <el-form-item label="路由路径" prop="path"><el-input v-model="formModel.path" /></el-form-item>
        <el-form-item label="组件路径" prop="component"><el-input v-model="formModel.component" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
interface MenuItem { id: number; name: string; path: string; component: string }
const rows = ref<MenuItem[]>([
  { id: 1, name: '用户管理', path: '/system/users', component: 'system/users' },
  { id: 2, name: '角色管理', path: '/system/roles', component: 'system/roles' },
  { id: 3, name: '权限管理', path: '/system/permissions', component: 'system/permissions' },
])
const keyword = ref('')
const filteredRows = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return rows.value
  return rows.value.filter((r) => r.name.toLowerCase().includes(q) || r.path.toLowerCase().includes(q))
})
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const defaultForm = () => ({ name: '', path: '', component: '' })
const formModel = reactive(defaultForm())
const rules: FormRules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
  component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
}
function openCreateDialog() { isEdit.value = false; editId.value = null; Object.assign(formModel, defaultForm()); dialogVisible.value = true }
function openEditDialog(row: MenuItem) { isEdit.value = true; editId.value = row.id; Object.assign(formModel, row); dialogVisible.value = true }
async function submitForm() {
  const valid = await formRef.value?.validate().catch(() => false); if (!valid) return
  if (isEdit.value && editId.value !== null) {
    const idx = rows.value.findIndex((item) => item.id === editId.value)
    if (idx >= 0) rows.value[idx] = { ...rows.value[idx], ...formModel }
    ElMessage.success('菜单更新成功')
  } else { rows.value.unshift({ id: Date.now(), ...formModel }); ElMessage.success('菜单创建成功') }
  dialogVisible.value = false
}
</script>

<style scoped lang="scss">
.page { padding: 16px; }
.page__header { margin-bottom: 12px; }
.page__toolbar { display: flex; justify-content: space-between; margin-bottom: 12px; gap: 12px; }
.page__search { width: 320px; }
h2 { margin: 0 0 6px; font-size: 20px; color: #303133; }
p { margin: 0; font-size: 13px; color: #909399; }
</style>
