# ⚛️ Frontend - React SPA

Frontend del sistema de tickets construido con React.

## 📁 Estructura

```
frontend/
├── public/          # Archivos estáticos
├── src/
│   ├── components/  # Componentes reutilizables
│   ├── pages/       # Páginas principales
│   ├── context/     # Context API (estado global)
│   ├── services/    # Llamadas a la API
│   ├── utils/       # Funciones auxiliares
│   ├── App.js       # Componente principal
│   └── index.js     # Punto de entrada
└── package.json
```

## 🚀 Instalación

```bash
cd frontend
npm install
```

## 🏃 Ejecutar

```bash
npm start
```

La aplicación se abrirá en `http://localhost:3000`

## 🎨 Características

- **Rutas protegidas**: Redirige a login si no hay autenticación
- **Roles**: Diferentes vistas para CLIENTE y SOPORTE
- **Estado global**: Manejo con Context API
- **Diseño responsivo**: UI moderna y adaptable

## 📱 Páginas Principales

### Públicas
- `/login` - Inicio de sesión
- `/register` - Registro de usuarios

### Privadas (Cliente)
- `/dashboard` - Panel de control del cliente
- `/tickets` - Mis tickets
- `/tickets/new` - Crear nuevo ticket
- `/tickets/:id` - Detalle de ticket

### Privadas (Soporte)
- `/dashboard` - Panel de control de soporte
- `/tickets` - Todos los tickets
- `/tickets/:id` - Gestionar ticket



