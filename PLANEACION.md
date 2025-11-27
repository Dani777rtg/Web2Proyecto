# 📋 PLANEACIÓN DEL PROYECTO - Sistema de Tickets

## 🎯 OBJETIVO GENERAL
Construir una aplicación web completa (SPA) de gestión de tickets con:
- Frontend en React con rutas protegidas y UI moderna
- Backend API REST con autenticación y autorización
- Base de datos relacional con Sequelize
- Sistema de roles (CLIENTE y SOPORTE)

---

## 📊 ESTADO ACTUAL DEL PROYECTO

### 🟢 FASE 1: BACKEND - ✅ COMPLETADA AL 100%
**Fecha de inicio:** 27 Nov 2025  
**Fecha de finalización:** 27 Nov 2025  
**Estado:** ✅ FUNCIONAL Y PROBADO

### 🟡 FASE 2: FRONTEND - ⏳ PENDIENTE
**Próximo a iniciar**

### 🔴 FASE 3: INTEGRACIÓN Y DESPLIEGUE - ⏳ PENDIENTE

---

## 📍 DÓNDE ESTAMOS AHORA

**HEMOS COMPLETADO:**
- ✅ Estructura completa del proyecto
- ✅ Repositorio GitHub configurado y actualizado
- ✅ Documentación técnica completa
- ✅ Backend API REST 100% funcional
- ✅ Base de datos diseñada e implementada
- ✅ Sistema de autenticación y autorización
- ✅ 10 endpoints funcionando correctamente
- ✅ Código probado y listo para usar con Postman

**ESTAMOS EN:** Punto de transición entre Backend (completado) y Frontend (por iniciar)

**PRÓXIMO PASO:** Comenzar con la implementación del Frontend en React

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

### ✅ Fase 1: Setup Base - COMPLETADA
- [x] Estructura de carpetas backend y frontend
- [x] Repositorio GitHub creado y conectado
- [x] Dependencias instaladas (Express, Sequelize, JWT, etc.)
- [x] Variables de entorno configuradas (.env.example)
- [x] Configuración de Sequelize completada
- [x] Documento de planeación creado
- [x] Diagrama de base de datos (DER)

### ✅ Fase 2: Modelos y BD - COMPLETADA
- [x] Modelo User con validaciones
- [x] Modelo Ticket con validaciones
- [x] Modelo Comment con validaciones
- [x] Relaciones entre modelos configuradas
- [x] Sincronización de BD funcionando
- [x] Hash de passwords automático

### ✅ Fase 3: Autenticación - COMPLETADA
- [x] Controller de auth (register/login)
- [x] Rutas de auth públicas
- [x] Middleware de autenticación JWT
- [x] Middleware de roles (authorize)
- [x] Generación de tokens JWT
- [x] Validación de tokens
- [x] Protección de rutas

### ✅ Fase 4: CRUD de Tickets - COMPLETADA
- [x] Controller de tickets completo
- [x] Rutas de tickets protegidas
- [x] Filtrado por rol (CLIENTE/SOPORTE)
- [x] Validaciones de permisos
- [x] GET todos los tickets
- [x] GET ticket por ID
- [x] POST crear ticket
- [x] PUT actualizar ticket
- [x] DELETE eliminar ticket

### ✅ Fase 5: Comentarios - COMPLETADA
- [x] Controller de comentarios
- [x] Rutas de comentarios
- [x] Relación con tickets
- [x] GET comentarios por ticket
- [x] POST agregar comentario
- [x] Validación de permisos

### ✅ Fase 6: Testing Backend - COMPLETADA
- [x] Guía de pruebas con Postman creada
- [x] Todos los endpoints documentados
- [x] Autenticación verificada
- [x] Roles verificados
- [x] CRUD completo verificado
- [x] Manejo de errores implementado

### ⏳ Fase 7: Frontend React - PENDIENTE
- [ ] Setup de Create React App
- [ ] Instalación de dependencias (React Router, Axios)
- [ ] Estructura de carpetas
- [ ] Context API para autenticación
- [ ] Componentes reutilizables
- [ ] Página de Login
- [ ] Página de Registro
- [ ] Dashboard Cliente
- [ ] Dashboard Soporte
- [ ] Lista de Tickets
- [ ] Detalle de Ticket
- [ ] Formulario de Crear Ticket
- [ ] Sistema de Comentarios
- [ ] Rutas protegidas
- [ ] Diseño UI/UX

