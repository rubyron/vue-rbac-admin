import type { MockMethod } from 'vite-plugin-mock'

export default [
    {
        url: '/api/login',
        method: 'post',
        response: ({ body }:{body:{username:string,password:string}}) => {
            const { username, password } = body
            console.log('body', body)
            if (username === 'admin' && password === '12345') {
                return {
                    code: 200,
                    data: {
                        token: 'admin-token',
                        role:'admin'
                    }
                }
            }
            if (username === 'user' && password === '123456') {
                return {
                    code: 200,
                    data: {
                        token: 'user-token',
                        role:'user'
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
        response: () => {
            return {
                code: 200,
                data: {
                    name: 'Admin',
                    roles: ['admin'],
                    permissions: ['user:add', 'user:edit']
                }
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
