import request from '@/service/request/myaxios';

export const publishService = {
  async publishDiary(data) {
    try {
      const res = await request.post('/api/publish', data);

      if (res.data && res.data.code === 0) {
        return res.data.data;
      } else {
        console.error('发布失败：', res.data.message || res.data);
        throw new Error(res.data.message || '发布失败');
      }
    } catch (error) {
      console.error('请求发布接口失败:', error);
      throw error;
    }
  }
};
