
import { defineStore } from 'pinia'
import { getToken, setInfo, removeInfo, emitAuthEvent } from '../utils/token'
import type { LoginForm } from '../types/login'
import { loginApi, logoutApi } from '../api/auth'
import { ref } from 'vue'
import { useUserStore } from './user'

export const useAuthStore = defineStore('auth', () => {
    //state  getters actions 
    const token = ref(getToken()) // 通过 getToken 获取 token，确保初始值正确
    function clearAuthState() {
        token.value = ''
        removeInfo()
        const userStore = useUserStore()
        userStore.clearMenuTree()
    }

    function syncFromStorage() {
        token.value = getToken()
        if (!token.value) {
            const userStore = useUserStore()
            userStore.clearMenuTree()
        }
    }

    async function login(payload: LoginForm) {
        const res = await loginApi({ username: payload.username, password: payload.password })
        console.log('res', res)
        token.value = res.data.token
        setInfo(res.data, 'login')
    }

    async function logout() {
        await logoutApi()
        clearAuthState()
        emitAuthEvent('logout')
    }

    function forceLogout() {
        clearAuthState()
    }

    return { token, login, logout, syncFromStorage, clearAuthState, forceLogout }
})