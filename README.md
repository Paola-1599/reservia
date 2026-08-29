# RESERVIA

Plataforma web para la reserva de citas con especialistas, con gestión completa de servicios, disponibilidad y pagos. Desarrollada bajo arquitectura cliente-servidor con autenticación segura basada en JWT.

Proyecto académico desarrollado en el programa Tecnología en Análisis y Desarrollo de Software del Servicio Nacional de Aprendizaje (SENA).

## Descripción General

RESERVIA permite la interacción entre tres roles principales:

- **Administrador** - Gestión de usuarios, servicios, estadísticas y ventas
- **Especialista** - Gestión de disponibilidad y citas
- **Cliente** - Búsqueda de servicios, reserva de citas y pagos

El sistema incluye:

- Registro y login con autenticación JWT
- Recuperación de contraseña mediante token temporal
- Protección de rutas basada en roles
- Gestión de catálogo de servicios con imágenes
- Gestión de disponibilidad por especialista
- Agendamiento, cancelación y reprogramación de citas
- Procesamiento de pagos
- Historial de citas y transacciones
- Estadísticas y reportes para administrador
- Dashboard personalizado por rol

## Arquitectura del Proyecto

El repositorio contiene frontend y backend en carpetas independientes:

```
/frontend  - Aplicación React (Cliente)
/backend   - API REST Node.js + Express (Servidor)
/documentacion - Manuales, diagramas UML y scripts SQL
```

Se implementa una arquitectura **cliente-servidor con separación por capas**:

- **Presentación**: SPA desarrollada en React con componentes por rol
- **Lógica de Negocio**: API REST desarrollada con Node.js y Express
- **Persistencia**: Base de datos relacional en MySQL

La comunicación se realiza mediante peticiones HTTP usando JSON.

## Backend - Estructura Técnica

### Configuración Principal

- Uso de dotenv para variables de entorno
- Conexión de base de datos mediante módulo independiente con pool de conexiones
- Middleware global para CORS y parseo de JSON
- Modularización por rutas especializadas

### Rutas Disponibles

```
/api/usuarios      - Gestión de usuarios
/api/auth          - Autenticación y login
/api/servicios     - Catálogo de servicios
/api/pagos         - Procesamiento de pagos
/api/ventas        - Historial de ventas
/api/agendas       - Gestión de agendas
/api/citas         - Gestión de citas
/api/disponibilidad - Disponibilidad de especialistas
```

### Separación por Capas

```
routes/         - Definición de endpoints
controllers/    - Lógica de negocio
services/       - Operaciones auxiliares
middlewares/    - Autenticación y validaciones
config/         - Configuración de base de datos
utils/          - Funciones utilitarias
```

## Seguridad Implementada

### Autenticación

El sistema implementa autenticación basada en **JSON Web Token (JWT)** siguiendo este flujo:

#### 1. Registro de Usuario

El usuario envía sus datos al endpoint:
```
POST /api/auth/registro
```

El backend:
- Valida los datos requeridos (nombre, email, documento, teléfono, etc.)
- Hashea la contraseña utilizando bcryptjs
- Guarda el usuario en MySQL con la contraseña encriptada
- Retorna confirmación con datos del usuario

#### 2. Inicio de Sesión

El usuario envía credenciales al endpoint:
```
POST /api/auth/login
```

El backend:
- Busca el usuario por email
- Compara la contraseña ingresada con el hash almacenado usando bcryptjs
- Si es válida, genera un JWT firmado con JWT_SECRET
- Retorna el token al cliente

El token contiene información como:
- `id` del usuario
- `rol` del usuario (cliente, especialista, admin)

#### 3. Acceso a Rutas Protegidas

El frontend envía el token en el header:
```
Authorization: Bearer <token>
```

El middleware de autenticación:
- Extrae el token desde el header Authorization
- Verifica el token con `jwt.verify()`
- Si es válido, adjunta los datos del usuario (id y rol) a la request
- Maneja errores 401 en caso de token inválido o expirado

#### 4. Recuperación de Contraseña

El usuario solicita recuperación mediante email.

El backend:
- Genera un resetToken aleatorio con expiración de 1 hora
- Almacena el resetToken y resetTokenExpiry en la base de datos
- Envía enlace de recuperación al correo del usuario
- Valida el token antes de permitir el cambio de contraseña

### Decisiones Técnicas de Seguridad

- ✅ JWT para mantener el sistema stateless
- ✅ Contraseñas nunca se almacenan en texto plano
- ✅ Autorización basada en roles (admin, especialista, cliente)
- ✅ Rutas críticas protegidas mediante middleware
- ✅ Uso de bcryptjs con salt rounds configurables
- ✅ Tokens con expiración configurable

