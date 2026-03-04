"use client";

import { useTodoStore } from "../store";
import { useTodos } from "../hooks/use-todos";
import { ITEMS_PER_PAGE } from "@/src/shared/lib/constants";
import { TodoList } from "./todo-list";
import { TodoSkeleton } from "./todo-skeleton";
import { ErrorState } from "@/src/shared/ui/error-state";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { Pagination } from "@/src/shared/ui/pagination";

export function TodoBoard() {
  const { refetch } = useTodos();

  const todos = useTodoStore((s) => s.todos);
  const total = useTodoStore((s) => s.total);
  const currentPage = useTodoStore((s) => s.currentPage);
  const isLoading = useTodoStore((s) => s.isLoading);
  const error = useTodoStore((s) => s.error);
  const setPage = useTodoStore((s) => s.setPage);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  if (isLoading) {
    return <TodoSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  if (todos.length === 0) {
    return (
      <EmptyState
        title="No hay tareas"
        description="No se encontraron tareas en esta página."
      />
    );
  }

  return (
    <div className="space-y-4">
      <TodoList todos={todos} />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
