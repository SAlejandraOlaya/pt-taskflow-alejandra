import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoItem } from "../components/todo-item";
import type { Todo } from "../types";

const pendingTodo: Todo = {
  id: 1,
  todo: "Buy groceries",
  completed: false,
  userId: 1,
};
const completedTodo: Todo = {
  id: 2,
  todo: "Clean house",
  completed: true,
  userId: 1,
};

describe("TodoItem", () => {
  it("renders todo text and pending badge", () => {
    render(<TodoItem todo={pendingTodo} />);

    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders completed badge for completed todos", () => {
    render(<TodoItem todo={completedTodo} />);

    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("renders checkbox matching completed state", () => {
    render(<TodoItem todo={completedTodo} />);

    const checkbox = screen.getByRole("checkbox", { name: "Task status" });
    expect(checkbox).toBeChecked();
  });

  it("calls onToggle when checkbox is clicked", async () => {
    const onToggle = jest.fn();
    const user = userEvent.setup();

    render(<TodoItem todo={pendingTodo} onToggle={onToggle} />);

    await user.click(screen.getByRole("checkbox", { name: "Task status" }));
    expect(onToggle).toHaveBeenCalledWith(1, false);
  });

  it("calls onDeleteRequest when delete button is clicked", async () => {
    const onDelete = jest.fn();
    const user = userEvent.setup();

    render(<TodoItem todo={pendingTodo} onDeleteRequest={onDelete} />);

    await user.click(screen.getByRole("button", { name: "Delete task" }));
    expect(onDelete).toHaveBeenCalledWith(pendingTodo);
  });

  it("does not render delete button when onDeleteRequest is not provided", () => {
    render(<TodoItem todo={pendingTodo} />);

    expect(
      screen.queryByRole("button", { name: "Delete task" }),
    ).not.toBeInTheDocument();
  });

  it("disables checkbox when toggling is true", () => {
    render(<TodoItem todo={pendingTodo} toggling />);

    const checkbox = screen.getByRole("checkbox", { name: "Task status" });
    expect(checkbox).toBeDisabled();
  });
});
