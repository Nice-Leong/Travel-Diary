const publishModel = require('../models/publish');

exports.publishDiary = async (req, res) => {
    try {
      const { title, content, images, video, location, user_id } = req.body;
  
      // 基本校验
      if (!title || !content || !images || !images.length || !user_id) {
        return res.status(400).json({ code: 1, message: '缺少必要参数' });
      }
  
      const insertId = await publishModel.createDiary({ title, content, images, video, location, user_id });
  
      res.json({ code: 0, message: '发布成功', data: { id: insertId } });
    } catch (error) {
      console.error('发布游记失败:', error);
      res.status(500).json({ code: 1, message: '服务器错误' });
    }
  };
  