# 🗄️ Diagrama Entidad-Relación (DER)
## Sistema de Gestión de Tickets

---

## 📊 Diagrama Visual (Representación en Texto)

```
┌─────────────────────────────────────────┐
│              USER                        │
├─────────────────────────────────────────┤
│ PK │ id            │ INTEGER            │
│    │ firstName     │ VARCHAR(100)       │
│    │ lastName      │ VARCHAR(100)       │
│ UK │ email         │ VARCHAR(255)       │
│    │ password      │ VARCHAR(255)       │
│    │ role          │ ENUM               │
│    │ createdAt     │ TIMESTAMP          │
│    │ updatedAt     │ TIMESTAMP          │
└─────────────────────────────────────────┘
        │                    │
        │ 1                  │ 1
        │                    │
        │ creó               │ está asignado como
        │                    │
        │ N                  │ N
        ▼                    ▼
┌─────────────────────────────────────────┐
│             TICKET                       │
├─────────────────────────────────────────┤
│ PK │ id               │ INTEGER         │
│    │ title            │ VARCHAR(255)    │
│    │ description      │ TEXT            │
│    │ category         │ ENUM            │
│    │ priority         │ ENUM            │
│    │ status           │ ENUM            │
│ FK │ creatorId        │ INTEGER         │
│ FK │ assignedAgentId  │ INTEGER (NULL)  │
│    │ createdAt        │ TIMESTAMP       │
│    │ updatedAt        │ TIMESTAMP       │
└─────────────────────────────────────────┘
        │
        │ 1
        │
        │ tiene
        │
        │ N
        ▼
┌─────────────────────────────────────────┐
│            COMMENT                       │
├─────────────────────────────────────────┤
│ PK │ id            │ INTEGER            │
│    │ content       │ TEXT               │
│ FK │ ticketId      │ INTEGER            │
│ FK │ userId        │ INTEGER            │
│    │ createdAt     │ TIMESTAMP          │
│    │ updatedAt     │ TIMESTAMP          │
└─────────────────────────────────────────┘
        ▲
        │
        │ N
        │
        │ escribió
        │
        │ 1
        │
┌─────────────────────────────────────────┐
│              USER                        │
└─────────────────────────────────────────┘
```

---

## 📋 Entidades Detalladas

### 1. USER (Usuarios)

**Descripción:** Almacena la información de todos los usuarios del sistema (Clientes y Agentes de Soporte)

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| **id** | INTEGER | PK, AUTO_INCREMENT | Identificador único del usuario |
| firstName | VARCHAR(100) | NOT NULL | Nombre del usuario |
| lastName | VARCHAR(100) | NOT NULL | Apellido del usuario |
| **email** | VARCHAR(255) | UNIQUE, NOT NULL | Email del usuario (usado para login) |
| password | VARCHAR(255) | NOT NULL | Contraseña hasheada con bcrypt |
| role | ENUM | NOT NULL | Rol del usuario: 'CLIENTE' o 'SOPORTE' |
| createdAt | TIMESTAMP | DEFAULT NOW() | Fecha de registro |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

**Índices:**
- PRIMARY KEY: `id`
- UNIQUE INDEX: `email`
- INDEX: `role` (para filtrado rápido)

**Valores ENUM de role:**
- `CLIENTE`
- `SOPORTE`

---

### 2. TICKET (Tickets de Soporte)

**Descripción:** Almacena todos los tickets de soporte creados por los clientes

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| **id** | INTEGER | PK, AUTO_INCREMENT | Identificador único del ticket |
| title | VARCHAR(255) | NOT NULL | Título del ticket |
| description | TEXT | NOT NULL | Descripción detallada del problema |
| category | ENUM | NOT NULL | Categoría del ticket |
| priority | ENUM | NOT NULL | Prioridad del ticket |
| status | ENUM | NOT NULL, DEFAULT 'ABIERTO' | Estado actual del ticket |
| **creatorId** | INTEGER | FK → User.id, NOT NULL | Usuario que creó el ticket |
| **assignedAgentId** | INTEGER | FK → User.id, NULLABLE | Agente asignado (NULL si no está asignado) |
| createdAt | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

**Índices:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `creatorId` REFERENCES `User(id)` ON DELETE CASCADE
- FOREIGN KEY: `assignedAgentId` REFERENCES `User(id)` ON DELETE SET NULL
- INDEX: `status` (para filtrado)
- INDEX: `priority` (para filtrado)
- INDEX: `creatorId` (para búsquedas del cliente)
- INDEX: `assignedAgentId` (para búsquedas del agente)

**Valores ENUM de category:**
- `FALLA` - Problema técnico o error
- `CONSULTA` - Pregunta o duda
- `MEJORA` - Sugerencia de mejora
- `OTRO` - Otra categoría

