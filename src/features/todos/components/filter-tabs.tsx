"use client";

import { Button } from "@/src/shared/ui/button";
import { cn } from "@/src/shared/lib/utils";
import type { FilterStatus } from "../types";

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

interface FilterTabsProps {
  value: FilterStatus;
  onValueChange: (value: FilterStatus) => void;
}

export function FilterTabs({ value, onValueChange }: FilterTabsProps) {
  return (
    <div
      className="inline-flex rounded-lg border bg-muted/30 p-1"
      role="tablist"
      aria-label="Filter tasks"
    >
      {FILTER_OPTIONS.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "rounded-md",
            value === option.value && "shadow-xs"
          )}
          onClick={() => onValueChange(option.value)}
          role="tab"
          aria-selected={value === option.value}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
