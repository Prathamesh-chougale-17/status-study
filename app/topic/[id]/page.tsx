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
import { ArrowLeft, Plus, BookOpen, RefreshCw } from 'lucide-react';
import { StudyTopic, StudyResource } from '@/lib/types';
import ResourceCard from '@/components/ResourceCard';
import ResourceCardSkeleton from '@/components/ResourceCardSkeleton';

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
      // This would require a separate API endpoint for updating individual resources
      // For now, we'll just update the local state
      if (topic) {
        const updatedResources = topic.resources.map(resource =>
          resource._id === resourceId ? { ...resource, status: newStatus as any } : resource
        );
        setTopic({ ...topic, resources: updatedResources });
      }
    } catch (error) {
      console.error('Error updating resource status:', error);
    }
  };

  const refreshTopic = () => {
    fetchTopic();
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0f0f0f] relative text-white">
        {/* Diagonal Grid with Red/Blue Glow */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
       repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.12) 0, rgba(255, 140, 0, 0.12) 1px, transparent 1px, transparent 22px),
            repeating-linear-gradient(-45deg, rgba(255, 69, 0, 0.08) 0, rgba(255, 69, 0, 0.08) 1px, transparent 1px, transparent 22px)
            `,
            backgroundSize: "44px 44px",
          }}
        />
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-32 bg-white/10 rounded animate-pulse"></div>
              <div className="h-9 w-20 bg-white/10 rounded animate-pulse"></div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white/10 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-8 w-64 bg-white/10 rounded animate-pulse"></div>
                <div className="h-4 w-96 bg-white/10 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="h-7 w-48 bg-white/10 rounded animate-pulse"></div>
              <div className="h-10 w-32 bg-white/10 rounded animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <ResourceCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen w-full bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
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
    <div className="min-h-screen w-full bg-[#0f0f0f] relative text-white">
      {/* Diagonal Grid with Red/Blue Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
     repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.12) 0, rgba(255, 140, 0, 0.12) 1px, transparent 1px, transparent 22px),
          repeating-linear-gradient(-45deg, rgba(255, 69, 0, 0.08) 0, rgba(255, 69, 0, 0.08) 1px, transparent 1px, transparent 22px)
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
          
          <div className="flex items-center gap-4">
            <div className="text-4xl">
              {iconMap[topic.icon as keyof typeof iconMap] || '📚'}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                {topic.title}
              </h1>
              <p className="text-gray-300 mt-2">
                {topic.description}
              </p>
            </div>
          </div>
        </div>

        <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">
                Resources ({topic.resources.length})
              </h2>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Resource
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Resource</DialogTitle>
                    <DialogDescription>
                      Add a new study resource to this topic.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                        placeholder="Resource title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newResource.description}
                        onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                        placeholder="Brief description of the resource"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="url">URL (Optional)</Label>
                      <Input
                        id="url"
                        type="url"
                        value={newResource.url}
                        onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={newResource.type}
                          onValueChange={(value) => setNewResource({ ...newResource, type: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
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
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={newResource.priority}
                          onValueChange={(value) => setNewResource({ ...newResource, priority: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={newResource.notes}
                        onChange={(e) => setNewResource({ ...newResource, notes: e.target.value })}
                        placeholder="Additional notes about this resource"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddResource}>
                        Add Resource
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {topic.resources.length === 0 ? (
              <Card className="bg-black/40 backdrop-blur-sm border border-white/10">
                <CardContent className="text-center py-12">
                  <div className="text-gray-400">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2 text-white">No resources yet</h3>
                    <p className="text-sm">Add your first resource to get started with this topic.</p>
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
                   />
                 ))}
               </div>
             )}
        </div>
      </div>
    </div>
  );
}
