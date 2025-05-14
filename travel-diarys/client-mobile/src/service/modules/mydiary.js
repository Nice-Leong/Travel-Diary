import request from '@/service/request/myaxios';

export const mydiaryService = {
  // 获取用户游记列表
  async getMyDiary(user_id) {
    try {
      const res = await request.get('/api/mydiary', {
        params:  user_id , 
      });

      if (res.data && res.data.code === 0) {
        return res.data.data;
      } else {
        throw new Error(res.data.message || '获取游记失败');
      }
    } catch (error) {
      console.error('获取游记失败:', error);
      throw error;
    }
  },

  // 删除游记
  async deleteMyDiary(id) {
    try {
      const res = await request.delete(`/api/mydiary/${id}`);

      if (res.data && res.data.code === 0) {
        return true;
      } else {
        throw new Error(res.data.message || '删除失败');
      }
    } catch (error) {
      console.error('删除游记失败:', error);
      throw error;
    }
  },

  // 编辑游记
  async updateDiary(id, data) {
    try {
      const updateData = {
        title: data.title,
        content: data.content,
        location: data.location,
        departure_time: data.departure_time,
        days: data.days,
        cost: data.cost,
        partner: data.partner,
        images: Array.isArray(data.images) ? data.images : [],
        video: data.video || ''
      };
      const res = await request.put(`/api/mydiary/${id}`, updateData);
      return res.data.data;
    } catch (error) {
      console.error('更新游记失败:', error);
      throw error;
    }
  }
};