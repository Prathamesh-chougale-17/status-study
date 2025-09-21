import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ResourceCardSkeleton() {
  return (
    <Card className="bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-md border border-white/10">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <Skeleton className="h-8 w-full rounded-lg" />
          <div className="flex gap-1">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-10" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}
