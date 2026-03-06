"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { todoApi } from "../api";
import { useTodoStore } from "../store";

/** CRUD actions for todos: create, toggle (optimistic), and delete. */
export function useTodoActions() {
  const [isCreating, setIsCreating] = useState(false);
  const addTodo = useTodoStore((s) => s.addTodo);
  const updateTodoCompleted = useTodoStore((s) => s.updateTodoCompleted);
  const removeTodo = useTodoStore((s) => s.removeTodo);
  const addTogglingId = useTodoStore((s) => s.addTogglingId);
  const removeTogglingId = useTodoStore((s) => s.removeTogglingId);

  const createTodo = useCallback(
    async (text: string): Promise<boolean> => {
      const trimmed = text.trim();
      if (!trimmed) return false;

      setIsCreating(true);
      try {
        const response = await todoApi.create({
          todo: trimmed,
          completed: false,
          userId: 1,
        });
        addTodo(response);
        toast.success("Task created successfully");
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error creating task";
        toast.error(message);
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [addTodo],
  );

  const toggle = useCallback(
    async (id: number, currentCompleted: boolean) => {
      if (useTodoStore.getState().togglingIds.has(id)) return;

      const nextCompleted = !currentCompleted;
      updateTodoCompleted(id, nextCompleted);

      if (id < 0) return;

      addTogglingId(id);
      try {
        await todoApi.update(id, { completed: nextCompleted });
      } catch (err) {
        updateTodoCompleted(id, currentCompleted);
        const message =
          err instanceof Error ? err.message : "Failed to update task";
        toast.error(message);
      } finally {
        removeTogglingId(id);
      }
    },
    [updateTodoCompleted, addTogglingId, removeTogglingId],
  );

  const deleteTodo = useCallback(
    async (id: number) => {
      if (id < 0) {
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
    [removeTodo],
  );

  return { createTodo, isCreating, toggle, deleteTodo };
}
