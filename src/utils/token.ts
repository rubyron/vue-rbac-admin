const TOKEN_KEY = 'legend_admin_token'
const ROLE_KEY = 'legend_admin_role'
const AUTH_EVENT_KEY = 'legend_admin_auth_event'
type AuthEventType = 'login' | 'logout' | 'refresh' | 'force-logout'

export function setInfo(info: {token:string,role:string}, eventType: AuthEventType = 'login') {
    localStorage.setItem(TOKEN_KEY, info.token)
    localStorage.setItem(ROLE_KEY, info.role)
    emitAuthEvent(eventType)
}

export function getToken(): string {
    return localStorage.getItem(TOKEN_KEY) || ''
}

export function getRole(): string {
    return localStorage.getItem(ROLE_KEY) || ''
}

export function removeInfo() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
}

export function emitAuthEvent(type: AuthEventType) {
    localStorage.setItem(AUTH_EVENT_KEY, JSON.stringify({ type, ts: Date.now() }))
}

export function parseAuthEvent(raw: string | null): AuthEventType | '' {
    if (!raw) return ''
    try {
        const parsed = JSON.parse(raw) as { type?: AuthEventType }
        return parsed.type || ''
    } catch {
        return ''
    }
}

export function getAuthStorageKeys() {
    return {
        tokenKey: TOKEN_KEY,
        roleKey: ROLE_KEY,
        eventKey: AUTH_EVENT_KEY,
    }
}