import request from '@/utils/request'
import type { LoginReq, LoginRes } from '../types/login.ts'


export function loginApi(data: LoginReq) {
    console.log('/api/login', data)
    // 示例：POST /api/login
    return request.post<LoginRes>('/api/login', data)
}

export function logoutApi() {
    return request.post<LoginRes>('/api/logout')
}


