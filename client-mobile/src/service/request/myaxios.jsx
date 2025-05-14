import axios from 'axios'
import { Toast } from 'antd-mobile'

const request = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000
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
    // 如果响应成功，直接返回数据
    return response
  },
  error => {
    // 处理错误响应
    if (error.response) {
      // 服务器返回了错误状态码
      const message = error.response.data?.message || '请求失败'
      Toast.show({
        content: message,
        icon: 'fail'
      })
    } else if (error.request) {
      // 请求发出但没有收到响应
      Toast.show({
        content: '网络错误，请检查网络连接',
        icon: 'fail'
      })
    } else {
      // 请求配置出错
      Toast.show({
        content: '请求配置错误',
        icon: 'fail'
      })
    }
    return Promise.reject(error)
  }
)

export default request