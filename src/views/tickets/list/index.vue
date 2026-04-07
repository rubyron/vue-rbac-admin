<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { queryTickets } from '@/api/tickets'
import type { queryForm, TicketScene } from '@/types/tickets'
import { usePagePermission } from '@/composables/usePagePermission'
import BaseTable from '@/components/table/BaseTable.vue'
import { useTableQuery } from '@/composables/useTableQuery'

const route = useRoute()
const router = useRouter()
const { can } = usePagePermission()

const sceneByRouteName: Record<string, TicketScene> = {
  MyTickets: 'my',
  TicketList: 'list',
  PendingTickets: 'pending',
  TicketDispatch: 'dispatch',
  TicketClosed: 'closed',
}

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    MyTickets: '我的工单',
    TicketList: '工单列表',
    PendingTickets: '待处理',
    TicketDispatch: '待分派',
    TicketClosed: '已关闭',
  }
  return map[route.name as string] || '工单'
})

const scene = computed(
  () => sceneByRouteName[route.name as string] || ('list' as TicketScene)
)

const {
  query: formInline,
  rows,
  total,
  page,
  pageSize,
  loading,
  fetchList,
  onSearch,
  onPageChange,
  onSizeChange,
  setQuery,
} = useTableQuery<
  queryForm & { scene: TicketScene },
  any,
  { code: number; data: { list: any[]; total: number } }
>({
  initialQuery: {
    orderNumber: '',
    status: '',
    createDate: null,
    scene: scene.value,
  },
  fetcher: queryTickets,
  defaultPageSize: 10,
  toParams: (q, p, ps) => ({
    orderNumber: q.orderNumber,
    status: q.status,
    createDate: q.createDate,
    scene: q.scene,
    page: p,
    pageSize: ps,
  }),
})

const statusLabel: Record<string, string> = {
  OPEN: '待受理',
  PENDING: '处理中',
  RESOLVED: '已解决',
  CLOSED: '已关闭',
}

function goDetail(row: { id: string }) {
  router.push({ name: 'TicketDetail', params: { id: row.id } })
}

function goCreate() {
  router.push({ name: 'CreateTicket' })
}

let listMounted = false
let orderDebounce: ReturnType<typeof setTimeout> | null = null
watch(
  () => formInline.orderNumber,
  () => {
    if (!listMounted) return
    if (orderDebounce) clearTimeout(orderDebounce)
    orderDebounce = setTimeout(() => fetchList(true), 300)
  }
)

watch(
  () => route.name,
  () => {
    setQuery({ scene: scene.value })
    fetchList(true)
  }
)

watch(
  () => [formInline.status, formInline.createDate],
  () => fetchList(true)
)

onMounted(() => {
  fetchList(true)
  listMounted = true
})
</script>

<template>
  <div class="ticket-list">
    <div class="ticket-list__head">
      <h2>{{ pageTitle }}</h2>
    </div>

    <BaseTable
      :data="rows"
      :loading="loading"
      :total="total"
      :page="page"
      :page-size="pageSize"
      @page-change="onPageChange"
      @size-change="onSizeChange"
    >
      <template #toolbar>
        <div class="ticket-list__toolbar">
        <el-form :inline="true" :model="formInline" class="ticket-list__form">
          <el-form-item label="工单号">
            <el-input
              v-model="formInline.orderNumber"
              placeholder="支持模糊搜索"
              clearable
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="formInline.status" placeholder="全部" clearable style="width: 140px">
              <el-option label="待受理" value="OPEN" />
              <el-option label="处理中" value="PENDING" />
              <el-option label="已解决" value="RESOLVED" />
              <el-option label="已关闭" value="CLOSED" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建日期">
            <el-date-picker
              v-model="formInline.createDate"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="ticket-list__actions">
          <el-button v-if="can('ticket:create')" type="primary" @click="goCreate">新建工单</el-button>
        </div>
      </div>
      </template>

      
        <el-table-column prop="no" label="工单号" min-width="160" fixed />
        <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            {{ statusLabel[row.status] || row.status }}
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="88" />
        <el-table-column prop="customerName" label="客户" min-width="120" />
        <el-table-column prop="assigneeName" label="处理人" width="110">
          <template #default="{ row }">
            {{ row.assigneeName || '—' }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="170" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="goDetail(row)">详情</el-button>
            <el-button v-if="can('ticket:accept')" link type="primary">受理</el-button>
            <el-button v-if="can('ticket:assign')" link type="primary">分派</el-button>
            <el-button v-if="can('ticket:priority')" link type="primary">调优先级</el-button>
            <el-button v-if="can('ticket:close')" link type="primary">关闭</el-button>
            <el-button v-if="can('ticket:urge')" link type="primary">催办</el-button>
            <el-button v-if="can('ticket:take')" link type="primary">接单</el-button>
            <el-button v-if="can('ticket:process')" link type="primary">处理</el-button>
            <el-button v-if="can('ticket:hold')" link type="primary">挂起</el-button>
            <el-button v-if="can('ticket:collaborate')" link type="primary">协作</el-button>
            <el-button v-if="can('ticket:finish')" link type="primary">完成</el-button>
          </template>
        </el-table-column>
    </BaseTable>
  </div>
</template>

<style scoped lang="scss">
.ticket-list {
  padding: 16px;
}

.ticket-list__head h2 {
  margin: 0 0 12px;
  font-size: 20px;
  color: #303133;
}

.ticket-list__toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.ticket-list__form {
  flex: 1;
}

.ticket-list__actions {
  display: flex;
  align-items: flex-start;
}

</style>
