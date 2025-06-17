# Esquema de Base de Datos - Sistema de Gimnasio

## Modelo No Relacional (MongoDB) - Implementación Actual

### 1. Colección: Users
```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  phone: String,
  membershipType: String, // 'basic', 'premium', 'vip'
  gymId: ObjectId, // Referencia al gimnasio
  isActive: Boolean,
  registrationDate: Date,
  profileImage: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  medicalInfo: {
    allergies: [String],
    conditions: [String],
    medications: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Colección: Gyms
```javascript
{
  _id: ObjectId,
  name: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  phone: String,
  email: String,
  operatingHours: {
    monday: { open: String, close: String, isClosed: Boolean },
    tuesday: { open: String, close: String, isClosed: Boolean },
    wednesday: { open: String, close: String, isClosed: Boolean },
    thursday: { open: String, close: String, isClosed: Boolean },
    friday: { open: String, close: String, isClosed: Boolean },
    saturday: { open: String, close: String, isClosed: Boolean },
    sunday: { open: String, close: String, isClosed: Boolean }
  },
  facilities: [String], // ['cardio', 'weights', 'pool', 'sauna', 'classes']
  maxCapacity: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Colección: Exercises
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String, // 'cardio', 'strength', 'flexibility', 'sports'
  muscleGroups: [String], // ['chest', 'back', 'legs', 'shoulders', 'arms', 'core']
  equipment: [String], // ['barbell', 'dumbbell', 'machine', 'bodyweight']
  difficulty: String, // 'beginner', 'intermediate', 'advanced'
  instructions: [String],
  tips: [String],
  warnings: [String],
  imageUrl: String,
  videoUrl: String,
  estimatedCaloriesPerMinute: Number,
  isActive: Boolean,
  createdBy: ObjectId, // Trainer o Admin que creó el ejercicio
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Colección: WorkoutPlans
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  userId: ObjectId, // Usuario al que pertenece el plan
  trainerId: ObjectId, // Entrenador que creó el plan
  gymId: ObjectId,
  goal: String, // 'weight_loss', 'muscle_gain', 'endurance', 'strength'
  duration: Number, // Duración en semanas
  difficulty: String,
  exercises: [
    {
      exerciseId: ObjectId,
      sets: Number,
      reps: Number,
      weight: Number,
      duration: Number, // Para ejercicios de tiempo (cardio)
      restTime: Number, // Tiempo de descanso en segundos
      notes: String,
      order: Number // Orden en la rutina
    }
  ],
  schedule: {
    daysPerWeek: Number,
    preferredDays: [String], // ['monday', 'wednesday', 'friday']
    estimatedDuration: Number // Duración estimada por sesión en minutos
  },
  isActive: Boolean,
  startDate: Date,
  endDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Colección: WorkoutSessions
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  workoutPlanId: ObjectId,
  gymId: ObjectId,
  sessionDate: Date,
  startTime: Date,
  endTime: Date,
  status: String, // 'planned', 'in_progress', 'completed', 'skipped'
  exercises: [
    {
      exerciseId: ObjectId,
      plannedSets: Number,
      completedSets: [
        {
          reps: Number,
          weight: Number,
          duration: Number,
          restTime: Number,
          completed: Boolean
        }
      ],
      notes: String,
      rating: Number // 1-5 qué tan difícil fue
    }
  ],
  overallRating: Number,
  notes: String,
  caloriesBurned: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Colección: Trainers
```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  phone: String,
  gymId: ObjectId,
  certifications: [
    {
      name: String,
      institution: String,
      dateObtained: Date,
      expirationDate: Date,
      certificateUrl: String
    }
  ],
  specialties: [String], // ['weight_training', 'cardio', 'nutrition', 'yoga']
  experience: Number, // Años de experiencia
  bio: String,
  profileImage: String,
  hourlyRate: Number,
  availability: {
    monday: [{ start: String, end: String }],
    tuesday: [{ start: String, end: String }],
    // ... otros días
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 7. Colección: Equipment
```javascript
{
  _id: ObjectId,
  name: String,
  type: String, // 'cardio', 'strength', 'free_weights'
  brand: String,
  model: String,
  gymId: ObjectId,
  location: String, // Área del gimnasio
  status: String, // 'available', 'in_use', 'maintenance', 'out_of_order'
  maxCapacity: Number, // Para máquinas que pueden usar varias personas
  currentUsers: [ObjectId], // Usuarios actuales usando el equipo
  maintenanceSchedule: {
    lastMaintenance: Date,
    nextMaintenance: Date,
    frequency: String // 'weekly', 'monthly', 'quarterly'
  },
  purchaseDate: Date,
  warrantyExpiration: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 8. Colección: Classes
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  gymId: ObjectId,
  trainerId: ObjectId,
  type: String, // 'yoga', 'spinning', 'zumba', 'crossfit'
  capacity: Number,
  duration: Number, // En minutos
  schedule: {
    dayOfWeek: String,
    startTime: String,
    endTime: String
  },
  recurrence: String, // 'weekly', 'monthly', 'once'
  room: String,
  requiredEquipment: [String],
  difficulty: String,
  price: Number,
  enrolledUsers: [
    {
      userId: ObjectId,
      enrollmentDate: Date,
      status: String // 'enrolled', 'waitlist', 'attended', 'missed'
    }
  ],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Modelo Relacional (SQL) - Alternativo

### Tablas Principales:

#### 1. users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    membership_type VARCHAR(50) NOT NULL,
    gym_id UUID REFERENCES gyms(id),
    is_active BOOLEAN DEFAULT true,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_image TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. gyms
```sql
CREATE TABLE gyms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    max_capacity INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. exercises
```sql
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    image_url TEXT,
    video_url TEXT,
    estimated_calories_per_minute DECIMAL(5,2),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES trainers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. workout_plans
```sql
CREATE TABLE workout_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id UUID REFERENCES users(id),
    trainer_id UUID REFERENCES trainers(id),
    gym_id UUID REFERENCES gyms(id),
    goal VARCHAR(100) NOT NULL,
    duration_weeks INTEGER,
    difficulty VARCHAR(50),
    days_per_week INTEGER,
    estimated_duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT true,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. workout_plan_exercises
```sql
CREATE TABLE workout_plan_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id),
    sets INTEGER,
    reps INTEGER,
    weight DECIMAL(5,2),
    duration_seconds INTEGER,
    rest_time_seconds INTEGER,
    exercise_order INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. workout_sessions
```sql
CREATE TABLE workout_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    workout_plan_id UUID REFERENCES workout_plans(id),
    gym_id UUID REFERENCES gyms(id),
    session_date DATE NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(50) DEFAULT 'planned',
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    notes TEXT,
    calories_burned INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Índices Recomendados (MongoDB)

```javascript
// Users
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "gymId": 1 })
db.users.createIndex({ "membershipType": 1 })

