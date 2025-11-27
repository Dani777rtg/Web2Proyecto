# 📋 Documento de Planeación del Proyecto
## Sistema de Gestión de Tickets de Soporte

---

## 📌 1. Información General

**Nombre del Proyecto:** Sistema de Gestión de Tickets de Soporte  
**Curso:** Desarrollo Web 2  
**Tipo de Aplicación:** SPA (Single Page Application)  
**Fecha de Inicio:** Noviembre 2025  
**Estado:** En Desarrollo - Fase de Planeación

---

## 🎯 2. Alcance del Proyecto

### 2.1 Descripción General
Sistema web que permite a los clientes crear y gestionar tickets de soporte técnico, mientras que los agentes de soporte pueden visualizar, asignar y resolver dichos tickets de manera eficiente.

### 2.2 Objetivos Principales

1. **Facilitar la comunicación** entre clientes y equipo de soporte
2. **Centralizar las solicitudes** de soporte en una plataforma única
3. **Mejorar los tiempos de respuesta** mediante asignación eficiente
4. **Mantener un historial** de todas las interacciones por ticket
5. **Proporcionar métricas** de desempeño del servicio de soporte

### 2.3 Funcionalidades Incluidas

✅ Sistema de autenticación con roles (Cliente/Soporte)  
✅ Creación y gestión de tickets  
✅ Sistema de comentarios en tickets  
✅ Asignación de tickets a agentes  
✅ Estados de tickets (Abierto, En Proceso, Resuelto, Cerrado)  
✅ Prioridades (Baja, Media, Alta)  
✅ Categorización de tickets  
✅ Dashboard con métricas básicas  
✅ Filtrado de tickets por rol  

### 2.4 Funcionalidades Excluidas (Fuera de Alcance)

❌ Notificaciones por email  
❌ Chat en tiempo real  
❌ Adjuntar archivos a tickets  
❌ Sistema de calificación/rating  
❌ Reportes avanzados/estadísticas complejas  
❌ Exportación de datos  

---

## 👥 3. Roles y Permisos

### 3.1 ROL: CLIENTE

**Descripción:** Usuario final que requiere soporte técnico

**Permisos:**
- ✅ Crear nuevos tickets
- ✅ Ver SOLO sus propios tickets
- ✅ Agregar comentarios a sus tickets
- ✅ Ver el estado de sus tickets
- ✅ Ver quién tiene asignado su ticket
- ❌ NO puede ver tickets de otros clientes
- ❌ NO puede asignar tickets
- ❌ NO puede cambiar el estado de tickets

**Vistas:**
- Dashboard del Cliente (métricas personales)
- Listado de Mis Tickets
- Detalle de Ticket propio
- Formulario de Crear Ticket

---

### 3.2 ROL: SOPORTE (AGENTE)

**Descripción:** Personal de soporte técnico que atiende tickets

**Permisos:**
- ✅ Ver TODOS los tickets del sistema
- ✅ Asignarse tickets a sí mismo
- ✅ Cambiar el estado de tickets (En Proceso, Resuelto, Cerrado)
- ✅ Agregar comentarios a cualquier ticket
- ✅ Ver información del cliente que creó el ticket
- ✅ Filtrar tickets (por estado, prioridad, asignación)
- ❌ NO puede eliminar tickets
- ❌ NO puede editar información del cliente

**Vistas:**
- Dashboard del Soporte (métricas globales)
- Listado de Todos los Tickets
- Tickets Asignados a Mí
- Detalle de Ticket con opciones de gestión

---

## 📊 4. Casos de Uso Detallados

### 4.1 CU-01: Registro de Usuario

**Actor:** Cliente nuevo / Agente nuevo  
**Precondiciones:** Ninguna  
**Flujo Principal:**
1. Usuario accede a la página de registro
2. Usuario completa el formulario (nombre, apellido, email, password, rol)
3. Sistema valida que el email no exista en la BD
4. Sistema encripta la contraseña con bcrypt
5. Sistema crea el registro en la tabla Users
6. Sistema redirige a la página de login

**Flujo Alternativo:**
- 3a. Si el email ya existe: mostrar error "Email ya registrado"
- 4a. Si la validación falla: mostrar errores específicos

**Postcondiciones:** Usuario registrado en el sistema

---

