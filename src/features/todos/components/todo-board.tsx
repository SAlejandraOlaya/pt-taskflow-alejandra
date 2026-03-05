"use client";

import { useState, useMemo } from "react";
import { useTodoStore } from "../store";
import { useTodos } from "../hooks/use-todos";
import { useToggleTodo } from "../hooks/use-toggle-todo";
import { useDeleteTodo } from "../hooks/use-delete-todo";
import { ITEMS_PER_PAGE } from "@/src/shared/lib/constants";
import { TodoForm } from "./todo-form";
import { TodoList } from "./todo-list";
import { FilterTabs } from "./filter-tabs";
import { TodoSkeleton } from "./todo-skeleton";
import { ErrorState } from "@/src/shared/ui/error-state";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { Pagination } from "@/src/shared/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/dialog";
import { Button } from "@/src/shared/ui/button";

export function TodoBoard() {
  const { refetch } = useTodos();
  const { toggle } = useToggleTodo();
  const { deleteTodo } = useDeleteTodo();
  const [todoToDelete, setTodoToDelete] = useState<{
    id: number;
    todo: string;
    isLocal?: boolean;
  } | null>(null);

  const todos = useTodoStore((s) => s.todos);
  const localTodos = useTodoStore((s) => s.localTodos);
  const allApiTodos = useTodoStore((s) => s.allApiTodos);
  const total = useTodoStore((s) => s.total);
  const currentPage = useTodoStore((s) => s.currentPage);
  const filter = useTodoStore((s) => s.filter);
  const isLoading = useTodoStore((s) => s.isLoading);
  const error = useTodoStore((s) => s.error);
  const setPage = useTodoStore((s) => s.setPage);
  const setFilter = useTodoStore((s) => s.setFilter);

  const filteredTodos = useMemo(() => {
    const apiList = filter === "all" ? todos : allApiTodos ?? todos;
    const merged = [...localTodos, ...apiList];
    switch (filter) {
      case "completed":
        return merged.filter((t) => t.completed);
      case "pending":
        return merged.filter((t) => !t.completed);
      default:
        return merged;
    }
  }, [localTodos, todos, allApiTodos, filter]);

  const virtualTotal = localTodos.length + total;
  const totalPages =
    filter === "all"
      ? Math.ceil(virtualTotal / ITEMS_PER_PAGE)
      : Math.ceil(filteredTodos.length / ITEMS_PER_PAGE) || 1;

  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayTodos =
    filter === "all"
      ? (() => {
          const localSlice = localTodos.slice(
            pageStart,
            pageStart + ITEMS_PER_PAGE
          );
          return [...localSlice, ...todos].slice(0, ITEMS_PER_PAGE);
        })()
      : filteredTodos.slice(pageStart, pageStart + ITEMS_PER_PAGE);

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <TodoForm />

      {isLoading ? (
        <TodoSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <>
          <FilterTabs value={filter} onValueChange={handleFilterChange} />
          {displayTodos.length === 0 ? (
            <EmptyState
              title={
                filter === "all"
                  ? "No tasks found"
                  : `No ${filter} tasks`
              }
              description={
                filter === "all"
                  ? "Create your first task using the form."
                  : `There are no ${filter} tasks on this page.`
              }
            />
          ) : (
            <>
              <TodoList
                todos={displayTodos}
                onToggle={toggle}
                onDeleteRequest={(todo) => setTodoToDelete(todo)}
              />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
          <Dialog
            open={!!todoToDelete}
            onOpenChange={(open) => !open && setTodoToDelete(null)}
          >
            <DialogContent showCloseButton>
              <DialogHeader>
                <DialogTitle>Delete task</DialogTitle>
                <DialogDescription>
                  {todoToDelete
                    ? `Are you sure you want to delete "${todoToDelete.todo}"? This cannot be undone.`
                    : ""}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter showCloseButton={false}>
                <Button
                  variant="outline"
                  onClick={() => setTodoToDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (todoToDelete) {
                      deleteTodo(todoToDelete.id, todoToDelete.isLocal);
                      setTodoToDelete(null);
                    }
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
