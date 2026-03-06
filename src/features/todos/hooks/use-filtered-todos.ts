"use client";

import { useEffect, useMemo } from "react";
import { useTodoStore } from "../store";
import { ITEMS_PER_PAGE } from "@/src/shared/lib/constants";

/** Derives filtered todo list and pagination from the store. */
export function useFilteredTodos() {
  const todos = useTodoStore((s) => s.todos);
  const filter = useTodoStore((s) => s.filter);
  const apiTotal = useTodoStore((s) => s.apiTotal);
  const currentPage = useTodoStore((s) => s.currentPage);
  const setPage = useTodoStore((s) => s.setPage);

  const displayTodos = useMemo(
    () =>
      filter === "all"
        ? todos
        : todos.filter((t) =>
            filter === "completed" ? t.completed : !t.completed,
          ),
    [todos, filter],
  );

  const totalPages = Math.max(1, Math.ceil(apiTotal / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) setPage(totalPages);
  }, [currentPage, totalPages, setPage]);

  return { displayTodos, totalPages };
}
