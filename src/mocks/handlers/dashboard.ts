// src/mocks/handlers/dashboard.ts
import { http, HttpResponse } from 'msw'

function genDates(days: number) {
  const arr: string[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    arr.push(`${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
  }
  return arr
}

function randSeries(days: number, base: number, jitter: number) {
  return Array.from({ length: days }, () =>
    Math.max(0, Math.round(base + (Math.random() * 2 - 1) * jitter)),
  )
}

export const dashboardHandlers = [
  http.get('/api/dashboard/overview', ({ request }) => {
    const url = new URL(request.url)
    const range = url.searchParams.get('range') ?? '7d' // 默认 7d
    const days = range === '7d' ? 7 : 30

    const dates = genDates(days)
    const created = randSeries(days, range === '7d' ? 24 : 20, 10)
    const resolved = randSeries(days, range === '7d' ? 18 : 16, 8)
    const breach = randSeries(days, 2, 2)

    const statusDist = [
      { name: 'OPEN', value: 86 },
      { name: 'PENDING', value: 128 },
      { name: 'RESOLVED', value: 74 },
      { name: 'CLOSED', value: 312 },
    ]
    const channelDist = [
      { name: 'Web', value: 162 },
      { name: 'Email', value: 98 },
      { name: 'API', value: 43 },
      { name: 'Phone', value: 27 },
      { name: 'WeChat', value: 16 },
    ]

    const data = {
      kpi: {
        todayCreated: created[created.length - 1],
        todayResolved: resolved[resolved.length - 1],
        openTickets: 214,
        slaBreach: 12,
        avgFirstResponseMin: 18,
        csat: 93.6,
        mom: {
          todayCreated: 0.12,
          todayResolved: 0.08,
          openTickets: -0.04,
          slaBreach: -0.15,
        },
      },
      trend: { dates, created, resolved, breach },
      statusDist,
      channelDist,
      slaCompliance: { value: 92.4, target: 95 },
      priorityTtrHours: [
        { priority: 'P0', hours: 3.6 },
        { priority: 'P1', hours: 8.9 },
        { priority: 'P2', hours: 19.2 },
        { priority: 'P3', hours: 42.7 },
      ],
      teamLoad: {
        agents: [
          { id: 'u_02', name: 'Alice' },
          { id: 'u_03', name: 'Bob' },
          { id: 'u_04', name: 'Carol' },
          { id: 'u_01', name: 'Eve' },
        ],
        open: [12, 18, 9, 14],
        pending: [6, 8, 5, 7],
        overdue: [1, 3, 0, 2],
      },
    }

    return HttpResponse.json({ code: 200, data })
  }),
]
