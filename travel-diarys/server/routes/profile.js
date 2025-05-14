const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.get('/:id', profileController.getUserInfo);        // 获取用户信息
router.put('/:id', profileController.updateUserInfo);     // 编辑用户信息
router.put('/password/:id', profileController.updatePassword); // 修改密码

module.exports = router;
