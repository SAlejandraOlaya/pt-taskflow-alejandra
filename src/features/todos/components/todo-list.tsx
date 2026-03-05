import { TodoItem } from "./todo-item";
import type { Todo } from "../types";

interface TodoListProps {
  todos: Todo[];
  onToggle?: (id: number, currentCompleted: boolean, isLocal?: boolean) => void;
  onDeleteRequest?: (todo: Todo) => void;
}

export function TodoList({ todos, onToggle, onDeleteRequest }: TodoListProps) {
  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
}
