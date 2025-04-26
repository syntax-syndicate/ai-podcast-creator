import { Skeleton } from "@/components/ui/skeleton";

export function StudioSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex flex-col">
        <div className="flex flex-col gap-2 py-8">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-1/3" />
        </div>

        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
