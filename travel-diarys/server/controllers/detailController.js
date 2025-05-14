const detailModel = require('../models/detail');

exports.getDiaryById = async (req, res) => {
  try {
    const id = req.params.id;
    const diary = await detailModel.findDiaryById(id);
    if (!diary) {
      return res.status(404).json({ code: 1, message: '日记不存在' });
    }
    res.json({ code: 0, message: '获取成功', data: diary });
  } catch (error) {
    console.error('获取详情失败:', error);
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
};
