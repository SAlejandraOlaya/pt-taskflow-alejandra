"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/src/shared/ui/input";
import { Button } from "@/src/shared/ui/button";
import { useCreateTodo } from "../hooks/use-create-todo";

export function TodoForm() {
  const [text, setText] = useState("");
  const { createTodo, isCreating } = useCreateTodo();

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
        disabled={isCreating}
      />
      <Button type="submit" disabled={isCreating || !text.trim()}>
        <Plus className="size-4" />
        Add
      </Button>
    </form>
  );
}