### 4.2 CU-02: Inicio de Sesión

**Actor:** Cliente / Agente  
**Precondiciones:** Usuario debe estar registrado  
**Flujo Principal:**
1. Usuario accede a la página de login
2. Usuario ingresa email y contraseña
3. Sistema valida las credenciales
4. Sistema compara la contraseña con bcrypt.compare()
5. Sistema genera un token JWT
6. Sistema devuelve el token al cliente
7. Frontend guarda el token (localStorage/Context)
8. Sistema redirige según el rol:
   - CLIENTE → `/dashboard` (cliente)
   - SOPORTE → `/dashboard` (soporte)

**Flujo Alternativo:**
- 3a. Credenciales incorrectas: mostrar "Email o contraseña incorrectos"
- 5a. Error al generar token: mostrar error del servidor

**Postcondiciones:** Usuario autenticado con token válido

---

### 4.3 CU-03: Crear Ticket (Cliente)

**Actor:** Cliente  
**Precondiciones:** Usuario autenticado con rol CLIENTE  
**Flujo Principal:**
1. Cliente accede a "Crear Nuevo Ticket"
2. Cliente completa el formulario:
   - Título (obligatorio)
   - Descripción (obligatorio)
   - Categoría (select: FALLA, CONSULTA, etc.)
   - Prioridad (select: BAJA, MEDIA, ALTA)
3. Sistema valida los campos
4. Sistema crea el ticket con:
   - creatorId = ID del cliente actual
   - status = "ABIERTO"
   - assignedAgentId = NULL
   - Timestamp de creación
5. Sistema guarda en la BD
6. Sistema muestra mensaje de éxito
7. Sistema redirige al listado de tickets del cliente

**Flujo Alternativo:**
- 3a. Validación falla: mostrar errores específicos
- 5a. Error de BD: mostrar "Error al crear ticket"

**Postcondiciones:** Ticket creado y visible para el cliente y todos los agentes

---

### 4.4 CU-04: Ver Listado de Tickets (Cliente)

**Actor:** Cliente  
**Precondiciones:** Usuario autenticado con rol CLIENTE  
**Flujo Principal:**
1. Cliente accede a "Mis Tickets"
2. Sistema consulta tickets WHERE creatorId = ID del cliente
3. Sistema ordena por fecha de creación (más recientes primero)
4. Sistema muestra tabla/lista con:
   - ID del ticket
   - Título
   - Estado (badge con colores)
   - Prioridad
   - Fecha de creación
   - Agente asignado (si existe)
5. Cliente puede hacer clic en un ticket para ver detalles

**Postcondiciones:** Cliente visualiza solo sus tickets

---

### 4.5 CU-05: Ver Listado de Tickets (Soporte)

**Actor:** Agente de Soporte  
**Precondiciones:** Usuario autenticado con rol SOPORTE  
**Flujo Principal:**
1. Agente accede a "Todos los Tickets"
2. Sistema consulta TODOS los tickets de la BD
3. Sistema permite filtrar por:
   - Estado (Abierto, En Proceso, Resuelto)
   - Prioridad (Baja, Media, Alta)
   - Asignación (Sin asignar, Asignados a mí, Todos)
4. Sistema muestra tabla/lista con:
   - ID del ticket
   - Título
   - Cliente (nombre del creador)
   - Estado
   - Prioridad
   - Agente asignado
   - Fecha de creación
5. Agente puede hacer clic en un ticket para gestionarlo

**Postcondiciones:** Agente visualiza tickets según filtros aplicados

---

### 4.6 CU-06: Asignar Ticket (Soporte)

**Actor:** Agente de Soporte  
**Precondiciones:** 
- Usuario autenticado con rol SOPORTE
- Ticket debe existir
**Flujo Principal:**
1. Agente accede al detalle de un ticket
2. Agente hace clic en "Asignarme este ticket"
3. Sistema actualiza el ticket:
   - assignedAgentId = ID del agente actual
   - status = "EN PROCESO"
4. Sistema guarda en la BD
5. Sistema muestra mensaje de éxito
6. Sistema actualiza la vista del ticket

**Flujo Alternativo:**
- 2a. Ticket ya asignado: mostrar "Ticket ya asignado a [Nombre]"
- 4a. Error de BD: mostrar "Error al asignar ticket"

