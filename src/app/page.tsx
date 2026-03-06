import { TodoBoard } from "@/src/features/todos/components/todo-board";
import { ThemeToggle } from "@/src/shared/ui/theme-toggle";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">TaskFlow</h1>
          <p className="text-muted-foreground text-sm">
            Create your own task flow
          </p>
        </div>
        <ThemeToggle />
      </header>

      <TodoBoard />
    </main>
  );
}
