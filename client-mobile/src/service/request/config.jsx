const BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:3000/api'  // 开发环境API地址
  : 'https://api.yourdomain.com/api';  // 生产环境API地址

const TIME_OUT = 5000; // 请求超时时间（毫秒）

export { BASE_URL, TIME_OUT };