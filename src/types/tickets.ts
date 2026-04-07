export interface queryForm {
  orderNumber: string
  status: string
  createDate: string | null
}

export type TicketScene = 'list' | 'my' | 'pending' | 'dispatch' | 'closed'

export interface TicketQueryParams extends queryForm {
  scene: TicketScene
  page: number
  pageSize: number
}
