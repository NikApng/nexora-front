# Стратегия рендеринга в проекте Nexora

## Текущий статус: **SSR (Server-Side Rendering)** с элементами **CSR (Client-Side Rendering)**

Проект использует **Next.js 16** с **App Router**, который по умолчанию использует Server-Side Rendering.

## Анализ по страницам

### 1. **Server Components (SSR) - рендерятся на сервере**

#### `app/page.tsx`
- **Тип**: Server Component
- **Рендеринг**: SSR
- **Описание**: Редирект на `/register`

#### `app/(auth)/login/page.tsx`
- **Тип**: Server Component
- **Рендеринг**: SSR
- **Описание**: Рендерит `LoginForm` (который является Client Component)

#### `app/(auth)/register/page.tsx`
- **Тип**: Server Component
- **Рендеринг**: SSR
- **Описание**: Рендерит `RegisterForm` (который является Client Component)

#### `app/(dashboard)/layout.tsx`
- **Тип**: Server Component
- **Рендеринг**: SSR
- **Описание**: Layout для всех dashboard страниц

#### `app/(dashboard)/projects/page.tsx`
- **Тип**: Server Component
- **Рендеринг**: SSR
- **Примечание**: Пока пустая страница

#### `app/(dashboard)/projects/[id]/page.tsx`
- **Тип**: Server Component
- **Рендеринг**: SSR (динамический роут)
- **Примечание**: Пока пустая страница

### 2. **Client Components (CSR) - рендерятся на клиенте**

#### `app/(dashboard)/profile/page.tsx`
- **Директива**: `"use client"`
- **Тип**: Client Component
- **Рендеринг**: CSR (Client-Side Rendering)
- **Причина**: Использует `useState`, интерактивные компоненты

#### `app/(dashboard)/tasks/page.tsx`
- **Директива**: `"use client"`
- **Тип**: Client Component
- **Рендеринг**: CSR (Client-Side Rendering)
- **Причина**: Использует `useState`, drag-and-drop, интерактивность

## Смешанный рендеринг (Hybrid)

В Next.js App Router используется **гибридный подход**:

```
Server Component (SSR)
    ↓
    └─> Client Component (CSR) [если есть "use client"]
```

**Пример:**
- `login/page.tsx` (Server Component) → рендерит `LoginForm` (Client Component)
- Сервер рендерит HTML оболочку, клиент рендерит интерактивные части

## Что НЕ используется

❌ **SSG (Static Site Generation)** - нет `generateStaticParams`
❌ **ISG (Incremental Static Generation)** - нет `revalidate`
❌ **ISR (Incremental Static Regeneration)** - нет настроек

## Преимущества текущего подхода

✅ **SSR (Server Components)**:
- Быстрая первая загрузка
- SEO-оптимизация
- Доступ к серверным ресурсам (БД, API)
- Меньше JavaScript на клиенте

✅ **CSR (Client Components)**:
- Интерактивность
- Состояние компонентов
- Работа с браузерными API

## Рекомендации по оптимизации

### 1. Для страниц, которые не меняются часто - добавить SSG:

```typescript
// app/(dashboard)/projects/page.tsx
export const dynamic = 'force-static' // SSG
// или
export const revalidate = 3600 // ISR каждые 3600 секунд
```

### 2. Для динамических страниц - использовать ISR:

```typescript
// app/(dashboard)/projects/[id]/page.tsx
export const revalidate = 60 // ISR каждые 60 секунд

export async function generateStaticParams() {
  // Предварительная генерация популярных страниц
  return [
    { id: '1' },
    { id: '2' },
  ]
}
```

### 3. Оптимизация Client Components:

- Использовать `use client` только там, где необходимо
- Разделять Server и Client компоненты
- Использовать Server Components для данных

## Итоговая схема

```
┌─────────────────────────────────────┐
│   Server Components (SSR)           │
│   - app/page.tsx                    │
│   - app/(auth)/login/page.tsx       │
│   - app/(auth)/register/page.tsx    │
│   - app/(dashboard)/layout.tsx      │
│   - app/(dashboard)/projects/       │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   Client Components (CSR)           │
│   - app/(dashboard)/profile/page.tsx│
│   - app/(dashboard)/tasks/page.tsx  │
│   - components/forms/*.tsx          │
│   - components/tasks/*.tsx          │
└─────────────────────────────────────┘
```

## Вывод

**Текущая стратегия**: **SSR + CSR (Hybrid)**
- Серверные компоненты для статичного контента
- Клиентские компоненты для интерактивности
- Оптимальный баланс между производительностью и функциональностью

**Рекомендация**: Для production можно добавить ISR для часто используемых страниц, чтобы кэшировать их и уменьшить нагрузку на сервер.


