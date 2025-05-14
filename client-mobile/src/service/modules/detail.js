import request from '@/service/request/myaxios';

export const detailService = {
  async getDiaryDetail(id) {
    try {
      const res = await request.get(`/api/detail/${id}`);

      if (res.data && res.data.code === 0) {
        return res.data.data;
      } else {
        console.error("获取详情失败：", res.data.message || res.data);
        throw new Error(res.data.message || '获取详情失败');
      }
    } catch (error) {
      console.error('请求详情失败:', error);
      throw error;
    }
  }
};
