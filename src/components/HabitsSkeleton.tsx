import { Skeleton } from '@/components/ui/skeleton';

const HabitsSkeleton = () => {
  return (
    <div className="min-h-screen bg-background px-5 pb-28 max-w-md mx-auto">
      {/* Header skeleton */}
      <header className="pt-12 pb-2 flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-7 w-40" />
        </div>
        <Skeleton className="h-9 w-9 rounded-lg" />
      </header>

      {/* Progress ring skeleton */}
      <div className="flex flex-col items-center gap-3 py-8">
        <Skeleton className="h-40 w-40 rounded-full" />
        <Skeleton className="h-4 w-44" />
      </div>

      {/* Habit list skeleton */}
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border/40"
          >
            <Skeleton className="h-11 w-11 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitsSkeleton;
