# 🗄️ DIAGRAMA ENTIDAD-RELACIÓN (DER)

## Representación Visual

```
┌─────────────────────────────────────┐
│            USER                     │
├─────────────────────────────────────┤
│ PK  id (INTEGER)                    │
│     firstName (STRING)              │
│     lastName (STRING)               │
│     email (STRING) UNIQUE           │
│     password (STRING) HASHED        │
│     role (ENUM: CLIENTE/SOPORTE)    │
│     createdAt (TIMESTAMP)           │
│     updatedAt (TIMESTAMP)           │
└─────────────────────────────────────┘
         │                    │
         │ 1                  │ 1
         │                    │
         │ creatorId          │ assignedAgentId
         │                    │
         │ N                  │ N
         ↓                    ↓
┌─────────────────────────────────────┐
│            TICKET                   │
├─────────────────────────────────────┤
│ PK  id (INTEGER)                    │
│     title (STRING)                  │
│     description (TEXT)              │
│     category (ENUM)                 │
│     priority (ENUM)                 │
│     status (ENUM)                   │
│ FK  creatorId → User.id             │
│ FK  assignedAgentId → User.id       │
│     createdAt (TIMESTAMP)           │
│     updatedAt (TIMESTAMP)           │
└─────────────────────────────────────┘
         │
         │ 1
         │
         │ ticketId
         │
         │ N
         ↓
┌─────────────────────────────────────┐
│            COMMENT                  │
├─────────────────────────────────────┤
│ PK  id (INTEGER)                    │
│     content (TEXT)                  │
│ FK  ticketId → Ticket.id            │
│ FK  userId → User.id                │
│     createdAt (TIMESTAMP)           │
│     updatedAt (TIMESTAMP)           │
└─────────────────────────────────────┘
         ↑
         │ N
         │
         │ userId
         │
         │ 1
┌─────────────────────────────────────┐
│            USER                     │
│       (referencia arriba)           │
└─────────────────────────────────────┘
```

## Relaciones Detalladas

### 1. User → Ticket (como Creador)
- **Tipo**: One-to-Many (1:N)
- **Cardinalidad**: Un usuario puede crear muchos tickets
- **Campo FK**: `Ticket.creatorId → User.id`
- **Obligatorio**: Sí (todo ticket debe tener un creador)

### 2. User → Ticket (como Agente Asignado)
- **Tipo**: One-to-Many (1:N)
- **Cardinalidad**: Un agente puede tener muchos tickets asignados
- **Campo FK**: `Ticket.assignedAgentId → User.id`
- **Obligatorio**: No (un ticket puede no estar asignado)
- **Restricción**: Solo usuarios con role='SOPORTE' pueden ser asignados

### 3. Ticket → Comment
- **Tipo**: One-to-Many (1:N)
- **Cardinalidad**: Un ticket puede tener muchos comentarios
- **Campo FK**: `Comment.ticketId → Ticket.id`
- **Obligatorio**: Sí (todo comentario pertenece a un ticket)
- **On Delete**: CASCADE (si se elimina un ticket, se eliminan sus comentarios)

### 4. User → Comment
- **Tipo**: One-to-Many (1:N)
- **Cardinalidad**: Un usuario puede hacer muchos comentarios
- **Campo FK**: `Comment.userId → User.id`
- **Obligatorio**: Sí (todo comentario tiene un autor)

## Índices Sugeridos

```sql
-- Para mejorar el rendimiento

-- Búsqueda de usuarios por email (login)
CREATE INDEX idx_users_email ON users(email);

-- Filtrado de tickets por creador
CREATE INDEX idx_tickets_creator ON tickets(creatorId);

-- Filtrado de tickets por agente asignado
CREATE INDEX idx_tickets_assigned ON tickets(assignedAgentId);

-- Filtrado de tickets por estado
CREATE INDEX idx_tickets_status ON tickets(status);

-- Búsqueda de comentarios por ticket
CREATE INDEX idx_comments_ticket ON comments(ticketId);

-- Búsqueda de comentarios por usuario
CREATE INDEX idx_comments_user ON comments(userId);
```

## Valores ENUM

### User.role
- `CLIENTE`: Usuario que crea tickets
- `SOPORTE`: Agente que gestiona tickets

### Ticket.category
- `FALLA`: Reporte de error o problema técnico
- `CONSULTA`: Pregunta o solicitud de información
- `SUGERENCIA`: Propuesta de mejora

### Ticket.priority
- `BAJA`: No urgente
- `MEDIA`: Importancia moderada
- `ALTA`: Requiere atención inmediata

### Ticket.status
- `ABIERTO`: Recién creado, sin asignar
- `EN_PROCESO`: Asignado y en resolución
- `RESUELTO`: Problema solucionado
- `CERRADO`: Finalizado y archivado

## Ejemplo de Datos

```sql
-- Usuario Cliente
INSERT INTO users VALUES (1, 'Juan', 'Pérez', 'juan@cliente.com', '$2a$10$...', 'CLIENTE', NOW(), NOW());

-- Usuario Soporte
INSERT INTO users VALUES (2, 'María', 'López', 'maria@soporte.com', '$2a$10$...', 'SOPORTE', NOW(), NOW());

-- Ticket creado por Juan
INSERT INTO tickets VALUES (1, 'Error en login', 'No puedo iniciar sesión...', 'FALLA', 'ALTA', 'ABIERTO', 1, NULL, NOW(), NOW());

-- María se asigna el ticket
UPDATE tickets SET assignedAgentId = 2, status = 'EN_PROCESO' WHERE id = 1;

-- Juan agrega un comentario
INSERT INTO comments VALUES (1, 'Ya intenté recuperar contraseña', 1, 1, NOW(), NOW());

-- María responde
INSERT INTO comments VALUES (2, 'Voy a revisar tu cuenta', 1, 2, NOW(), NOW());
```

## Restricciones de Integridad

1. **Email único**: No puede haber dos usuarios con el mismo email
2. **Role válido**: Solo puede ser 'CLIENTE' o 'SOPORTE'
3. **Foreign Keys**: Mantienen integridad referencial
4. **Not Null**: Campos obligatorios no pueden ser vacíos
5. **Cascade Delete**: Al eliminar un ticket, se eliminan sus comentarios

