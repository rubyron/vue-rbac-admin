<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import {
  createTicket,
  evaluateTicket,
  getTicketDetail,
  revokeTicket,
  supplementTicket,
  updateTicket,
} from '@/api/tickets'
import { usePagePermission } from '@/composables/usePagePermission'

type ActionType = 'create' | 'edit' | 'revoke' | 'supplement' | 'evaluate'

const route = useRoute()
const router = useRouter()
const { can } = usePagePermission()
const formRef = ref<FormInstance>()
const submitting = ref(false)
const loadingDetail = ref(false)

const form = reactive({
  id: '',
  title: '',
  priority: 'P2',
  description: '',
  revokeReason: '',
  supplementContent: '',
  rating: 5,
  evaluateComment: '',
})

const action = ref<ActionType>('create')
const actionOptions = computed(() => {
  const options: Array<{ label: string; value: ActionType; disabled: boolean }> = [
    { label: '创建', value: 'create', disabled: !can('ticket:create') },
    { label: '编辑', value: 'edit', disabled: !can('ticket:edit') },
    { label: '撤销', value: 'revoke', disabled: !can('ticket:revoke') },
    { label: '补充', value: 'supplement', disabled: !can('ticket:supplement') },
    { label: '评价', value: 'evaluate', disabled: !can('ticket:evaluate') },
  ]
  return options
})

const actionMeta = computed(() => {
  const map: Record<ActionType, { title: string; desc: string; submit: string }> = {
    create: { title: '新建工单', desc: '填写工单基础信息并提交。', submit: '创建' },
    edit: { title: '编辑工单', desc: '修改已创建工单的标题/优先级/说明。', submit: '保存修改' },
    revoke: { title: '撤销工单', desc: '撤销后工单将置为关闭状态。', submit: '确认撤销' },
    supplement: { title: '补充工单', desc: '补充更多上下文、日志或说明信息。', submit: '提交补充' },
    evaluate: { title: '工单评价', desc: '对处理结果进行满意度评价。', submit: '提交评价' },
  }
  return map[action.value]
})

const rules: FormRules = {
  id: [{ required: true, message: '请输入工单ID', trigger: 'blur' }],
  title: [{ required: true, message: '请输入工单标题', trigger: 'blur' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  revokeReason: [{ required: true, message: '请输入撤销原因', trigger: 'blur' }],
  supplementContent: [{ required: true, message: '请输入补充内容', trigger: 'blur' }],
  rating: [{ required: true, message: '请选择评分', trigger: 'change' }],
}

const needTicketId = computed(() => action.value !== 'create')
const isEditMode = computed(() => action.value === 'edit')

async function loadTicketById() {
  if (!form.id) return
  loadingDetail.value = true
  try {
    const res = await getTicketDetail(form.id)
    const row = res.data || {}
    form.title = row.title || ''
    form.priority = row.priority || 'P2'
    form.description = row.description || ''
  } catch {
    ElMessage.error('工单加载失败，请检查工单 ID')
  } finally {
    loadingDetail.value = false
  }
}

function initFromRoute() {
  const qAction = String(route.query.action || '')
  const validActions: ActionType[] = ['create', 'edit', 'revoke', 'supplement', 'evaluate']
  if (validActions.includes(qAction as ActionType)) {
    action.value = qAction as ActionType
  } else {
    const first = actionOptions.value.find((x) => !x.disabled)
    action.value = first?.value ?? 'create'
  }
  form.id = String(route.query.id || route.params.id || '')
  if (form.id) loadTicketById()
}

async function onSubmit() {
  const ok = await formRef.value?.validate().catch(() => false)
  if (!ok) return
  submitting.value = true
  try {
    if (action.value === 'create') {
      await createTicket({
        title: form.title,
        priority: form.priority,
        description: form.description,
      })
      ElMessage.success('工单已创建')
    } else if (action.value === 'edit') {
      await updateTicket(form.id, {
        title: form.title,
        priority: form.priority,
        description: form.description,
      })
      ElMessage.success('工单已更新')
    } else if (action.value === 'revoke') {
      await revokeTicket(form.id, { reason: form.revokeReason })
      ElMessage.success('工单已撤销')
    } else if (action.value === 'supplement') {
      await supplementTicket(form.id, { content: form.supplementContent })
      ElMessage.success('补充信息已提交')
    } else {
      await evaluateTicket(form.id, {
        rating: form.rating,
        comment: form.evaluateComment,
      })
      ElMessage.success('评价已提交')
    }
    router.push({ name: 'MyTickets' })
  } finally {
    submitting.value = false
  }
}

function onCancel() {
  router.back()
}

onMounted(() => {
  initFromRoute()
})
</script>

<template>
  <div class="ticket-form-page">
    <div class="ticket-form-page__head">
      <h2>{{ actionMeta.title }}</h2>
      <p>{{ actionMeta.desc }}</p>
    </div>

    <el-card shadow="never" class="ticket-form-page__card">
      <div class="ticket-form-page__action-switch">
        <el-radio-group v-model="action">
          <el-radio-button
            v-for="item in actionOptions"
            :key="item.value"
            :label="item.value"
            :disabled="item.disabled"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="88px" style="max-width: 640px">
        <el-form-item v-if="needTicketId" label="工单ID" prop="id">
          <div class="ticket-form-page__id-row">
            <el-input v-model="form.id" placeholder="请输入工单ID，例如 t_001" />
            <el-button :loading="loadingDetail" @click="loadTicketById">加载</el-button>
          </div>
        </el-form-item>

        <el-form-item v-if="action === 'create' || action === 'edit'" label="标题" prop="title">
          <el-input v-model="form.title" placeholder="简要描述问题或需求" maxlength="120" show-word-limit />
        </el-form-item>
        <el-form-item v-if="action === 'create' || action === 'edit'" label="优先级" prop="priority">
          <el-select v-model="form.priority" placeholder="请选择" style="width: 200px">
            <el-option label="P0 紧急" value="P0" />
            <el-option label="P1 高" value="P1" />
            <el-option label="P2 中" value="P2" />
            <el-option label="P3 低" value="P3" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="action === 'create' || action === 'edit'" label="详细说明" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="6"
            placeholder="现象、复现步骤、期望结果等"
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>
        <el-form-item v-if="action === 'revoke'" label="撤销原因" prop="revokeReason">
          <el-input
            v-model="form.revokeReason"
            type="textarea"
            :rows="4"
            placeholder="请输入撤销原因"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item v-if="action === 'supplement'" label="补充内容" prop="supplementContent">
          <el-input
            v-model="form.supplementContent"
            type="textarea"
            :rows="5"
            placeholder="请输入补充说明/日志/截图信息"
            maxlength="1200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item v-if="action === 'evaluate'" label="评分" prop="rating">
          <el-rate v-model="form.rating" :max="5" />
        </el-form-item>
        <el-form-item v-if="action === 'evaluate'" label="评价说明">
          <el-input
            v-model="form.evaluateComment"
            type="textarea"
            :rows="4"
            placeholder="请输入评价说明（可选）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="onSubmit">{{ actionMeta.submit }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.ticket-form-page {
  padding: 16px;
}

.ticket-form-page__head {
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

.ticket-form-page__card {
  max-width: 720px;
}

.ticket-form-page__action-switch {
  margin-bottom: 16px;
}

.ticket-form-page__id-row {
  width: 100%;
  display: flex;
  gap: 8px;
}
</style>
