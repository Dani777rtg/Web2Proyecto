const { User } = require('../models');

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user ya viene del middleware de autenticación
    res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil del usuario',
      error: error.message
    });
  }
};

module.exports = {
  getMe
};

