const profileModel = require('../models/profile');

// 获取用户信息
const getUserInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await profileModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ code: 1, message: '用户不存在' });
    }
    res.json({ code: 0, message: '获取成功', data: user });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ code: 1, message: '获取失败' });
  }
};

// 更新用户信息
const updateUserInfo = async (req, res) => {
  const { id } = req.params;
  const { nickname, avatar, bio } = req.body;
  try {
    await profileModel.updateUserInfo(id, nickname, avatar, bio);
    res.json({ code: 0, message: '更新成功' });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({ code: 1, message: '更新失败' });
  }
};

// 修改密码
const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;
  try {
    const success = await profileModel.changePassword(id, oldPassword, newPassword);
    if (!success) {
      return res.status(400).json({ code: 1, message: '旧密码错误' });
    }
    res.json({ code: 0, message: '修改成功' });
  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({ code: 1, message: '修改失败' });
  }
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  updatePassword
};
