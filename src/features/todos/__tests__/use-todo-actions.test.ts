import { renderHook, act } from "@testing-library/react";
import { useTodoActions } from "../hooks/use-todo-actions";
import { useTodoStore } from "../store";
import { todoApi } from "../api";
import { toast } from "sonner";

jest.mock("../api");
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedApi = jest.mocked(todoApi);

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

beforeEach(() => {
  resetStore();
  jest.clearAllMocks();
});

describe("useTodoActions", () => {
  describe("createTodo", () => {
    it("calls API and adds todo to store on success", async () => {
      mockedApi.create.mockResolvedValue({
        id: 300,
        todo: "New task",
        completed: false,
        userId: 1,
      });

      const { result } = renderHook(() => useTodoActions());

      let success: boolean = false;
      await act(async () => {
        success = await result.current.createTodo("New task");
      });

      expect(success).toBe(true);
      expect(mockedApi.create).toHaveBeenCalledWith({
        todo: "New task",
        completed: false,
        userId: 1,
      });
      expect(useTodoStore.getState().todos).toHaveLength(1);
      expect(toast.success).toHaveBeenCalledWith("Task created successfully");
    });

    it("returns false for empty string without calling API", async () => {
      const { result } = renderHook(() => useTodoActions());

      let success: boolean = true;
      await act(async () => {
        success = await result.current.createTodo("   ");
      });

      expect(success).toBe(false);
      expect(mockedApi.create).not.toHaveBeenCalled();
    });

    it("shows error toast on API failure", async () => {
      mockedApi.create.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useTodoActions());

      let success: boolean = true;
      await act(async () => {
        success = await result.current.createTodo("Failing task");
      });

      expect(success).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("Network error");
      expect(useTodoStore.getState().todos).toHaveLength(0);
    });
  });

  describe("toggle", () => {
    it("does optimistic update and calls API", async () => {
      useTodoStore.setState({
        todos: [{ id: 1, todo: "Task", completed: false, userId: 1 }],
      });
      mockedApi.update.mockResolvedValue({
        id: 1,
        todo: "Task",
        completed: true,
        userId: 1,
      });

      const { result } = renderHook(() => useTodoActions());

      await act(async () => {
        await result.current.toggle(1, false);
      });

      expect(useTodoStore.getState().todos[0].completed).toBe(true);
      expect(mockedApi.update).toHaveBeenCalledWith(1, { completed: true });
    });

    it("rolls back on API failure", async () => {
      useTodoStore.setState({
        todos: [{ id: 1, todo: "Task", completed: false, userId: 1 }],
      });
      mockedApi.update.mockRejectedValue(new Error("Server error"));

      const { result } = renderHook(() => useTodoActions());

      await act(async () => {
        await result.current.toggle(1, false);
      });

      expect(useTodoStore.getState().todos[0].completed).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("Server error");
    });

    it("skips API call for local todos (id < 0)", async () => {
      useTodoStore.setState({
        todos: [{ id: -1, todo: "Local", completed: false, userId: 1 }],
      });

      const { result } = renderHook(() => useTodoActions());

      await act(async () => {
        await result.current.toggle(-1, false);
      });

      expect(useTodoStore.getState().todos[0].completed).toBe(true);
      expect(mockedApi.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteTodo", () => {
    it("removes todo from store on success", async () => {
      useTodoStore.setState({
        todos: [{ id: 1, todo: "Task", completed: false, userId: 1 }],
      });
      mockedApi.delete.mockResolvedValue({
        id: 1,
        todo: "Task",
        completed: false,
        userId: 1,
        isDeleted: true,
        deletedOn: new Date().toISOString(),
      });

      const { result } = renderHook(() => useTodoActions());

      await act(async () => {
        await result.current.deleteTodo(1);
      });

      expect(useTodoStore.getState().todos).toHaveLength(0);
      expect(toast.success).toHaveBeenCalledWith("Task deleted");
    });

    it("shows error toast on API failure", async () => {
      useTodoStore.setState({
        todos: [{ id: 1, todo: "Task", completed: false, userId: 1 }],
      });
      mockedApi.delete.mockRejectedValue(new Error("Delete failed"));

      const { result } = renderHook(() => useTodoActions());

      await act(async () => {
        await result.current.deleteTodo(1);
      });

      expect(useTodoStore.getState().todos).toHaveLength(1);
      expect(toast.error).toHaveBeenCalledWith("Delete failed");
    });

    it("removes local todo without API call", async () => {
      useTodoStore.setState({
        todos: [{ id: -1, todo: "Local", completed: false, userId: 1 }],
      });

      const { result } = renderHook(() => useTodoActions());

      await act(async () => {
        await result.current.deleteTodo(-1);
      });

      expect(useTodoStore.getState().todos).toHaveLength(0);
      expect(mockedApi.delete).not.toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Task deleted");
    });
  });
});
