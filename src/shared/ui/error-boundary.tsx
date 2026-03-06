"use client";

import { Component } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/src/shared/ui/button";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/** Catches unhandled rendering errors and shows a recovery UI. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <div className="bg-destructive/10 rounded-full p-3">
          <AlertCircle className="text-destructive size-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Something went wrong</p>
          <p className="text-muted-foreground text-sm">
            An unexpected error occurred.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="size-4" />
          Reload page
        </Button>
      </div>
    );
  }
}
