'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  CalendarProvider,
  CalendarBody,
  CalendarHeader,
  CalendarDate,
  CalendarDatePicker,
  CalendarMonthPicker,
  CalendarYearPicker,
  CalendarDatePagination,
  CalendarItem,
  type Feature,
  type Status,
} from '@/components/ui/kibo-ui/calendar';
import Link from 'next/link';

// Define study event statuses
const studyStatuses: Status[] = [
  { id: 'scheduled', name: 'Scheduled', color: '#3b82f6' }, // Blue
  { id: 'in-progress', name: 'In Progress', color: '#f59e0b' }, // Amber
  { id: 'completed', name: 'Completed', color: '#10b981' }, // Green
  { id: 'cancelled', name: 'Cancelled', color: '#ef4444' }, // Red
];

// Sample study events
const initialEvents: Feature[] = [
  {
    id: '1',
    name: 'React Hooks Study Session',
    startAt: new Date(2024, 11, 15, 10, 0), // December 15, 2024, 10:00 AM
    endAt: new Date(2024, 11, 15, 12, 0), // December 15, 2024, 12:00 PM
    status: studyStatuses[0], // Scheduled
  },
  {
    id: '2',
    name: 'LeetCode Practice',
    startAt: new Date(2024, 11, 16, 14, 0), // December 16, 2024, 2:00 PM
    endAt: new Date(2024, 11, 16, 16, 0), // December 16, 2024, 4:00 PM
    status: studyStatuses[1], // In Progress
  },
  {
    id: '3',
    name: 'System Design Review',
    startAt: new Date(2024, 11, 18, 9, 0), // December 18, 2024, 9:00 AM
    endAt: new Date(2024, 11, 18, 11, 0), // December 18, 2024, 11:00 AM
    status: studyStatuses[0], // Scheduled
  },
  {
    id: '4',
    name: 'Mock Interview',
    startAt: new Date(2024, 11, 20, 15, 0), // December 20, 2024, 3:00 PM
    endAt: new Date(2024, 11, 20, 16, 30), // December 20, 2024, 4:30 PM
    status: studyStatuses[2], // Completed
  },
  {
    id: '5',
    name: 'JavaScript Fundamentals',
    startAt: new Date(2024, 11, 22, 10, 0), // December 22, 2024, 10:00 AM
    endAt: new Date(2024, 11, 22, 12, 0), // December 22, 2024, 12:00 PM
    status: studyStatuses[0], // Scheduled
  },
];

export default function CalendarPage() {
  const [events, setEvents] = useState<Feature[]>(initialEvents);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    status: 'scheduled',
  });

  const handleAddEvent = () => {
    if (!newEvent.name.trim() || !newEvent.date || !newEvent.startTime || !newEvent.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    const eventDate = new Date(newEvent.date);
    const [startHour, startMinute] = newEvent.startTime.split(':').map(Number);
    const [endHour, endMinute] = newEvent.endTime.split(':').map(Number);

    const startAt = new Date(eventDate);
    startAt.setHours(startHour, startMinute, 0, 0);

    const endAt = new Date(eventDate);
    endAt.setHours(endHour, endMinute, 0, 0);

    const selectedStatus = studyStatuses.find(s => s.id === newEvent.status) || studyStatuses[0];

    const event: Feature = {
      id: Date.now().toString(),
      name: newEvent.name,
      startAt,
      endAt,
      status: selectedStatus,
    };

    setEvents([...events, event]);
    setNewEvent({
      name: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      status: 'scheduled',
    });
    setIsAddDialogOpen(false);
  };

  const getStatusColor = (statusId: string) => {
    switch (statusId) {
      case 'scheduled': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'in-progress': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  // Get current date for default date input
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

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
                <h1 className="text-4xl font-bold text-foreground">
                  Study Calendar
                </h1>
                <p className="text-muted-foreground mt-2">
                  Schedule and track your study sessions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-background border border-border">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Add Study Event</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">Event Name *</Label>
                      <Input
                        value={newEvent.name}
                        onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                        className="bg-background border-border text-foreground"
                        placeholder="Enter event name"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">Description</Label>
                      <Textarea
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        className="bg-background border-border text-foreground resize-none min-h-[80px]"
                        placeholder="Event description (optional)"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">Date *</Label>
                      <Input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        className="bg-background border-border text-foreground"
                        min={todayString}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">Start Time *</Label>
                        <Input
                          type="time"
                          value={newEvent.startTime}
                          onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                          className="bg-background border-border text-foreground"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">End Time *</Label>
                        <Input
                          type="time"
                          value={newEvent.endTime}
                          onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                          className="bg-background border-border text-foreground"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">Status</Label>
                      <Select
                        value={newEvent.status}
                        onValueChange={(value) => setNewEvent({...newEvent, status: value})}
                      >
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          {studyStatuses.map((status) => (
                            <SelectItem key={status.id} value={status.id}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: status.color }}
                                />
                                {status.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        onClick={handleAddEvent}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Add Event
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
          <CalendarProvider className="min-h-[600px]">
            {/* Calendar Header with Navigation */}
            <CalendarDate>
              <CalendarDatePicker>
                <CalendarMonthPicker />
                <CalendarYearPicker start={2020} end={2030} />
              </CalendarDatePicker>
              <CalendarDatePagination />
            </CalendarDate>

            {/* Days of Week Header */}
            <CalendarHeader />

            {/* Calendar Body with Events */}
            <CalendarBody features={events}>
              {({ feature }) => (
                <div
                  key={feature.id}
                  className="mb-1 rounded px-1 py-0.5 text-xs"
                  style={{
                    backgroundColor: `${feature.status.color}20`,
                    color: feature.status.color,
                  }}
                >
                  <CalendarItem
                    feature={feature}
                    className="text-xs"
                  />
                </div>
              )}
            </CalendarBody>
          </CalendarProvider>
        </div>

        {/* Events Legend */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Event Status Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {studyStatuses.map((status) => (
              <div key={status.id} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: status.color }}
                />
                <span className="text-sm text-muted-foreground">{status.name}</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStatusColor(status.id)}`}
                >
                  {events.filter(e => e.status.id === status.id).length}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Events</h3>
          <div className="grid gap-4">
            {events
              .filter(event => event.startAt >= new Date())
              .sort((a, b) => a.startAt.getTime() - b.startAt.getTime())
              .slice(0, 5)
              .map((event) => (
                <div key={event.id} className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: event.status.color }}
                        />
                        <h4 className="font-medium text-foreground">{event.name}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(event.status.id)}`}
                        >
                          {event.status.name}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>
                            📅 {event.startAt.toLocaleDateString()}
                          </span>
                          <span>
                            ⏰ {event.startAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.endAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {events.filter(event => event.startAt >= new Date()).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming events scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
