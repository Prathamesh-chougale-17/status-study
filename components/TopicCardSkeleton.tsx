import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function TopicCardSkeleton() {
  return (
    <Card className="h-full bg-black/40 backdrop-blur-sm border border-white/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}
