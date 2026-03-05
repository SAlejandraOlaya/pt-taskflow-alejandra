import { TodoBoard } from "@/src/features/todos/components/todo-board";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">TaskFlow</h1>
        <p className="text-sm text-muted-foreground">
          Create your own task flow
        </p>
      </header>

      <TodoBoard />
    </main>
  );
}
