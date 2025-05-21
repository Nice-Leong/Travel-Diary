const express = require('express');
const router = express.Router();
const myDiaryController = require('../controllers/mydiaryController');
const authMiddleware = require('../middlewares/auth');



router.get('/', authMiddleware,  myDiaryController.getMyDiary);


router.put('/:id', authMiddleware, myDiaryController.updateDiary);


// 删除游记
router.delete('/:id', authMiddleware, myDiaryController.deleteDiary);

module.exports = router;
