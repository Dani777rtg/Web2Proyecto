# 🧪 Guía de Pruebas con Postman

Esta guía te ayudará a probar todos los endpoints del backend con Postman.

## 📋 Prerequisitos

1. Tener el backend corriendo: `cd backend && npm run dev`
2. Tener Postman instalado
3. Base de datos configurada

---

## 🔐 1. AUTENTICACIÓN

### 1.1 Registrar Usuario Cliente

**Request:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@cliente.com",
  "password": "123456",
  "role": "CLIENTE"
}
```

**Response Esperada (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@cliente.com",
      "role": "CLIENTE"
    }
  }
}
```

💡 **Guarda el token** en una variable de entorno de Postman o cópialo para usarlo después.

---

### 1.2 Registrar Usuario Soporte

**Request:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "firstName": "María",
  "lastName": "López",
  "email": "maria@soporte.com",
  "password": "123456",
  "role": "SOPORTE"
}
```

💡 **Guarda este token también** para probar las funciones de soporte.

---

### 1.3 Login

**Request:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "juan@cliente.com",
  "password": "123456"
}
```

**Response Esperada (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@cliente.com",
      "role": "CLIENTE"
    }
  }
}
```

---

## 👤 2. PERFIL DE USUARIO

### 2.1 Obtener Mi Perfil

**Request:**
```
GET http://localhost:5000/api/users/me
Authorization: Bearer <TU_TOKEN_AQUÍ>
```

**Response Esperada (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@cliente.com",
      "role": "CLIENTE",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

## 🎫 3. TICKETS (Como CLIENTE)

### 3.1 Crear un Ticket

**Request:**
```
POST http://localhost:5000/api/tickets
Authorization: Bearer <TOKEN_DE_CLIENTE>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Error al iniciar sesión",
  "description": "No puedo iniciar sesión en la plataforma desde hace 2 días. Aparece un error 500.",
  "category": "FALLA",
  "priority": "ALTA"
}
```

**Response Esperada (201):**
```json
{
  "success": true,
  "message": "Ticket creado exitosamente",
  "data": {
    "ticket": {
      "id": 1,
      "title": "Error al iniciar sesión",
      "description": "No puedo iniciar sesión...",
      "category": "FALLA",
      "priority": "ALTA",
      "status": "ABIERTO",
      "creatorId": 1,
      "assignedAgentId": null,
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z",
      "creator": {
        "id": 1,
        "firstName": "Juan",
        "lastName": "Pérez",
        "email": "juan@cliente.com"
      }
    }
  }
}
```

---

### 3.2 Listar Mis Tickets (Como Cliente)

**Request:**
```
GET http://localhost:5000/api/tickets
Authorization: Bearer <TOKEN_DE_CLIENTE>
```

**Response Esperada (200):**
```json
{
  "success": true,
  "count": 1,
  "data": {
    "tickets": [
      {
        "id": 1,
        "title": "Error al iniciar sesión",
        "description": "No puedo iniciar sesión...",
        "category": "FALLA",
        "priority": "ALTA",
        "status": "ABIERTO",
        "creatorId": 1,
        "assignedAgentId": null,
        "createdAt": "2024-01-15T10:35:00.000Z",
        "updatedAt": "2024-01-15T10:35:00.000Z",
        "creator": { ... },
        "assignedAgent": null
      }
    ]
  }
}
```

💡 Como CLIENTE, solo verás tus propios tickets.

---

### 3.3 Ver Detalle de Mi Ticket

**Request:**
```
GET http://localhost:5000/api/tickets/1
Authorization: Bearer <TOKEN_DE_CLIENTE>
```

**Response Esperada (200):**
```json
{
  "success": true,
  "data": {
    "ticket": {
      "id": 1,
      "title": "Error al iniciar sesión",
      "description": "No puedo iniciar sesión...",
      "category": "FALLA",
      "priority": "ALTA",
      "status": "ABIERTO",
      "creatorId": 1,
      "assignedAgentId": null,
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z",
      "creator": { ... },
      "assignedAgent": null,
      "comments": []
    }
  }
}
```

---

### 3.4 Actualizar Mi Ticket (Solo título/descripción)

**Request:**
```
PUT http://localhost:5000/api/tickets/1
Authorization: Bearer <TOKEN_DE_CLIENTE>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Error al iniciar sesión - URGENTE",
  "description": "No puedo iniciar sesión en la plataforma desde hace 2 días. Aparece un error 500. Por favor ayuda."
}
```

💡 Como CLIENTE, solo puedes actualizar `title` y `description`.

---

## 🛠️ 4. TICKETS (Como SOPORTE)

### 4.1 Listar Todos los Tickets

**Request:**
```
GET http://localhost:5000/api/tickets
Authorization: Bearer <TOKEN_DE_SOPORTE>
```

**Response:** Verás TODOS los tickets del sistema, no solo los tuyos.

---

### 4.2 Asignarse un Ticket

**Request:**
```
PUT http://localhost:5000/api/tickets/1
Authorization: Bearer <TOKEN_DE_SOPORTE>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "assignedAgentId": 2,
  "status": "EN_PROCESO"
}
```

💡 Cambia `2` por el ID del usuario de soporte (María en este caso).

---

### 4.3 Resolver un Ticket

**Request:**
```
PUT http://localhost:5000/api/tickets/1
Authorization: Bearer <TOKEN_DE_SOPORTE>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "status": "RESUELTO"
}
```

---

### 4.4 Eliminar un Ticket

**Request:**
```
DELETE http://localhost:5000/api/tickets/1
Authorization: Bearer <TOKEN_DE_SOPORTE>
```

**Response Esperada (200):**
```json
{
  "success": true,
  "message": "Ticket eliminado exitosamente"
}
```

---

## 💬 5. COMENTARIOS

### 5.1 Agregar un Comentario (Como Cliente)

**Request:**
```
POST http://localhost:5000/api/tickets/1/comments
Authorization: Bearer <TOKEN_DE_CLIENTE>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "content": "Ya intenté recuperar mi contraseña pero sigo sin poder entrar."
}
```

**Response Esperada (201):**
```json
{
  "success": true,
  "message": "Comentario agregado exitosamente",
  "data": {
    "comment": {
      "id": 1,
      "content": "Ya intenté recuperar mi contraseña...",
      "ticketId": 1,
      "userId": 1,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "user": {
        "id": 1,
        "firstName": "Juan",
        "lastName": "Pérez",
        "email": "juan@cliente.com",
        "role": "CLIENTE"
      }
    }
  }
}
```

---

### 5.2 Agregar un Comentario (Como Soporte)

**Request:**
```
POST http://localhost:5000/api/tickets/1/comments
Authorization: Bearer <TOKEN_DE_SOPORTE>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "content": "Hola Juan, estoy revisando tu cuenta. Te contacto en unos minutos."
}
```

---

### 5.3 Ver Comentarios de un Ticket

**Request:**
```
GET http://localhost:5000/api/tickets/1/comments
Authorization: Bearer <TOKEN_DE_CLIENTE_O_SOPORTE>
```

**Response Esperada (200):**
```json
{
  "success": true,
  "count": 2,
  "data": {
    "comments": [
      {
        "id": 1,
        "content": "Ya intenté recuperar mi contraseña...",
        "ticketId": 1,
        "userId": 1,
        "createdAt": "2024-01-15T11:00:00.000Z",
        "user": {
          "id": 1,
          "firstName": "Juan",
          "lastName": "Pérez",
          "email": "juan@cliente.com",
          "role": "CLIENTE"
        }
      },
      {
        "id": 2,
        "content": "Hola Juan, estoy revisando tu cuenta...",
        "ticketId": 1,
        "userId": 2,
        "createdAt": "2024-01-15T11:05:00.000Z",
        "user": {
          "id": 2,
          "firstName": "María",
          "lastName": "López",
          "email": "maria@soporte.com",
          "role": "SOPORTE"
        }
      }
    ]
  }
}
```

---

## ❌ 6. CASOS DE ERROR

### 6.1 Sin Token (401)

**Request:**
```
GET http://localhost:5000/api/tickets
(Sin header Authorization)
```

**Response:**
```json
{
  "success": false,
  "message": "No autorizado, token no proporcionado"
}
```

---

### 6.2 Token Inválido (401)

**Request:**
```
GET http://localhost:5000/api/tickets
Authorization: Bearer token_invalido_123
```

**Response:**
```json
{
  "success": false,
  "message": "Token inválido o expirado"
}
```

---

### 6.3 Rol Incorrecto (403)

**Request:**
```
POST http://localhost:5000/api/tickets
Authorization: Bearer <TOKEN_DE_SOPORTE>
Content-Type: application/json

