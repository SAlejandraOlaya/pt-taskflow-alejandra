"use client";

import { useEffect, useCallback } from "react";
import { useTodoStore } from "../store";
import { todoApi } from "../api";
import { ITEMS_PER_PAGE } from "@/src/shared/lib/constants";

/** Fetches paginated todos from the API. */
export function useTodos() {
  const currentPage = useTodoStore((s) => s.currentPage);
  const setTodos = useTodoStore((s) => s.setTodos);
  const setLoading = useTodoStore((s) => s.setLoading);
  const setError = useTodoStore((s) => s.setError);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const skip = (currentPage - 1) * ITEMS_PER_PAGE;
      const data = await todoApi.getAll(ITEMS_PER_PAGE, skip);
      setTodos(data.todos, data.total);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error loading tasks";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, setTodos, setLoading, setError]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return { refetch: fetchTodos };
}
