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
  // 使用正则以匹配带 public base 的路径，如 /vue-rbac-admin/api/tickets/t_001
  http.get(/\/api\/tickets\/([^/]+)$/, ({ request }) => {
    const url = new URL(request.url)
    const m = url.pathname.match(/\/api\/tickets\/([^/]+)$/)
    const id = m?.[1] || ''
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

  http.put('/api/tickets/:id', async ({ params, request }) => {
    const id = params.id as string
    const body = (await request.json()) as {
      title?: string
      priority?: string
      description?: string
    }
    const idx = ticketStore.findIndex((t) => t.id === id)
    if (idx < 0) {
      return HttpResponse.json({ code: 404, message: '工单不存在' }, { status: 404 })
    }
    const now = new Date().toISOString()
    ticketStore[idx] = {
      ...ticketStore[idx],
      title: body.title ?? ticketStore[idx].title,
      priority: body.priority ?? ticketStore[idx].priority,
      description: body.description ?? ticketStore[idx].description,
      updatedAt: now,
    }
    return HttpResponse.json({ code: 200, data: ticketStore[idx] })
  }),

  http.post('/api/tickets/:id/revoke', async ({ params, request }) => {
    const id = params.id as string
    const body = (await request.json()) as { reason?: string }
    const idx = ticketStore.findIndex((t) => t.id === id)
    if (idx < 0) {
      return HttpResponse.json({ code: 404, message: '工单不存在' }, { status: 404 })
    }
    const now = new Date().toISOString()
    ticketStore[idx] = {
      ...ticketStore[idx],
      revoked: true,
      revokeReason: body.reason || '用户主动撤销',
      status: 'CLOSED',
      updatedAt: now,
    }
    return HttpResponse.json({ code: 200, data: ticketStore[idx] })
  }),

  http.post('/api/tickets/:id/supplement', async ({ params, request }) => {
    const id = params.id as string
    const body = (await request.json()) as { content?: string }
    const idx = ticketStore.findIndex((t) => t.id === id)
    if (idx < 0) {
      return HttpResponse.json({ code: 404, message: '工单不存在' }, { status: 404 })
    }
    const now = new Date().toISOString()
    const oldList = ticketStore[idx].supplements ?? []
    ticketStore[idx] = {
      ...ticketStore[idx],
      supplements: [...oldList, body.content || '补充说明'],
      updatedAt: now,
    }
    return HttpResponse.json({ code: 200, data: ticketStore[idx] })
  }),

  http.post('/api/tickets/:id/evaluate', async ({ params, request }) => {
    const id = params.id as string
    const body = (await request.json()) as { rating?: number; comment?: string }
    const idx = ticketStore.findIndex((t) => t.id === id)
    if (idx < 0) {
      return HttpResponse.json({ code: 404, message: '工单不存在' }, { status: 404 })
    }
    const now = new Date().toISOString()
    ticketStore[idx] = {
      ...ticketStore[idx],
      evaluation: { rating: body.rating || 5, comment: body.comment || '' },
      updatedAt: now,
    }
    return HttpResponse.json({ code: 200, data: ticketStore[idx] })
  }),
]
