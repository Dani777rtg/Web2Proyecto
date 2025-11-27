# 📋 PLANEACIÓN DEL PROYECTO - Sistema de Tickets

## 🎯 OBJETIVO
Construir una API REST funcional con autenticación, protección de rutas y CRUD completo de tickets, lista para probar con Postman.

---

## 🗄️ DISEÑO DE BASE DE DATOS

### Tabla: users
| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Identificador único |
| firstName | VARCHAR(100) | NOT NULL | Nombre |
| lastName | VARCHAR(100) | NOT NULL | Apellido |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email (login) |
| password | VARCHAR(255) | NOT NULL | Contraseña hasheada |
| role | ENUM | NOT NULL | 'CLIENTE' o 'SOPORTE' |
| createdAt | TIMESTAMP | NOT NULL | Fecha creación |
| updatedAt | TIMESTAMP | NOT NULL | Fecha actualización |

### Tabla: tickets
| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Identificador único |
| title | VARCHAR(255) | NOT NULL | Título del ticket |
| description | TEXT | NOT NULL | Descripción detallada |
| category | ENUM | NOT NULL | 'FALLA', 'CONSULTA', 'SUGERENCIA' |
| priority | ENUM | NOT NULL | 'BAJA', 'MEDIA', 'ALTA' |
| status | ENUM | NOT NULL | 'ABIERTO', 'EN_PROCESO', 'RESUELTO', 'CERRADO' |
| creatorId | INTEGER | FK (users.id), NOT NULL | Usuario que creó el ticket |
| assignedAgentId | INTEGER | FK (users.id), NULL | Agente asignado |
| createdAt | TIMESTAMP | NOT NULL | Fecha creación |
| updatedAt | TIMESTAMP | NOT NULL | Fecha actualización |

### Tabla: comments
| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Identificador único |
| content | TEXT | NOT NULL | Contenido del comentario |
| ticketId | INTEGER | FK (tickets.id), NOT NULL | Ticket asociado |
| userId | INTEGER | FK (users.id), NOT NULL | Usuario que comentó |
| createdAt | TIMESTAMP | NOT NULL | Fecha creación |
| updatedAt | TIMESTAMP | NOT NULL | Fecha actualización |

### Relaciones
- **User → Tickets (creados)**: Un usuario puede crear muchos tickets (1:N)
- **User → Tickets (asignados)**: Un agente puede tener muchos tickets asignados (1:N)
- **User → Comments**: Un usuario puede hacer muchos comentarios (1:N)
- **Ticket → Comments**: Un ticket puede tener muchos comentarios (1:N)

---

## 🏗️ ARQUITECTURA DEL BACKEND (MVC)

```
backend/
├── config/
│   └── database.js         # Configuración de Sequelize
├── models/
│   ├── index.js           # Inicialización de modelos
│   ├── User.js            # Modelo Usuario
│   ├── Ticket.js          # Modelo Ticket
│   └── Comment.js         # Modelo Comentario
├── controllers/
│   ├── authController.js  # Login, Register
│   ├── userController.js  # Obtener perfil
│   ├── ticketController.js # CRUD de tickets
│   └── commentController.js # CRUD de comentarios
├── routes/
│   ├── authRoutes.js      # /api/auth/*
│   ├── userRoutes.js      # /api/users/*
│   ├── ticketRoutes.js    # /api/tickets/*
│   └── commentRoutes.js   # /api/comments/*
├── middlewares/
│   ├── authMiddleware.js  # Verificar JWT
│   └── roleMiddleware.js  # Verificar roles
├── utils/
│   └── helpers.js         # Funciones auxiliares
└── server.js              # Punto de entrada
```

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### Flujo de Registro
1. Usuario envía: `firstName`, `lastName`, `email`, `password`, `role`
2. Backend hashea la contraseña con bcrypt
3. Se guarda en BD
4. Retorna: datos del usuario (sin password)

### Flujo de Login
1. Usuario envía: `email`, `password`
2. Backend verifica credenciales
3. Genera token JWT con: `{ id, email, role }`
4. Retorna: `{ token, user }`

### Middleware de Autenticación
- Verifica token JWT en header `Authorization: Bearer <token>`
- Decodifica y agrega `req.user` con los datos del usuario
- Si no hay token o es inválido: `401 Unauthorized`

### Middleware de Roles
- Verifica que `req.user.role` sea el requerido
- Si no tiene permiso: `403 Forbidden`

---

## 🛣️ API REST - ENDPOINTS

### **Autenticación (Público)**
```
POST   /api/auth/register    # Registrar usuario
POST   /api/auth/login        # Iniciar sesión
```