// WorkoutPlans
db.workoutplans.createIndex({ "userId": 1 })
db.workoutplans.createIndex({ "gymId": 1 })
db.workoutplans.createIndex({ "trainerId": 1 })

// WorkoutSessions
db.workoutsessions.createIndex({ "userId": 1, "sessionDate": -1 })
db.workoutsessions.createIndex({ "workoutPlanId": 1 })
db.workoutsessions.createIndex({ "gymId": 1, "sessionDate": -1 })

// Exercises
db.exercises.createIndex({ "category": 1 })
db.exercises.createIndex({ "muscleGroups": 1 })
db.exercises.createIndex({ "difficulty": 1 })
```

## Ventajas del Modelo NoSQL (MongoDB):

1. **Flexibilidad**: Fácil agregar nuevos campos sin migrar toda la base de datos
2. **Rendimiento**: Menos JOINs, consultas más rápidas
3. **Escalabilidad**: Mejor para aplicaciones con mucha carga
4. **Estructura anidada**: Los arrays de ejercicios y sets se almacenan naturalmente
5. **Desarrollo ágil**: Cambios de schema más sencillos

## Casos de Uso Principales:

1. **Obtener rutina de un usuario**: Una sola consulta a WorkoutPlans
2. **Registrar sesión de ejercicio**: Inserción en WorkoutSessions con subdocumentos
3. **Analytics por gimnasio**: Agregaciones eficientes en MongoDB
4. **Búsqueda de ejercicios**: Índices de texto completo nativos