{
  "title": "Test",
  "description": "Test",
  "category": "FALLA",
  "priority": "BAJA"
}
```

**Response:**
```json
{
  "success": false,
  "message": "El rol SOPORTE no tiene permisos para acceder a este recurso"
}
```

💡 Solo los CLIENTES pueden crear tickets.

---

### 6.4 Acceso Denegado a Ticket de Otro Usuario (403)

**Request:**
```
GET http://localhost:5000/api/tickets/2
Authorization: Bearer <TOKEN_DE_JUAN>
```
(Donde el ticket 2 fue creado por otro usuario)

**Response:**
```json
{
  "success": false,
  "message": "No tienes permiso para ver este ticket"
}
```

---

## 🎯 Flujo Completo de Prueba Sugerido

1. ✅ Registrar usuario CLIENTE (Juan)
2. ✅ Registrar usuario SOPORTE (María)
3. ✅ Login como Juan y guardar token
4. ✅ Crear ticket como Juan
5. ✅ Ver mis tickets como Juan
6. ✅ Agregar comentario al ticket como Juan
7. ✅ Login como María y guardar token
8. ✅ Ver todos los tickets como María
9. ✅ Asignarse el ticket como María
10. ✅ Cambiar estado a EN_PROCESO
11. ✅ Responder comentario como María
12. ✅ Ver los comentarios del ticket
13. ✅ Resolver el ticket como María
14. ✅ Verificar que Juan puede ver el ticket resuelto

---

## 📦 Colección de Postman

Puedes crear una colección en Postman con estos requests y usar Variables para los tokens:

**Variables de entorno:**
- `base_url`: `http://localhost:5000`
- `token_cliente`: (guardar después del login)
- `token_soporte`: (guardar después del login)
- `ticket_id`: (guardar después de crear ticket)

---

## ✅ Checklist de Pruebas

- [ ] Registro de usuario CLIENTE
- [ ] Registro de usuario SOPORTE
- [ ] Login correcto
- [ ] Login con credenciales incorrectas
- [ ] Obtener perfil autenticado
- [ ] Crear ticket (CLIENTE)
- [ ] Listar tickets (CLIENTE - solo ve los suyos)
- [ ] Listar tickets (SOPORTE - ve todos)
- [ ] Ver detalle de ticket
- [ ] Actualizar ticket (CLIENTE - solo título/descripción)
- [ ] Asignar ticket (SOPORTE)
- [ ] Cambiar estado de ticket (SOPORTE)
- [ ] Eliminar ticket (SOPORTE)
- [ ] Agregar comentario
- [ ] Listar comentarios
- [ ] Error 401 sin token
- [ ] Error 403 rol incorrecto
- [ ] Error 403 acceso a ticket de otro usuario

---

¡Backend completamente funcional y listo para probar! 🚀

