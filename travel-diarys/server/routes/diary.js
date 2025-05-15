const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');


// 获取日记列表
router.get('/', diaryController.getDiaryList);

module.exports = router;
