"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/src/shared/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const paginationTap = { scale: 0.97 };
const paginationHover = { scale: 1.02 };

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <div className="flex items-center justify-between pt-4">
      <motion.div
        whileHover={prevDisabled ? undefined : paginationHover}
        whileTap={prevDisabled ? undefined : paginationTap}
        transition={{ duration: 0.15 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={prevDisabled}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
      </motion.div>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <motion.div
        whileHover={nextDisabled ? undefined : paginationHover}
        whileTap={nextDisabled ? undefined : paginationTap}
        transition={{ duration: 0.15 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={nextDisabled}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </motion.div>
    </div>
  );
}
