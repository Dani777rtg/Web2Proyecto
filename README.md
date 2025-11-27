# 🎫 Sistema de Tickets - Proyecto Web 2

Sistema de gestión de tickets con roles de Cliente y Soporte.

## 📋 Descripción

Aplicación SPA (Single Page Application) que permite:
- **Clientes**: Crear y gestionar sus propios tickets de soporte
- **Agentes de Soporte**: Ver, asignar y resolver tickets de clientes

## 🛠️ Tecnologías

### Frontend
- React
- React Router (rutas protegidas)
- Context API / Redux (manejo de estado)

### Backend
- Node.js
- Express (API REST)
- Sequelize (ORM)
- PostgreSQL / MySQL (Base de datos)
- JWT (Autenticación)

## 📁 Estructura del Proyecto

```
proyecto-web-2/
├── backend/          # API REST con Express
├── frontend/         # SPA con React
└── README.md         # Este archivo
```

## 🚀 Estado del Proyecto

**🎉 BACKEND COMPLETADO Y FUNCIONAL - Listo para probar con Postman**

### ✅ Completado
- ✅ Estructura inicial del proyecto
- ✅ Repositorio GitHub conectado
- ✅ Documento de planeación detallado
- ✅ Diagrama Entidad-Relación (DER)
- ✅ Configuración del backend (Express + Sequelize)
- ✅ Modelos de BD (User, Ticket, Comment)
- ✅ Sistema de autenticación completo (JWT)
- ✅ Middleware de autenticación y roles
- ✅ CRUD completo de tickets
- ✅ Sistema de comentarios
- ✅ API REST protegida y funcional
- ✅ Código organizado según MVC
- ✅ Guía completa de pruebas con Postman

### ⏳ Pendiente
- ⏳ Configuración del frontend (React)
- ⏳ Implementación del frontend
- ⏳ Integración frontend-backend
- ⏳ Despliegue

## 📦 Instalación y Configuración

### Backend

```bash
# 1. Clonar el repositorio
git clone https://github.com/Dani777rtg/Web2Proyecto.git
cd Web2Proyecto

# 2. Instalar dependencias del backend
cd backend
npm install

# 3. Configurar variables de entorno
# Copia env.example a .env y configura tus credenciales
cp env.example .env

# 4. Crear la base de datos
# En PostgreSQL: CREATE DATABASE tickets_db;

# 5. Iniciar el servidor
npm run dev
```

**El servidor estará corriendo en:** `http://localhost:5000`

### Probar con Postman

Lee la guía completa en [POSTMAN-TESTS.md](./POSTMAN-TESTS.md)

## 🎯 Endpoints Disponibles

### Autenticación (Público)
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Usuarios (Protegido)
- `GET /api/users/me` - Obtener perfil del usuario autenticado

### Tickets (Protegido)
- `GET /api/tickets` - Listar tickets (filtrado por rol)
- `POST /api/tickets` - Crear ticket (CLIENTE)
- `GET /api/tickets/:id` - Ver detalle de ticket
- `PUT /api/tickets/:id` - Actualizar ticket
- `DELETE /api/tickets/:id` - Eliminar ticket (SOPORTE)

### Comentarios (Protegido)
- `GET /api/tickets/:id/comments` - Listar comentarios
- `POST /api/tickets/:id/comments` - Agregar comentario

## 👥 Roles del Sistema

- **CLIENTE**: Puede crear y ver sus propios tickets
- **SOPORTE**: Puede ver todos los tickets, asignarlos y resolverlos

## 📝 Licencia

Proyecto académico - Web 2



