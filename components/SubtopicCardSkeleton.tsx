import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function SubtopicCardSkeleton() {
  return (
    <Card className="h-full bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm border border-border hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 group animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            {/* Title */}
            <div className="h-6 w-3/4 bg-gradient-to-r from-muted/60 to-muted/40 rounded animate-pulse"></div>
            {/* Description lines */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted/50 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-muted/50 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-col gap-1 ml-3">
            {/* Action buttons */}
            <div className="h-8 w-8 bg-muted/30 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-muted/30 rounded animate-pulse"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Stats section */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-lg border border-border">
              <div className="h-4 w-4 bg-purple-400/40 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-muted/40 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-lg border border-border">
              <div className="h-4 w-4 bg-blue-400/40 rounded animate-pulse"></div>
              <div className="h-4 w-12 bg-muted/40 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Preview section */}
          <div className="bg-gradient-to-r from-muted/20 to-muted/30 border border-border p-3 rounded-lg">
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted/40 rounded animate-pulse"></div>
              <div className="h-3 w-4/5 bg-muted/40 rounded animate-pulse"></div>
              <div className="h-3 w-3/5 bg-muted/40 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Action button */}
          <div className="h-9 w-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-lg animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
}
