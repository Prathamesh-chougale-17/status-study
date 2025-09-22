'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, RefreshCw, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { StudyTask } from '@/lib/types';
import { toast } from 'sonner';
import Link from 'next/link';
import MotivationalQuote from '@/components/MotivationalQuote';
import AchievementBadges from '@/components/AchievementBadges';

type KanbanTask = StudyTask & {
  id: string;
};

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
  { id: 'todo', name: 'To Do', color: 'bg-gray-500' },
  { id: 'in-progress', name: 'In Progress', color: 'bg-blue-500' },
  { id: 'review', name: 'Review', color: 'bg-yellow-500' },
  { id: 'completed', name: 'Completed', color: 'bg-green-500' },
];

export default function KanbanPage() {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<KanbanTask | null>(null);
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
      console.log('=== FETCHING KANBAN TASKS ===');
      
      const response = await fetch('/api/kanban');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched tasks from Kanban API:', data.length, 'tasks');
        
        // Convert to KanbanTask format and fix any invalid column values
        const kanbanTasks: KanbanTask[] = data.map((task: StudyTask) => {
          // Fix invalid column values (if column is not a valid column name, default to 'todo')
          const validColumns = ['todo', 'in-progress', 'review', 'completed'];
          const fixedColumn = validColumns.includes(task.column) ? task.column : 'todo';
          
          if (task.column !== fixedColumn) {
            console.log(`Fixed invalid column "${task.column}" to "${fixedColumn}" for task ${task.name}`);
            // Update in database
            fetch(`/api/tasks/${task._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ column: fixedColumn }),
            }).catch(err => console.error('Error fixing column:', err));
          }
          
          return {
            ...task,
            id: task._id || task.name, // Ensure id field for Kanban
            column: fixedColumn, // Use the fixed column value
          };
        });
        
        setTasks(kanbanTasks);
      } else {
        console.error('Failed to fetch tasks:', response.status);
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
      console.log('=== FETCHING KANBAN SUGGESTIONS ===');
      
      const response = await fetch('/api/kanban/suggestions');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched suggestions:', { 
          topics: data.topics?.length || 0, 
          resources: data.resources?.length || 0, 
          subtopics: data.subtopics?.length || 0 
        });
        setSuggestions(data);
      } else {
        console.error('Failed to fetch suggestions:', response.status);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent, task: KanbanTask) => {
    console.log('Drag started:', task.name);
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.column === targetColumn) {
      setDraggedTask(null);
      return;
    }

    console.log(`Moving ${draggedTask.name} from ${draggedTask.column} to ${targetColumn}`);

    // Update local state immediately
    const updatedTasks = tasks.map(task => 
      task.id === draggedTask.id 
        ? { ...task, column: targetColumn as any }
        : task
    );
    setTasks(updatedTasks);

    // Update in database
    try {
      const response = await fetch(`/api/tasks/${draggedTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          column: targetColumn,
        }),
      });

      const responseData = await response.json();
      console.log('API Response:', response.status, responseData);

      if (response.ok) {
        console.log('SUCCESS: Task updated in database');
        toast.success(`Moved ${draggedTask.name} to ${targetColumn.replace('-', ' ')}`);
      } else {
        console.error('API ERROR:', responseData);
        toast.error(`Failed to update ${draggedTask.name}`);
        // Revert on failure
        setTasks(tasks);
      }
    } catch (error) {
      console.error('NETWORK ERROR:', error);
      toast.error(`Network error updating ${draggedTask.name}`);
      // Revert on failure
      setTasks(tasks);
    }

    setDraggedTask(null);
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

    console.log('=== CREATING KANBAN TASK ===', task);

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

  const TaskCard = ({ task }: { task: KanbanTask }) => (
    <Card
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      className="mb-3 cursor-move hover:shadow-md transition-shadow bg-card border-border"
    >
      <CardHeader className="pb-2">
        <h3 className="font-medium text-sm text-foreground">{task.name}</h3>
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-2">
          <Badge variant="outline" className="text-xs">
            {task.priority}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {task.category}
          </Badge>
        </div>
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
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
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading tasks...</p>
            </div>
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

        {/* Progress Badges */}
        <div className="mb-8">
          <AchievementBadges totalTopics={suggestions.topics.length} totalResources={suggestions.resources.length} />
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

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <span className="font-semibold text-foreground">{column.name}</span>
                <Badge variant="secondary" className="ml-auto">
                  {tasks.filter(task => task.column === column.id).length}
                </Badge>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {tasks
                  .filter(task => task.column === column.id)
                  .map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
              </div>

              {/* Drop Zone */}
              {tasks.filter(task => task.column === column.id).length === 0 && (
                <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center text-muted-foreground">
                  Drop tasks here
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}