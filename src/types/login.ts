export type LoginForm = {
    username: string
    password: string
    remember: boolean
}

export type LoginReq = { username: string; password: string }
export type LoginRes = { token: string,role:string }
