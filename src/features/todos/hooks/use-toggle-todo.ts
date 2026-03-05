"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { todoApi } from "../api";
import { useTodoStore } from "../store";

/**
 * Toggle todo completed state. Local todos: update store only (API does not persist them).
 * API todos: optimistic update + PATCH, rollback on failure.
 */
export function useToggleTodo() {
  const toggleTodo = useTodoStore((s) => s.toggleTodo);

  const toggle = useCallback(
    async (id: number, currentCompleted: boolean, isLocal?: boolean) => {
      const nextCompleted = !currentCompleted;
      toggleTodo(id);

      if (isLocal) return;

      try {
        await todoApi.update(id, { completed: nextCompleted });
      } catch (err) {
        toggleTodo(id);
        const message =
          err instanceof Error ? err.message : "Failed to update task";
        toast.error(message);
      }
    },
    [toggleTodo]
  );

  return { toggle };
}
