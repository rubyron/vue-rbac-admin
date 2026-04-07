import type { MockMethod } from 'vite-plugin-mock'
import { ticketsSeed, type TicketRecord } from '../src/mocks/data/ticketsSeed'

let ticketStore: TicketRecord[] = [...ticketsSeed]
const MOCK_CURRENT_ASSIGNEE = 'Alice'

function filterByScene(list: TicketRecord[], scene: string | undefined) {
  switch (scene) {
    case 'my':
      return list.filter((t) => t.assigneeName === MOCK_CURRENT_ASSIGNEE)
    case 'pending':
      return list.filter(
        (t) =>
          t.assigneeName === MOCK_CURRENT_ASSIGNEE && ['OPEN', 'PENDING'].includes(t.status)
      )
    case 'dispatch':
      return list.filter(
        (t) => t.assigneeId == null && !['CLOSED', 'RESOLVED'].includes(t.status)
      )
    case 'closed':
      return list.filter((t) => ['CLOSED', 'RESOLVED'].includes(t.status))
    default:
      return list
  }
}

export default [
  {
    url: '/api/tickets/:id',
    method: 'get',
    response: ({ params }: { params: { id: string } }) => {
      const found = ticketStore.find((t) => t.id === params.id)
      if (!found) return { code: 404, message: '工单不存在' }
      return { code: 200, data: found }
    },
  },
  {
    url: '/api/tickets',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const scene = query.scene
      const orderNumber = (query.orderNumber || '').trim().toLowerCase()
      const status = (query.status || '').trim()
      const page = Math.max(1, Number(query.page) || 1)
      const pageSize = Math.min(50, Math.max(1, Number(query.pageSize) || 10))

      let list = filterByScene(ticketStore, scene)
      if (orderNumber) list = list.filter((t) => t.no.toLowerCase().includes(orderNumber))
      if (status) list = list.filter((t) => t.status === status)

      const total = list.length
      const start = (page - 1) * pageSize
      const pageList = list.slice(start, start + pageSize)

      return { code: 200, data: { list: pageList, total } }
    },
  },
  {
    url: '/api/tickets',
    method: 'post',
    response: ({ body }: { body: { title?: string; priority?: string; description?: string } }) => {
      const nextNo = `TCK-2026-${String(ticketStore.length + 1).padStart(6, '0')}`
      const now = new Date().toISOString()
      const row: TicketRecord = {
        id: `t_${Date.now()}`,
        no: nextNo,
        title: body.title || '未命名工单',
        description: body.description || '',
        status: 'OPEN',
        priority: body.priority || 'P2',
        customerId: 'c_demo',
        customerName: '演示客户',
        assigneeId: null,
        assigneeName: null,
        tags: [],
        createdAt: now,
        updatedAt: now,
        slaDueAt: now,
      }
      ticketStore = [row, ...ticketStore]
      return { code: 200, data: row }
    },
  },
] as MockMethod[]
