# 🔧 Guía de Configuración Inicial

Esta guía te ayudará a configurar el proyecto paso a paso.

## ✅ Paso 1: Estructura Inicial - COMPLETADO

La estructura de carpetas ya está creada:

```
proyecto-web-2/
├── backend/
│   ├── config/          ✅ Creada
│   ├── models/          ✅ Creada
│   ├── controllers/     ✅ Creada
│   ├── routes/          ✅ Creada
│   ├── middlewares/     ✅ Creada
│   ├── utils/           ✅ Creada
│   ├── package.json     ✅ Creado
│   ├── env.example      ✅ Creado
│   └── README.md        ✅ Creado
├── frontend/
│   ├── public/          ✅ Creada
│   ├── src/             ✅ Creada
│   ├── package.json     ✅ Creado
│   └── README.md        ✅ Creado
├── .gitignore           ✅ Creado
├── README.md            ✅ Creado
└── SETUP.md             ✅ Este archivo
```

## 📝 Próximos Pasos

### Paso 2: Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Paso 3: Configurar Base de Datos

1. Instalar PostgreSQL (o MySQL)
2. Crear la base de datos:
   ```sql
   CREATE DATABASE tickets_db;
   ```
3. Copiar `backend/env.example` a `backend/.env`
4. Configurar las credenciales en `backend/.env`

### Paso 4: Crear Documento de Planeación

Documentar:
- Alcance completo del proyecto
- Casos de uso detallados
- Reglas de negocio
- Flujos de usuario

### Paso 5: Diseñar DER (Diagrama Entidad-Relación)

Crear diagrama con:
- Entidad User (id, firstName, lastName, email, password, role)
- Entidad Ticket (id, title, description, category, priority, status, creatorId, assignedAgentId)
- Entidad Comment (id, content, ticketId, userId)
- Relaciones entre entidades

### Paso 6: Implementar Modelos de Sequelize

### Paso 7: Crear Rutas Base de la API

### Paso 8: Configurar Frontend React

### Paso 9: Integrar Frontend con Backend

### Paso 10: Testing y Ajustes

## 🎯 Estado Actual

**PASO 1 COMPLETADO** ✅

Siguiente: Paso 2 - Documento de Planeación y DER



