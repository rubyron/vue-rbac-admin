import { ticketHandlers } from '@/mocks/handlers/tickets'
import { dashboardHandlers } from '@/mocks/handlers/dashboard'
import { userInfoHandlers } from '@/mocks/handlers/userInfo'
import { authHandlers } from '@/mocks/handlers/auth'

export const handlers = [
    ...authHandlers,
  ...userInfoHandlers,
  ...dashboardHandlers,
  ...ticketHandlers,
]
