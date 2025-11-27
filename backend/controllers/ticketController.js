const { Ticket, User, Comment } = require('../models');

// @desc    Obtener todos los tickets (filtrado por rol)
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res) => {
  try {
    const { role, id } = req.user;

    let tickets;

    if (role === 'CLIENTE') {
      // Los clientes solo ven sus propios tickets
      tickets = await Ticket.findAll({
        where: { creatorId: id },
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: User,
            as: 'assignedAgent',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    } else if (role === 'SOPORTE') {
      // Los agentes ven todos los tickets
      tickets = await Ticket.findAll({
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: User,
            as: 'assignedAgent',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    }

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: { tickets }
    });
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los tickets',
      error: error.message
    });
  }
};

// @desc    Obtener un ticket por ID
// @route   GET /api/tickets/:id
// @access  Private
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    const ticket = await Ticket.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'assignedAgent',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'email']
            }
          ],
          order: [['createdAt', 'ASC']]
        }
      ]
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    // Si es CLIENTE, solo puede ver sus propios tickets
    if (role === 'CLIENTE' && ticket.creatorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver este ticket'
      });
    }

    res.status(200).json({
      success: true,
      data: { ticket }
    });
  } catch (error) {
    console.error('Error al obtener ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el ticket',
      error: error.message
    });
  }
};

// @desc    Crear un nuevo ticket
// @route   POST /api/tickets
// @access  Private (CLIENTE)
const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const { id: creatorId } = req.user;

    // Validar campos requeridos
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona título, descripción y categoría'
      });
    }

    // Crear el ticket
    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority: priority || 'MEDIA',
      status: 'ABIERTO', // Estado por defecto
      creatorId
    });

    // Obtener el ticket con las relaciones
    const ticketWithRelations = await Ticket.findByPk(ticket.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Ticket creado exitosamente',
      data: { ticket: ticketWithRelations }
    });
  } catch (error) {
    console.error('Error al crear ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el ticket',
      error: error.message
    });
  }
};

// @desc    Actualizar un ticket
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    const updates = req.body;

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    // Reglas de actualización por rol
    if (role === 'CLIENTE') {
      // Cliente solo puede actualizar sus propios tickets
      if (ticket.creatorId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para actualizar este ticket'
        });
      }
      // Cliente solo puede actualizar título y descripción
      const allowedUpdates = ['title', 'description'];
      const requestedUpdates = Object.keys(updates);
      const isValidOperation = requestedUpdates.every(update => allowedUpdates.includes(update));
      
      if (!isValidOperation) {
        return res.status(400).json({
          success: false,
          message: 'Solo puedes actualizar título y descripción'
        });
      }
    } else if (role === 'SOPORTE') {
      // Soporte puede actualizar cualquier campo
      // incluyendo status, priority, assignedAgentId
    }

    // Actualizar el ticket
    await ticket.update(updates);

    // Obtener el ticket actualizado con relaciones
    const updatedTicket = await Ticket.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'assignedAgent',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Ticket actualizado exitosamente',
      data: { ticket: updatedTicket }
    });
  } catch (error) {
    console.error('Error al actualizar ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el ticket',
      error: error.message
    });
  }
};

// @desc    Eliminar un ticket
// @route   DELETE /api/tickets/:id
// @access  Private (SOPORTE)
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    await ticket.destroy();

    res.status(200).json({
      success: true,
      message: 'Ticket eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el ticket',
      error: error.message
    });
  }
};

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket
};

