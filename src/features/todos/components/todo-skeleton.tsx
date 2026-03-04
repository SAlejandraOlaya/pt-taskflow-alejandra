import { Skeleton } from "@/src/shared/ui/skeleton";

interface TodoSkeletonProps {
  count?: number;
}

export function TodoSkeleton({ count = 10 }: TodoSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg border p-4"
        >
          <Skeleton className="size-4 rounded-lg" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}
