import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Todo, FilterStatus } from "./types";

let localIdCounter = Date.now();

const STORAGE_KEY = "taskflow-local-todos";

interface TodoState {
  todos: Todo[];
  total: number;
  localTodos: Todo[];
  allApiTodos: Todo[] | null;
  currentPage: number;
  filter: FilterStatus;
  isLoading: boolean;
  error: string | null;

  setTodos: (todos: Todo[], total: number) => void;
  setAllApiTodos: (todos: Todo[] | null) => void;
  addLocalTodo: (todo: Todo) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  setPage: (page: number) => void;
  setFilter: (filter: FilterStatus) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTodoStore = create<TodoState>()(
  devtools(
    persist(
      (set) => ({
        todos: [],
        total: 0,
        localTodos: [],
        allApiTodos: null,
        currentPage: 1,
        filter: "all",
        isLoading: false,
        error: null,

        setTodos: (todos, total) => set({ todos, total }),
        setAllApiTodos: (allApiTodos) => set({ allApiTodos }),

        addLocalTodo: (todo) =>
          set((state) => {
            const newTodo: Todo = {
              ...todo,
              id: ++localIdCounter,
              isLocal: true,
            };
            return {
              localTodos: [newTodo, ...state.localTodos],
            };
          }),

        toggleTodo: (id) =>
          set((state) => ({
            todos: state.todos.map((t) =>
              t.id === id ? { ...t, completed: !t.completed } : t,
            ),
            localTodos: state.localTodos.map((t) =>
              t.id === id ? { ...t, completed: !t.completed } : t,
            ),
            allApiTodos: state.allApiTodos?.map((t) =>
              t.id === id ? { ...t, completed: !t.completed } : t,
            ) ?? null,
          })),

        removeTodo: (id) =>
          set((state) => ({
            todos: state.todos.filter((t) => t.id !== id),
            localTodos: state.localTodos.filter((t) => t.id !== id),
            allApiTodos: state.allApiTodos?.filter((t) => t.id !== id) ?? null,
          })),

        setPage: (page) => set({ currentPage: page }),
        setFilter: (filter) => set({ filter }),
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
      }),
      {
        name: STORAGE_KEY,
        partialize: (state) => ({ localTodos: state.localTodos }),
        onRehydrateStorage: () => (state) => {
          if (state?.localTodos?.length) {
            const maxId = Math.max(...state.localTodos.map((t) => t.id), 0);
            localIdCounter = Math.max(localIdCounter, maxId);
          }
        },
      },
    ),
    { name: "TodoStore" },
  ),
);

export const selectFilteredTodos = (state: TodoState): Todo[] => {
  const merged = [...state.localTodos, ...state.todos];
  switch (state.filter) {
    case "completed":
      return merged.filter((t) => t.completed);
    case "pending":
      return merged.filter((t) => !t.completed);
    default:
      return merged;
  }
};
