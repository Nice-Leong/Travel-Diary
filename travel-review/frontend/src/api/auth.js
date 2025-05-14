import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || '登录失败');
  }
};

export const getAuthHeader = async () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};