**Postcondiciones:** Ticket asignado al agente y en estado EN PROCESO

---

### 4.7 CU-07: Cambiar Estado de Ticket (Soporte)

**Actor:** Agente de Soporte  
**Precondiciones:** 
- Usuario autenticado con rol SOPORTE
- Ticket debe estar asignado al agente
**Flujo Principal:**
1. Agente accede al detalle de un ticket asignado
2. Agente selecciona nuevo estado en dropdown:
   - EN PROCESO
   - RESUELTO
   - CERRADO
3. Sistema valida que el agente sea el asignado
4. Sistema actualiza el ticket.status
5. Sistema guarda en la BD
6. Sistema muestra mensaje de éxito
7. Sistema actualiza la vista

**Flujo Alternativo:**
- 3a. Agente no asignado: mostrar "No tienes permiso para modificar este ticket"

**Postcondiciones:** Estado del ticket actualizado

---

### 4.8 CU-08: Agregar Comentario a Ticket

**Actor:** Cliente / Agente de Soporte  
**Precondiciones:** 
- Usuario autenticado
- Si es CLIENTE: debe ser el creador del ticket
- Si es SOPORTE: puede comentar en cualquier ticket
**Flujo Principal:**
1. Usuario accede al detalle de un ticket
2. Usuario escribe comentario en el textarea
3. Usuario hace clic en "Enviar Comentario"
4. Sistema valida permisos
5. Sistema crea registro en tabla Comments:
   - content = texto del comentario
   - ticketId = ID del ticket actual
   - userId = ID del usuario actual
   - Timestamp de creación
6. Sistema guarda en la BD
7. Sistema recarga los comentarios del ticket
8. Sistema muestra el nuevo comentario en la lista

**Flujo Alternativo:**
- 4a. Sin permiso: mostrar "No tienes permiso para comentar"
- 5a. Comentario vacío: mostrar "El comentario no puede estar vacío"

**Postcondiciones:** Comentario agregado y visible en el ticket

---

### 4.9 CU-09: Ver Dashboard (Cliente)

**Actor:** Cliente  
**Precondiciones:** Usuario autenticado con rol CLIENTE  
**Flujo Principal:**
1. Cliente accede al dashboard
2. Sistema consulta estadísticas del cliente:
   - Total de tickets creados
   - Tickets abiertos
   - Tickets en proceso
   - Tickets resueltos
3. Sistema muestra cards con las métricas
4. Sistema muestra lista de tickets recientes (últimos 5)

**Postcondiciones:** Cliente visualiza sus métricas personales

---

### 4.10 CU-10: Ver Dashboard (Soporte)

**Actor:** Agente de Soporte  
**Precondiciones:** Usuario autenticado con rol SOPORTE  
**Flujo Principal:**
1. Agente accede al dashboard
2. Sistema consulta estadísticas globales:
   - Total de tickets en el sistema
   - Tickets pendientes (sin asignar)
   - Tickets asignados al agente actual
   - Tickets resueltos hoy
   - Tickets por prioridad (Alta: X, Media: Y, Baja: Z)
3. Sistema muestra cards con las métricas
4. Sistema muestra tabla de tickets urgentes (Prioridad ALTA + Estado ABIERTO)

**Postcondiciones:** Agente visualiza métricas del sistema

---

## 📐 5. Reglas de Negocio

### RN-01: Autenticación
- Todo usuario debe estar autenticado para acceder al sistema (excepto login/registro)
- El token JWT debe ser válido y no estar expirado
- El token expira en 7 días por defecto

### RN-02: Roles
- Un usuario solo puede tener UN rol (CLIENTE o SOPORTE)
- El rol se asigna al momento del registro
- El rol NO puede ser modificado posteriormente

### RN-03: Creación de Tickets
- Solo los usuarios con rol CLIENTE pueden crear tickets
- Un ticket SIEMPRE debe tener: título, descripción, categoría y prioridad
- Al crear un ticket, el estado por defecto es "ABIERTO"
- El assignedAgentId es NULL al crear el ticket (sin asignar)
- El creatorId es el ID del usuario que crea el ticket (no modificable)

