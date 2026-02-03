const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware');
const {
    createTurf,
    getAllTurfs,
    getTurfById,
    updateTurf,
    deleteTurf,
    getMyTurfs,
    getAllTurfsAdmin
} = require('../controllers/turfController');

const router = express.Router();

// Admin routes (must be before /:id to avoid conflicts)
router.get('/admin/my-turfs', protect, adminProtect, getMyTurfs);
router.get('/admin/all', protect, adminProtect, getAllTurfsAdmin);

// Public routes
router.get('/', getAllTurfs);
router.get('/:id', getTurfById);

// Protected admin routes
router.post('/', protect, adminProtect, createTurf);
router.put('/:id', protect, adminProtect, updateTurf);
router.delete('/:id', protect, adminProtect, deleteTurf);

module.exports = router;
