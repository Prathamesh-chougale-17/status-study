'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ExternalLink, Video, FileText, BookOpen, GraduationCap, Target, Edit2, Trash2 } from 'lucide-react';
import { StudyResource } from '@/lib/types';
import { useState } from 'react';

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
  onNotesChange?: (resourceId: string, newNotes: string) => void;
  onResourceUpdate?: (resourceId: string, updatedResource: Partial<StudyResource>) => void;
  onResourceDelete?: (resourceId: string) => void;
}

export default function ResourceCard({ resource, onStatusChange, onNotesChange, onResourceUpdate, onResourceDelete }: ResourceCardProps) {
  const TypeIcon = resourceTypeIcons[resource.type] || FileText;
  
  // Debug logging
  console.log('ResourceCard - resource._id:', resource._id);
  console.log('ResourceCard - resource object keys:', Object.keys(resource));
  
  // Temporary fix: Generate ID if missing
  const resourceId = resource._id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  console.log('ResourceCard - using resourceId:', resourceId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedResource, setEditedResource] = useState({
    title: resource.title,
    description: resource.description,
    url: resource.url,
    type: resource.type,
    status: resource.status,
    priority: resource.priority,
    tags: resource.tags.join(', '),
    notes: resource.notes || '',
  });
  
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

  const handleSaveResource = () => {
    if (onResourceUpdate) {
      const updatedResource = {
        ...editedResource,
        tags: editedResource.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      };
      onResourceUpdate(resourceId, updatedResource);
    }
    setIsDialogOpen(false);
  };

  const handleCancelEdit = () => {
    setEditedResource({
      title: resource.title,
      description: resource.description,
      url: resource.url,
      type: resource.type,
      status: resource.status,
      priority: resource.priority,
      tags: resource.tags.join(', '),
      notes: resource.notes || '',
    });
    setIsDialogOpen(false);
  };

  const handleOpenDialog = () => {
    setEditedResource({
      title: resource.title,
      description: resource.description,
      url: resource.url,
      type: resource.type,
      status: resource.status,
      priority: resource.priority,
      tags: resource.tags.join(', '),
      notes: resource.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDeleteResource = () => {
    if (onResourceDelete) {
      onResourceDelete(resourceId);
    }
  };
  
  return (
    <>
      <Card className="group bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-md border border-border hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className={`p-2.5 rounded-lg border ${getTypeColor(resource.type)} group-hover:scale-105 transition-transform duration-300 shadow-md`}>
                <TypeIcon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg text-foreground group-hover:text-orange-500 transition-colors duration-300 mb-1 line-clamp-2">
                  {resource.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm line-clamp-2">
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
              <div className="flex gap-1">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleOpenDialog}
                      className="h-6 w-6 p-0 hover:bg-muted"
                    >
                      <Edit2 className="h-3 w-3 text-orange-400" />
                    </Button>
                  </DialogTrigger>
                </Dialog>
                {onResourceDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-3 w-3 text-red-400" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-background border border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">Delete Resource</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          Are you sure you want to delete "{resource.title}"? This action cannot be undone and will permanently remove the resource.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-border text-foreground hover:bg-muted">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteResource}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Resource
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {resource.url && (
              <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg border border-border hover:bg-muted/30 transition-colors">
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
                    className="text-xs bg-muted text-muted-foreground border-border hover:bg-muted/80 transition-colors px-1.5 py-0.5"
                  >
                    #{tag}
                  </Badge>
                ))}
                {resource.tags.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-muted text-muted-foreground border-border px-1.5 py-0.5"
                  >
                    +{resource.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {onStatusChange && (
              <div className="flex items-center justify-between p-1.5 bg-gradient-to-r from-muted/20 to-muted/30 rounded-md border border-border">
                <span className="text-xs text-muted-foreground font-medium">Status</span>
                <Select
                  value={resource.status}
                  onValueChange={(value) => {
                    onStatusChange(resourceId, value);
                  }}
                >
                  <SelectTrigger className="w-32 h-5 bg-background border border-border text-foreground hover:bg-muted hover:border-border/80 transition-all duration-200 text-xs font-medium rounded shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border backdrop-blur-md shadow-2xl">
                    <SelectItem value="not-started" className="hover:bg-muted text-xs text-muted-foreground focus:bg-muted py-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        Not Started
                      </div>
                    </SelectItem>
                    <SelectItem value="in-progress" className="hover:bg-muted text-xs text-yellow-400 focus:bg-muted py-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                        In Progress
                      </div>
                    </SelectItem>
                    <SelectItem value="completed" className="hover:bg-muted text-xs text-green-400 focus:bg-muted py-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        Completed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="text-xs text-muted-foreground bg-gradient-to-r from-muted/20 to-muted/30 border border-border p-2 rounded-lg leading-relaxed">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                <span className="text-xs font-medium text-orange-400 uppercase tracking-wide">Notes</span>
              </div>
              <div className="line-clamp-2 min-h-[20px]">
                {resource.notes || (
                  <span className="text-gray-500 italic">No notes added yet.</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-background border border-border backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">Edit Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Title</Label>
              <Input
                value={editedResource.title}
                onChange={(e) => setEditedResource({...editedResource, title: e.target.value})}
                className="bg-background border-border text-foreground"
                placeholder="Resource title"
              />
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Description</Label>
              <Textarea
                value={editedResource.description}
                onChange={(e) => setEditedResource({...editedResource, description: e.target.value})}
                className="bg-background border-border text-foreground resize-none min-h-[80px]"
                placeholder="Resource description"
              />
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">URL</Label>
              <Input
                value={editedResource.url}
                onChange={(e) => setEditedResource({...editedResource, url: e.target.value})}
                className="bg-background border-border text-foreground"
                placeholder="https://example.com"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Type</Label>
                <Select
                  value={editedResource.type}
                  onValueChange={(value: 'video' | 'article' | 'book' | 'course' | 'practice' | 'other') => setEditedResource({...editedResource, type: value})}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="practice">Practice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Priority</Label>
                <Select
                  value={editedResource.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') => setEditedResource({...editedResource, priority: value})}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Tags (comma separated)</Label>
              <Input
                value={editedResource.tags}
                onChange={(e) => setEditedResource({...editedResource, tags: e.target.value})}
                className="bg-background border-border text-foreground"
                placeholder="tag1, tag2, tag3"
              />
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Notes</Label>
              <Textarea
                value={editedResource.notes}
                onChange={(e) => setEditedResource({...editedResource, notes: e.target.value})}
                className="bg-background border-border text-foreground resize-none min-h-[100px]"
                placeholder="Add your notes here..."
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveResource}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
