export interface TicketRecord {
  id: string
  no: string
  title: string
  description?: string
  status: string
  priority: string
  customerId: string
  customerName: string
  assigneeId: string | null
  assigneeName: string | null
  tags: string[]
  createdAt: string
  updatedAt: string
  slaDueAt: string
}

export const ticketsSeed: TicketRecord[] = [
  {
    id: 't_001',
    no: 'TCK-2026-000123',
    title: '无法登录后台，提示 403',
    description: '使用 Chrome 登录后跳转 403，清缓存无效。',
    status: 'OPEN',
    priority: 'P0',
    customerId: 'c_01',
    customerName: 'Acme Corp',
    assigneeId: 'u_02',
    assigneeName: 'Alice',
    tags: ['auth', 'vip'],
    createdAt: '2026-02-25T10:11:00.000Z',
    updatedAt: '2026-02-28T03:21:00.000Z',
    slaDueAt: '2026-02-28T12:00:00.000Z',
  },
  {
    id: 't_002',
    no: 'TCK-2026-000124',
    title: '发票开具信息需要修改',
    description: '税号变更，需重开上月发票。',
    status: 'PENDING',
    priority: 'P2',
    customerId: 'c_02',
    customerName: 'Beta LLC',
    assigneeId: 'u_03',
    assigneeName: 'Bob',
    tags: ['billing'],
    createdAt: '2026-02-24T08:00:00.000Z',
    updatedAt: '2026-02-27T09:30:00.000Z',
    slaDueAt: '2026-03-02T12:00:00.000Z',
  },
  {
    id: 't_003',
    no: 'TCK-2026-000125',
    title: '导出报表为空',
    description: '选择本月范围导出 Excel 无数据。',
    status: 'RESOLVED',
    priority: 'P1',
    customerId: 'c_03',
    customerName: 'Gamma Inc',
    assigneeId: null,
    assigneeName: null,
    tags: ['report'],
    createdAt: '2026-02-20T12:10:00.000Z',
    updatedAt: '2026-02-26T11:11:00.000Z',
    slaDueAt: '2026-02-27T12:00:00.000Z',
  },
  {
    id: 't_004',
    no: 'TCK-2026-000126',
    title: '新开通账号未收到激活邮件',
    description: '注册后 30 分钟仍未收到邮件，垃圾箱已查。',
    status: 'OPEN',
    priority: 'P1',
    customerId: 'c_04',
    customerName: 'Delta Co',
    assigneeId: null,
    assigneeName: null,
    tags: ['email', 'onboarding'],
    createdAt: '2026-03-01T09:00:00.000Z',
    updatedAt: '2026-03-01T09:00:00.000Z',
    slaDueAt: '2026-03-02T18:00:00.000Z',
  },
  {
    id: 't_005',
    no: 'TCK-2026-000127',
    title: '工单流程咨询',
    description: '咨询 SLA 与升级规则。',
    status: 'CLOSED',
    priority: 'P3',
    customerId: 'c_01',
    customerName: 'Acme Corp',
    assigneeId: 'u_02',
    assigneeName: 'Alice',
    tags: ['faq'],
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-20T16:00:00.000Z',
    slaDueAt: '2026-01-18T12:00:00.000Z',
  },
]
