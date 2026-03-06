import { useTodoStore } from "../store";
import type { Todo } from "../types";

const baseTodo: Todo = {
  id: 100,
  todo: "Test task",
  completed: false,
  userId: 1,
};

function resetStore() {
  useTodoStore.setState({
    todos: [],
    apiTotal: 0,
    currentPage: 1,
    filter: "all",
    isLoading: false,
    error: null,
    nextLocalId: -1,
    togglingIds: new Set(),
  });
}

beforeEach(resetStore);

describe("useTodoStore", () => {
  describe("addTodo", () => {
    it("prepends the todo with a negative local ID", () => {
      useTodoStore.getState().addTodo(baseTodo);

      const { todos, nextLocalId } = useTodoStore.getState();
      expect(todos).toHaveLength(1);
      expect(todos[0].id).toBe(-1);
      expect(todos[0].todo).toBe("Test task");
      expect(nextLocalId).toBe(-2);
    });

    it("decrements nextLocalId on each call", () => {
      const { addTodo } = useTodoStore.getState();
      addTodo(baseTodo);
      addTodo({ ...baseTodo, todo: "Second" });

      const { todos, nextLocalId } = useTodoStore.getState();
      expect(todos).toHaveLength(2);
      expect(todos[0].id).toBe(-2);
      expect(todos[1].id).toBe(-1);
      expect(nextLocalId).toBe(-3);
    });
  });

  describe("removeTodo", () => {
    it("removes the todo with the given ID", () => {
      useTodoStore.setState({
        todos: [baseTodo, { ...baseTodo, id: 200, todo: "Other" }],
      });

      useTodoStore.getState().removeTodo(100);

      const { todos } = useTodoStore.getState();
      expect(todos).toHaveLength(1);
      expect(todos[0].id).toBe(200);
    });

    it("does nothing if ID does not exist", () => {
      useTodoStore.setState({ todos: [baseTodo] });
      useTodoStore.getState().removeTodo(999);

      expect(useTodoStore.getState().todos).toHaveLength(1);
    });
  });

  describe("updateTodoCompleted", () => {
    it("toggles completed for the matching todo", () => {
      useTodoStore.setState({ todos: [baseTodo] });
      useTodoStore.getState().updateTodoCompleted(100, true);

      expect(useTodoStore.getState().todos[0].completed).toBe(true);
    });

    it("leaves other todos unchanged", () => {
      const other = { ...baseTodo, id: 200, completed: true };
      useTodoStore.setState({ todos: [baseTodo, other] });
      useTodoStore.getState().updateTodoCompleted(100, true);

      expect(useTodoStore.getState().todos[1].completed).toBe(true);
    });
  });

  describe("setFilter / setPage", () => {
    it("updates the filter", () => {
      useTodoStore.getState().setFilter("completed");
      expect(useTodoStore.getState().filter).toBe("completed");
    });

    it("updates the current page", () => {
      useTodoStore.getState().setPage(5);
      expect(useTodoStore.getState().currentPage).toBe(5);
    });
  });

  describe("togglingIds", () => {
    it("adds and removes toggling IDs", () => {
      useTodoStore.getState().addTogglingId(1);
      expect(useTodoStore.getState().togglingIds.has(1)).toBe(true);

      useTodoStore.getState().removeTogglingId(1);
      expect(useTodoStore.getState().togglingIds.has(1)).toBe(false);
    });

    it("handles multiple IDs", () => {
      const { addTogglingId } = useTodoStore.getState();
      addTogglingId(1);
      addTogglingId(2);

      const ids = useTodoStore.getState().togglingIds;
      expect(ids.has(1)).toBe(true);
      expect(ids.has(2)).toBe(true);
    });
  });

  describe("setTodos", () => {
    it("replaces todos and sets apiTotal", () => {
      const todos = [baseTodo, { ...baseTodo, id: 200 }];
      useTodoStore.getState().setTodos(todos, 42);

      const state = useTodoStore.getState();
      expect(state.todos).toEqual(todos);
      expect(state.apiTotal).toBe(42);
    });
  });
});
