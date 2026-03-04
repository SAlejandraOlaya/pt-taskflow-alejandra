import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Todo, FilterStatus } from "./types";

let localIdCounter = Date.now();

interface TodoState {
  todos: Todo[];
  total: number;
  localTodos: Todo[];
  currentPage: number;
  filter: FilterStatus;
  isLoading: boolean;
  error: string | null;

  setTodos: (todos: Todo[], total: number) => void;
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
    (set) => ({
      todos: [],
      total: 0,
      localTodos: [],
      currentPage: 1,
      filter: "all",
      isLoading: false,
      error: null,

      setTodos: (todos, total) => set({ todos, total }),

      addLocalTodo: (todo) =>
        set((state) => ({
          localTodos: [
            { ...todo, id: ++localIdCounter, isLocal: true },
            ...state.localTodos,
          ],
        })),

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t,
          ),
          localTodos: state.localTodos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t,
          ),
        })),

      removeTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
          localTodos: state.localTodos.filter((t) => t.id !== id),
        })),

      setPage: (page) => set({ currentPage: page }),
      setFilter: (filter) => set({ filter }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
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
