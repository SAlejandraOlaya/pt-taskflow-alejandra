import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Todo, FilterStatus } from "./types";

interface TodoState {
  todos: Todo[];
  apiTotal: number;
  currentPage: number;
  filter: FilterStatus;
  isLoading: boolean;
  error: string | null;
  nextLocalId: number;
  togglingIds: Set<number>;

  setTodos: (todos: Todo[], apiTotal: number) => void;
  addTodo: (todo: Todo) => void;
  updateTodoCompleted: (id: number, completed: boolean) => void;
  removeTodo: (id: number) => void;
  setPage: (page: number) => void;
  setFilter: (filter: FilterStatus) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addTogglingId: (id: number) => void;
  removeTogglingId: (id: number) => void;
}

export const useTodoStore = create<TodoState>()(
  devtools(
    (set) => ({
      todos: [],
      apiTotal: 0,
      currentPage: 1,
      filter: "all",
      isLoading: false,
      error: null,
      nextLocalId: -1,
      togglingIds: new Set<number>(),

      setTodos: (todos, apiTotal) => set({ todos, apiTotal }),

      addTodo: (todo) =>
        set((state) => ({
          todos: [{ ...todo, id: state.nextLocalId }, ...state.todos],
          nextLocalId: state.nextLocalId - 1,
        })),

      updateTodoCompleted: (id, completed) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, completed } : t,
          ),
        })),

      removeTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
        })),

      setPage: (page) => set({ currentPage: page }),
      setFilter: (filter) => set({ filter }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      addTogglingId: (id) =>
        set((state) => {
          const next = new Set(state.togglingIds);
          next.add(id);
          return { togglingIds: next };
        }),

      removeTogglingId: (id) =>
        set((state) => {
          const next = new Set(state.togglingIds);
          next.delete(id);
          return { togglingIds: next };
        }),
    }),
    { name: "TodoStore" },
  ),
);
