import { cn } from '@/util/cn';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-secondary/90', className)} {...props} />;
}

export { Skeleton };
