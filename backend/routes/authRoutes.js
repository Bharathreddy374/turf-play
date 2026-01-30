const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { registerUser, loginUser, getUser } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/getUser', protect, getUser);

module.exports = router;