### RN-04: Visualización de Tickets
- Un CLIENTE solo puede ver sus propios tickets (creatorId = su ID)
- Un AGENTE puede ver TODOS los tickets del sistema
- Los tickets deben mostrarse ordenados por fecha de creación (más recientes primero)

### RN-05: Asignación de Tickets
- Solo los usuarios con rol SOPORTE pueden asignar tickets
- Un ticket solo puede estar asignado a UN agente a la vez
- Un agente solo puede asignarse tickets a sí mismo (no a otros agentes)
- Al asignar un ticket, el estado cambia automáticamente a "EN PROCESO"

### RN-06: Estados de Tickets
- Estados válidos: ABIERTO, EN PROCESO, RESUELTO, CERRADO
- Solo un AGENTE puede cambiar el estado de un ticket
- Flujo recomendado: ABIERTO → EN PROCESO → RESUELTO → CERRADO
- Un ticket RESUELTO puede volver a ABIERTO si el cliente lo requiere

### RN-07: Prioridades
- Prioridades válidas: BAJA, MEDIA, ALTA
- La prioridad la define el CLIENTE al crear el ticket
- Solo un AGENTE puede modificar la prioridad posteriormente

### RN-08: Comentarios
- Un CLIENTE solo puede comentar en sus propios tickets
- Un AGENTE puede comentar en cualquier ticket
- Los comentarios NO pueden ser eliminados
- Los comentarios NO pueden ser editados (inmutables)
- Cada comentario debe registrar quién lo hizo y cuándo

### RN-09: Seguridad
- Las contraseñas deben ser encriptadas con bcrypt (salt rounds: 10)
- Las contraseñas NUNCA deben devolverse en las respuestas de la API
- Todas las rutas (excepto login/register) requieren token JWT válido
- El token debe enviarse en el header: `Authorization: Bearer <token>`

### RN-10: Validaciones
- Email debe ser único en el sistema
- Email debe tener formato válido
- Contraseña debe tener mínimo 6 caracteres
- firstName y lastName son obligatorios
- Título del ticket: mínimo 5 caracteres, máximo 100
- Descripción del ticket: mínimo 10 caracteres

---

## 🔄 6. Flujos de Trabajo

### 6.1 Flujo: Ciclo de Vida de un Ticket

```
1. CREACIÓN (Cliente)
   ├─> Estado: ABIERTO
   ├─> Asignado a: NULL
   └─> Prioridad: [definida por cliente]
        │
        ↓
2. ASIGNACIÓN (Agente)
   ├─> Estado: EN PROCESO
   ├─> Asignado a: [ID del agente]
   └─> [Agente puede agregar comentarios]
        │
        ↓
3. RESOLUCIÓN (Agente)
   ├─> Estado: RESUELTO
   ├─> [Agente agrega comentario explicando la solución]
   └─> [Cliente puede verificar la solución]
        │
        ↓
4. CIERRE (Agente)
   ├─> Estado: CERRADO
   └─> [Ticket completado]
```

### 6.2 Flujo: Autenticación y Navegación

```
Usuario NO autenticado
   │
   ├─> Accede a ruta protegida
   │   └─> Redirige a /login
   │
   └─> Realiza login exitoso
       │
       ├─> ROL: CLIENTE
       │   ├─> Redirige a /dashboard (cliente)
       │   ├─> Puede acceder a:
       │   │   ├─> /tickets (solo sus tickets)
       │   │   ├─> /tickets/new
       │   │   └─> /tickets/:id (solo si es suyo)
       │   └─> NO puede acceder a rutas de soporte
       │
       └─> ROL: SOPORTE
           ├─> Redirige a /dashboard (soporte)
           ├─> Puede acceder a:
           │   ├─> /tickets (todos los tickets)
           │   └─> /tickets/:id (cualquier ticket)
           └─> NO puede crear tickets
```

---

## 🛠️ 7. Requerimientos Técnicos

### 7.1 Frontend (React)

**Tecnologías:**
- React 18+
- React Router DOM v6 (rutas protegidas)
- Context API (manejo de estado de autenticación)
- Axios (peticiones HTTP)

