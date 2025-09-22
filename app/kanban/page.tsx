'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, RefreshCw, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { StudyTask } from '@/lib/types';
import { toast } from 'sonner';
import Link from 'next/link';
import MotivationalQuote from '@/components/MotivationalQuote';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/kibo-ui/kanban';

type KanbanTask = StudyTask & {
  id: string;
} & Record<string, unknown>;

type TaskSuggestions = {
  topics: Array<{
    _id: string;
    title: string;
    category: string;
    icon: string;
    color: string;
  }>;
  resources: Array<{
    _id: string;
    title: string;
    type: string;
    status: string;
    priority: string;
    topicId: string;
    topicTitle: string;
  }>;
  subtopics: Array<{
    _id: string;
    title: string;
    topicId: string;
    topicTitle: string;
  }>;
};

const columns = [
  { id: 'todo', name: 'To Do', color: '#6B7280' },
  { id: 'in-progress', name: 'In Progress', color: '#F59E0B' },
  { id: 'review', name: 'Review', color: '#8B5CF6' },
  { id: 'completed', name: 'Completed', color: '#10B981' },
];

export default function KanbanPage() {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
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
      
      const response = await fetch('/api/kanban');
      if (response.ok) {
        const data = await response.json();
        
        // Convert to KanbanTask format and fix any invalid column values
        const kanbanTasks: KanbanTask[] = data.map((task: StudyTask) => {
          // Fix invalid column values (if column is not a valid column name, default to 'todo')
          const validColumns = ['todo', 'in-progress', 'review', 'completed'];
          const fixedColumn = validColumns.includes(task.column) ? task.column : 'todo';
          
          if (task.column !== fixedColumn) {
            // Update in database
            fetch(`/api/tasks/${task._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ column: fixedColumn }),
            });
          }
          
          return {
            ...task,
            id: task._id || task.name, // Ensure id field for Kanban
            column: fixedColumn, // Use the fixed column value
          };
        });
        
        setTasks(kanbanTasks);
      } else {
        toast.error('Failed to fetch tasks');
      }
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('/api/kanban/suggestions');
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      // Silently fail for suggestions
    }
  };

  const handleDataChange = async (newTasks: any[]) => {
    // Update UI immediately
    setTasks(newTasks as KanbanTask[]);
    
    // Prevent duplicate calls
    if (isUpdating) return;
    setIsUpdating(true);
    
    // Update database on every drag - no checks, just update
    try {
      for (const task of newTasks) {
        await fetch(`/api/tasks/${task._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ column: task.column }),
        });
      }
      toast.success('Tasks saved!');
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      // Reset after a short delay
      setTimeout(() => setIsUpdating(false), 500);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.name.trim()) {
      toast.error('Please enter a task name');
      return;
    }

    const task = {
      name: newTask.name,
      description: newTask.description,
      column: newTask.column,
      priority: newTask.priority,
      category: newTask.category,
      tags: newTask.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      topicId: newTask.topicId,
      resourceId: newTask.resourceId,
      subtopicId: newTask.subtopicId,
      dueDate: newTask.dueDate,
      estimatedHours: newTask.estimatedHours,
    };


    try {
      const response = await fetch('/api/kanban', {
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
        setTasks(prevTasks => [...prevTasks, kanbanTask]);
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
      toast.error('Failed to create task');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton className="h-10 w-80 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>

          {/* Motivational Quote Skeleton */}
          <div className="mb-8 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm border border-border rounded-lg p-6">
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Add Task Button Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-10 w-36" />
          </div>

          {/* Kanban Board Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((column) => (
              <div key={column} className="bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-md border border-border rounded-lg p-4">
                {/* Column Header Skeleton */}
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-6 w-8 rounded-full ml-auto" />
                </div>

                {/* Task Cards Skeleton */}
                <div className="space-y-3">
                  {[1, 2].map((task) => (
                    <div key={task} className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border border-border rounded-lg p-4">
                      <div className="space-y-3">
                        {/* Task Title */}
                        <Skeleton className="h-4 w-3/4" />
                        
                        {/* Task Description */}
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                        
                        {/* Badges */}
                        <div className="flex flex-wrap gap-1">
                          <Skeleton className="h-5 w-12 rounded-full" />
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          <Skeleton className="h-5 w-10 rounded-full" />
                          <Skeleton className="h-5 w-14 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Your Progress Hub 🎯
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your study progress and stay motivated on your learning journey
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={fetchTasks} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mb-8">
          <MotivationalQuote />
        </div>

        {/* Add Task Button */}
        <div className="mb-6">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                <Plus className="h-4 w-4 mr-2" />
                Add New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Task Name</Label>
                  <Input
                    id="name"
                    value={newTask.name}
                    onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                    placeholder="Enter task name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({...newTask, priority: value as any})}
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
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newTask.category}
                      onValueChange={(value) => setNewTask({...newTask, category: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interview-prep">Interview Prep</SelectItem>
                        <SelectItem value="career-growth">Career Growth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={newTask.tags}
                    onChange={(e) => setNewTask({...newTask, tags: e.target.value})}
                    placeholder="react, javascript, frontend"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTask}>
                    Create Task
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Kibo UI Kanban Board */}
        <KanbanProvider
          columns={columns}
          data={tasks}
          onDataChange={handleDataChange}
        >
          {(column) => (
            <KanbanBoard id={column.id} key={column.id}>
              <KanbanHeader>
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: column.color }}
                  />
                  <span className="font-semibold text-foreground">{column.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {tasks.filter(task => task.column === column.id).length}
                  </Badge>
                </div>
              </KanbanHeader>
              <KanbanCards id={column.id}>
                {(taskItem: any) => {
                  const task = taskItem as KanbanTask;
                  return (
                  <KanbanCard
                    column={column.id}
                    id={task.id}
                    key={task.id}
                    name={task.name}
                    className={`${
                      updatingTaskId === task.id 
                        ? 'animate-pulse ring-2 ring-green-500/50 shadow-lg shadow-green-500/30' 
                        : ''
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-1 flex-1">
                          <p className="m-0 font-medium text-sm text-foreground">
                            {task.name}
                          </p>
                          {task.description && (
                            <p className="m-0 text-xs text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {task.category}
                        </Badge>
                      </div>
                      
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {task.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{task.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {(task.dueDate || task.estimatedHours) && (
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          )}
                          {task.estimatedHours && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.estimatedHours}h
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </KanbanCard>
                  );
                }}
              </KanbanCards>
            </KanbanBoard>
          )}
        </KanbanProvider>
      </div>
    </div>
  );
}