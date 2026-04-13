# Fluid Taskscape - App de Gestión de Tareas

App de gestión de tareas con tablero Kanban y vista de calendario.

## Tech Stack

- **Frontend**: JavaScript vanilla + Tailwind CSS + Material Design 3
- **Backend**: Java 17 + Spring Boot 3.2 + MySQL
- **Diseño**: Sistema "Kinetic Serenity" (glassmorphism, dark theme)

## Requisitos

- Java 17+
- MySQL 8.0+
- Node.js 18+ (solo para servidor de desarrollo frontend)

## Configuración

### Base de datos
```bash
# Crear la base de datos (se crea automáticamente, pero necesitas MySQL corriendo)
mysql -u root -e "CREATE DATABASE IF NOT EXISTS taskscape"
```

### Backend
```bash
cd backend
./mvnw spring-boot:run
```
El servidor arranca en http://localhost:8080

### Frontend
```bash
cd frontend
npx serve -l 3000
```
La app abre en http://localhost:3000

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/tasks | Listar tareas |
| GET | /api/tasks/:id | Obtener tarea |
| POST | /api/tasks | Crear tarea |
| PUT | /api/tasks/:id | Actualizar tarea |
| DELETE | /api/tasks/:id | Eliminar tarea |
| GET | /api/tasks/date/:date | Tareas por fecha |

## Estructura del Proyecto

```
├── frontend/          # SPA JavaScript vanilla
│   ├── index.html
│   ├── css/
│   └── js/
│       ├── app.js     # Inicialización
│       ├── router.js  # Router SPA (hash-based)
│       ├── api.js     # Cliente HTTP
│       ├── state.js   # Estado global
│       └── views/     # Vistas (kanban, calendar, etc.)
│
├── backend/           # API REST Spring Boot
│   └── src/main/java/com/taskscape/
│       ├── controller/
│       ├── model/
│       ├── repository/
│       └── service/
│
└── README.md
```

## Despliegue

- **Frontend**: Vercel (static site)
- **Backend**: Railway (Spring Boot + MySQL)

## Licencia

MIT