**Valores ENUM de priority:**
- `BAJA` - Prioridad baja
- `MEDIA` - Prioridad media
- `ALTA` - Prioridad alta

**Valores ENUM de status:**
- `ABIERTO` - Ticket recién creado, sin asignar
- `EN PROCESO` - Ticket asignado y siendo atendido
- `RESUELTO` - Ticket solucionado
- `CERRADO` - Ticket cerrado definitivamente

---

### 3. COMMENT (Comentarios)

**Descripción:** Almacena los comentarios/mensajes de los tickets (historial de interacciones)

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| **id** | INTEGER | PK, AUTO_INCREMENT | Identificador único del comentario |
| content | TEXT | NOT NULL | Contenido del comentario |
| **ticketId** | INTEGER | FK → Ticket.id, NOT NULL | Ticket al que pertenece |
| **userId** | INTEGER | FK → User.id, NOT NULL | Usuario que escribió el comentario |
| createdAt | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

**Índices:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `ticketId` REFERENCES `Ticket(id)` ON DELETE CASCADE
- FOREIGN KEY: `userId` REFERENCES `User(id)` ON DELETE CASCADE
- INDEX: `ticketId` (para listar comentarios de un ticket)
- INDEX: `userId` (para ver comentarios de un usuario)

---

## 🔗 Relaciones Entre Entidades

### Relación 1: User → Ticket (Como Creador)

**Tipo:** Uno a Muchos (1:N)

- Un **User** (con rol CLIENTE) puede **crear** muchos **Tickets**
- Un **Ticket** es **creado** por exactamente un **User**

**Implementación:**
```sql
FOREIGN KEY (creatorId) REFERENCES User(id) ON DELETE CASCADE
```

**Sequelize:**
```javascript
User.hasMany(Ticket, { foreignKey: 'creatorId', as: 'createdTickets' });
Ticket.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });
```

---

### Relación 2: User → Ticket (Como Agente Asignado)

**Tipo:** Uno a Muchos (1:N) - Opcional

- Un **User** (con rol SOPORTE) puede **estar asignado** a muchos **Tickets**
- Un **Ticket** puede **estar asignado** a un **User** o a ninguno (NULL)

**Implementación:**
```sql
FOREIGN KEY (assignedAgentId) REFERENCES User(id) ON DELETE SET NULL
```

**Sequelize:**
```javascript
User.hasMany(Ticket, { foreignKey: 'assignedAgentId', as: 'assignedTickets' });
Ticket.belongsTo(User, { foreignKey: 'assignedAgentId', as: 'assignedAgent' });
```

---

### Relación 3: Ticket → Comment

**Tipo:** Uno a Muchos (1:N)

- Un **Ticket** puede **tener** muchos **Comments**
- Un **Comment** **pertenece** a exactamente un **Ticket**

**Implementación:**
```sql
FOREIGN KEY (ticketId) REFERENCES Ticket(id) ON DELETE CASCADE
```

**Sequelize:**
```javascript
Ticket.hasMany(Comment, { foreignKey: 'ticketId', as: 'comments' });
Comment.belongsTo(Ticket, { foreignKey: 'ticketId', as: 'ticket' });
```

---

### Relación 4: User → Comment

**Tipo:** Uno a Muchos (1:N)

- Un **User** puede **escribir** muchos **Comments**
- Un **Comment** es **escrito** por exactamente un **User**

**Implementación:**
```sql
FOREIGN KEY (userId) REFERENCES Comment(id) ON DELETE CASCADE
```

**Sequelize:**
```javascript
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
```

---

## 🔍 Consultas Comunes

### 1. Obtener todos los tickets de un cliente

```sql
SELECT * FROM Ticket 
WHERE creatorId = :clienteId 
ORDER BY createdAt DESC;
```

**Sequelize:**
```javascript
await Ticket.findAll({
  where: { creatorId: clienteId },
  include: [
    { model: User, as: 'creator' },
    { model: User, as: 'assignedAgent' }
  ],
  order: [['createdAt', 'DESC']]
});
```

---

### 2. Obtener tickets asignados a un agente

```sql
SELECT * FROM Ticket 
WHERE assignedAgentId = :agenteId 
ORDER BY priority DESC, createdAt ASC;
```

**Sequelize:**
```javascript
await Ticket.findAll({
  where: { assignedAgentId: agenteId },
  include: [{ model: User, as: 'creator' }],
  order: [
    ['priority', 'DESC'],
    ['createdAt', 'ASC']
  ]
});
```

---

### 3. Obtener tickets sin asignar (disponibles)

```sql
SELECT * FROM Ticket 
WHERE assignedAgentId IS NULL 
  AND status = 'ABIERTO'
ORDER BY priority DESC, createdAt ASC;
```

