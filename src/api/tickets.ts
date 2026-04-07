import request from '@/utils/request'
import type { TicketQueryParams } from '@/types/tickets'

export type TicketsListRes = { code: number; data: { list: any[]; total: number } }
export type TicketDetailRes = { code: number; data: any }

export async function queryTickets(params: TicketQueryParams, signal: AbortSignal) {
  return request.get('/api/tickets', {
    params: {
      scene: params.scene,
      orderNumber: params.orderNumber,
      status: params.status,
      page: params.page,
      pageSize: params.pageSize,
    },
    signal,
  }) as Promise<TicketsListRes>
}

export function getTicketDetail(id: string) {
  return request.get(`/api/tickets/${id}`) as Promise<TicketDetailRes>
}

export function createTicket(payload: { title: string; priority: string; description: string }) {
  return request.post('/api/tickets', payload) as Promise<TicketDetailRes>
}

export function updateTicket(id: string, payload: { title: string; priority: string; description: string }) {
  return request.put(`/api/tickets/${id}`, payload) as Promise<TicketDetailRes>
}

export function revokeTicket(id: string, payload: { reason: string }) {
  return request.post(`/api/tickets/${id}/revoke`, payload) as Promise<TicketDetailRes>
}

export function supplementTicket(id: string, payload: { content: string }) {
  return request.post(`/api/tickets/${id}/supplement`, payload) as Promise<TicketDetailRes>
}

export function evaluateTicket(id: string, payload: { rating: number; comment: string }) {
  return request.post(`/api/tickets/${id}/evaluate`, payload) as Promise<TicketDetailRes>
}
