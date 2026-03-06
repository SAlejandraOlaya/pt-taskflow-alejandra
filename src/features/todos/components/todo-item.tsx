"use client";

import { Trash2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Checkbox } from "@/src/shared/ui/checkbox";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import type { Todo } from "../types";
import { badgeVariants } from "../lib/motion-variants";

interface TodoItemProps {
  todo: Todo;
  onToggle?: (id: number, currentCompleted: boolean) => void;
  onDeleteRequest?: (todo: Todo) => void;
  toggling?: boolean;
}

/** Single todo row with toggle, badge, and delete action. */
export function TodoItem({
  todo,
  onToggle,
  onDeleteRequest,
  toggling,
}: TodoItemProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const variants = badgeVariants(reducedMotion);

  return (
    <div className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-4 transition-colors">
      <div className="touch-manipulation transition-transform active:scale-[0.92]">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle?.(todo.id, todo.completed)}
          disabled={toggling}
          aria-label="Task status"
        />
      </div>

      <p
        className={`flex-1 text-sm transition-opacity ${todo.completed ? "text-muted-foreground line-through opacity-80" : ""}`}
      >
        {todo.todo}
      </p>

      <Badge variant={todo.completed ? "secondary" : "outline"}>
        <AnimatePresence mode="wait">
          <motion.span
            key={todo.completed ? "done" : "pending"}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            className="inline-block"
          >
            {todo.completed ? "Completed" : "Pending"}
          </motion.span>
        </AnimatePresence>
      </Badge>

      {onDeleteRequest && (
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive size-8 shrink-0"
          onClick={() => onDeleteRequest(todo)}
          aria-label="Delete task"
        >
          <Trash2 className="size-4" />
        </Button>
      )}
    </div>
  );
}
