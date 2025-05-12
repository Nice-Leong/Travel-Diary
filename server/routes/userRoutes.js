const express = require('express');
const router = express.Router();
const User = require('../models/user');

// 获取所有用户信息
router.get('/', async (req, res) => {
  try {
    const users = await User.find();  // 获取所有用户
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
