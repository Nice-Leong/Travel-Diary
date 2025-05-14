import axios from 'axios';
import { getAuthHeader } from './auth';

const API_URL = 'http://localhost:5000/api/travelogs';

export const getTravelogs = async (status = 'all') => {
  const headers = await getAuthHeader();
  try {
    const response = await axios.get(API_URL, { 
      headers, 
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error('获取游记列表失败:', error);
    throw error;
  }
};

export const approveTravelog = async (id) => {
  const headers = await getAuthHeader();
  try {
    await axios.put(`${API_URL}/${id}/approve`, {}, { headers });
  } catch (error) {
    console.error('批准游记失败:', error);
    throw error;
  }
};

export const rejectTravelog = async (id, reason) => {
  const headers = await getAuthHeader();
  try {
    await axios.put(`${API_URL}/${id}/reject`, { reject_reason: reason }, { headers });
  } catch (error) {
    console.error('拒绝游记失败:', error);
    throw error;
  }
};

export const deleteTravelog = async (id) => {
  const headers = await getAuthHeader();
  try {
    await axios.delete(`${API_URL}/${id}`, { headers });
  } catch (error) {
    console.error('删除游记失败:', error);
    throw error;
  }
};