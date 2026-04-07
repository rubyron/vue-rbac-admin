<template>
  <div class="page">
    <div class="page__header">
      <h2>权限管理</h2>
      <p>维护权限点与权限编码，用于角色授权。</p>
    </div>
    <el-card shadow="never">
      <div class="page__toolbar">
        <el-input v-model="keyword" placeholder="按权限名/编码搜索" clearable class="page__search" />
        <el-button type="primary" @click="openCreateDialog">新建权限</el-button>
      </div>

      <el-table :data="filteredRows" border stripe>
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="name" label="权限名称" min-width="180" />
        <el-table-column prop="code" label="权限编码" min-width="220" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑权限' : '新建权限'" width="520px" destroy-on-close>
      <el-form ref="formRef" :model="formModel" :rules="rules" label-width="90px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formModel.name" />
        </el-form-item>
        <el-form-item label="权限编码" prop="code">
          <el-input v-model="formModel.code" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="formModel.type" class="w-full">
            <el-option label="页面" value="page" />
            <el-option label="操作" value="action" />
          </el-select>
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
import { computed, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
type PermissionType = 'page' | 'action'
interface PermissionItem { id: number; name: string; code: string; type: PermissionType }
const rows = ref<PermissionItem[]>([
  { id: 1, name: '用户查询', code: 'user:read', type: 'page' },
  { id: 2, name: '用户新建', code: 'user:create', type: 'action' },
  { id: 3, name: '角色配置', code: 'role:update', type: 'action' },
])
const keyword = ref('')
const filteredRows = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return rows.value
  return rows.value.filter((r) => r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q))
})
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const defaultForm = () => ({ name: '', code: '', type: 'page' as PermissionType })
const formModel = reactive(defaultForm())
const rules: FormRules = {
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入权限编码', trigger: 'blur' }],
  type: [{ required: true, message: '请选择权限类型', trigger: 'change' }],
}
function openCreateDialog() { isEdit.value = false; editId.value = null; Object.assign(formModel, defaultForm()); dialogVisible.value = true }
function openEditDialog(row: PermissionItem) { isEdit.value = true; editId.value = row.id; Object.assign(formModel, row); dialogVisible.value = true }
async function submitForm() {
  const valid = await formRef.value?.validate().catch(() => false); if (!valid) return
  if (isEdit.value && editId.value !== null) {
    const idx = rows.value.findIndex((item) => item.id === editId.value)
    if (idx >= 0) rows.value[idx] = { ...rows.value[idx], ...formModel }
    ElMessage.success('权限更新成功')
  } else { rows.value.unshift({ id: Date.now(), ...formModel }); ElMessage.success('权限创建成功') }
  dialogVisible.value = false
}
</script>

<style scoped lang="scss">
.page { padding: 16px; }
.page__header { margin-bottom: 12px; }
.page__toolbar { display: flex; justify-content: space-between; margin-bottom: 12px; gap: 12px; }
.page__search { width: 320px; }
.w-full { width: 100%; }
h2 { margin: 0 0 6px; font-size: 20px; color: #303133; }
p { margin: 0; font-size: 13px; color: #909399; }
</style>
