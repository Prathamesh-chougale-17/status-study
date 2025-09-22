'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, RefreshCw, Calendar, Clock } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { toast } from 'sonner';
import {
  KanbanProvider,
  KanbanBoard,
  KanbanHeader,
  KanbanCards,
  KanbanCard,
  type DragEndEvent,
} from '@/components/ui/kibo-ui/kanban';
import Link from 'next/link';
import { StudyTask } from '@/lib/types';

// Define the structure for Kanban items (extends StudyTask)
interface KanbanTask extends StudyTask {
  id: string; // For Kanban compatibility
  [key: string]: unknown; // Add index signature to match KanbanItemProps
}

// Define columns for our Kanban board
interface KanbanColumn {
  id: string;
  name: string;
  color: string;
  [key: string]: unknown; // Add index signature to match KanbanColumnProps
}

const columns: KanbanColumn[] = [
  { id: 'todo', name: 'To Do', color: 'bg-gray-500' },
  { id: 'in-progress', name: 'In Progress', color: 'bg-blue-500' },
  { id: 'review', name: 'Review', color: 'bg-yellow-500' },
  { id: 'completed', name: 'Completed', color: 'bg-green-500' },
];

// Interfaces for suggestions
interface TaskSuggestions {
  topics: Array<{
    _id: string;
    title: string;
    category: 'interview-prep' | 'career-growth';
    icon: string;
    color: string;
  }>;
  resources: Array<{
    _id: string;
    title: string;
    type: string;
    status: string;
    priority: 'low' | 'medium' | 'high';
    topicId: string;
    topicTitle: string;
  }>;
  subtopics: Array<{
    _id: string;
    title: string;
    topicId: string;
    topicTitle: string;
  }>;
}

