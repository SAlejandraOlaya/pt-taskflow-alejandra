"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { todoApi } from "../api";
import { useTodoStore } from "../store";


export function useDeleteTodo() {
  const removeTodo = useTodoStore((s) => s.removeTodo);

  const deleteTodo = useCallback(
    async (id: number, isLocal?: boolean) => {
      if (isLocal) {
        removeTodo(id);
        toast.success("Task deleted");
        return;
      }

      try {
        await todoApi.delete(id);
        removeTodo(id);
        toast.success("Task deleted");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete task";
        toast.error(message);
      }
    },
    [removeTodo]
  );

  return { deleteTodo };
}
