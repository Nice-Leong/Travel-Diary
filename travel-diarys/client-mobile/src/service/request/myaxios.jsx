import axios from 'axios'
import { Toast } from 'antd-mobile'
import { BASE_URL, TIME_OUT } from './config'

const request = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      // 处理401错误
      if (error.response.status === 401) {
        // 清除token和用户信息
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        
        // 显示提示
        Toast.show({
          content: '登录已过期，请重新登录',
          icon: 'fail'
        })

        // 重定向到登录页
        window.location.href = '/login'
      } else {
        // 其他错误
        const message = error.response.data?.message || '请求失败'
        Toast.show({
          content: message,
          icon: 'fail'
        })
      }
    } else if (error.request) {
      Toast.show({
        content: '网络错误，请检查网络连接',
        icon: 'fail'
      })
    } else {
      Toast.show({
        content: '请求配置错误',
        icon: 'fail'
      })
    }
    return Promise.reject(error)
  }
)

export default request