export default function KanbanPage() {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<TaskSuggestions>({
    topics: [],
    resources: [],
    subtopics: []
  });
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: 'interview-prep' as 'interview-prep' | 'career-growth',
    tags: '',
    column: 'todo' as 'todo' | 'in-progress' | 'review' | 'completed',
    topicId: 'none',
    resourceId: 'none',
    subtopicId: 'none',
    dueDate: '',
    estimatedHours: '',
  });

  useEffect(() => {
    fetchTasks();
    fetchSuggestions();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        // Convert to KanbanTask format
        const kanbanTasks: KanbanTask[] = data.map((task: StudyTask) => ({
          ...task,
          id: task._id || task.name, // Ensure id field for Kanban
        }));
        setTasks(kanbanTasks);
      } else {
        toast.error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('/api/tasks/suggestions');
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    console.log('Drag ended:', event);
    // The drag end logic is handled by the KanbanProvider
    // We can add additional logic here if needed
  };

  const handleDataChange = async (newData: KanbanTask[]) => {
    // Update local state immediately for smooth UI
    setTasks(newData);
    
    // Find tasks that changed columns and update them in the database
    const currentTasks = tasks;
    const changedTasks = newData.filter(newTask => {
      const oldTask = currentTasks.find(t => t.id === newTask.id);
      return oldTask && oldTask.column !== newTask.column;
    });

    // Update each changed task in the database
    for (const task of changedTasks) {
      try {
        await fetch(`/api/tasks/${task._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            column: task.column,
          }),
        });
      } catch (error) {
        console.error('Error updating task:', error);
        toast.error(`Failed to update ${task.name}`);
      }
    }
  };

  const handleAddTask = async () => {
    if (!newTask.name.trim()) {
      toast.error('Please enter a task name');
      return;
    }

    const task: Partial<StudyTask> = {
      name: newTask.name,
      description: newTask.description,
      column: newTask.column,
      priority: newTask.priority,
      category: newTask.category,
      tags: newTask.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      topicId: newTask.topicId && newTask.topicId !== 'none' ? newTask.topicId : undefined,
      resourceId: newTask.resourceId && newTask.resourceId !== 'none' ? newTask.resourceId : undefined,
      subtopicId: newTask.subtopicId && newTask.subtopicId !== 'none' ? newTask.subtopicId : undefined,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      estimatedHours: newTask.estimatedHours ? parseInt(newTask.estimatedHours) : undefined,
    };

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        const newTaskData = await response.json();
        const kanbanTask: KanbanTask = {
          ...newTaskData,
          id: newTaskData._id,
        };
        setTasks([...tasks, kanbanTask]);
        setNewTask({
          name: '',
          description: '',
          priority: 'medium',
          category: 'interview-prep',
          tags: '',
          column: 'todo',
          topicId: 'none',
          resourceId: 'none',
          subtopicId: 'none',
          dueDate: '',
          estimatedHours: '',
        });
        setIsAddDialogOpen(false);
        toast.success('Task created successfully');
      } else {
        toast.error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-600 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'interview-prep': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'career-growth': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

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
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Your Progress Hub 🎯
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Transform your goals into achievements, one task at a time! ✨
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                    🔥 {tasks.filter(t => t.column === 'completed').length} completed today
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full">
                    ⚡ {tasks.filter(t => t.column === 'in-progress').length} in progress
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={fetchTasks}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-background border border-border">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Add New Study Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">Task Name</Label>
                      <Input
                        value={newTask.name}
                        onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                        className="bg-background border-border text-foreground"
                        placeholder="Enter task name"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">Description</Label>
                      <Textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        className="bg-background border-border text-foreground resize-none min-h-[80px]"
                        placeholder="Task description"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">Priority</Label>
                        <Select
                          value={newTask.priority}
                          onValueChange={(value) => setNewTask({...newTask, priority: value as typeof newTask.priority})}
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
                      
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">Category</Label>
                        <Select
                          value={newTask.category}
                          onValueChange={(value) => setNewTask({...newTask, category: value as typeof newTask.category})}
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
                    </div>

                    {/* Related Topic/Resource/Subtopic Selection */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">Related Topic (Optional)</Label>
                        <Select
                          value={newTask.topicId}
                          onValueChange={(value) => setNewTask({...newTask, topicId: value})}
                        >
                          <SelectTrigger className="bg-background border-border text-foreground">
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-border">
                            <SelectItem value="none">No topic</SelectItem>
                            {suggestions.topics.map((topic) => (
                              <SelectItem key={topic._id} value={topic._id}>
                                {topic.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {newTask.topicId && newTask.topicId !== 'none' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-muted-foreground mb-2 block">Related Resource</Label>
                            <Select
                              value={newTask.resourceId}
                              onValueChange={(value) => setNewTask({...newTask, resourceId: value})}
                            >
                              <SelectTrigger className="bg-background border-border text-foreground">
                                <SelectValue placeholder="Select resource" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border-border">
                                <SelectItem value="none">No resource</SelectItem>
                                {suggestions.resources
                                  .filter(resource => resource.topicId === newTask.topicId)
                                  .map((resource) => (
                                    <SelectItem key={resource._id} value={resource._id}>
                                      {resource.title}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm text-muted-foreground mb-2 block">Related Subtopic</Label>
                            <Select
                              value={newTask.subtopicId}
                              onValueChange={(value) => setNewTask({...newTask, subtopicId: value})}
                            >
                              <SelectTrigger className="bg-background border-border text-foreground">
                                <SelectValue placeholder="Select subtopic" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border-border">
                                <SelectItem value="none">No subtopic</SelectItem>
                                {suggestions.subtopics
                                  .filter(subtopic => subtopic.topicId === newTask.topicId)
                                  .map((subtopic) => (
                                    <SelectItem key={subtopic._id} value={subtopic._id}>
                                      {subtopic.title}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">Due Date (Optional)</Label>
                        <Input
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                          className="bg-background border-border text-foreground"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">Estimated Hours</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={newTask.estimatedHours}
                          onChange={(e) => setNewTask({...newTask, estimatedHours: e.target.value})}
                          className="bg-background border-border text-foreground"
                          placeholder="e.g. 2"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">Tags (comma separated)</Label>
                      <Input
                        value={newTask.tags}
                        onChange={(e) => setNewTask({...newTask, tags: e.target.value})}
                        className="bg-background border-border text-foreground"
                        placeholder="react, javascript, algorithms"
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
                      <Button
                        onClick={handleAddTask}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Add Task
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="h-[calc(100vh-200px)]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading tasks...</p>
              </div>
            </div>
          ) : (
            <KanbanProvider
              columns={columns}
              data={tasks}
              onDataChange={handleDataChange}
              onDragEnd={handleDragEnd}
              className="h-full"
            >
            {(column) => (
              <KanbanBoard key={column.id} id={column.id} className="h-full">
                <KanbanHeader className="flex items-center gap-2 p-3 border-b">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <span className="font-semibold text-foreground">{column.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {tasks.filter(task => task.column === column.id).length}
                  </Badge>
                </KanbanHeader>
                <KanbanCards id={column.id} className="p-2">
                  {(task) => (
                    <KanbanCard
                      key={task.id}
                      id={task.id}
                      name={task.name}
                      column={task.column}
                      className="hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm text-foreground">{task.name}</h3>
                        {typeof task.description === 'string' && task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        
                        {/* Due Date and Estimated Hours */}
                        {((task as KanbanTask).dueDate || (task as KanbanTask).estimatedHours) && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {(task as KanbanTask).dueDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date((task as KanbanTask).dueDate as Date).toLocaleDateString()}
                              </div>
                            )}
                            {(task as KanbanTask).estimatedHours && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {(task as KanbanTask).estimatedHours}h
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPriorityColor(task.priority as string)}`}
                          >
                            {task.priority as string}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getCategoryColor(task.category as string)}`}
                          >
                            {(task.category as string) === 'interview-prep' ? 'Interview' : 'Career'}
                          </Badge>
                        </div>
                        {Array.isArray(task.tags) && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-muted text-muted-foreground">
                                #{tag}
                              </Badge>
                            ))}
                            {task.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">
                                +{task.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </KanbanCard>
                  )}
                </KanbanCards>
              </KanbanBoard>
            )}
          </KanbanProvider>
          )}
        </div>
      </div>
    </div>
  );
}
