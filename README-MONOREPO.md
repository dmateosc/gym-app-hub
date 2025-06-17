# Gym Management System - Nx Monorepo

Este proyecto ha sido migrado a una arquitectura de monorepo usando [Nx](https://nx.dev/) para gestionar mejor el código del frontend, backend y librerías compartidas.

## 🏗️ Estructura del Monorepo

```
gym-app/
├── apps/
│   ├── api/          # Backend NestJS con Arquitectura Hexagonal
│   └── web/          # Frontend React con Vite
├── libs/
│   ├── shared-types/ # Tipos TypeScript compartidos
│   └── shared-utils/ # Utilidades compartidas
├── nx.json          # Configuración de Nx
├── package.json     # Dependencias del workspace
└── tsconfig.base.json # Configuración TypeScript base
```

## 🚀 Comandos de Desarrollo

### Desarrollo conjunto (recomendado)
```bash
# Ejecutar tanto el API como el frontend en paralelo
npm run dev

# O individualmente:
npm run serve:api    # Solo el backend (puerto 5000)
npm run serve:web    # Solo el frontend (puerto 3000)
```

### Build
```bash
# Build de todos los proyectos
npm run build

# Build individual
npm run build:api
npm run build:web
```

### Testing
```bash
# Ejecutar tests en todos los proyectos
npm run test

# Tests con watch mode
npm run test:watch

# Coverage de todos los proyectos
npm run test:coverage
```

### Linting y Formatting
```bash
# Lint todos los proyectos
npm run lint

# Fix de linting automático
npm run lint:fix

# Format código con Prettier
npm run format
```

### Comandos Nx Avanzados
```bash
# Ver el grafo de dependencias
npm run dep-graph

# Ejecutar solo proyectos afectados por cambios
npm run affected:build
npm run affected:test
npm run affected:lint

# Reset de cache de Nx
npm run clean
```

## 📱 Aplicaciones

### 🔧 API (Backend)
- **Ubicación**: `apps/api/`
- **Tecnología**: NestJS + TypeScript
- **Arquitectura**: Hexagonal (Ports & Adapters)
- **Base de datos**: MongoDB
- **Puerto**: 5000
- **Documentación**: Swagger en `/api/docs`

### 🌐 Web (Frontend)  
- **Ubicación**: `apps/web/`
- **Tecnología**: React + TypeScript + Vite
- **Estilo**: Bootstrap
- **Puerto**: 3000
- **Proxy**: Las llamadas `/api/*` se redirigen al backend

## 📚 Librerías Compartidas

### 🏷️ shared-types
- **Ubicación**: `libs/shared-types/`
- **Propósito**: Tipos TypeScript compartidos entre frontend y backend
- **Incluye**: Interfaces de User, Gym, Exercise, WorkoutPlan, etc.

### 🛠️ shared-utils
- **Ubicación**: `libs/shared-utils/`
- **Propósito**: Utilidades y funciones comunes
- **Incluye**: Validaciones, formateo de fechas, constantes, etc.

## 🔧 Configuración del Entorno

### Variables de Entorno

**Backend (`apps/api/.env`)**:
```env
MONGO_URI=mongodb://localhost:27017/gymdb
RABBITMQ_URI=amqp://localhost:5672
PORT=5000
NODE_ENV=development
```

**Frontend (`apps/web/.env`)**:
```env
VITE_API_URL=http://localhost:5000
```

## 📈 Beneficios del Monorepo

1. **Código compartido**: Las librerías shared-types y shared-utils eliminan duplicación
2. **Builds incrementales**: Nx solo compila lo que cambió
3. **Testing inteligente**: Solo ejecuta tests de código afectado
4. **Dependency graph**: Visualización clara de dependencias entre proyectos
5. **Desarrollo unificado**: Un solo repositorio para todo el stack
6. **Tooling consistente**: ESLint, Prettier y TypeScript configurados de forma unificada

## 🎯 Próximos Pasos

- [ ] Configurar CI/CD con GitHub Actions
- [ ] Agregar más librerías compartidas según necesidad
- [ ] Implementar lazy loading en el frontend
- [ ] Configurar Docker multi-stage builds
- [ ] Agregar tests E2E con Cypress/Playwright

## 📖 Más Información

- [Documentación de Nx](https://nx.dev/)
- [Guía de Migración a Monorepo](https://nx.dev/recipes/adopting-nx)
- [Best Practices con Nx](https://nx.dev/core-features/enforce-project-boundaries)