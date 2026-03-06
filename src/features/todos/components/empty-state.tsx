"use client";

import { Inbox } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { emptyStateVariants } from "../lib/motion-variants";

interface EmptyStateProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

/** Placeholder shown when a list has no items. */
export function EmptyState({
  title = "No results",
  description = "There are no items to display.",
  children,
}: EmptyStateProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const variants = emptyStateVariants(reducedMotion);

  return (
    <motion.div
      initial={variants.initial}
      animate={variants.animate}
      className="flex flex-col items-center justify-center gap-3 py-16 text-center"
    >
      <div className="bg-muted rounded-full p-3">
        <Inbox className="text-muted-foreground size-6" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {children}
    </motion.div>
  );
}
