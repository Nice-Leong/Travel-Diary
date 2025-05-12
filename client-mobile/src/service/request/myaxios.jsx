import axios from 'axios';
import { Toast } from 'antd-mobile';
import { BASE_URL, TIME_OUT } from './config';

// 创建axios实例
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  withCredentials: true // 允许跨域携带cookie
});

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    Toast.show({
      content: '请求配置错误',
      icon: 'fail'
    });
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  response => {
    const { data } = response;
    
    // 这里可以根据后端的数据结构进行调整
    if (data.code === 200) {
      return data.data;
    }
    
    // 处理其他状态码
    Toast.show({
      content: data.message || '请求失败',
      icon: 'fail'
    });
    return Promise.reject(new Error(data.message || '请求失败'));
  },
  error => {
    if (error.response) {
      // 处理不同的错误状态码
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          Toast.show({
            content: '没有权限访问',
            icon: 'fail'
          });
          break;
        case 404:
          Toast.show({
            content: '请求的资源不存在',
            icon: 'fail'
          });
          break;
        case 500:
          Toast.show({
            content: '服务器错误',
            icon: 'fail'
          });
          break;
        default:
          Toast.show({
            content: '网络错误',
            icon: 'fail'
          });
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      Toast.show({
        content: '网络连接失败',
        icon: 'fail'
      });
    } else {
      // 请求配置出错
      Toast.show({
        content: '请求配置错误',
        icon: 'fail'
      });
    }
    return Promise.reject(error);
  }
);

export default instance;