'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ExternalLink, Video, FileText, BookOpen, GraduationCap, Target } from 'lucide-react';
import { StudyResource } from '@/lib/types';

const resourceTypeIcons = {
  video: Video,
  article: FileText,
  book: BookOpen,
  course: GraduationCap,
  practice: Target,
  other: FileText,
};

const statusColors = {
  'not-started': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-green-100 text-green-800',
};

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800',
};

interface ResourceCardProps {
  resource: StudyResource;
  onStatusChange?: (resourceId: string, newStatus: string) => void;
}

export default function ResourceCard({ resource, onStatusChange }: ResourceCardProps) {
  const TypeIcon = resourceTypeIcons[resource.type] || FileText;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'article': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'book': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'course': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'practice': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };
  
  return (
    <Card className="group bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-md border border-white/10 hover:border-white/30 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-[1.01]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2.5 rounded-lg border ${getTypeColor(resource.type)} group-hover:scale-105 transition-transform duration-300 shadow-md`}>
              <TypeIcon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg text-white group-hover:text-orange-400 transition-colors duration-300 mb-1 line-clamp-2">
                {resource.title}
              </CardTitle>
              <CardDescription className="text-gray-300 text-sm line-clamp-2">
                {resource.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col gap-1 ml-3">
            <Badge className={`${getStatusColor(resource.status)} px-2 py-0.5 text-xs font-medium border`}>
              {resource.status.replace('-', ' ')}
            </Badge>
            <Badge className={`${getPriorityColor(resource.priority)} px-2 py-0.5 text-xs font-medium border`}>
              {resource.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {resource.url && (
            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
              <ExternalLink className="h-4 w-4 text-orange-400 flex-shrink-0" />
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 text-xs truncate font-medium"
              >
                {resource.url}
              </a>
            </div>
          )}
          
          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {resource.tags.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors px-1.5 py-0.5"
                >
                  #{tag}
                </Badge>
              ))}
              {resource.tags.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-white/10 text-white border-white/20 px-1.5 py-0.5"
                >
                  +{resource.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {onStatusChange && (
            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
              <Label htmlFor={`status-${resource._id}`} className="text-xs text-gray-300 font-medium">
                Status:
              </Label>
              <Select
                value={resource.status}
                onValueChange={(value) => onStatusChange(resource._id!, value)}
              >
                <SelectTrigger className="w-28 h-7 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/95 border-white/20 backdrop-blur-md">
                  <SelectItem value="not-started" className="hover:bg-white/10 text-xs">Not Started</SelectItem>
                  <SelectItem value="in-progress" className="hover:bg-white/10 text-xs">In Progress</SelectItem>
                  <SelectItem value="completed" className="hover:bg-white/10 text-xs">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {resource.notes && (
            <div className="text-xs text-gray-300 bg-gradient-to-r from-white/5 to-white/10 border border-white/10 p-2 rounded-lg leading-relaxed">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                <span className="text-xs font-medium text-orange-400 uppercase tracking-wide">Notes</span>
              </div>
              <div className="line-clamp-2">
                {resource.notes}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
