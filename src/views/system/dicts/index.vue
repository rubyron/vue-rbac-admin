<template>
  <div class="page">
    <div class="page__header">
      <h2>字典维护</h2>
      <p>维护业务字典项与键值数据。</p>
    </div>
    <el-card shadow="never">
      <div class="page__toolbar">
        <el-input v-model="keyword" placeholder="按字典名称/编码搜索" clearable class="page__search" />
        <el-button type="primary" @click="openCreateDialog">新建字典</el-button>
      </div>

      <el-table :data="filteredRows" border stripe>
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="name" label="字典名称" min-width="180" />
        <el-table-column prop="code" label="字典编码" min-width="180" />
        <el-table-column prop="value" label="字典值" min-width="220" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑字典' : '新建字典'" width="520px" destroy-on-close>
      <el-form ref="formRef" :model="formModel" :rules="rules" label-width="90px">
        <el-form-item label="字典名称" prop="name"><el-input v-model="formModel.name" /></el-form-item>
        <el-form-item label="字典编码" prop="code"><el-input v-model="formModel.code" :disabled="isEdit" /></el-form-item>
        <el-form-item label="字典值" prop="value"><el-input v-model="formModel.value" /></el-form-item>
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
interface DictItem { id: number; name: string; code: string; value: string }
const rows = ref<DictItem[]>([
  { id: 1, name: '工单状态', code: 'ticket_status', value: 'pending,processing,closed' },
  { id: 2, name: '优先级', code: 'ticket_priority', value: 'P1,P2,P3' },
  { id: 3, name: '消息类型', code: 'message_type', value: 'system,biz,notice' },
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
const defaultForm = () => ({ name: '', code: '', value: '' })
const formModel = reactive(defaultForm())
const rules: FormRules = {
  name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入字典编码', trigger: 'blur' }],
  value: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
}
function openCreateDialog() { isEdit.value = false; editId.value = null; Object.assign(formModel, defaultForm()); dialogVisible.value = true }
function openEditDialog(row: DictItem) { isEdit.value = true; editId.value = row.id; Object.assign(formModel, row); dialogVisible.value = true }
async function submitForm() {
  const valid = await formRef.value?.validate().catch(() => false); if (!valid) return
  if (isEdit.value && editId.value !== null) {
    const idx = rows.value.findIndex((item) => item.id === editId.value)
    if (idx >= 0) rows.value[idx] = { ...rows.value[idx], ...formModel }
    ElMessage.success('字典更新成功')
  } else { rows.value.unshift({ id: Date.now(), ...formModel }); ElMessage.success('字典创建成功') }
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
