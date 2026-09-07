# GestoDeTareas (TaskApp)

Gestor de tareas full stack: un backend en **Spring Boot** guarda las tareas en **PostgreSQL** y un frontend en **Angular 21** las muestra y administra.

Puedes crear, completar, editar y eliminar tareas. También hay una pantalla de estadísticas con el progreso real de la base de datos.

---

## Qué hace

| Acción | Dónde |
|---|---|
| Listar tareas | Tablero (`/`) |
| Crear tarea | Formulario del tablero |
| Marcar hecha / pendiente | Checkbox de cada tarjeta |
| Editar título | Icono de lápiz |
| Eliminar | Icono de papelera |
| Ver métricas | Estadísticas (`/stats`) |

Cada tarea tiene `id`, `title` y `completed`.

---

## Stack

**Backend (`taskapp/`)**
- Java 25
- Spring Boot 4.1.1
- Spring Data JPA + Hibernate
- PostgreSQL
- Arquitectura hexagonal (domain / application / infrastructure)

**Frontend (`frontend/`)**
- Angular 21
- Tailwind CSS 4
- Signals + standalone components
- Proxy de desarrollo hacia el API

---

## Requisitos

- [JDK 25](https://adoptium.net/)
- [Maven](https://maven.apache.org/) (o usa el `mvnw` del repo)
- [Node.js](https://nodejs.org/) 20+ (el proyecto se probó con Node 24)
- [PostgreSQL](https://www.postgresql.org/) 16+ (se usó 18.3)

---

## Base de datos

1. Arranca PostgreSQL.
2. Crea la base:

```sql
CREATE DATABASE taskapp_db;
```

3. Credenciales por defecto en `taskapp/src/main/resources/application.properties`:

```
jdbc:postgresql://localhost:5432/taskapp_db
usuario: postgres
password: admin123
```

Hibernate crea/actualiza la tabla `tasks` al arrancar (`spring.jpa.hibernate.ddl-auto=update`).

Si tu usuario o contraseña son distintos, cambia ese archivo antes de levantar el backend.

---

## Cómo correrlo

Necesitas **dos terminales**. El backend primero.

### 1. Backend — puerto 8080

```powershell
cd C:\GestoDeTareas\taskapp
.\mvnw.cmd spring-boot:run
```

Cuando veas `Started TaskappApplication`, la API está lista en [http://localhost:8080](http://localhost:8080).

### 2. Frontend — puerto 4200

```powershell
cd C:\GestoDeTareas\frontend
npm install
npm start
```

Abre [http://localhost:4200](http://localhost:4200).

`ng serve` usa `proxy.conf.json`: las peticiones a `/api` se reenvían a `http://localhost:8080`. No hace falta llamar al 8080 desde el navegador.

---

## Cómo se conectan

```
UI Angular (localhost:4200)
        │  eventos (crear, toggle, editar, borrar)
        ▼
TaskService  →  /api/v1/tasks
        │  proxy.conf.json
        ▼
Spring TaskController  →  http://localhost:8080/api/v1/tasks
        │
        ▼
PostgreSQL (taskapp_db)
```

El contrato JSON es el mismo en ambos lados:

```json
{ "id": 1, "title": "Preparar el informe", "completed": false }
```

---

## API

Base: `http://localhost:8080/api/v1/tasks`

CORS permitido desde `http://localhost:4200`.

| Método | Ruta | Body | Uso en el front |
|---|---|---|---|
| `GET` | `/api/v1/tasks` | — | Cargar tablero y stats |
| `GET` | `/api/v1/tasks/{id}` | — | Una tarea por id |
| `POST` | `/api/v1/tasks` | `{ "title": "..." }` | Crear |
| `PUT` | `/api/v1/tasks/{id}` | `{ "title": "...", "completed": true }` | Editar |
| `PATCH` | `/api/v1/tasks/{id}/toggle` | — | Completar / descompletar |
| `DELETE` | `/api/v1/tasks/{id}` | — | Eliminar |

El título en `POST` no puede ir vacío.

---

## Estructura

```
GestoDeTareas/
├── taskapp/                  Backend Spring Boot
│   └── src/main/java/com/andresh/taskapp/
│       ├── domain/           Modelo Task y puerto del repositorio
│       ├── application/      Casos de uso
│       └── infrastructure/
│           ├── controller/   TaskController (API REST)
│           ├── persistence/  Entidad JPA y adapter
│           └── config/       Beans
└── frontend/                 Angular 21
    └── src/app/
        ├── core/             Modelo + TaskService (HTTP)
        └── presentation/
            ├── components/   navbar, form, card
            └── pages/        tablero y estadísticas
```

---

## Scripts útiles

**Frontend**

```powershell
npm start          # desarrollo en :4200
npm test           # tests con Vitest
npm run build      # build de producción
```

**Backend**

```powershell
.\mvnw.cmd spring-boot:run
.\mvnw.cmd test
```

---

## Problemas frecuentes

**`Port 8080 was already in use`**  
Ya hay un Java escuchando ese puerto. No arranques otro backend. Cierra el proceso anterior (`Ctrl+C`) o mata el `java.exe` que usa 8080.

**El front dice que no conecta con el backend**  
Confirma que Spring está arriba y que PostgreSQL acepta conexiones. El frontend solo habla con `/api`; si el proxy o el 8080 fallan, verás el error en el tablero.

**Hibernate no arranca / no hay dialecto**  
Suele ser que PostgreSQL no está corriendo o no existe `taskapp_db`.

**Puerto 4200 ocupado**  
Cierra el `ng serve` anterior o usa otro puerto: `npx ng serve --port 4201`.

---

## Licencia

Uso privado / académico del proyecto TaskApp.
