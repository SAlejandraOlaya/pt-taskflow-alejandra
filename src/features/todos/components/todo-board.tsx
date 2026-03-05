"use client";

import { useState } from "react";
import { useTodoStore } from "../store";
import { useTodos } from "../hooks/use-todos";
import { useToggleTodo } from "../hooks/use-toggle-todo";
import { useDeleteTodo } from "../hooks/use-delete-todo";
import { ITEMS_PER_PAGE } from "@/src/shared/lib/constants";
import { TodoForm } from "./todo-form";
import { TodoList } from "./todo-list";
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
  const total = useTodoStore((s) => s.total);
  const currentPage = useTodoStore((s) => s.currentPage);
  const isLoading = useTodoStore((s) => s.isLoading);
  const error = useTodoStore((s) => s.error);
  const setPage = useTodoStore((s) => s.setPage);

  const virtualTotal = localTodos.length + total;
  const totalPages = Math.ceil(virtualTotal / ITEMS_PER_PAGE);

  // Exactly 10 items per page: local slice for this page + API slice for this page.
  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const localSlice = localTodos.slice(pageStart, pageStart + ITEMS_PER_PAGE);
  const allTodos = [...localSlice, ...todos].slice(0, ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <TodoForm />

      {isLoading ? (
        <TodoSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : allTodos.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="Create your first task using the form."
        />
      ) : (
        <>
          <TodoList
            todos={allTodos}
            onToggle={toggle}
            onDeleteRequest={(todo) => setTodoToDelete(todo)}
          />
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
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
