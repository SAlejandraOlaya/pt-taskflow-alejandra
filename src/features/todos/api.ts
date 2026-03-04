import { fetchClient } from "@/src/shared/lib/fetch-client";
import type { Todo, TodosResponse, CreateTodoPayload } from "./types";

export const todoApi = {
  getAll: (limit: number, skip: number) =>
    fetchClient<TodosResponse>(`/todos?limit=${limit}&skip=${skip}`),

  create: (payload: CreateTodoPayload) =>
    fetchClient<Todo>("/todos/add", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: number, data: Partial<Todo>) =>
    fetchClient<Todo>(`/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    fetchClient<Todo & { isDeleted: boolean; deletedOn: string }>(
      `/todos/${id}`,
      { method: "DELETE" },
    ),
};
