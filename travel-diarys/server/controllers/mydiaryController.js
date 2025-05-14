const mydiary = require('../models/mydiary');

// 获取当前登录用户的所有游记
const getMyDiary = async (req, res) => {
  const { user_id } = req.query;
  try {
    const diary = await mydiary.getMyDiaryByUserId(user_id);
    res.json({ code: 0, message: '获取成功', data: diary });

  } catch (error) {
    res.status(500).json({ code: 1, message: '获取游记失败' });
  }
};

// 更新游记
const updateDiary = async (req, res) => {
  console.log('进入 updateDiary，id:', req.params.id);
  const { id } = req.params;
  const { 
    title, 
    content, 
    location,
    departure_time,
    days,
    cost,
    partner,
    images, 
    video 
  } = req.body;
  
  try {

    // 更新游记
    const result = await mydiary.updateDiary(
      id, title, content, location, departure_time,
      days, cost, partner, images, video
    );

    if (!result) {
      return res.status(404).json({ message: '更新失败或未找到记录' });
    }

    res.json({ message: '更新成功', data: result });
  } catch (error) {
    console.error('更新游记失败:', error);
    res.status(500).json({ 
      code: 1, 
      message: error.message || '更新失败'
    });
  }
};

// 删除游记
const deleteDiary = async (req, res) => {
  const { id } = req.params;
  
  try {
    // 验证游记是否存在
    const diary = await mydiary.getMyDiaryByUserId(id);
    if (!diary) {
      return res.status(404).json({ code: 1, message: '游记不存在' });
    }

    // 删除游记
    await mydiary.deleteDiary(id);
    
    res.json({
      code: 0,
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除游记失败:', error);
    res.status(500).json({ code: 1, message: '删除失败' });
  }
};

module.exports = { getMyDiary, updateDiary, deleteDiary };
