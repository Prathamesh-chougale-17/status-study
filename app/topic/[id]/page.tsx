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
import { ArrowLeft, Plus, ExternalLink, BookOpen, Video, FileText, GraduationCap, Target, MoreHorizontal, Edit, Trash2, RefreshCw } from 'lucide-react';
import { StudyTopic, StudyResource } from '@/lib/types';

const iconMap = {
  Code: '💻',
  Brain: '🧠',
  BookOpen: '📚',
  Users: '👥',
  Target: '🎯',
  Lightbulb: '💡',
};

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
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

  const ResourceCard = ({ resource }: { resource: StudyResource }) => {
    const TypeIcon = resourceTypeIcons[resource.type] || FileText;
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TypeIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{resource.title}</CardTitle>
                <CardDescription className="text-sm mt-1">
                  {resource.description}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusColors[resource.status]}>
                {resource.status.replace('-', ' ')}
              </Badge>
              <Badge className={priorityColors[resource.priority]}>
                {resource.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {resource.url && (
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-gray-500" />
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm truncate"
                >
                  {resource.url}
                </a>
              </div>
            )}
            
            {resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {resource.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Label htmlFor={`status-${resource._id}`} className="text-sm">
                Status:
              </Label>
              <Select
                value={resource.status}
                onValueChange={(value) => handleUpdateResourceStatus(resource._id!, value)}
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {resource.notes && (
              <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                {resource.notes}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
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
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {topic.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {topic.description}
              </p>
            </div>
          </div>
        </div>

        <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
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
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-500 dark:text-gray-400">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No resources yet</h3>
                    <p className="text-sm">Add your first resource to get started with this topic.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {topic.resources.map((resource) => (
                  <ResourceCard key={resource._id} resource={resource} />
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