## Modelo de Datos

### Tablas Principales

- **usuarios** - Registro de clientes, especialistas y administradores
- **servicios** - Catálogo de servicios disponibles
- **agendas** - Disponibilidad de especialistas
- **citas** - Reservas de citas con estado (programada, realizada, cancelada)
- **pagos** - Registro de transacciones
- **ventas** - Historial de ventas

### Relaciones

Las relaciones se gestionan mediante claves foráneas (FK):
- Los usuarios tienen rol definido
- Las citas relacionan cliente ↔ especialista ↔ servicio
- Los pagos se vinculan a citas específicas
- Los servicios pueden tener múltiples especialistas

## Instalación

### Requisitos

- Node.js v18 o superior
- npm v9 o superior
- MySQL 8.0 o compatible
- Git

### Clonar Repositorio

```bash
git clone https://github.com/tu-usuario/RESERVIA.git
cd RESERVIA
```

### Configuración Backend

```bash
cd backend
npm install
```

Crear archivo `.env` con las siguientes variables:

```env
MYSQL_HOST=tu-host-mysql
MYSQL_PORT=3306
MYSQL_USER=tu-usuario
MYSQL_PASSWORD=tu-contraseña
MYSQL_DATABASE=reservia
MYSQL_CONNECTION_LIMIT=10

EMAIL_USER=tu-correo@gmail.com
EMAIL_PASS=tu-contraseña-app

JWT_SECRET=tu-clave-secreta-jwt

PORT=4000
```

Ejecutar servidor de desarrollo:

```bash
npm run dev
```

Servidor disponible en: `http://localhost:4000`

### Configuración Frontend

```bash
cd frontend
npm install
npm start
```

Aplicación disponible en: `http://localhost:3000`

## Variables de Entorno (.env)

### Backend

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MYSQL_HOST` | Host del servidor MySQL | metro.proxy.rlwy.net |
| `MYSQL_PORT` | Puerto MySQL | 3306 |
| `MYSQL_USER` | Usuario de MySQL | root |
| `MYSQL_PASSWORD` | Contraseña MySQL | xxxxxxx |
| `MYSQL_DATABASE` | Nombre de la base de datos | reservia |
| `EMAIL_USER` | Correo para envío de emails | soporte@reservia.com |
| `EMAIL_PASS` | Contraseña de aplicación de email | xxxxxxx |
| `JWT_SECRET` | Clave secreta para firmar JWT | Reservia@__1234 |
| `PORT` | Puerto del servidor | 4000 |

## Scripts Disponibles

### Backend

```bash
npm run dev      # Ejecutar con nodemon (desarrollo)
npm start        # Ejecutar en producción
npm test         # Ejecutar pruebas (no configuradas)
```

### Frontend

```bash
npm start        # Iniciar servidor de desarrollo
npm run build    # Crear build de producción
npm test         # Ejecutar pruebas
```

## Estructura de Carpetas

```
RESERVIA/
├── backend/
│   ├── config/           # Configuración de BD
│   ├── controllers/      # Lógica de negocio
│   ├── middlewares/      # Autenticación y validaciones
│   ├── routes/           # Definición de endpoints
│   ├── services/         # Servicios auxiliares
│   ├── utils/            # Funciones utilitarias
│   ├── uploads/          # Archivos subidos
│   ├── .env             # Variables de entorno
│   └── server.js        # Punto de entrada
├── frontend/
│   ├── public/          # Archivos estáticos
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── styles/      # Estilos CSS
│   │   ├── services/    # Llamadas API
│   │   ├── api/         # Configuración Axios
│   │   └── App.js       # Componente principal
│   └── package.json
└── README.md           # Este archivo
```

## Buenas Prácticas Implementadas

- ✅ Uso de variables de entorno para configuración sensible
- ✅ Separación clara por capas (routes, controllers, services)
- ✅ Manejo robusto de errores con mensajes claros
- ✅ Protección de rutas mediante middleware de autenticación
- ✅ Encriptación de contraseñas con bcryptjs
- ✅ Control de acceso granular por rol
- ✅ Organización modular del código
- ✅ Documentación técnica completa en carpeta documentacion/
- ✅ Uso de pool de conexiones MySQL para mejor rendimiento
- ✅ Validación de datos en servidor
- ✅ CORS configurado correctamente
- ✅ Versionado con Git


## Autora

- Anyi Paola Gómez Arias

**Programa**: Tecnología en Análisis y Desarrollo de Software  
**Institución**: Servicio Nacional de Aprendizaje (SENA)  
**Año**: 2024-2026

## Licencia

Este proyecto está bajo licencia [ISC](LICENSE).

---

**Última actualización**: Agosto 2026

