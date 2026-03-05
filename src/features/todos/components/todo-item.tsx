"use client";

import { Checkbox } from "@/src/shared/ui/checkbox";
import { Badge } from "@/src/shared/ui/badge";
import type { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <Checkbox checked={todo.completed} disabled aria-label="Task status" />

      <p
        className={`flex-1 text-sm ${todo.completed ? "text-muted-foreground line-through" : ""
          }`}
      >
        {todo.todo}
      </p>

      <Badge variant={todo.completed ? "secondary" : "outline"}>
        {todo.completed ? "Done" : "Pending"}
      </Badge>
    </div>
  );
}
