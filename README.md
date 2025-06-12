# Gym Management System - Full Stack + Microservices

Sistema completo para la gestión de usuarios de gimnasio desarrollado con **Arquitectura Hexagonal**, **Domain-Driven Design**, **CQRS**, **Event-Driven Architecture** y **React**.

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│     Frontend    │────│     Backend     │────│    RabbitMQ     │
│   (React+TS)    │    │   (NestJS+TS)   │    │   (Messages)    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │                 │
                    │     MongoDB     │
                    │   (Database)    │
                    │                 │
                    └─────────────────┘
```

---

## 🚀 Instalación desde cero

### Prerrequisitos

- **Node.js**: v18 o superior.
- **MongoDB**: v6.0 o superior.
- **RabbitMQ**: v3.12 o superior (opcional para eventos).
- **npm** o **yarn**.

---

### Backend: Configuración de NestJS

#### 1. Instalar NestJS CLI

```bash
npm install -g @nestjs/cli
```

#### 2. Crear un nuevo proyecto NestJS

```bash
nest new gym-backend-hexagonal
cd gym-backend-hexagonal
```

#### 3. Instalar las dependencias necesarias

```bash
# Dependencias principales
npm install @nestjs/cqrs @nestjs/mongoose @nestjs/swagger mongoose class-validator class-transformer dotenv

# Dependencias para RabbitMQ (opcional, para eventos)
npm install @nestjs/microservices amqp-connection-manager amqplib

# Dependencias de desarrollo
npm install --save-dev @types/mongoose @types/amqplib
```

#### 4. Generar la estructura del proyecto

```bash
# Crear el módulo principal para usuarios
nest generate module app/infrastructure/modules/user --flat

# Crear el controlador para usuarios
nest generate controller app/infrastructure/adapters/controllers/user --flat

# Crear el servicio de dominio para usuarios
nest generate service app/domain/services/user --flat

# Crear filtros para manejo de excepciones
nest generate filter app/infrastructure/filters/domain-exception --flat
```

#### 5. Configuración de MongoDB en NestJS

Agrega la conexión a MongoDB en el archivo `app.module.ts`:

```typescript
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/gymdb'),
    UserModule, // Importar el módulo de usuarios
  ],
})
export class AppModule {}
```

#### 6. Configuración de RabbitMQ (opcional)

Agrega un servicio de publicación de eventos utilizando **RabbitMQ**:

```bash
# Crear Publisher y Listener
nest generate service app/infrastructure/adapters/messaging/rabbitmq-event-publisher --flat
nest generate service app/infrastructure/adapters/messaging/user-event-listener --flat
```

---

### Frontend: Configuración de React + Vite

#### 1. Crear un nuevo proyecto React con Vite

```bash
# Crear el proyecto con Vite
npm create vite@latest gym-frontend -- --template react-ts
cd gym-frontend
```

#### 2. Instalar las dependencias necesarias

```bash
# React Query, React Router, Bootstrap, etc.
npm install @tanstack/react-query axios react-router-dom react-bootstrap bootstrap react-hook-form zod react-hot-toast

# Dependencias de desarrollo
npm install --save-dev @types/react @types/react-dom
```

#### 3. Configuración de Vite

Actualiza el archivo `vite.config.ts` para configurar el proxy al backend:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

#### 4. Estructura básica de React

Genera los siguientes directorios para organizar el frontend:

```plaintext
src/
├── components/          # Componentes reutilizables
├── hooks/               # Custom hooks (React Query, etc.)
├── pages/               # Páginas principales
├── services/            # Servicios de API
├── types/               # Definición de tipos (TypeScript)
├── App.tsx              # Punto de entrada de rutas
├── main.tsx             # Punto de entrada principal
```

#### 5. Configuración de Bootstrap

Importa Bootstrap en `main.tsx`:

```typescript
import 'bootstrap/dist/css/bootstrap.min.css';
```

---

### Configuración Adicional

#### Variables de entorno

Crea un archivo `.env` en el backend y frontend con las siguientes configuraciones:

**Backend:**

```plaintext
# MongoDB
MONGO_URI=mongodb://localhost:27017/gymdb

# RabbitMQ (opcional)
RABBITMQ_URI=amqp://localhost:5672

# Servidor
PORT=5000
NODE_ENV=development
```

**Frontend:**

```plaintext
VITE_API_URL=http://localhost:5000
```

---

## 🛠️ Comandos útiles

### Backend (NestJS)

```bash
# Verificar versión de NestJS
nest --version

# Generar un módulo
nest generate module <nombre>

# Generar un controlador
nest generate controller <nombre>

# Generar un servicio
nest generate service <nombre>

# Generar un filtro para excepciones
nest generate filter <nombre>
```

### Frontend (React + Vite)

```bash
# Crear un nuevo proyecto
npm create vite@latest gym-frontend -- --template react-ts

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa del build
npm run preview
```

---

## 📚 Documentación incluida

1. **Swagger (API Docs)**: Disponible en `http://localhost:5000/api/docs`.
2. **React Query DevTools**: Activo en modo desarrollo para gestionar el estado de datos del frontend.

---

## 🧪 Testing

### Backend

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests E2E
npm run test:e2e

# Ver cobertura de test
npm run test:cov
```

### Frontend

```bash
# Ejecutar tests (si se integran)
npm run test
```

---

## 🚀 Despliegue con Docker

Usa el archivo `docker-compose.yml` para levantar los servicios completos:

```bash
docker-compose up --build
```

Esto levantará los siguientes servicios:
- **MongoDB**: Base de datos de usuarios.
- **RabbitMQ**: Gestión de eventos y colas de mensajes.
- **Backend**: API para gestión de usuarios.
- **Frontend**: Interfaz web para administración.

---

## 📈 Próximas funcionalidades

- [ ] Autenticación con JWT.
- [ ] Gestión de roles (admin, staff, usuarios).
- [ ] Integración con pasarelas de pago.
- [ ] Dashboard con métricas de usuarios y actividad.
- [ ] Sistema de reservas para clases y entrenamientos.

---

## 🤝 Contribución

1. Haz un fork del proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`).
3. Commit tus cambios (`git commit -m 'Add some amazing feature'`).
4. Sube la rama (`git push origin feature/amazing-feature`).
5. Abre un Pull Request.

---

## 📄 Licencia

MIT License