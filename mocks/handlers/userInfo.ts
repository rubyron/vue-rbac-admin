import { http, HttpResponse } from 'msw'
import { getMenusByRole, mockUsers, type Role } from './rbac'

export const userInfoHandlers = [
  http.get(/\/api\/userInfo$/, ({ request }) => {
    const url = new URL(request.url)
    const role = (url.searchParams.get('role') as Role) ?? 'employee'
    const isValidRole = ['super_admin', 'system_admin', 'employee', 'support', 'engineer'].includes(role)
    const matchedRole = isValidRole ? role : 'employee'
    const matchedUser = mockUsers.find((user) => user.role === matchedRole)

    return HttpResponse.json({
      code: 200,
      data: getMenusByRole(matchedRole),
      profile: {
        role: matchedRole,
        username: matchedUser?.username ?? '',
        displayName: matchedUser?.displayName ?? '',
      },
    })
  }),
]
