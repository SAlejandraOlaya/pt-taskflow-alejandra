"use client";

import { useState } from "react";
import { toast } from "sonner";
import { todoApi } from "../api";
import { useTodoStore } from "../store";

export function useCreateTodo() {
  const [isCreating, setIsCreating] = useState(false);
  const addLocalTodo = useTodoStore((s) => s.addLocalTodo);

  async function createTodo(text: string): Promise<boolean> {
    const trimmed = text.trim();
    if (!trimmed) return false;

    setIsCreating(true);

    try {
      const response = await todoApi.create({
        todo: trimmed,
        completed: false,
        userId: 1,
      });

      addLocalTodo(response);
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
  }

  return { createTodo, isCreating };
}
