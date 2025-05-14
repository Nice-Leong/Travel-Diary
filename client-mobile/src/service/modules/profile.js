import request from '@/service/request/myaxios';

export const profileService = {
  // 获取用户信息
  async getUserInfo(id) {
    try {
      const res = await request.get(`/api/profile/${id}`);
      if (res.data && res.data.code === 0 && res.data.data) {
        return res.data.data; 
      } else {
        throw new Error(res.data.message || '获取用户信息失败');
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  },

  // 更新用户信息
  async updateUserInfo(id, data) {
    try {
      const res = await request.put(`/api/profile/${id}`, data);
      if (res.data && res.data.code === 0) {
        return true;
      } else {
        throw new Error(res.data.message || '更新用户信息失败');
      }
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  },

  // 修改密码
  async updatePassword(id, data) {
    try {
      const res = await request.put(`/api/profile/password/${id}`, data);
      if (res.data && res.data.code === 0) {
        return true;
      } else {
        throw new Error(res.data.message || '修改密码失败');
      }
    } catch (error) {
      console.error('修改密码失败:', error);
      throw error;
    }
  }
};
