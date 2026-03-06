# TaskFlow

App de gestión de tareas para la prueba técnica de frontend de Orquestia. Usa la API pública de [DummyJSON](https://dummyjson.com/docs/todos) para CRUD de TODOs.

## Demo

> Deploy en Vercel: https://pt-taskflow-alejandra-b9wborf7p-alejandra-olaya-s-projects.vercel.app/

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · TailwindCSS v4 · shadcn/ui · Zustand 5 · Sonner · next-themes · Jest + Testing Library

## Decisiones Técnicas

### Estado con Zustand

Elegí Zustand porque necesitaba estado compartido entre varios componentes (lista, formulario, filtros, paginación) sin providers ni boilerplate. El store centraliza los TODOs, la página actual, el filtro y los estados de loading/error.

Los componentes se suscriben a slices individuales (`useTodoStore(s => s.todos)`) para evitar re-renders innecesarios. El middleware `devtools` facilita la depuración vía Redux DevTools.

El contador de IDs locales (`nextLocalId`) y el set de IDs en vuelo (`togglingIds`) viven dentro del store para mantener todo el estado predecible y testeable.

### Arquitectura feature-based

Organicé todo bajo `src/features/todos/` en vez del layout plano típico. Los hooks, componentes, store, tipos y el cliente API viven juntos. Si el proyecto creciera (ej: `features/users/`), cada feature queda autocontenida sin contaminar las demás.

El componente `TodoBoard` actúa como orquestador ligero delegando la lógica a hooks (`useTodos`, `useTodoActions`, `useFilteredTodos`) y subcomponentes (`DeleteConfirmDialog`, `FilterTabs`, `Pagination`, etc.).

### La API no persiste datos

Los endpoints de escritura de DummyJSON devuelven 200 pero no guardan nada. Lo resolví así:

- Los TODOs creados se agregan al store de Zustand con IDs negativos para no chocar con los IDs de la API. Estos TODOs viven en memoria y se pierden al recargar.
- El toggle usa optimistic update: actualiza la UI de inmediato y si la API falla, revierte al estado anterior y muestra un toast de error.
- Los TODOs eliminados se borran del store tras confirmación vía Dialog con loading state mientras la llamada está en vuelo.
- Al cambiar de página se hace un nuevo fetch, por lo que los cambios locales (crear, toggle, eliminar) solo se reflejan en la página donde se hicieron.

No se usa localStorage ni ningún mecanismo de persistencia del lado del cliente. En un sistema real, la no-persistencia de la API sería un bug crítico del backend que debe corregirse en origen, no compensarse desde el frontend. Agregar una capa de cache local introduciría complejidad de sincronización (conflictos, datos stale, invalidación) para resolver un problema que no debería existir. La solución actual refleja la realidad del contrato de la API: las escrituras son simuladas, y el frontend las trata como tales.

### Optimistic updates en toggle

Elegí optimistic updates para el toggle porque la acción es reversible, esperar la respuesta genera lag en cada click, y el rollback cubre el caso de fallo sin perder datos. Para evitar race conditions por clicks rápidos, el store mantiene un `togglingIds` Set que bloquea toggles duplicados mientras la llamada API está en vuelo.

### Delete post-respuesta

A diferencia del toggle, el delete espera la confirmación de la API antes de remover el TODO del listado. La eliminación es destructiva e irreversible: si la API falla, el usuario no pierde el dato. El dialog de confirmación con loading state hace que la espera sea explícita y controlada, en lugar de eliminar de inmediato (sin esperar confirmación del servidor) y tener que restaurar un item que el usuario ya dejó de ver.

### Testing

Se incluyen tests unitarios y de componente con Jest que cubren el store de Zustand, los hooks de acciones CRUD, y el componente `TodoItem`.

## Inicio Rápido

Necesitas Node.js >= 20 y [pnpm](https://pnpm.io/) >= 9.

```bash
git clone https://github.com/SAlejandraOlaya/pt-taskflow-alejandra.git
cd pt-taskflow-alejandra
pnpm install
cp .env.example .env
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

La única variable de entorno es `NEXT_PUBLIC_API_URL`. Si no se define, el fetch client usa `https://dummyjson.com` como fallback. En un entorno de producción real se recomendaría fallar explícitamente si la variable no está configurada, pero dado que esta app consume una API pública fija, el fallback simplifica el setup sin riesgo.

## Scripts

- `pnpm dev` — servidor de desarrollo
- `pnpm build` — build de producción
- `pnpm lint` — ESLint
- `pnpm format` — Prettier
- `pnpm format:check` — verificar formato
- `pnpm test` — ejecutar tests con Jest
- `pnpm test:watch` — tests en modo watch

## Estructura

```
src/
├── app/
│   ├── layout.tsx                # Layout raíz con ThemeProvider + Toaster
│   ├── page.tsx                  # Ruta única
│   └── globals.css
├── features/todos/
│   ├── api.ts                    # Cliente API (CRUD contra DummyJSON)
│   ├── types.ts                  # Interfaces y tipos
│   ├── store.ts                  # Zustand store con devtools
│   ├── components/
│   │   ├── todo-board.tsx        # Orquestador principal
│   │   ├── todo-form.tsx
│   │   ├── todo-item.tsx
│   │   ├── todo-skeleton.tsx
│   │   ├── filter-tabs.tsx
│   │   ├── empty-state.tsx
│   │   ├── error-state.tsx
│   │   ├── pagination.tsx
│   │   └── delete-confirm-dialog.tsx
│   ├── hooks/
│   │   ├── use-todos.ts          # Fetch paginado
│   │   ├── use-todo-actions.ts   # Create, toggle y delete
│   │   └── use-filtered-todos.ts # Filtrado y paginación derivados
│   └── __tests__/
│       ├── store.test.ts
│       ├── use-todo-actions.test.ts
│       └── todo-item.test.tsx
└── shared/
    ├── lib/
    │   ├── fetch-client.ts       # Wrapper tipado sobre fetch
    │   ├── utils.ts              # cn()
    │   └── constants.ts
    └── ui/                       # Primitivos shadcn/ui
```

## Funcionalidades

- Listado paginado (10 por página) con skeletons de carga y retry en error
- Crear TODOs con POST `/todos/add`, se prependen al listado actual
- Toggle completado/pendiente con optimistic update, rollback en error y protección contra clicks rápidos
- Eliminar con confirmación vía Dialog y loading state en el botón
- Filtro local (All / Pending / Completed) sobre la página actual, con acción para limpiar filtro en estado vacío
- Dark mode con detección del sistema
- Toasts de feedback en cada operación
- Tests unitarios y de componente con Jest + Testing Library
