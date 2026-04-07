import type { MockMethod } from 'vite-plugin-mock'
import { mockUsers, getMenusByRole } from '../src/mocks/handlers/rbac'

export default [
    {
        url: '/api/login',
        method: 'post',
        response: ({ body }:{body:{username:string,password:string}}) => {
            const { username, password } = body
            const matchedUser = mockUsers.find((user) => user.username === username && user.password === password)
            if (matchedUser) {
                return {
                    code: 200,
                    data: {
                        token: matchedUser.token,
                        role: matchedUser.role
                    }
                }
            }

            return {
                code: 401,
                message: '账号或密码错误'
            }
        },
    },

    {
        url: '/api/user/info',
        method: 'get',
        response: ({ query }:{query:{role?:string}}) => {
            const role = (query.role || 'employee') as any
            return {
                code: 200,
                data: getMenusByRole(role)
            }
        },
    },
    {
        url: '/api/logout',
        method: 'post',
        response: () => {
            return {
                code: 200,
                message: 'Logout successful'
            }
        }
    }
] as MockMethod[]
