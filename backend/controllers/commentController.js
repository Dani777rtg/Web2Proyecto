const { Comment, Ticket, User } = require('../models');

// @desc    Obtener comentarios de un ticket
// @route   GET /api/tickets/:ticketId/comments
// @access  Private
const getCommentsByTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { role, id: userId } = req.user;

    // Verificar que el ticket existe
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    // Si es CLIENTE, verificar que sea su ticket
    if (role === 'CLIENTE' && ticket.creatorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver los comentarios de este ticket'
      });
    }

    // Obtener los comentarios
    const comments = await Comment.findAll({
      where: { ticketId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: { comments }
    });
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los comentarios',
      error: error.message
    });
  }
};

// @desc    Crear un comentario en un ticket
// @route   POST /api/tickets/:ticketId/comments
// @access  Private
const createComment = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { content } = req.body;
    const { id: userId, role } = req.user;

    // Validar contenido
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'El contenido del comentario es requerido'
      });
    }

    // Verificar que el ticket existe
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    // Si es CLIENTE, verificar que sea su ticket
    if (role === 'CLIENTE' && ticket.creatorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para comentar en este ticket'
      });
    }

    // Crear el comentario
    const comment = await Comment.create({
      content,
      ticketId,
      userId
    });

    // Obtener el comentario con las relaciones
    const commentWithRelations = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Comentario agregado exitosamente',
      data: { comment: commentWithRelations }
    });
  } catch (error) {
    console.error('Error al crear comentario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el comentario',
      error: error.message
    });
  }
};

module.exports = {
  getCommentsByTicket,
  createComment
};