**Estructura de Componentes:**
```
src/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── RoleRoute.jsx
│   ├── tickets/
│   │   ├── TicketList.jsx
│   │   ├── TicketCard.jsx
│   │   ├── TicketDetail.jsx
│   │   ├── TicketForm.jsx
│   │   └── CommentSection.jsx
│   └── dashboard/
│       ├── ClientDashboard.jsx
│       └── SupportDashboard.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── TicketsPage.jsx
│   └── TicketDetailPage.jsx
├── context/
│   └── AuthContext.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   └── ticketService.js
└── utils/
    ├── helpers.js
    └── constants.js
```

**Rutas:**
- `/` → Landing/Redirect
- `/login` → Página de login (pública)
- `/register` → Página de registro (pública)
- `/dashboard` → Dashboard (protegida, renderiza según rol)
- `/tickets` → Listado de tickets (protegida, filtra según rol)
- `/tickets/new` → Crear ticket (protegida, solo CLIENTE)
- `/tickets/:id` → Detalle de ticket (protegida)

---

### 7.2 Backend (Express + Sequelize)

**Tecnologías:**
- Node.js
- Express 4+
- Sequelize 6+
- PostgreSQL o MySQL
- bcryptjs (encriptación)
- jsonwebtoken (JWT)
- express-validator (validaciones)

**Estructura de Archivos:**
```
backend/
├── config/
│   ├── database.js       (Configuración de Sequelize)
│   └── jwt.js            (Configuración de JWT)
├── models/
│   ├── index.js          (Inicialización de Sequelize)
│   ├── User.js           (Modelo User)
│   ├── Ticket.js         (Modelo Ticket)
│   └── Comment.js        (Modelo Comment)
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── ticketController.js
│   └── commentController.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── ticket.routes.js
│   └── comment.routes.js
├── middlewares/
│   ├── authMiddleware.js    (Verificar JWT)
│   ├── roleMiddleware.js    (Verificar rol)
│   └── errorHandler.js      (Manejo de errores)
├── utils/
│   └── validators.js
└── server.js
```

**Rutas de la API:**
```
POST   /api/auth/register          - Registro
POST   /api/auth/login             - Login
GET    /api/users/me               - Usuario actual
GET    /api/tickets                - Listar tickets (filtrado por rol)
POST   /api/tickets                - Crear ticket (solo CLIENTE)
GET    /api/tickets/:id            - Detalle de ticket
PUT    /api/tickets/:id/assign     - Asignar ticket (solo SOPORTE)
PUT    /api/tickets/:id/status     - Cambiar estado (solo SOPORTE)
GET    /api/tickets/:id/comments   - Listar comentarios
POST   /api/tickets/:id/comments   - Agregar comentario
```

---

## 📊 8. Base de Datos (Sequelize)

### 8.1 Modelos

**User:**
- id (INTEGER, PK, Auto-increment)
- firstName (STRING, NOT NULL)
- lastName (STRING, NOT NULL)
- email (STRING, UNIQUE, NOT NULL)
- password (STRING, NOT NULL) - Hashed con bcrypt
- role (ENUM: 'CLIENTE', 'SOPORTE', NOT NULL)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

**Ticket:**
- id (INTEGER, PK, Auto-increment)
- title (STRING, NOT NULL)
- description (TEXT, NOT NULL)
- category (ENUM: 'FALLA', 'CONSULTA', 'MEJORA', etc.)
- priority (ENUM: 'BAJA', 'MEDIA', 'ALTA')
- status (ENUM: 'ABIERTO', 'EN PROCESO', 'RESUELTO', 'CERRADO')
- creatorId (INTEGER, FK → User.id)
- assignedAgentId (INTEGER, FK → User.id, NULLABLE)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

**Comment:**
- id (INTEGER, PK, Auto-increment)
- content (TEXT, NOT NULL)
- ticketId (INTEGER, FK → Ticket.id)
- userId (INTEGER, FK → User.id)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

### 8.2 Relaciones

```
User (1) ──< creó >── (N) Ticket
User (1) ──< asignado >── (N) Ticket
User (1) ──< escribió >── (N) Comment
Ticket (1) ──< tiene >── (N) Comment
```

---

## 🎨 9. Diseño de Interfaz (UI/UX)

### 9.1 Principios de Diseño
- ✅ Diseño limpio y moderno
- ✅ Responsivo (mobile-first)
- ✅ Accesible (contraste, etiquetas)
- ✅ Feedback visual inmediato
- ✅ Colores consistentes para estados