### **Usuarios (Protegido)**
```
GET    /api/users/me          # Obtener perfil del usuario autenticado
```

### **Tickets**
```
GET    /api/tickets           # Listar tickets (filtrado por rol)
                              # CLIENTE: solo sus tickets
                              # SOPORTE: todos los tickets

POST   /api/tickets           # Crear ticket (solo CLIENTE)

GET    /api/tickets/:id       # Ver detalle de ticket
                              # CLIENTE: solo si es suyo
                              # SOPORTE: cualquiera

PUT    /api/tickets/:id       # Actualizar ticket
                              # CLIENTE: solo title/description de sus tickets
                              # SOPORTE: puede cambiar status, asignarse

DELETE /api/tickets/:id       # Eliminar ticket (solo SOPORTE)
```

### **Comentarios**
```
GET    /api/tickets/:id/comments    # Listar comentarios de un ticket

POST   /api/tickets/:id/comments    # Agregar comentario
```

---

## 📊 REGLAS DE NEGOCIO

### Tickets
1. **Estado inicial**: Al crear un ticket, `status = 'ABIERTO'`
2. **Asignación**: Solo SOPORTE puede asignar tickets
3. **Visibilidad**:
   - CLIENTE solo ve sus propios tickets
   - SOPORTE ve todos los tickets
4. **Edición**:
   - CLIENTE puede editar título y descripción de sus tickets abiertos
   - SOPORTE puede cambiar estado, prioridad y asignación

### Comentarios
1. Cualquier usuario puede comentar en tickets donde tenga acceso
2. No se pueden editar ni eliminar comentarios (auditoría)
3. Se registra quién hizo el comentario y cuándo

### Autenticación
1. Email debe ser único
2. Contraseña mínimo 6 caracteres
3. Token JWT expira en 7 días

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Setup Base
- [x] Estructura de carpetas
- [x] Repositorio GitHub
- [ ] Instalar dependencias
- [ ] Configurar variables de entorno
- [ ] Configurar Sequelize

### Fase 2: Modelos y BD
- [ ] Modelo User
- [ ] Modelo Ticket
- [ ] Modelo Comment
- [ ] Sincronizar BD

### Fase 3: Autenticación
- [ ] Controller de auth (register/login)
- [ ] Rutas de auth
- [ ] Middleware de autenticación JWT
- [ ] Middleware de roles

### Fase 4: CRUD de Tickets
- [ ] Controller de tickets
- [ ] Rutas de tickets
- [ ] Filtrado por rol
- [ ] Validaciones

### Fase 5: Comentarios
- [ ] Controller de comentarios
- [ ] Rutas de comentarios
- [ ] Relación con tickets

### Fase 6: Testing
- [ ] Probar todos los endpoints con Postman
- [ ] Verificar autenticación
- [ ] Verificar roles
- [ ] Verificar CRUD completo

---

## 🧪 PRUEBAS CON POSTMAN

### Colección de Requests

#### 1. Registro
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@cliente.com",
  "password": "123456",
  "role": "CLIENTE"
}
```

#### 2. Login
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "juan@cliente.com",
  "password": "123456"
}
Response: { "token": "...", "user": {...} }
```

#### 3. Ver Mi Perfil
```
GET http://localhost:5000/api/users/me
Headers:
Authorization: Bearer <token>
```

#### 4. Crear Ticket
```
POST http://localhost:5000/api/tickets
Headers:
Authorization: Bearer <token>
Body (JSON):
{
  "title": "Error en login",
  "description": "No puedo iniciar sesión",
  "category": "FALLA",
  "priority": "ALTA"
}
```

#### 5. Listar Mis Tickets
```
GET http://localhost:5000/api/tickets
Headers:
Authorization: Bearer <token>
```

#### 6. Ver Detalle de Ticket
```
GET http://localhost:5000/api/tickets/1
Headers:
Authorization: Bearer <token>
```

#### 7. Agregar Comentario
```
POST http://localhost:5000/api/tickets/1/comments
Headers:
Authorization: Bearer <token>
Body (JSON):
{
  "content": "Necesito ayuda urgente"
}
```

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

1. ✅ Crear documento de planeación
2. Instalar dependencias del backend
3. Configurar Sequelize y conexión a BD
4. Crear modelos (User, Ticket, Comment)
5. Implementar autenticación completa
6. Implementar CRUD de tickets
7. Probar con Postman

**TIEMPO ESTIMADO**: Backend funcional en 1-2 horas de trabajo enfocado

