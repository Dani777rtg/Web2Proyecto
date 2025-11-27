const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El título es requerido' },
      len: {
        args: [5, 255],
        msg: 'El título debe tener entre 5 y 255 caracteres'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La descripción es requerida' },
      len: {
        args: [10, 5000],
        msg: 'La descripción debe tener entre 10 y 5000 caracteres'
      }
    }
  },
  category: {
    type: DataTypes.ENUM('FALLA', 'CONSULTA', 'SUGERENCIA'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['FALLA', 'CONSULTA', 'SUGERENCIA']],
        msg: 'La categoría debe ser FALLA, CONSULTA o SUGERENCIA'
      }
    }
  },
  priority: {
    type: DataTypes.ENUM('BAJA', 'MEDIA', 'ALTA'),
    allowNull: false,
    defaultValue: 'MEDIA',
    validate: {
      isIn: {
        args: [['BAJA', 'MEDIA', 'ALTA']],
        msg: 'La prioridad debe ser BAJA, MEDIA o ALTA'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('ABIERTO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'),
    allowNull: false,
    defaultValue: 'ABIERTO',
    validate: {
      isIn: {
        args: [['ABIERTO', 'EN_PROCESO', 'RESUELTO', 'CERRADO']],
        msg: 'El estado debe ser ABIERTO, EN_PROCESO, RESUELTO o CERRADO'
      }
    }
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'creator_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  assignedAgentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'assigned_agent_id',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'tickets',
  timestamps: true,
  underscored: true
});

module.exports = Ticket;

