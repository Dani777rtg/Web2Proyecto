const { sequelize } = require('../config/database');
const User = require('./User');
const Ticket = require('./Ticket');
const Comment = require('./Comment');

// =============================
// RELACIONES ENTRE MODELOS
// =============================

// User → Ticket (como Creador)
User.hasMany(Ticket, {
  foreignKey: 'creatorId',
  as: 'createdTickets',
  onDelete: 'CASCADE'
});
Ticket.belongsTo(User, {
  foreignKey: 'creatorId',
  as: 'creator'
});

// User → Ticket (como Agente Asignado)
User.hasMany(Ticket, {
  foreignKey: 'assignedAgentId',
  as: 'assignedTickets',
  onDelete: 'SET NULL'
});
Ticket.belongsTo(User, {
  foreignKey: 'assignedAgentId',
  as: 'assignedAgent'
});

// Ticket → Comment
Ticket.hasMany(Comment, {
  foreignKey: 'ticketId',
  as: 'comments',
  onDelete: 'CASCADE'
});
Comment.belongsTo(Ticket, {
  foreignKey: 'ticketId',
  as: 'ticket'
});

// User → Comment
User.hasMany(Comment, {
  foreignKey: 'userId',
  as: 'comments',
  onDelete: 'CASCADE'
});
Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// =============================
// SINCRONIZACIÓN DE LA BASE DE DATOS
// =============================

const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force }); // force: true elimina y recrea las tablas
    console.log('✅ Base de datos sincronizada correctamente');
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Ticket,
  Comment,
  syncDatabase
};

