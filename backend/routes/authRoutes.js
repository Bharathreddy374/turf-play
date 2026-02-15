const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware');
const { registerUser, loginUser, getUser, refreshAccessToken, logoutUser } = require('../controllers/authController');
const { getAllUsers, getUserById, updateUserRole, deleteUser, getDashboardStats } = require('../controllers/adminController');

const router = express.Router();

// User routes
router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logoutUser);
router.get('/getUser', protect, getUser);

// Admin routes
router.get('/admin/stats', protect, adminProtect, getDashboardStats);
router.get('/admin/users', protect, adminProtect, getAllUsers);
router.get('/admin/users/:id', protect, adminProtect, getUserById);
router.patch('/admin/users/:id/role', protect, adminProtect, updateUserRole);
router.delete('/admin/users/:id', protect, adminProtect, deleteUser);

module.exports = router;