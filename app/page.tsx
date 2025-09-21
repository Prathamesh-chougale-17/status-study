'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Code, Brain, Users, Target, Lightbulb, Calendar, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { StudyTopic, Progress as ProgressType } from '@/lib/types';

const defaultTopics: StudyTopic[] = [
  {
    _id: '1',
    title: 'Data Structures & Algorithms',
    description: 'DSA: Data Structures & Algorithms',
    icon: 'Code',
    color: 'bg-green-500',
    category: 'interview-prep',
    resources: [],
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    title: 'Low Level Design',
    description: 'LLD: Low Level Design',
    icon: 'Brain',
    color: 'bg-purple-500',
    category: 'interview-prep',
    resources: [],
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    title: 'Core Computer Science',
    description: 'CORE Computer Science',
    icon: 'BookOpen',
    color: 'bg-blue-500',
    category: 'interview-prep',
    resources: [],
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    title: 'Behavioral Interview Questions',
    description: 'Managerial, Behavioral & HR',
    icon: 'Users',
    color: 'bg-orange-500',
    category: 'interview-prep',
    resources: [],
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '5',
    title: 'System Design',
    description: 'High-level system architecture and design patterns',
    icon: 'Target',
    color: 'bg-red-500',
    category: 'career-growth',
    resources: [],
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '6',
    title: 'Software Engineering Best Practices',
    description: '20+ Software Engineering Best Practices for Modern Web Development',
    icon: 'Lightbulb',
    color: 'bg-yellow-500',
    category: 'career-growth',
    resources: [],
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const iconMap = {
  Code,
  Brain,
  BookOpen,
  Users,
  Target,
  Lightbulb,
  Calendar,
  TrendingUp,
};

export default function Home() {
  const [topics, setTopics] = useState<StudyTopic[]>([]);
  const [progress, setProgress] = useState<ProgressType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch topics and progress in parallel
      const [topicsResponse, progressResponse] = await Promise.all([
        fetch('/api/topics'),
        fetch('/api/progress')
      ]);

      if (topicsResponse.ok) {
        const topicsData = await topicsResponse.json();
        setTopics(topicsData.length > 0 ? topicsData : defaultTopics);
      } else {
        console.error('Failed to fetch topics');
        setTopics(defaultTopics); // Fallback to default topics
      }

      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setProgress(progressData);
      } else {
        console.error('Failed to fetch progress');
        // Set default progress if API fails
        const now = new Date();
        setProgress({
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          week: Math.ceil(now.getDate() / 7),
          day: now.getDate(),
          yearProgress: 0,
          monthProgress: 0,
          weekProgress: 0,
          dayProgress: 0,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Using default topics.');
      setTopics(defaultTopics);
      // Set default progress on error
      const now = new Date();
      setProgress({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        week: Math.ceil(now.getDate() / 7),
        day: now.getDate(),
        yearProgress: 0,
        monthProgress: 0,
        weekProgress: 0,
        dayProgress: 0,
        updatedAt: new Date(),
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchData();
  };

  const createNewTopic = async (category: 'interview-prep' | 'career-growth') => {
    const title = prompt('Enter topic title:');
    if (!title) return;

    const description = prompt('Enter topic description:') || '';
    
    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          icon: 'BookOpen',
          color: 'bg-gray-500',
          category,
          resources: [],
          progress: 0,
        }),
      });

      if (response.ok) {
        await fetchData(); // Refresh the data
      } else {
        alert('Failed to create topic');
      }
    } catch (error) {
      console.error('Error creating topic:', error);
      alert('Failed to create topic');
    }
  };

  const interviewPrepTopics = topics.filter(topic => topic.category === 'interview-prep');
  const careerGrowthTopics = topics.filter(topic => topic.category === 'career-growth');

  const TopicCard = ({ topic }: { topic: StudyTopic }) => {
    const IconComponent = iconMap[topic.icon as keyof typeof iconMap] || BookOpen;
    
    return (
      <Link href={`/topic/${topic._id}`}>
        <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${topic.color} text-white`}>
                <IconComponent className="h-6 w-6" />
              </div>
              <Badge variant="secondary" className="text-xs">
                {topic.resources.length} resources
              </Badge>
            </div>
            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
              {topic.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {topic.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{topic.progress}%</span>
              </div>
              <Progress value={topic.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Study Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Organize your interview prep and career growth resources in one place
              </p>
            </div>
            <div className="flex items-center gap-2">
              {error && (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
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
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Interview Prep Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Interview Prep
                </h2>
                <Button 
                  size="sm" 
                  className="gap-2"
                  onClick={() => createNewTopic('interview-prep')}
                >
                  <Plus className="h-4 w-4" />
                  New Topic
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {interviewPrepTopics.map((topic) => (
                  <TopicCard key={topic._id} topic={topic} />
                ))}
              </div>
            </section>

            {/* Career Growth Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Job & SDE Career Growth
                </h2>
                <Button 
                  size="sm" 
                  className="gap-2"
                  onClick={() => createNewTopic('career-growth')}
                >
                  <Plus className="h-4 w-4" />
                  New Topic
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {careerGrowthTopics.map((topic) => (
                  <TopicCard key={topic._id} topic={topic} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {progress && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Year</span>
                        <span>{progress.yearProgress}%</span>
                      </div>
                      <Progress value={progress.yearProgress} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Month</span>
                        <span>{progress.monthProgress}%</span>
                      </div>
                      <Progress value={progress.monthProgress} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Week</span>
                        <span>{progress.weekProgress}%</span>
                      </div>
                      <Progress value={progress.weekProgress} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Day</span>
                        <span>{progress.dayProgress}%</span>
                      </div>
                      <Progress value={progress.dayProgress} className="h-2" />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  September 2025
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">21</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Today</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}