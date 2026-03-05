import axios from 'axios'
import { getToken, removeInfo } from '@/utils/token'

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || '',
    timeout: 15000,
})

instance.interceptors.request.use((config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

instance.interceptors.response.use(
    (resp) => resp.data,
    (error) => {
        console.log('error', error)
        const status = error?.response?.status
        if (status === 401) {
            removeInfo()
            // 这里不强行跳转，让路由守卫接管也行
        }
        return Promise.reject(error)
    }
)

export default instance
