'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, BookOpen, RefreshCw, FileText } from 'lucide-react';
import { StudyTopic, StudyResource, Subtopic } from '@/lib/types';
import ResourceCard from '@/components/ResourceCard';
import ResourceCardSkeleton from '@/components/ResourceCardSkeleton';
import SubtopicCard from '@/components/SubtopicCard';
import SubtopicCardSkeleton from '@/components/SubtopicCardSkeleton';
import { ThemeToggle } from '@/components/theme-toggle';
import { toast } from 'sonner';

const iconMap = {
  Code: '💻',
  Brain: '🧠',
  BookOpen: '📚',
  Users: '👥',
  Target: '🎯',
  Lightbulb: '💡',
};


export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const [topic, setTopic] = useState<StudyTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddSubtopicDialogOpen, setIsAddSubtopicDialogOpen] = useState(false);
  const [newResource, setNewResource] = useState<Partial<StudyResource>>({
    title: '',
    description: '',
    url: '',
    type: 'article',
    status: 'not-started',
    priority: 'medium',
    tags: [],
    notes: '',
  });
  const [newSubtopic, setNewSubtopic] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    if (params.id) {
      fetchTopic();
    }
  }, [params.id]);

  const fetchTopic = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/topics/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setTopic(data);
      } else {
        console.error('Failed to fetch topic');
        // Handle error - maybe redirect to dashboard
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching topic:', error);
      // Handle error - maybe redirect to dashboard
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async () => {
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId: params.id,
          ...newResource,
        }),
      });

      if (response.ok) {
        await fetchTopic(); // Refresh the topic data
        setIsAddDialogOpen(false);
        setNewResource({
          title: '',
          description: '',
          url: '',
          type: 'article',
          status: 'not-started',
          priority: 'medium',
          tags: [],
          notes: '',
        });
      }
    } catch (error) {
      console.error('Error adding resource:', error);
    }
  };

  const handleUpdateResourceStatus = async (resourceId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (response.ok) {
        // Update local state
        if (topic) {
          const updatedResources = topic.resources.map(resource =>
            resource._id === resourceId ? { ...resource, status: newStatus as any } : resource
          );
          setTopic({ ...topic, resources: updatedResources });
        }
        toast.success('Resource status updated successfully');
      } else {
        toast.error('Failed to update resource status');
      }
    } catch (error) {
      console.error('Error updating resource status:', error);
      toast.error('Failed to update resource status');
    }
  };

  const handleUpdateResourceNotes = async (resourceId: string, newNotes: string) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: newNotes,
        }),
      });

      if (response.ok) {
        // Update local state
        if (topic) {
          const updatedResources = topic.resources.map(resource =>
            resource._id === resourceId ? { ...resource, notes: newNotes } : resource
          );
          setTopic({ ...topic, resources: updatedResources });
        }
        toast.success('Resource notes updated successfully');
      } else {
        toast.error('Failed to update resource notes');
      }
    } catch (error) {
      console.error('Error updating resource notes:', error);
      toast.error('Failed to update resource notes');
    }
  };

  const handleUpdateResource = async (resourceId: string, updatedResource: Partial<StudyResource>) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedResource),
      });

      if (response.ok) {
        // Update local state
        if (topic) {
          const updatedResources = topic.resources.map(resource =>
            resource._id === resourceId ? { ...resource, ...updatedResource } : resource
          );
          setTopic({ ...topic, resources: updatedResources });
        }
        toast.success('Resource updated successfully');
      } else {
        toast.error('Failed to update resource');
      }
    } catch (error) {
      console.error('Error updating resource:', error);
      toast.error('Failed to update resource');
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update local state
        if (topic) {
          const updatedResources = topic.resources.filter(resource => resource._id !== resourceId);
          setTopic({ ...topic, resources: updatedResources });
        }
        toast.success('Resource deleted successfully');
      } else {
        toast.error('Failed to delete resource');
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
    }
  };

  const handleAddSubtopic = async () => {
    if (!newSubtopic.title.trim()) {
      toast.error('Please enter a subtopic title');
      return;
    }
    
    try {
      const response = await fetch('/api/subtopics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId: params.id,
          title: newSubtopic.title,
          description: newSubtopic.description,
          notes: '',
          links: [],
        }),
      });

      if (response.ok) {
        await fetchTopic(); // Refresh the topic data
        setIsAddSubtopicDialogOpen(false);
        setNewSubtopic({ title: '', description: '' });
        toast.success('Subtopic created successfully');
      } else {
        toast.error('Failed to create subtopic');
      }
    } catch (error) {
      console.error('Error adding subtopic:', error);
      toast.error('Failed to create subtopic');
    }
  };

  const handleUpdateSubtopic = async (subtopicId: string, updatedSubtopic: Partial<Subtopic>) => {
    try {
      const response = await fetch(`/api/subtopics/${subtopicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSubtopic),
      });

      if (response.ok) {
        await fetchTopic(); // Refresh the topic data
        toast.success('Subtopic updated successfully');
      } else {
        toast.error('Failed to update subtopic');
      }
    } catch (error) {
      console.error('Error updating subtopic:', error);
      toast.error('Failed to update subtopic');
    }
  };

  const handleDeleteSubtopic = async (subtopicId: string) => {
    try {
      const response = await fetch(`/api/subtopics/${subtopicId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTopic(); // Refresh the topic data
        toast.success('Subtopic deleted successfully');
      } else {
        toast.error('Failed to delete subtopic');
      }
    } catch (error) {
      console.error('Error deleting subtopic:', error);
      toast.error('Failed to delete subtopic');
    }
  };

  const refreshTopic = () => {
    fetchTopic();
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background relative text-foreground">
        {/* Diagonal Grid with Orange Glow - Dark Mode */}
        <div
          className="absolute inset-0 z-0 pointer-events-none dark:block hidden"
          style={{
            backgroundImage: `
       repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.12) 0, rgba(255, 140, 0, 0.12) 1px, transparent 1px, transparent 22px),
            repeating-linear-gradient(-45deg, rgba(255, 69, 0, 0.08) 0, rgba(255, 69, 0, 0.08) 1px, transparent 1px, transparent 22px)
            `,
            backgroundSize: "44px 44px",
          }}
        />
        {/* Light Mode Grid */}
        <div
          className="absolute inset-0 z-0 pointer-events-none dark:hidden block"
          style={{
            backgroundImage: `
       repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.06) 0, rgba(255, 140, 0, 0.06) 1px, transparent 1px, transparent 22px),
            repeating-linear-gradient(-45deg, rgba(255, 69, 0, 0.04) 0, rgba(255, 69, 0, 0.04) 1px, transparent 1px, transparent 22px)
            `,
            backgroundSize: "44px 44px",
          }}
        />
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-20 bg-muted rounded animate-pulse"></div>
                <div className="h-9 w-20 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-muted rounded-xl animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-96 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Subtopics Section Skeleton */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-7 w-48 bg-muted rounded animate-pulse"></div>
                <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SubtopicCardSkeleton key={index} />
                ))}
              </div>
            </div>

            {/* Resources Section Skeleton */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-7 w-48 bg-muted rounded animate-pulse"></div>
                <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ResourceCardSkeleton key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Topic not found
          </h1>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen w-full bg-background relative text-foreground">
      {/* Diagonal Grid with Orange Glow - Dark Mode */}
      <div
        className="absolute inset-0 z-0 pointer-events-none dark:block hidden"
        style={{
          backgroundImage: `
     repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.12) 0, rgba(255, 140, 0, 0.12) 1px, transparent 1px, transparent 22px),
          repeating-linear-gradient(-45deg, rgba(255, 69, 0, 0.08) 0, rgba(255, 69, 0, 0.08) 1px, transparent 1px, transparent 22px)
          `,
          backgroundSize: "44px 44px",
        }}
      />
      {/* Light Mode Grid */}
      <div
        className="absolute inset-0 z-0 pointer-events-none dark:hidden block"
        style={{
          backgroundImage: `
     repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.06) 0, rgba(255, 140, 0, 0.06) 1px, transparent 1px, transparent 22px),
          repeating-linear-gradient(-45deg, rgba(255, 69, 0, 0.04) 0, rgba(255, 69, 0, 0.04) 1px, transparent 1px, transparent 22px)
          `,
          backgroundSize: "44px 44px",
        }}
      />
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={refreshTopic}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-4xl">
              {iconMap[topic.icon as keyof typeof iconMap] || '📚'}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                {topic.title}
              </h1>
              <p className="text-muted-foreground mt-2">
                {topic.description}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Subtopics Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Subtopics ({topic.subtopics?.length || 0})
              </h2>
              
              <Dialog open={isAddSubtopicDialogOpen} onOpenChange={setIsAddSubtopicDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Subtopic
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-background border border-border backdrop-blur-md">
                  <DialogHeader>
                    <DialogTitle className="text-foreground text-xl">Add New Subtopic</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Create a new subtopic for detailed note-taking and link organization.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subtopic-title" className="text-sm text-muted-foreground mb-2 block">Title</Label>
                      <Input
                        id="subtopic-title"
                        value={newSubtopic.title}
                        onChange={(e) => setNewSubtopic({ ...newSubtopic, title: e.target.value })}
                        className="bg-background border-border text-foreground"
                        placeholder="Subtopic title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subtopic-description" className="text-sm text-muted-foreground mb-2 block">Description</Label>
                      <Textarea
                        id="subtopic-description"
                        value={newSubtopic.description}
                        onChange={(e) => setNewSubtopic({ ...newSubtopic, description: e.target.value })}
                        className="bg-background border-border text-foreground resize-none"
                        placeholder="Brief description of this subtopic"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddSubtopicDialogOpen(false)}
                        className="border-border text-foreground hover:bg-muted"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddSubtopic} className="bg-orange-500 hover:bg-orange-600 text-white">
                        Add Subtopic
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {(!topic.subtopics || topic.subtopics.length === 0) ? (
              <Card className="bg-card/50 backdrop-blur-sm border border-border">
                <CardContent className="text-center py-16">
                  <div className="text-muted-foreground">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                      <FileText className="h-8 w-8 opacity-60" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">No subtopics yet</h3>
                    <p className="text-sm max-w-md mx-auto leading-relaxed">
                      Create subtopics to organize detailed notes and links for this topic. 
                      Each subtopic can contain rich notes and helpful resources.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {topic.subtopics.map((subtopic) => (
                  <SubtopicCard 
                    key={subtopic._id || `subtopic-${subtopic.title}`} 
                    subtopic={subtopic} 
                    onSubtopicUpdate={handleUpdateSubtopic}
                    onSubtopicDelete={handleDeleteSubtopic}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Resources Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Resources ({topic.resources.length})
              </h2>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Resource
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-background border border-border backdrop-blur-md">
                  <DialogHeader>
                    <DialogTitle className="text-foreground text-xl">Add New Resource</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Add a new study resource to this topic.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-sm text-muted-foreground mb-2 block">Title</Label>
                      <Input
                        id="title"
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                        className="bg-background border-border text-foreground"
                        placeholder="Resource title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description" className="text-sm text-muted-foreground mb-2 block">Description</Label>
                      <Textarea
                        id="description"
                        value={newResource.description}
                        onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                        className="bg-background border-border text-foreground resize-none"
                        placeholder="Brief description of the resource"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="url" className="text-sm text-muted-foreground mb-2 block">URL (Optional)</Label>
                      <Input
                        id="url"
                        type="url"
                        value={newResource.url}
                        onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                        className="bg-background border-border text-foreground"
                        placeholder="https://example.com"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type" className="text-sm text-muted-foreground mb-2 block">Type</Label>
                        <Select
                          value={newResource.type}
                          onValueChange={(value) => setNewResource({ ...newResource, type: value as any })}
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
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="priority" className="text-sm text-muted-foreground mb-2 block">Priority</Label>
                        <Select
                          value={newResource.priority}
                          onValueChange={(value) => setNewResource({ ...newResource, priority: value as any })}
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
                      <Label htmlFor="notes" className="text-sm text-muted-foreground mb-2 block">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={newResource.notes}
                        onChange={(e) => setNewResource({ ...newResource, notes: e.target.value })}
                        className="bg-background border-border text-foreground resize-none"
                        placeholder="Additional notes about this resource"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                        className="border-border text-foreground hover:bg-muted"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddResource} className="bg-orange-500 hover:bg-orange-600 text-white">
                        Add Resource
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {topic.resources.length === 0 ? (
              <Card className="bg-card/50 backdrop-blur-sm border border-border">
                <CardContent className="text-center py-16">
                  <div className="text-muted-foreground">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 opacity-60" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">No resources yet</h3>
                    <p className="text-sm max-w-md mx-auto leading-relaxed">
                      Add your first resource to get started with this topic. 
                      Resources can be articles, videos, books, or any study material.
                    </p>
                  </div>
                </CardContent>
              </Card>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {topic.resources.map((resource) => (
                   <ResourceCard 
                     key={resource._id} 
                     resource={resource} 
                     onStatusChange={handleUpdateResourceStatus}
                     onNotesChange={handleUpdateResourceNotes}
                     onResourceUpdate={handleUpdateResource}
                     onResourceDelete={handleDeleteResource}
                   />
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
