import request from '@/service/request/myaxios';

export const diaryService = {
  async getDiaryList(page = 1, pageSize = 10, searchKey = '') {
    try {
      const res = await request.get('/api/diary', {
        params: { page, pageSize, searchKey }
      });

      if (Array.isArray(res.data.data)) {
        return res.data.data; // 提取 data 中的数组
      } else {
        console.error("API 返回的数据不是数组", res.data);
        return [];
      }
    } catch (error) {
      console.error('获取日记列表失败:', error);
      throw error;
    }
  }
};