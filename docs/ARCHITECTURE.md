# Архитектура проекта Nexora

## Структура проекта

Проект организован по принципу слоистой архитектуры (Layered Architecture), что обеспечивает разделение ответственности и упрощает поддержку кода.

## Структура директорий

```
nexora-front/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Группа маршрутов для авторизации
│   ├── (dashboard)/             # Группа маршрутов для дашборда
│   ├── api/                     # API маршруты (REST endpoints)
│   └── layout.tsx               # Корневой layout
│
├── components/                   # React компоненты
│   ├── forms/                   # Формы
│   ├── header/                  # Компоненты header
│   ├── profile/                 # Компоненты профиля
│   ├── providers/               # React провайдеры
│   └── ui/                      # UI компоненты (shadcn/ui)
│
├── lib/                         # Библиотека (бизнес-логика)
│   ├── auth/                    # Конфигурация аутентификации
│   ├── constants/               # Константы приложения
│   ├── db/                      # Подключение к БД
│   ├── hooks/                   # React хуки
│   ├── repositories/            # Репозитории (Data Access Layer)
│   ├── services/                # Сервисы (Business Logic Layer)
│   └── validations/             # Схемы валидации (Zod)
│
├── db/                          # База данных
│   └── schema.ts                # Схемы БД (Drizzle ORM)
│
└── types/                       # TypeScript типы
    └── next-auth.d.ts           # Расширение типов NextAuth
```

## Архитектурные слои

### 1. Presentation Layer (Слой представления)
**Расположение:** `app/`, `components/`

- **Pages (app/)**: Страницы Next.js App Router
- **Components**: React компоненты для UI
- **Hooks**: Кастомные React хуки для работы с данными

**Ответственность:**
- Отображение UI
- Обработка пользовательского ввода
- Вызов хуков и сервисов

### 2. API Layer (API слой)
**Расположение:** `app/api/`

- **Route Handlers**: Next.js Route Handlers для REST API

**Ответственность:**
- Прием HTTP запросов
- Валидация входных данных
- Вызов сервисов
- Формирование HTTP ответов

### 3. Service Layer (Слой сервисов)
**Расположение:** `lib/services/`

- **AuthService**: Сервис для авторизации и регистрации

**Ответственность:**
- Бизнес-логика приложения
- Оркестрация работы репозиториев
- Обработка бизнес-правил

**Пример:**
```typescript
// lib/services/auth.service.ts
export class AuthService {
  async register(data: RegisterData): Promise<User>
  async login(credentials: LoginCredentials): Promise<User | null>
}
```

### 4. Repository Layer (Слой репозиториев)
**Расположение:** `lib/repositories/`

- **UserRepository**: Репозиторий для работы с пользователями

**Ответственность:**
- Абстракция доступа к данным
- Операции CRUD с БД
- Запросы к базе данных

**Пример:**
```typescript
// lib/repositories/user.repository.ts
export class UserRepository {
  async findByEmail(email: string): Promise<User | null>
  async create(userData: NewUser): Promise<User>
  async existsByEmail(email: string): Promise<boolean>
}
```

### 5. Data Access Layer (Слой доступа к данным)
**Расположение:** `lib/db/`, `db/`

- **Connection**: Подключение к БД
- **Schema**: Схемы БД (Drizzle ORM)

**Ответственность:**
- Подключение к базе данных
- Определение схем данных
- Миграции

## Поток данных

### Регистрация пользователя:
```
Component (RegisterForm)
  ↓
Hook (useRegister)
  ↓
API Route (/api/register)
  ↓
Validation (registerSchema)
  ↓
Service (AuthService.register)
  ↓
Repository (UserRepository.create)
  ↓
Database
```

### Вход пользователя:
```
Component (LoginForm)
  ↓
Hook (useLogin)
  ↓
NextAuth (signIn)
  ↓
Auth Config (authorize)
  ↓
Service (AuthService.login)
  ↓
Repository (UserRepository.findByEmail)
  ↓
Database
```

## Принципы

### 1. Разделение ответственности (Separation of Concerns)
- Каждый слой имеет четко определенную ответственность
- Компоненты не знают о БД, репозитории не знают о UI

### 2. Dependency Inversion (Инверсия зависимостей)
- Высокоуровневые модули (сервисы) не зависят от низкоуровневых (репозитории)
- Используется абстракция через интерфейсы

### 3. Single Responsibility Principle
- Каждый класс/функция отвечает за одну вещь
- Репозиторий только для данных, сервис только для логики

### 4. DRY (Don't Repeat Yourself)
- Общая логика вынесена в сервисы и хуки
- Константы вынесены в отдельные файлы

## Импорты

### Рекомендуемые пути импорта:
```typescript
// Компоненты
import { Button } from "@/components/ui/button"

// Сервисы
import { authService } from "@/lib/services"

// Репозитории
import { userRepository } from "@/lib/repositories"

// Хуки
import { useRegister } from "@/lib/hooks/use-auth"

// Валидация
import { registerSchema } from "@/lib/validations/auth.validation"

// Константы
import { NAVIGATION_ITEMS } from "@/lib/constants/navigation.constants"

// Типы
import type { RegisterInput } from "@/lib/validations/auth.validation"
```

## Расширение проекта

### Добавление новой сущности (например, Project):

1. **Создать схему БД:**
   ```typescript
   // db/schema.ts
   export const projects = sqliteTable("projects", { ... })
   ```

2. **Создать репозиторий:**
   ```typescript
   // lib/repositories/project.repository.ts
   export class ProjectRepository { ... }
   ```

3. **Создать сервис:**
   ```typescript
   // lib/services/project.service.ts
   export class ProjectService { ... }
   ```

4. **Создать валидацию:**
   ```typescript
   // lib/validations/project.validation.ts
   export const createProjectSchema = z.object({ ... })
   ```

5. **Создать API роут:**
   ```typescript
   // app/api/projects/route.ts
   export async function POST(request: NextRequest) { ... }
   ```

6. **Создать компонент:**
   ```typescript
   // components/projects/ProjectForm.tsx
   ```

## Тестирование

Каждый слой можно тестировать независимо:
- **Repositories**: Мок БД
- **Services**: Мок репозиториев
- **API Routes**: Мок сервисов
- **Components**: Мок хуков

## Дополнительные ресурсы

- [Next.js App Router](https://nextjs.org/docs/app)
- [Drizzle ORM](https://orm.drizzle.team/)
- [NextAuth.js](https://next-auth.js.org/)
- [Zod Validation](https://zod.dev/)

