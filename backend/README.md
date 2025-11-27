# 🔧 Backend - API REST

Backend del sistema de tickets construido con Express y Sequelize.

## 📁 Estructura

```
backend/
├── config/          # Configuraciones (DB, JWT, etc)
├── models/          # Modelos de Sequelize
├── controllers/     # Lógica de negocio
├── routes/          # Definición de rutas
├── middlewares/     # Middleware (auth, validaciones)
├── utils/           # Funciones auxiliares
├── server.js        # Punto de entrada
└── package.json
```

## 🚀 Instalación

```bash
cd backend
npm install
```

## ⚙️ Configuración

Crear archivo `.env` con las siguientes variables:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tickets_db
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_secreto_jwt
```

## 📡 Rutas API

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login

### Usuarios
- `GET /api/users/me` - Obtener usuario autenticado

### Tickets
- `GET /api/tickets` - Listar tickets (filtrado por rol)
- `POST /api/tickets` - Crear ticket (CLIENTE)
- `GET /api/tickets/:id` - Detalle de ticket

### Comentarios
- `POST /api/tickets/:id/comments` - Agregar comentario
- `GET /api/tickets/:id/comments` - Listar comentarios

## 🏃 Ejecutar

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```