### ⏳ Fase 8: Integración - PENDIENTE
- [ ] Conectar frontend con backend
- [ ] Manejo de tokens en frontend
- [ ] Interceptores de Axios
- [ ] Manejo de errores en frontend
- [ ] Loading states
- [ ] Mensajes de éxito/error
- [ ] Pruebas de integración

### ⏳ Fase 9: Pulido Final - PENDIENTE
- [ ] Responsive design
- [ ] Validaciones en formularios
- [ ] Mejoras de UX
- [ ] Optimización de rendimiento
- [ ] Pruebas end-to-end

### ⏳ Fase 10: Despliegue (Opcional) - PENDIENTE
- [ ] Configuración para producción
- [ ] Variables de entorno de producción
- [ ] Deploy del backend (Heroku/Railway/Render)
- [ ] Deploy del frontend (Vercel/Netlify)
- [ ] Configuración de base de datos en producción

---

## 🎓 RESUMEN EJECUTIVO

### ✅ LO QUE HEMOS LOGRADO (BACKEND)

**Tiempo invertido:** 1 sesión de trabajo  
**Fecha:** 27 Nov 2025  
**Commits en GitHub:** 6

#### Infraestructura
- ✅ Proyecto estructurado con arquitectura MVC
- ✅ Repositorio GitHub: https://github.com/Dani777rtg/Web2Proyecto
- ✅ Base de datos relacional con 3 tablas y relaciones
- ✅ Documentación técnica completa

#### Funcionalidades Backend
- ✅ **Autenticación completa:** Registro, login, JWT tokens
- ✅ **Autorización por roles:** Middleware para CLIENTE y SOPORTE
- ✅ **CRUD de Tickets:** Crear, leer, actualizar, eliminar (con permisos)
- ✅ **Sistema de Comentarios:** Agregar y listar comentarios
- ✅ **Filtrado por rol:** Clientes ven solo sus tickets, Soporte ve todos
- ✅ **Validaciones:** En modelos y controladores
- ✅ **Seguridad:** Passwords hasheadas, tokens con expiración

#### Endpoints Funcionales (10 rutas)
- ✅ POST /api/auth/register
- ✅ POST /api/auth/login
- ✅ GET /api/users/me
- ✅ GET /api/tickets
- ✅ POST /api/tickets
- ✅ GET /api/tickets/:id
- ✅ PUT /api/tickets/:id
- ✅ DELETE /api/tickets/:id
- ✅ GET /api/tickets/:id/comments
- ✅ POST /api/tickets/:id/comments

**Estado:** 🟢 Backend 100% funcional y probado

---

### ⏳ LO QUE FALTA (FRONTEND Y MÁS)

#### Frontend React (Estimado: 3-5 horas)
- ⏳ Setup y configuración inicial
- ⏳ Sistema de autenticación en UI (Login/Registro)
- ⏳ Context API para estado global
- ⏳ Dashboard para CLIENTE
- ⏳ Dashboard para SOPORTE
- ⏳ Páginas de gestión de tickets
- ⏳ Sistema de comentarios en UI
- ⏳ Rutas protegidas por rol
- ⏳ Diseño responsivo y moderno

#### Integración (Estimado: 1-2 horas)
- ⏳ Conectar React con API
- ⏳ Manejo de tokens en frontend
- ⏳ Interceptores de Axios
- ⏳ Manejo de estados de carga
- ⏳ Mensajes de error/éxito

#### Opcional - Despliegue
- ⏳ Deploy backend (Heroku/Railway/Render)
- ⏳ Deploy frontend (Vercel/Netlify)
- ⏳ Configuración de producción

**Progreso Total del Proyecto:** 25% (Backend listo, falta Frontend)

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

## 🚀 PASOS REALIZADOS (COMPLETADOS)

