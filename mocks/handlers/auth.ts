import { http, HttpResponse } from 'msw'
import { mockUsers } from './rbac'

type LoginReq = { username: string; password: string }
type LoginOk = { code: 200; data: { token: string; role: string } }
type LoginFail = { code: 401; message: string }
type LoginRes = LoginOk | LoginFail

export const authHandlers = [
  http.post(/\/api\/login$/, async ({ request }) => {
    const body = (await request.json()) as LoginReq
    const { username, password } = body

    const matchedUser = mockUsers.find((user) => user.username === username && user.password === password)
    if (matchedUser) {
      const res: LoginOk = { code: 200, data: { token: matchedUser.token, role: matchedUser.role } }
      return HttpResponse.json(res)
    }

    const res: LoginFail = { code: 401, message: '账号或密码错误' }
    // ✅ 同时返回 HTTP 401（更像真实后端）
    return HttpResponse.json(res, { status: 401 })
  }),
http.post(/\/api\/logout$/, async ({ request }) => {
   return HttpResponse.json({
                code: 200,
                message: 'Logout successful'
            })
})
]