### 9.2 Paleta de Colores (Sugerida)

**Estados de Tickets:**
- 🔵 ABIERTO: Azul (#3B82F6)
- 🟡 EN PROCESO: Amarillo (#F59E0B)
- 🟢 RESUELTO: Verde (#10B981)
- ⚫ CERRADO: Gris (#6B7280)

**Prioridades:**
- 🟢 BAJA: Verde claro (#34D399)
- 🟡 MEDIA: Amarillo (#FBBF24)
- 🔴 ALTA: Rojo (#EF4444)

---

## ✅ 10. Criterios de Aceptación

### Para el Cliente:
- ✅ Puedo registrarme e iniciar sesión
- ✅ Puedo crear tickets con título, descripción, categoría y prioridad
- ✅ Solo veo mis propios tickets
- ✅ Puedo ver el detalle completo de mis tickets
- ✅ Puedo agregar comentarios a mis tickets
- ✅ Puedo ver quién está asignado a mi ticket
- ✅ Puedo ver el historial de comentarios
- ✅ Mi dashboard muestra estadísticas de mis tickets

### Para el Agente de Soporte:
- ✅ Puedo ver todos los tickets del sistema
- ✅ Puedo filtrar tickets por estado, prioridad y asignación
- ✅ Puedo asignarme tickets disponibles
- ✅ Puedo cambiar el estado de mis tickets asignados
- ✅ Puedo agregar comentarios a cualquier ticket
- ✅ Mi dashboard muestra métricas globales del sistema
- ✅ Veo información del cliente que creó cada ticket

---

## 🚀 11. Plan de Implementación

### Fase 1: Setup (Actual)
- ✅ Estructura del proyecto
- ✅ Repositorio GitHub
- ✅ Documento de planeación
- ⏳ Diagrama DER

### Fase 2: Backend Base
- Configuración de Sequelize
- Modelos de BD (User, Ticket, Comment)
- Migraciones
- Seeder de datos de prueba

### Fase 3: Autenticación
- Registro de usuarios
- Login con JWT
- Middleware de autenticación
- Middleware de roles

### Fase 4: API de Tickets
- CRUD de tickets
- Filtrado por rol
- Asignación de tickets
- Cambio de estado

### Fase 5: Sistema de Comentarios
- Crear comentarios
- Listar comentarios de un ticket
- Validación de permisos

### Fase 6: Frontend Base
- Configuración de React
- Sistema de rutas
- Context de autenticación
- Componentes base

### Fase 7: Vistas Cliente
- Login/Registro
- Dashboard cliente
- Listado de tickets
- Crear ticket
- Detalle de ticket

### Fase 8: Vistas Soporte
- Dashboard soporte
- Listado completo de tickets
- Gestión de tickets
- Asignación

### Fase 9: Integración y Testing
- Conectar frontend con backend
- Pruebas de flujos completos
- Ajustes de UX
- Corrección de bugs

### Fase 10: Refinamiento
- Validaciones adicionales
- Mensajes de error mejorados
- Optimizaciones
- Documentación final

---

## 📝 12. Entregables del Proyecto

1. ✅ **Código fuente completo** en GitHub
2. ✅ **Documento de planeación** (este archivo)
3. ⏳ **Diagrama Entidad-Relación (DER)**
4. ⏳ **Backend funcional** con todas las rutas implementadas
5. ⏳ **Frontend funcional** con todas las vistas implementadas
6. ⏳ **Base de datos** configurada y con datos de prueba
7. ⏳ **README** con instrucciones de instalación y uso
8. ⏳ **Demostración en vivo** del sistema funcionando

---

## 🎓 13. Conclusión

Este documento de planeación establece las bases sólidas para el desarrollo del Sistema de Gestión de Tickets. Se han definido claramente:

- ✅ El alcance y los límites del proyecto
- ✅ Los roles y sus permisos específicos
- ✅ Los casos de uso detallados
- ✅ Las reglas de negocio que rigen el sistema
- ✅ Los requerimientos técnicos
- ✅ El plan de implementación por fases

Con esta planeación, el equipo de desarrollo tiene una guía clara para construir el sistema de manera estructurada y eficiente.

---

**Documento creado:** Noviembre 2025  
**Última actualización:** Noviembre 2025  
**Versión:** 1.0

