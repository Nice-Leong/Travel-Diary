const express = require('express');
const router = express.Router();
const publishController = require('../controllers/publishController');

// 发布日记
router.post('/', publishController.publishDiary);



module.exports = router;