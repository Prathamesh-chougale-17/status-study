'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BookOpen, Code, Brain, Users, Target, Lightbulb, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { StudyTopic } from '@/lib/types';
import { useState } from 'react';

const iconMap = {
  Code,
  Brain,
  BookOpen,
  Users,
  Target,
  Lightbulb,
};

const colorOptions = [
  { value: 'bg-green-500', label: 'Green' },
  { value: 'bg-blue-500', label: 'Blue' },
  { value: 'bg-purple-500', label: 'Purple' },
  { value: 'bg-orange-500', label: 'Orange' },
  { value: 'bg-red-500', label: 'Red' },
  { value: 'bg-yellow-500', label: 'Yellow' },
  { value: 'bg-gray-500', label: 'Gray' },
];

interface TopicCardProps {
  topic: StudyTopic;
  onTopicUpdate?: (topicId: string, updatedTopic: Partial<StudyTopic>) => void;
  onTopicDelete?: (topicId: string) => void;
}

export default function TopicCard({ topic, onTopicUpdate, onTopicDelete }: TopicCardProps) {
  const IconComponent = iconMap[topic.icon as keyof typeof iconMap] || BookOpen;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedTopic, setEditedTopic] = useState({
    title: topic.title,
    description: topic.description,
    icon: topic.icon,
    color: topic.color,
    category: topic.category,
  });

  const handleSaveTopic = () => {
    if (onTopicUpdate) {
      onTopicUpdate(topic._id!, editedTopic);
    }
    setIsDialogOpen(false);
  };

  const handleCancelEdit = () => {
    setEditedTopic({
      title: topic.title,
      description: topic.description,
      icon: topic.icon,
      color: topic.color,
      category: topic.category,
    });
    setIsDialogOpen(false);
  };

  const handleDeleteTopic = () => {
    if (onTopicDelete && confirm('Are you sure you want to delete this topic?')) {
      onTopicDelete(topic._id!);
    }
  };

  const handleOpenDialog = () => {
    setEditedTopic({
      title: topic.title,
      description: topic.description,
      icon: topic.icon,
      color: topic.color,
      category: topic.category,
    });
    setIsDialogOpen(true);
  };
  
  return (
    <>
      <Card className="h-full bg-card/50 backdrop-blur-sm border border-border hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-xl ${topic.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <IconComponent className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground border-border">
                {topic.resources.length} resources
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
                {onTopicDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDeleteTopic}
                    className="h-6 w-6 p-0 hover:bg-destructive/20"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          <Link href={`/topic/${topic._id}`}>
            <div className="cursor-pointer">
              <CardTitle className="text-lg text-foreground group-hover:text-orange-500 transition-colors">
                {topic.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {topic.description}
              </CardDescription>
            </div>
          </Link>
        </CardHeader>
        <CardContent>
          <Link href={`/topic/${topic._id}`}>
            <div className="text-sm text-muted-foreground cursor-pointer">
              {topic.resources.length} resources available
            </div>
          </Link>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-background border border-border backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">Edit Topic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Title</Label>
              <Input
                value={editedTopic.title}
                onChange={(e) => setEditedTopic({...editedTopic, title: e.target.value})}
                className="bg-background border-border text-foreground"
                placeholder="Topic title"
              />
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Description</Label>
              <Textarea
                value={editedTopic.description}
                onChange={(e) => setEditedTopic({...editedTopic, description: e.target.value})}
                className="bg-background border-border text-foreground resize-none min-h-[80px]"
                placeholder="Topic description"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Icon</Label>
                <Select
                  value={editedTopic.icon}
                  onValueChange={(value: 'Code' | 'Brain' | 'BookOpen' | 'Users' | 'Target' | 'Lightbulb') => setEditedTopic({...editedTopic, icon: value})}
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
                  value={editedTopic.color}
                  onValueChange={(value) => setEditedTopic({...editedTopic, color: value})}
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
                value={editedTopic.category}
                onValueChange={(value: 'interview-prep' | 'career-growth') => setEditedTopic({...editedTopic, category: value})}
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
                onClick={handleCancelEdit}
                className="border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveTopic}
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
