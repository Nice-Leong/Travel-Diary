const express = require('express');
const router = express.Router();
const travelogController = require('../controllers/travelogs');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, travelogController.getAllTravelogs);
router.put('/:id/approve', authMiddleware, travelogController.approveTravelog);
router.put('/:id/reject', authMiddleware, travelogController.rejectTravelog);
router.delete('/:id', authMiddleware, travelogController.deleteTravelog);

module.exports = router;