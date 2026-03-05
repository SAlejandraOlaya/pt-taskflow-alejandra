"use client";

import { Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { Checkbox } from "@/src/shared/ui/checkbox";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import type { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle?: (id: number, currentCompleted: boolean, isLocal?: boolean) => void;
  onDeleteRequest?: (todo: Todo) => void;
}

export function TodoItem({ todo, onToggle, onDeleteRequest }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <motion.div
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.15 }}
        className="touch-manipulation"
      >
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() =>
            onToggle?.(todo.id, todo.completed, todo.isLocal)
          }
          aria-label="Task status"
        />
      </motion.div>

      <motion.p
        className={`flex-1 text-sm ${todo.completed ? "text-muted-foreground line-through" : ""}`}
        animate={{
          opacity: todo.completed ? 0.85 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {todo.todo}
      </motion.p>

      <Badge variant={todo.completed ? "secondary" : "outline"}>
        {todo.completed ? "Completed" : "Pending"}
      </Badge>

      {onDeleteRequest && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={() => onDeleteRequest(todo)}
          aria-label="Delete task"
        >
          <Trash2 className="size-4" />
        </Button>
      )}
    </div>
  );
}
