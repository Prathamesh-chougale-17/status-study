import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ResourceCardSkeleton() {
  return (
    <Card className="group bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-md border border-border hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-500 relative overflow-hidden animate-pulse">
      {/* Shimmer overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5 opacity-50 pointer-events-none" />
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* Type icon with colored background */}
            <div className="p-2.5 rounded-lg border bg-gradient-to-br from-blue-400/20 to-purple-400/20 shadow-md">
              <div className="h-4 w-4 bg-muted/60 rounded animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-0">
              {/* Title */}
              <div className="h-5 w-3/4 bg-gradient-to-r from-muted/60 to-muted/40 rounded animate-pulse mb-2"></div>
              {/* Description lines */}
              <div className="space-y-1">
                <div className="h-4 w-full bg-muted/50 rounded animate-pulse"></div>
                <div className="h-4 w-2/3 bg-muted/50 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 ml-3">
            {/* Status badge */}
            <div className="h-6 w-20 bg-gradient-to-r from-gray-400/20 to-gray-400/30 rounded-full animate-pulse"></div>
            {/* Priority badge */}
            <div className="h-6 w-16 bg-gradient-to-r from-yellow-400/20 to-yellow-400/30 rounded-full animate-pulse"></div>
            {/* Action buttons */}
            <div className="flex gap-1 mt-1">
              <div className="h-6 w-6 bg-muted/30 rounded animate-pulse"></div>
              <div className="h-6 w-6 bg-muted/30 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10">
        <div className="space-y-3">
          {/* URL link placeholder */}
          <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg border border-border">
            <div className="h-4 w-4 bg-orange-400/40 rounded animate-pulse flex-shrink-0"></div>
            <div className="h-3 w-3/4 bg-muted/40 rounded animate-pulse"></div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            <div className="h-6 w-12 bg-muted/30 rounded-full animate-pulse"></div>
            <div className="h-6 w-16 bg-muted/30 rounded-full animate-pulse"></div>
            <div className="h-6 w-10 bg-muted/30 rounded-full animate-pulse"></div>
          </div>

          {/* Status selector */}
          <div className="flex items-center justify-between p-1.5 bg-gradient-to-r from-muted/20 to-muted/30 rounded-md border border-border">
            <div className="h-3 w-12 bg-muted/40 rounded animate-pulse"></div>
            <div className="h-5 w-32 bg-muted/40 rounded animate-pulse"></div>
          </div>

          {/* Notes section */}
          <div className="bg-gradient-to-r from-muted/20 to-muted/30 border border-border p-2 rounded-lg">
            <div className="flex items-center gap-1 mb-2">
              <div className="w-1.5 h-1.5 bg-orange-400/40 rounded-full animate-pulse"></div>
              <div className="h-3 w-12 bg-orange-400/40 rounded animate-pulse"></div>
            </div>
            <div className="space-y-1">
              <div className="h-3 w-full bg-muted/40 rounded animate-pulse"></div>
              <div className="h-3 w-2/3 bg-muted/40 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
