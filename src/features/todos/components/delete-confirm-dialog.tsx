"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/dialog";
import { Button } from "@/src/shared/ui/button";

interface DeleteConfirmDialogProps {
  todo: { id: number; todo: string } | null;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
}

/** Confirmation dialog before deleting a todo. */
export function DeleteConfirmDialog({
  todo,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    if (!todo) return;
    setIsDeleting(true);
    try {
      await onConfirm(todo.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={!!todo} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Delete task</DialogTitle>
          <DialogDescription>
            {todo
              ? `Are you sure you want to delete "${todo.todo}"? This cannot be undone.`
              : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton={false}>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="size-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
