<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getTicketDetail } from '@/api/tickets'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const ticket = ref<Record<string, any> | null>(null)

const ticketId = computed(() => String(route.params.id || ''))

const statusLabel: Record<string, string> = {
  OPEN: '待受理',
  PENDING: '处理中',
  RESOLVED: '已解决',
  CLOSED: '已关闭',
}

async function load() {
  if (!ticketId.value) return
  loading.value = true
  ticket.value = null
  try {
    const res = await getTicketDetail(ticketId.value)
    ticket.value = res.data
  } catch {
    ElMessage.error('加载工单失败或工单不存在')
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(ticketId, () => load())

function goBack() {
  router.back()
}
</script>

<template>
  <div v-loading="loading" class="ticket-detail">
    <div class="ticket-detail__head">
      <el-button link type="primary" @click="goBack">← 返回</el-button>
      <h2 v-if="ticket">工单详情</h2>
    </div>

    <el-empty v-if="!loading && !ticket" description="未找到工单" />

    <el-card v-else-if="ticket" shadow="never">
      <template #header>
        <div class="ticket-detail__title">
          <span class="ticket-detail__no">{{ ticket.no }}</span>
          <el-tag>{{ statusLabel[ticket.status] || ticket.status }}</el-tag>
          <el-tag type="info">{{ ticket.priority }}</el-tag>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="标题" :span="2">{{ ticket.title }}</el-descriptions-item>
        <el-descriptions-item label="客户">{{ ticket.customerName }}</el-descriptions-item>
        <el-descriptions-item label="处理人">{{ ticket.assigneeName || '未分派' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ ticket.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ ticket.updatedAt }}</el-descriptions-item>
        <el-descriptions-item label="SLA 截止">{{ ticket.slaDueAt }}</el-descriptions-item>
        <el-descriptions-item label="标签" :span="2">
          <el-tag v-for="tag in ticket.tags || []" :key="tag" size="small" class="ticket-detail__tag">
            {{ tag }}
          </el-tag>
          <span v-if="!(ticket.tags && ticket.tags.length)">—</span>
        </el-descriptions-item>
        <el-descriptions-item label="详细说明" :span="2">
          <div class="ticket-detail__desc">{{ ticket.description || '无' }}</div>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.ticket-detail {
  padding: 16px;
}

.ticket-detail__head {
  margin-bottom: 12px;

  h2 {
    margin: 8px 0 0;
    font-size: 20px;
    color: #303133;
  }
}

.ticket-detail__title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.ticket-detail__no {
  font-weight: 600;
  font-size: 16px;
}

.ticket-detail__tag {
  margin-right: 6px;
}

.ticket-detail__desc {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #606266;
}
</style>
