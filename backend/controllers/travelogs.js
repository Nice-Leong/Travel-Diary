const pool = require('../config/db');
const Diary = require('../models/Travelog');

exports.getAllTravelogs = async (req, res) => {
  try {
    const { status = 'all' } = req.query;
    const travelogs = await Diary.find({ status });
    res.json(travelogs);
  } catch (err) {
    console.error('获取游记列表失败:', err);
    res.status(500).json({ message: '获取游记列表失败' });
  }
};

exports.approveTravelog = async (req, res) => {
  try {
    const [result] = await pool.query(
      `UPDATE diary 
       SET status = 'approved', create_time = CURRENT_TIMESTAMP 
       WHERE id = ? AND isDeleted = false`,
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      console.warn(`游记未找到或已被删除，ID: ${req.params.id}`);
      return res.status(404).json({ message: '游记未找到或已被删除' });
    }
    
    const [travelog] = await pool.query(
      'SELECT * FROM diary WHERE id = ?',
      [req.params.id]
    );
    
    res.json(travelog[0]);
  } catch (err) {
    console.error('批准游记失败:', err);
    res.status(500).json({ message: '批准游记失败' });
  }
};

exports.rejectTravelog = async (req, res) => {
  try {
    const { reject_reason } = req.body;
    
    if (!reject_reason) {
      return res.status(400).json({ message: '拒绝原因不能为空' });
    }
    
    const [result] = await pool.query(
      `UPDATE diary 
       SET status = 'rejected', reject_reason = ?, create_time = CURRENT_TIMESTAMP 
       WHERE id = ? AND isDeleted = false`,
      [reject_reason, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      console.warn(`游记未找到或已被删除，ID: ${req.params.id}`);
      return res.status(404).json({ message: '游记未找到或已被删除' });
    }
    
    const [travelog] = await pool.query(
      'SELECT * FROM diary WHERE id = ?',
      [req.params.id]
    );
    
    res.json(travelog[0]);
  } catch (err) {
    console.error('拒绝游记失败:', err);
    res.status(500).json({ message: '拒绝游记失败' });
  }
};

exports.deleteTravelog = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权执行此操作' });
    }
    
    const [result] = await pool.query(
      `UPDATE diary 
       SET isDeleted = true, create_time = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      console.warn(`游记未找到或已被删除，ID: ${req.params.id}`);
      return res.status(404).json({ message: '游记未找到或已被删除' });
    }
    
    res.json({ message: '游记已删除' });
  } catch (err) {
    console.error('删除游记失败:', err);
    res.status(500).json({ message: '删除游记失败' });
  }
};