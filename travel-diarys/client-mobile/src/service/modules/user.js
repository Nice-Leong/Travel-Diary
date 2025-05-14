import request from '@/service/request/myaxios'

export const userService = {
    async login(data) {
        try {
          const res = await request.post('/api/user/login', data)
          return res.data
        } catch (error) {
          console.error('登录请求错误:', error)
          throw error
        }
      },
  async register(data) {
    const res = await request.post('/api/user/register', data)
    return res.data
  }
}
