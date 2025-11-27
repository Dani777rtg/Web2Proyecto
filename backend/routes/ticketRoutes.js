const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket
} = require('../controllers/ticketController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Rutas protegidas
router.get('/', protect, getTickets);
router.post('/', protect, authorize('CLIENTE'), createTicket);
router.get('/:id', protect, getTicketById);
router.put('/:id', protect, updateTicket);
router.delete('/:id', protect, authorize('SOPORTE'), deleteTicket);

module.exports = router;

