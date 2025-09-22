'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  KanbanProvider,
  KanbanBoard,
  KanbanHeader,
  KanbanCards,
  KanbanCard,
  type DragEndEvent,
} from '@/components/ui/kibo-ui/kanban';
import Link from 'next/link';

// Define the structure for our study tasks
interface StudyTask {
  id: string;
  name: string;
  description: string;
  column: string;
  priority: 'low' | 'medium' | 'high';
  category: 'interview-prep' | 'career-growth';
  tags: string[];
  createdAt: Date;
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

// Initial sample tasks
const initialTasks: StudyTask[] = [
  {
    id: '1',
    name: 'Study React Hooks',
    description: 'Learn useState, useEffect, and custom hooks',
    column: 'todo',
    priority: 'high',
    category: 'interview-prep',
    tags: ['react', 'javascript'],
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Practice LeetCode Problems',
    description: 'Solve 5 medium difficulty problems',
    column: 'in-progress',
    priority: 'high',
    category: 'interview-prep',
    tags: ['algorithms', 'data-structures'],
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'System Design Study',
    description: 'Review scalability patterns and distributed systems',
    column: 'review',
    priority: 'medium',
    category: 'interview-prep',
    tags: ['system-design', 'architecture'],
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'Update Resume',
    description: 'Add recent projects and skills',
    column: 'completed',
    priority: 'medium',
    category: 'career-growth',
    tags: ['resume', 'career'],
    createdAt: new Date(),
  },
];

export default function KanbanPage() {
  const [tasks, setTasks] = useState<StudyTask[]>(initialTasks);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: 'interview-prep' as 'interview-prep' | 'career-growth',
    tags: '',
    column: 'todo',
  });

  const handleDragEnd = (event: DragEndEvent) => {
    // The drag end logic is handled by the KanbanProvider
    console.log('Drag ended:', event);
  };

  const handleDataChange = (newData: StudyTask[]) => {
    setTasks(newData);
  };

  const handleAddTask = () => {
    if (!newTask.name.trim()) return;

    const task: StudyTask = {
      id: Date.now().toString(),
      name: newTask.name,
      description: newTask.description,
      column: newTask.column,
      priority: newTask.priority,
      category: newTask.category,
      tags: newTask.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      createdAt: new Date(),
    };

    setTasks([...tasks, task]);
    setNewTask({
      name: '',
      description: '',
      priority: 'medium',
      category: 'interview-prep',
      tags: '',
      column: 'todo',
    });
    setIsAddDialogOpen(false);
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
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  Study Task Board
                </h1>
                <p className="text-muted-foreground mt-2">
                  Organize your study tasks with drag-and-drop Kanban board
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
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
        </div>
      </div>
    </div>
  );
}
