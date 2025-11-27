# ⚙️ Instrucciones de Configuración

## 1. Crear Base de Datos

### PostgreSQL:
```sql
CREATE DATABASE tickets_db;
```

### MySQL (alternativa):
```sql
CREATE DATABASE tickets_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 2. Crear archivo `.env`

Copia el archivo `env.example` y renómbralo a `.env`:

```bash
cp env.example .env
```

Luego edita el archivo `.env` con tus credenciales:

```env
# Configuración del servidor
PORT=5000
NODE_ENV=development

# Configuración de la base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tickets_db
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_contraseña

# JWT Secret (IMPORTANTE: Cambia esto en producción)
JWT_SECRET=mi_secreto_super_secreto_para_jwt_12345
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000
```

### Si usas MySQL en lugar de PostgreSQL:
```env
DB_PORT=3306
```

Y también instala el driver de MySQL:
```bash
npm install mysql2
```

Luego modifica `config/database.js` línea 15:
```javascript
dialect: 'mysql',  // Cambiar de 'postgres' a 'mysql'
```

## 3. Instalar dependencias (si no lo has hecho)

```bash
npm install
```

## 4. Iniciar el servidor

```bash
npm run dev
```

Si todo está configurado correctamente, deberías ver:

```
✅ Conexión a la base de datos establecida correctamente.
✅ Base de datos sincronizada correctamente
🚀 Servidor corriendo en puerto 5000
📡 Ambiente: development
🌐 URL: http://localhost:5000
```

## 5. Verificar que funciona

Abre tu navegador o Postman y visita:

```
http://localhost:5000/
```

Deberías ver un JSON con información de la API.

## 🐛 Troubleshooting

### Error: "role 'postgres' does not exist"
Crea el rol en PostgreSQL:
```sql
CREATE ROLE postgres WITH LOGIN PASSWORD 'tu_password';
ALTER ROLE postgres CREATEDB;
```

### Error: "database 'tickets_db' does not exist"
Asegúrate de crear la base de datos primero (ver paso 1).

### Error: "connect ECONNREFUSED"
Verifica que PostgreSQL/MySQL esté corriendo:
```bash
# PostgreSQL
sudo service postgresql status

# MySQL
sudo service mysql status
```

### Error: "password authentication failed"
Verifica que las credenciales en `.env` sean correctas.

