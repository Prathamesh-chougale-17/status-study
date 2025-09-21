'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Edit2, Trash2, FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Subtopic } from '@/lib/types';
import { useState } from 'react';

interface SubtopicCardProps {
  subtopic: Subtopic;
  onSubtopicUpdate?: (subtopicId: string, updatedSubtopic: Partial<Subtopic>) => void;
  onSubtopicDelete?: (subtopicId: string) => void;
}

export default function SubtopicCard({ subtopic, onSubtopicUpdate, onSubtopicDelete }: SubtopicCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedSubtopic, setEditedSubtopic] = useState({
    title: subtopic.title,
    description: subtopic.description,
  });

  const handleSaveSubtopic = () => {
    if (onSubtopicUpdate) {
      onSubtopicUpdate(subtopic._id!, editedSubtopic);
    }
    setIsDialogOpen(false);
  };

  const handleCancelEdit = () => {
    setEditedSubtopic({
      title: subtopic.title,
      description: subtopic.description,
    });
    setIsDialogOpen(false);
  };

  const handleDeleteSubtopic = () => {
    if (onSubtopicDelete) {
      onSubtopicDelete(subtopic._id!);
    }
  };

  const handleOpenDialog = () => {
    setEditedSubtopic({
      title: subtopic.title,
      description: subtopic.description,
    });
    setIsDialogOpen(true);
  };

  const hasNotes = subtopic.notes && subtopic.notes.trim() !== '';
  const notesPreview = hasNotes ? subtopic.notes.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : 'No notes added yet';
  
  return (
    <>
      <Card className="h-full bg-card/50 backdrop-blur-sm border border-border hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-orange-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground border-border">
                {subtopic.links.length} links
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
                      <Edit2 className="h-3 w-3 text-orange-500" />
                    </Button>
                  </DialogTrigger>
                </Dialog>
                {onSubtopicDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-destructive/20"
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-background border border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">Delete Subtopic</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          Are you sure you want to delete "{subtopic.title}"? This action cannot be undone and will permanently remove the subtopic and all its content.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-border text-foreground hover:bg-muted">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteSubtopic}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Subtopic
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>
          <Link href={`/topic/${subtopic.topicId}/subtopic/${subtopic._id}`}>
            <div className="cursor-pointer">
              <CardTitle className="text-lg text-foreground group-hover:text-orange-500 transition-colors">
                {subtopic.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {subtopic.description}
              </CardDescription>
            </div>
          </Link>
        </CardHeader>
        <CardContent>
          <Link href={`/topic/${subtopic.topicId}/subtopic/${subtopic._id}`}>
            <div className="space-y-3 cursor-pointer">
              <div className="text-xs text-muted-foreground bg-gradient-to-r from-muted/20 to-muted/30 border border-border p-2 rounded-lg leading-relaxed">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  <span className="text-xs font-medium text-orange-400 uppercase tracking-wide">Notes Preview</span>
                </div>
                <div className="line-clamp-2 min-h-[20px]">
                  {notesPreview}
                </div>
              </div>
              
              {subtopic.links.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 mb-1">
                    <ExternalLink className="h-3 w-3 text-orange-400" />
                    <span className="text-xs font-medium text-orange-400 uppercase tracking-wide">Links</span>
                  </div>
                  <div className="space-y-1">
                    {subtopic.links.slice(0, 2).map((link, index) => (
                      <div key={index} className="text-xs text-muted-foreground truncate">
                        • {link.title}
                      </div>
                    ))}
                    {subtopic.links.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{subtopic.links.length - 2} more links
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-background border border-border backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">Edit Subtopic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Title</Label>
              <Input
                value={editedSubtopic.title}
                onChange={(e) => setEditedSubtopic({...editedSubtopic, title: e.target.value})}
                className="bg-background border-border text-foreground"
                placeholder="Subtopic title"
              />
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Description</Label>
              <Textarea
                value={editedSubtopic.description}
                onChange={(e) => setEditedSubtopic({...editedSubtopic, description: e.target.value})}
                className="bg-background border-border text-foreground resize-none min-h-[80px]"
                placeholder="Subtopic description"
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
                onClick={handleSaveSubtopic}
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
