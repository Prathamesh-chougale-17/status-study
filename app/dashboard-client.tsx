'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, RefreshCw, AlertCircle, Kanban, Calendar } from 'lucide-react';
import { StudyTopic } from '@/lib/types';
import TopicCardSkeleton from '@/components/TopicCardSkeleton';
import TopicCard from '@/components/TopicCard';
import { ThemeToggle } from '@/components/theme-toggle';
import MotivationalQuote from '@/components/MotivationalQuote';
import AchievementBadges from '@/components/AchievementBadges';
import { AuthControls } from '@/components/auth-controls';
import { toast } from 'sonner';

const colorOptions = [
  { value: 'bg-green-500', label: 'Green' },
  { value: 'bg-blue-500', label: 'Blue' },
  { value: 'bg-purple-500', label: 'Purple' },
  { value: 'bg-orange-500', label: 'Orange' },
  { value: 'bg-red-500', label: 'Red' },
  { value: 'bg-yellow-500', label: 'Yellow' },
  { value: 'bg-gray-500', label: 'Gray' },
];

interface DashboardClientProps {
  session: any;
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const [topics, setTopics] = useState<StudyTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: '',
    description: '',
    icon: 'BookOpen' as 'Code' | 'Brain' | 'BookOpen' | 'Users' | 'Target' | 'Lightbulb',
    color: 'bg-gray-500',
    category: 'interview-prep' as 'interview-prep' | 'career-growth',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch topics
      const topicsResponse = await fetch('/api/topics');

      if (topicsResponse.ok) {
        const topicsData = await topicsResponse.json();
        setTopics(topicsData);
      } else {
        console.error('Failed to fetch topics');
        setTopics([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data.');
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchData();
  };

  const handleCreateTopic = async () => {
    if (!newTopic.title.trim()) {
      toast.error('Please enter a topic title');
      return;
    }
    
    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTopic,
          resources: [],
          progress: 0,
        }),
      });

      if (response.ok) {
        const newTopicData = await response.json();
        setTopics(prev => [...prev, newTopicData]);
        setIsCreateDialogOpen(false);
        setNewTopic({
          title: '',
          description: '',
          icon: 'BookOpen',
          color: 'bg-gray-500',
          category: 'interview-prep',
        });
        toast.success('Topic created successfully');
      } else {
        toast.error('Failed to create topic');
      }
    } catch (error) {
      console.error('Error creating topic:', error);
      toast.error('Failed to create topic');
    }
  };

  const handleUpdateTopic = async (topicId: string, updatedTopic: Partial<StudyTopic>) => {
    try {
      const response = await fetch(`/api/topics/${topicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTopic),
      });

      if (response.ok) {
        // Update local state instead of refetching
        setTopics(prev => prev.map(topic => 
          topic._id === topicId ? { ...topic, ...updatedTopic } : topic
        ));
        toast.success('Topic updated successfully');
      } else {
        toast.error('Failed to update topic');
      }
    } catch (error) {
      console.error('Error updating topic:', error);
      toast.error('Failed to update topic');
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    try {
      const response = await fetch(`/api/topics/${topicId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update local state instead of refetching
        setTopics(prev => prev.filter(topic => topic._id !== topicId));
        toast.success('Topic deleted successfully');
      } else {
        toast.error('Failed to delete topic');
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
      toast.error('Failed to delete topic');
    }
  };

  const interviewPrepTopics = topics.filter(topic => topic.category === 'interview-prep');
  const careerGrowthTopics = topics.filter(topic => topic.category === 'career-growth');

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background relative text-foreground">
        {/* Background Pattern */}
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
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Loading skeleton content */}
          <div className="animate-pulse">
            <div className="h-10 bg-gray-300 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <TopicCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background relative text-foreground">
      {/* Background Pattern */}
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
                  Your Study Journey ✨
                </h1>
                <p className="text-muted-foreground text-lg">
                  Every step forward is progress. You've got this! 🚀
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Keep going strong!
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                    📚 {topics.length} topics to master
                  </div>
                </div>
              </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  {error && (
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                  <Link href="/kanban">
                    <Button
                      size="sm"
                      className="gap-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Kanban className="h-4 w-4" />
                      Task Board
                    </Button>
                  </Link>
                  <Link href="/calendar">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-300"
                    >
                      <Calendar className="h-4 w-4" />
                      Calendar
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshData}
                    disabled={loading}
                    className="gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <AuthControls />
                </div>
            </div>
        </div>

        {/* Motivational Quote Section */}
        <div className="mb-8">
          <MotivationalQuote />
        </div>

        <div className="space-y-8">
            {/* Interview Prep Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  Interview Prep
                </h2>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      className="gap-2"
                      onClick={() => setNewTopic({...newTopic, category: 'interview-prep'})}
                    >
                      <Plus className="h-4 w-4" />
                      New Topic
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {interviewPrepTopics.map((topic) => (
                  <TopicCard 
                    key={topic._id} 
                    topic={topic} 
                    onTopicUpdate={handleUpdateTopic}
                    onTopicDelete={handleDeleteTopic}
                  />
                ))}
        </div>
            </section>

            {/* Career Growth Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  Job & SDE Career Growth
                </h2>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      className="gap-2"
                      onClick={() => setNewTopic({...newTopic, category: 'career-growth'})}
                    >
                      <Plus className="h-4 w-4" />
                      New Topic
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {careerGrowthTopics.map((topic) => (
                  <TopicCard 
                    key={topic._id} 
                    topic={topic} 
                    onTopicUpdate={handleUpdateTopic}
                    onTopicDelete={handleDeleteTopic}
                  />
                ))}
              </div>
            </section>
        </div>

        {/* Achievement Badges Section */}
        <div className="mt-12 mb-8">
          <AchievementBadges 
            totalTopics={topics.length} 
            totalResources={topics.reduce((acc, topic) => acc + topic.resources.length, 0)}
          />
        </div>
      </div>

      {/* Create Topic Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl bg-background border border-border backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">Create New Topic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Title</Label>
              <Input
                value={newTopic.title}
                onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                className="bg-background border-border text-foreground"
                placeholder="Topic title"
              />
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Description</Label>
              <Textarea
                value={newTopic.description}
                onChange={(e) => setNewTopic({...newTopic, description: e.target.value})}
                className="bg-background border-border text-foreground resize-none min-h-[80px]"
                placeholder="Topic description"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Icon</Label>
                <Select
                  value={newTopic.icon}
                  onValueChange={(value: 'Code' | 'Brain' | 'BookOpen' | 'Users' | 'Target' | 'Lightbulb') => setNewTopic({...newTopic, icon: value})}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="Code">Code</SelectItem>
                    <SelectItem value="Brain">Brain</SelectItem>
                    <SelectItem value="BookOpen">Book</SelectItem>
                    <SelectItem value="Users">Users</SelectItem>
                    <SelectItem value="Target">Target</SelectItem>
                    <SelectItem value="Lightbulb">Lightbulb</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Color</Label>
                <Select
                  value={newTopic.color}
                  onValueChange={(value) => setNewTopic({...newTopic, color: value})}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${color.value}`}></div>
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Category</Label>
              <Select
                value={newTopic.category}
                onValueChange={(value: 'interview-prep' | 'career-growth') => setNewTopic({...newTopic, category: value})}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="interview-prep">Interview Prep</SelectItem>
                  <SelectItem value="career-growth">Career Growth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTopic}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Create Topic
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
