import axios from 'axios'
import { getToken, removeInfo, emitAuthEvent } from '@/utils/token'

/** 与 Vite `base` 对齐：开发环境若未配 VITE_API_BASE，请求会落到 /api 根路径，触发 “did you mean /vue-rbac-admin/api/...” */
function resolveApiBase(): string {
    const raw = import.meta.env.VITE_API_BASE
    if (typeof raw === 'string' && raw.trim() !== '') {
        return raw.replace(/\/$/, '')
    }
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
    return base
}

const instance = axios.create({
    baseURL: resolveApiBase(),
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
            emitAuthEvent('force-logout')
            if (window.location.hash !== '#/login') {
                window.location.hash = '#/login'
            }
        }
        return Promise.reject(error)
    }
)

export default instance
