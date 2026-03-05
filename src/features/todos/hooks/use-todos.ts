"use client";

import { useEffect, useCallback } from "react";
import { useTodoStore } from "../store";
import { todoApi } from "../api";
import { ITEMS_PER_PAGE, ALL_API_LIMIT } from "@/src/shared/lib/constants";

export function useTodos() {
  const currentPage = useTodoStore((s) => s.currentPage);
  const filter = useTodoStore((s) => s.filter);
  const allApiTodos = useTodoStore((s) => s.allApiTodos);
  const setTodos = useTodoStore((s) => s.setTodos);
  const setAllApiTodos = useTodoStore((s) => s.setAllApiTodos);
  const setLoading = useTodoStore((s) => s.setLoading);
  const setError = useTodoStore((s) => s.setError);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (filter !== "all") {
      if (allApiTodos === null) {
        try {
          const data = await todoApi.getAll(ALL_API_LIMIT, 0);
          setAllApiTodos(data.todos);
          setTodos(data.todos, data.total);
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Error loading tasks";
          setError(message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
      return;
    }

    setAllApiTodos(null);

    const localTodosLength = useTodoStore.getState().localTodos.length;
    const localCount = Math.min(
      ITEMS_PER_PAGE,
      Math.max(0, localTodosLength - (currentPage - 1) * ITEMS_PER_PAGE),
    );
    const apiLimit = ITEMS_PER_PAGE - localCount;
    const apiSkip = Math.max(0, (currentPage - 1) * ITEMS_PER_PAGE - localTodosLength);

    try {
      if (apiLimit === 0) {
        const data = await todoApi.getAll(ITEMS_PER_PAGE, 0);
        setTodos(data.todos, data.total);
      } else {
        const data = await todoApi.getAll(apiLimit, apiSkip);
        setTodos(data.todos, data.total);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error loading tasks";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filter, allApiTodos, setTodos, setAllApiTodos, setLoading, setError]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return { refetch: fetchTodos };
}
