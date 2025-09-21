'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Save, Plus, ExternalLink, Trash2, Edit2 } from 'lucide-react';
import { Subtopic, SubtopicLink } from '@/lib/types';
import { ThemeToggle } from '@/components/theme-toggle';
import NotesEditor from '@/components/NotesEditor';

export default function SubtopicPage() {
  const params = useParams();
  const router = useRouter();
  const [subtopic, setSubtopic] = useState<Subtopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedNotes, setEditedNotes] = useState('');
  const [newLink, setNewLink] = useState({ title: '', url: '', description: '' });
  const [showAddLink, setShowAddLink] = useState(false);

  useEffect(() => {
    if (params.subtopicId) {
      fetchSubtopic();
    }
  }, [params.subtopicId]);

  const fetchSubtopic = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/subtopics/${params.subtopicId}`);
      if (response.ok) {
        const data = await response.json();
        setSubtopic(data);
        setEditedTitle(data.title);
        setEditedDescription(data.description);
        setEditedNotes(data.notes || '');
      } else {
        console.error('Failed to fetch subtopic');
        router.push(`/topic/${params.id}`);
      }
    } catch (error) {
      console.error('Error fetching subtopic:', error);
      router.push(`/topic/${params.topicId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!subtopic) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/subtopics/${params.subtopicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription,
          notes: editedNotes,
        }),
      });

      if (response.ok) {
        setSubtopic({
          ...subtopic,
          title: editedTitle,
          description: editedDescription,
          notes: editedNotes,
        });
        setIsEditing(false);
      } else {
        alert('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving subtopic:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleAddLink = async () => {
    if (!subtopic || !newLink.title || !newLink.url) return;

    try {
      const updatedLinks = [
        ...subtopic.links,
        {
          _id: Date.now().toString(), // Temporary ID
          title: newLink.title,
          url: newLink.url,
          description: newLink.description,
          createdAt: new Date(),
        }
      ];

      const response = await fetch(`/api/subtopics/${params.subtopicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          links: updatedLinks,
        }),
      });

      if (response.ok) {
        setSubtopic({ ...subtopic, links: updatedLinks });
        setNewLink({ title: '', url: '', description: '' });
        setShowAddLink(false);
      } else {
        alert('Failed to add link');
      }
    } catch (error) {
      console.error('Error adding link:', error);
      alert('Failed to add link');
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!subtopic) return;

    try {
      const updatedLinks = subtopic.links.filter(link => link._id !== linkId);
      
      const response = await fetch(`/api/subtopics/${params.subtopicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          links: updatedLinks,
        }),
      });

      if (response.ok) {
        setSubtopic({ ...subtopic, links: updatedLinks });
      } else {
        alert('Failed to delete link');
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('Failed to delete link');
    }
  };

  const handleDeleteSubtopic = async () => {
    try {
      const response = await fetch(`/api/subtopics/${params.subtopicId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push(`/topic/${params.id}`);
      } else {
        alert('Failed to delete subtopic');
      }
    } catch (error) {
      console.error('Error deleting subtopic:', error);
      alert('Failed to delete subtopic');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background relative text-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!subtopic) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Subtopic not found</h1>
          <Button onClick={() => router.push(`/topic/${params.id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Topic
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
              onClick={() => router.push(`/topic/${params.id}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Topic
            </Button>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedTitle(subtopic.title);
                      setEditedDescription(subtopic.description);
                      setEditedNotes(subtopic.notes || '');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete
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
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm text-muted-foreground mb-2 block">Title</Label>
                  <Input
                    id="title"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="bg-background border-border text-foreground text-2xl font-bold"
                    placeholder="Subtopic title"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-sm text-muted-foreground mb-2 block">Description</Label>
                  <Textarea
                    id="description"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="bg-background border-border text-foreground"
                    placeholder="Brief description"
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">{subtopic.title}</h1>
                <p className="text-muted-foreground text-lg">{subtopic.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notes Section */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <NotesEditor
                    value={editedNotes}
                    onChange={setEditedNotes}
                    placeholder="Start writing your notes..."
                    className="min-h-[400px]"
                  />
                ) : (
                  <div 
                    className="prose prose-invert max-w-none min-h-[400px] p-4 bg-muted/20 rounded-lg border border-border"
                    dangerouslySetInnerHTML={{ __html: subtopic.notes || '<p class="text-muted-foreground italic">No notes added yet. Click Edit to add your notes.</p>' }}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Links Section */}
          <div>
            <Card className="bg-card/50 backdrop-blur-sm border border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">Links</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setShowAddLink(!showAddLink)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Link
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAddLink && (
                  <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-border">
                    <div>
                      <Label htmlFor="link-title" className="text-sm text-muted-foreground mb-1 block">Title</Label>
                      <Input
                        id="link-title"
                        value={newLink.title}
                        onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                        className="bg-background border-border text-foreground"
                        placeholder="Link title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="link-url" className="text-sm text-muted-foreground mb-1 block">URL</Label>
                      <Input
                        id="link-url"
                        value={newLink.url}
                        onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                        className="bg-background border-border text-foreground"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="link-description" className="text-sm text-muted-foreground mb-1 block">Description (Optional)</Label>
                      <Textarea
                        id="link-description"
                        value={newLink.description}
                        onChange={(e) => setNewLink({...newLink, description: e.target.value})}
                        className="bg-background border-border text-foreground"
                        placeholder="Brief description"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleAddLink}
                        disabled={!newLink.title || !newLink.url}
                      >
                        Add Link
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowAddLink(false);
                          setNewLink({ title: '', url: '', description: '' });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {subtopic.links.length === 0 ? (
                    <p className="text-muted-foreground text-sm italic">No links added yet.</p>
                  ) : (
                    subtopic.links.map((link) => (
                      <div key={link._id} className="p-3 bg-muted/20 rounded-lg border border-border">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <ExternalLink className="h-4 w-4 text-orange-500 flex-shrink-0" />
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-500 hover:text-orange-400 font-medium truncate"
                              >
                                {link.title}
                              </a>
                            </div>
                            {link.description && (
                              <p className="text-muted-foreground text-sm">{link.description}</p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteLink(link._id!)}
                            className="h-6 w-6 p-0 hover:bg-destructive/20 ml-2"
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
