const express = require('express');
const router = express.Router();
const publishController = require('../controllers/publishController');
const authMiddleware = require('../middlewares/auth');

// 发布日记
router.post('/', authMiddleware, publishController.publishDiary);



module.exports = router;