"use client";

import { motion, AnimatePresence } from "motion/react";
import { stagger } from "motion";
import { TodoItem } from "./todo-item";
import type { Todo } from "../types";

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.04),
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -16, transition: { duration: 0.2 } },
};

interface TodoListProps {
  todos: Todo[];
  onToggle?: (id: number, currentCompleted: boolean, isLocal?: boolean) => void;
  onDeleteRequest?: (todo: Todo) => void;
}

export function TodoList({ todos, onToggle, onDeleteRequest }: TodoListProps) {
  return (
    <motion.ul
      className="space-y-3"
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="popLayout">
        {todos.map((todo) => (
          <motion.li
            key={todo.id}
            layout
            variants={itemVariants}
            exit="exit"
          >
            <TodoItem
              todo={todo}
              onToggle={onToggle}
              onDeleteRequest={onDeleteRequest}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