**Sequelize:**
```javascript
await Ticket.findAll({
  where: { 
    assignedAgentId: null,
    status: 'ABIERTO'
  },
  include: [{ model: User, as: 'creator' }],
  order: [
    ['priority', 'DESC'],
    ['createdAt', 'ASC']
  ]
});
```

---

### 4. Obtener un ticket con sus comentarios

```sql
SELECT t.*, c.* 
FROM Ticket t
LEFT JOIN Comment c ON t.id = c.ticketId
WHERE t.id = :ticketId
ORDER BY c.createdAt ASC;
```

**Sequelize:**
```javascript
await Ticket.findByPk(ticketId, {
  include: [
    { model: User, as: 'creator' },
    { model: User, as: 'assignedAgent' },
    { 
      model: Comment, 
      as: 'comments',
      include: [{ model: User, as: 'user' }],
      order: [['createdAt', 'ASC']]
    }
  ]
});
```

---

### 5. Estadísticas del Dashboard (Soporte)

```sql
-- Total de tickets
SELECT COUNT(*) as total FROM Ticket;

-- Tickets por estado
SELECT status, COUNT(*) as count 
FROM Ticket 
GROUP BY status;

-- Tickets por prioridad
SELECT priority, COUNT(*) as count 
FROM Ticket 
GROUP BY priority;

-- Tickets sin asignar
SELECT COUNT(*) as pending 
FROM Ticket 
WHERE assignedAgentId IS NULL AND status = 'ABIERTO';
```

---

### 6. Estadísticas del Dashboard (Cliente)

```sql
-- Tickets del cliente por estado
SELECT status, COUNT(*) as count 
FROM Ticket 
WHERE creatorId = :clienteId
GROUP BY status;
```

---

## ⚙️ Reglas de Integridad Referencial

### ON DELETE CASCADE
Cuando se elimina un registro padre, se eliminan automáticamente los registros hijos:

- Si se elimina un **User (CLIENTE)**, se eliminan todos sus **Tickets** creados
- Si se elimina un **Ticket**, se eliminan todos sus **Comments**
- Si se elimina un **User**, se eliminan todos sus **Comments**

### ON DELETE SET NULL
Cuando se elimina un registro padre, el campo FK en el hijo se establece en NULL:

- Si se elimina un **User (SOPORTE)**, los **Tickets** asignados a él tienen `assignedAgentId = NULL`

---

## 🔐 Consideraciones de Seguridad

1. **Passwords**: Nunca almacenar en texto plano. Siempre usar bcrypt con salt
2. **Email**: Debe ser único para evitar duplicados
3. **Foreign Keys**: Mantener integridad referencial en todo momento
4. **Índices**: Crear índices en campos frecuentemente consultados
5. **Validaciones**: Implementar validaciones a nivel de aplicación Y base de datos

---

## 📝 Notas de Implementación

### Sequelize - Definición de Modelos

**User Model:**
```javascript
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING(100), allowNull: false },
  lastName: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { 
    type: DataTypes.ENUM('CLIENTE', 'SOPORTE'), 
    allowNull: false 
  }
}, {
  tableName: 'users',
  timestamps: true
});
```

**Ticket Model:**
```javascript
const Ticket = sequelize.define('Ticket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  category: { 
    type: DataTypes.ENUM('FALLA', 'CONSULTA', 'MEJORA', 'OTRO'), 
    allowNull: false 
  },
  priority: { 
    type: DataTypes.ENUM('BAJA', 'MEDIA', 'ALTA'), 
    allowNull: false 
  },
  status: { 
    type: DataTypes.ENUM('ABIERTO', 'EN PROCESO', 'RESUELTO', 'CERRADO'),
    allowNull: false,
    defaultValue: 'ABIERTO'
  },
  creatorId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  assignedAgentId: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: { model: 'users', key: 'id' }
  }
}, {
  tableName: 'tickets',
  timestamps: true
});
```

**Comment Model:**
```javascript
const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  ticketId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: 'tickets', key: 'id' }
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: 'users', key: 'id' }
  }
}, {
  tableName: 'comments',
  timestamps: true
});
```

---

## ✅ Checklist de Implementación

- [ ] Instalar Sequelize y driver de BD (pg para PostgreSQL)
- [ ] Crear archivo de configuración de BD
- [ ] Definir modelos (User, Ticket, Comment)
- [ ] Establecer relaciones entre modelos
- [ ] Crear script de sincronización
- [ ] Crear seeders con datos de prueba
- [ ] Probar creación de tablas
- [ ] Verificar foreign keys
- [ ] Probar consultas básicas
- [ ] Implementar validaciones

---

**Documento creado:** Noviembre 2025  
**Última actualización:** Noviembre 2025  
**Versión:** 1.0

