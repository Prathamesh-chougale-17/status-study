import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function TopicCardSkeleton() {
  return (
    <Card className="h-full bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm border border-border hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 group animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {/* Icon placeholder with gradient */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400/20 to-pink-400/20 shadow-lg">
            <div className="h-6 w-6 bg-muted/60 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            {/* Resource count badge */}
            <div className="h-6 w-20 bg-muted/40 rounded-full animate-pulse"></div>
            {/* Action buttons */}
            <div className="flex gap-1">
              <div className="h-6 w-6 bg-muted/30 rounded animate-pulse"></div>
              <div className="h-6 w-6 bg-muted/30 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        {/* Title */}
        <div className="h-6 w-3/4 bg-gradient-to-r from-muted/60 to-muted/40 rounded animate-pulse mt-4"></div>
        {/* Description lines */}
        <div className="space-y-2 mt-2">
          <div className="h-4 w-full bg-muted/50 rounded animate-pulse"></div>
          <div className="h-4 w-2/3 bg-muted/50 rounded animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Resource count text */}
        <div className="h-4 w-32 bg-muted/40 rounded animate-pulse"></div>
      </CardContent>
    </Card>
  );
}
