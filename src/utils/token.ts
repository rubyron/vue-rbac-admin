const TOKEN_KEY = 'legend_admin_token'
const ROLE_KEY = 'legend_admin_role'

export function setInfo(info: {token:string,role:string}, remember: boolean) {
    const storage = remember ? localStorage : sessionStorage
    storage.setItem(TOKEN_KEY, info.token)
    storage.setItem(ROLE_KEY, info.role)
}

export function getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || ''
}

export function getRole(): string {
    return sessionStorage.getItem(ROLE_KEY) || localStorage.getItem(ROLE_KEY) || ''
}

export function removeInfo() {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
    sessionStorage.removeItem(ROLE_KEY)
}