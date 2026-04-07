// src/mocks/handlers/tickets.ts
import { http, HttpResponse } from 'msw'
import { ticketsSeed, type TicketRecord } from '@/mocks/data/ticketsSeed'

let ticketStore: TicketRecord[] = [...ticketsSeed]

const MOCK_CURRENT_ASSIGNEE = 'Alice'

function filterByScene(list: TicketRecord[], scene: string | null) {
  switch (scene) {
    case 'my':
      return list.filter((t) => t.assigneeName === MOCK_CURRENT_ASSIGNEE)
    case 'pending':
      return list.filter(
        (t) =>
          t.assigneeName === MOCK_CURRENT_ASSIGNEE &&
          ['OPEN', 'PENDING'].includes(t.status)
      )
    case 'dispatch':
      return list.filter(
        (t) => t.assigneeId == null && !['CLOSED', 'RESOLVED'].includes(t.status)
      )
    case 'closed':
      return list.filter((t) => ['CLOSED', 'RESOLVED'].includes(t.status))
    case 'list':
    default:
      return list
  }
}

export const ticketHandlers = [
  http.get('/api/tickets/:id', ({ params }) => {
    const id = params.id as string
    const found = ticketStore.find((t) => t.id === id)
    if (!found) {
      return HttpResponse.json({ code: 404, message: '工单不存在' }, { status: 404 })
    }
    return HttpResponse.json({ code: 200, data: found })
  }),

  http.get(/\/api\/tickets$/, ({ request }) => {
    const url = new URL(request.url)
    const scene = url.searchParams.get('scene')
    const orderNumber = (url.searchParams.get('orderNumber') || '').trim().toLowerCase()
    const status = (url.searchParams.get('status') || '').trim()
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
    const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get('pageSize')) || 10))

    let list = filterByScene(ticketStore, scene)
    if (orderNumber) {
      list = list.filter((t) => t.no.toLowerCase().includes(orderNumber))
    }
    if (status) {
      list = list.filter((t) => t.status === status)
    }

    const total = list.length
    const start = (page - 1) * pageSize
    const pageList = list.slice(start, start + pageSize)

    return HttpResponse.json({
      code: 200,
      data: { list: pageList, total },
    })
  }),

  http.post(/\/api\/tickets$/, async ({ request }) => {
    const body = (await request.json()) as {
      title: string
      priority?: string
      description?: string
    }
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
    return HttpResponse.json({ code: 200, data: row })
  }),
]