### ✅ Fase Backend (27 Nov 2025)
1. ✅ Crear estructura inicial del proyecto
2. ✅ Configurar repositorio GitHub
3. ✅ Crear documento de planeación
4. ✅ Diseñar diagrama de base de datos (DER)
5. ✅ Instalar dependencias del backend
6. ✅ Configurar Sequelize y conexión a BD
7. ✅ Crear modelos (User, Ticket, Comment)
8. ✅ Implementar relaciones entre modelos
9. ✅ Implementar sistema de autenticación completo
10. ✅ Implementar middleware de JWT
11. ✅ Implementar middleware de roles
12. ✅ Implementar CRUD de tickets con validaciones
13. ✅ Implementar sistema de comentarios
14. ✅ Probar con Postman (documentación incluida)
15. ✅ Subir todo al repositorio GitHub
16. ✅ Documentar progreso completo

**RESULTADO:** Backend 100% funcional y probado

---

## 🎯 PRÓXIMOS PASOS (PENDIENTES)

### 📅 Fase Frontend React
1. ⏳ Configurar proyecto React con Create React App
2. ⏳ Instalar dependencias (React Router, Axios, etc.)
3. ⏳ Crear estructura de carpetas del frontend
4. ⏳ Implementar Context API para autenticación
5. ⏳ Crear componentes base (Navbar, Layout, etc.)
6. ⏳ Implementar página de Login
7. ⏳ Implementar página de Registro
8. ⏳ Implementar Dashboard para CLIENTE
9. ⏳ Implementar Dashboard para SOPORTE
10. ⏳ Implementar lista de tickets
11. ⏳ Implementar detalle de ticket
12. ⏳ Implementar formulario de crear ticket
13. ⏳ Implementar sistema de comentarios en UI
14. ⏳ Configurar rutas protegidas
15. ⏳ Conectar frontend con backend API
16. ⏳ Diseñar UI/UX moderna y responsive
17. ⏳ Probar integración completa

**TIEMPO ESTIMADO:** 3-5 horas de trabajo enfocado

---

## 📈 PROGRESO GENERAL DEL PROYECTO

```
BACKEND         ████████████████████ 100% ✅
FRONTEND        ░░░░░░░░░░░░░░░░░░░░   0% ⏳
INTEGRACIÓN     ░░░░░░░░░░░░░░░░░░░░   0% ⏳
DESPLIEGUE      ░░░░░░░░░░░░░░░░░░░░   0% ⏳
─────────────────────────────────────────
TOTAL           █████░░░░░░░░░░░░░░░  25% 
```

**Estado:** Backend Completado - Listo para Frontend

---

## 🏁 CRITERIOS PARA CONSIDERAR EL PROYECTO COMPLETO

### Requisitos Mínimos (MVP)
- [x] ✅ Backend API REST funcional
- [x] ✅ Base de datos diseñada e implementada
- [x] ✅ Sistema de autenticación con JWT
- [x] ✅ CRUD de tickets
- [x] ✅ Sistema de comentarios
- [x] ✅ Roles de usuario (CLIENTE/SOPORTE)
- [ ] ⏳ Frontend React funcional
- [ ] ⏳ Login y registro en UI
- [ ] ⏳ Dashboard para cada rol
- [ ] ⏳ Gestión de tickets desde UI
- [ ] ⏳ Sistema de comentarios en UI
- [ ] ⏳ Rutas protegidas en frontend
- [ ] ⏳ Integración completa frontend-backend

### Extras (Opcionales)
- [ ] Dashboard con métricas y gráficas
- [ ] Notificaciones en tiempo real
- [ ] Búsqueda y filtrado avanzado
- [ ] Paginación de tickets
- [ ] Exportar tickets a PDF/Excel
- [ ] Sistema de archivos adjuntos
- [ ] Historial de cambios en tickets
- [ ] Despliegue en producción

---

## 📝 DOCUMENTACIÓN CREADA

- ✅ `README.md` - Documentación principal del proyecto
- ✅ `PLANEACION.md` - Este documento (planeación completa)
- ✅ `DIAGRAMA-BD.md` - Diseño de la base de datos
- ✅ `POSTMAN-TESTS.md` - Guía de pruebas con Postman
- ✅ `RESUMEN-PROGRESO.md` - Estado actual del proyecto
- ✅ `SETUP.md` - Instrucciones de configuración
- ✅ `backend/CONFIGURACION.md` - Configuración del backend
- ✅ `backend/README.md` - Documentación del backend
- ✅ `frontend/README.md` - Documentación del frontend (estructura inicial)

