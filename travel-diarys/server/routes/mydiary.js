const express = require('express');
const router = express.Router();
const myDiaryController = require('../controllers/mydiaryController');



router.get('/',  myDiaryController.getMyDiary);


router.put('/:id', myDiaryController.updateDiary);


// 删除游记
router.delete('/:id', myDiaryController.deleteDiary);

module.exports = router;
