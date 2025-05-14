const diaryModel = require('../models/diary')

exports.getDiaryList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, searchKey = '' } = req.query
    const diaries = await diaryModel.findAllDiaries(page, pageSize, searchKey)
    res.json({
      code: 0,
      data: diaries,
      message: '获取成功'
    })
  } catch (error) {
    console.error('获取日记列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}