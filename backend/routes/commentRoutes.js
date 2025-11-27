const express = require('express');
const router = express.Router();
const {
  getCommentsByTicket,
  createComment
} = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware');

// Rutas protegidas - Los comentarios van como sub-rutas de tickets
// Estas rutas se montarán en /api/tickets/:ticketId/comments
router.get('/:ticketId/comments', protect, getCommentsByTicket);
router.post('/:ticketId/comments', protect, createComment);

module.exports = router;

