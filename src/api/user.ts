import request from '@/utils/request'
import type { ApiResponse, UserInfoResI } from '@/types/api'



export const getUserInfo = (role:string) => {
  return request.get<UserInfoResI[]>('/api/userInfo', { params: { role } })
}