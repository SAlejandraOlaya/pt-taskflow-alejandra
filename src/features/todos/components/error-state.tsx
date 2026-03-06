import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/src/shared/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/** Error message with optional retry button. */
export function ErrorState({
  message = "Something went wrong",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="bg-destructive/10 rounded-full p-3">
        <AlertCircle className="text-destructive size-6" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{message}</p>
        <p className="text-muted-foreground text-sm">
          Verify your connection and try again.
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="size-4" />
          Retry
        </Button>
      )}
    </div>
  );
}
