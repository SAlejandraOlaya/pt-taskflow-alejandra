"use client";

import { useState } from "react";
import { useTodoStore } from "../store";
import { useTodos } from "../hooks/use-todos";
import { useTodoActions } from "../hooks/use-todo-actions";
import { useFilteredTodos } from "../hooks/use-filtered-todos";
import { TodoForm } from "./todo-form";
import { TodoItem } from "./todo-item";
import { FilterTabs } from "./filter-tabs";
import { TodoSkeleton } from "./todo-skeleton";
import { ErrorState } from "./error-state";
import { EmptyState } from "./empty-state";
import { Pagination } from "./pagination";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { Button } from "@/src/shared/ui/button";

/** Main orchestrator: fetching, filtering, list, and CRUD. */
export function TodoBoard() {
  const { refetch } = useTodos();
  const { toggle, deleteTodo } = useTodoActions();
  const { displayTodos, totalPages } = useFilteredTodos();

  const [todoToDelete, setTodoToDelete] = useState<{
    id: number;
    todo: string;
  } | null>(null);

  const currentPage = useTodoStore((s) => s.currentPage);
  const filter = useTodoStore((s) => s.filter);
  const isLoading = useTodoStore((s) => s.isLoading);
  const error = useTodoStore((s) => s.error);
  const setPage = useTodoStore((s) => s.setPage);
  const setFilter = useTodoStore((s) => s.setFilter);
  const togglingIds = useTodoStore((s) => s.togglingIds);

  return (
    <div className="space-y-6">
      <TodoForm />

      {isLoading ? (
        <TodoSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <>
          <FilterTabs value={filter} onValueChange={setFilter} />

          {displayTodos.length === 0 ? (
            <EmptyState
              title={filter === "all" ? "No tasks found" : `No ${filter} tasks`}
              description={
                filter === "all"
                  ? "Create your first task using the form."
                  : "Try a different filter or switch to all tasks."
              }
            >
              {filter !== "all" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  Show all tasks
                </Button>
              )}
            </EmptyState>
          ) : (
            <>
              <ul className="space-y-3">
                {displayTodos.map((todo, i) => (
                  <li
                    key={todo.id}
                    className="animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
                    style={{
                      animationDelay: `${i * 40}ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <TodoItem
                      todo={todo}
                      onToggle={toggle}
                      onDeleteRequest={(t) => setTodoToDelete(t)}
                      toggling={togglingIds.has(todo.id)}
                    />
                  </li>
                ))}
              </ul>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}

          <DeleteConfirmDialog
            todo={todoToDelete}
            onClose={() => setTodoToDelete(null)}
            onConfirm={deleteTodo}
          />
        </>
      )}
    </div>
  );
}
