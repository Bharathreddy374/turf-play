const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware');
const {
    createBooking,
    getAvailableSlots,
    getMyBookings,
    cancelBooking,
    getAllBookings,
    updateBookingStatus,
    getBookingStats,
} = require('../controllers/bookingController');

const router = express.Router();

// Public route (no auth needed to check slots)
router.get('/slots', getAvailableSlots);

// Authenticated user routes
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.patch('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/admin/all', protect, adminProtect, getAllBookings);
router.patch('/admin/:id/status', protect, adminProtect, updateBookingStatus);
router.get('/admin/stats', protect, adminProtect, getBookingStats);

module.exports = router;
