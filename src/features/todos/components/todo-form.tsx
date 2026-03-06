"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Input } from "@/src/shared/ui/input";
import { Button } from "@/src/shared/ui/button";
import { MAX_TODO_LENGTH } from "@/src/shared/lib/constants";
import { useTodoActions } from "../hooks/use-todo-actions";

/** Input form for creating new todos. */
export function TodoForm() {
  const [text, setText] = useState("");
  const { createTodo, isCreating } = useTodoActions();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const success = await createTodo(text);
    if (success) setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a new task..."
        maxLength={MAX_TODO_LENGTH}
        disabled={isCreating}
      />
      <Button type="submit" disabled={isCreating || !text.trim()}>
        {isCreating ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Plus className="size-4" />
        )}
        {isCreating ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}
