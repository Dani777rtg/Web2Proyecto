const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware para verificar el token JWT
const protect = async (req, res, next) => {
  let token;

  // Verificar si el header Authorization existe y empieza con 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraer el token
      token = req.headers.authorization.split(' ')[1];

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar el usuario en la base de datos (sin incluir la contraseña)
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      next();
    } catch (error) {
      console.error('Error en autenticación:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'No autorizado, token no proporcionado'
    });
  }
};

module.exports = { protect };

