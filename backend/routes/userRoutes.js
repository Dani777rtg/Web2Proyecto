const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Ruta protegida
router.get('/me', protect, getMe);

module.exports = router;

