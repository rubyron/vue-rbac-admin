import { http, HttpResponse } from 'msw'

type LoginReq = { username: string; password: string }
type Role = 'admin' | 'user'

type LoginOk = { code: 200; data: { token: string; role: Role } }
type LoginFail = { code: 401; message: string }
type LoginRes = LoginOk | LoginFail

export const authHandlers = [
  http.post('/api/login', async ({ request }) => {
    const body = (await request.json()) as LoginReq
    const { username, password } = body

    if (username === 'admin' && password === '123456') {
      const res: LoginOk = { code: 200, data: { token: 'admin-token', role: 'admin' } }
      return HttpResponse.json(res)
    }

    if (username === 'user' && password === '123456') {
      const res: LoginOk = { code: 200, data: { token: 'user-token', role: 'user' } }
      return HttpResponse.json(res)
    }

    const res: LoginFail = { code: 401, message: '账号或密码错误' }
    // ✅ 同时返回 HTTP 401（更像真实后端）
    return HttpResponse.json(res, { status: 401 })
  }),
]
