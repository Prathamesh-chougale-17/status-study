'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Code, Brain, Users, Target, Lightbulb, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { StudyTopic } from '@/lib/types';

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
};

export default function Home() {
  const [topics, setTopics] = useState<StudyTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setTopics(topicsData.length > 0 ? topicsData : defaultTopics);
      } else {
        console.error('Failed to fetch topics');
        setTopics(defaultTopics); // Fallback to default topics
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Using default topics.');
      setTopics(defaultTopics);
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
        <Card className="h-full bg-black/40 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${topic.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="h-6 w-6" />
              </div>
              <Badge variant="secondary" className="text-xs bg-white/10 text-white border-white/20">
                {topic.resources.length} resources
              </Badge>
            </div>
            <CardTitle className="text-lg text-white group-hover:text-orange-400 transition-colors">
              {topic.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-300">
              {topic.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-400">
              {topic.resources.length} resources available
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0f0f0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0f0f0f] relative text-white">
      {/* Diagonal Grid with Red/Blue Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
     repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.12) 0, rgba(255, 140, 0, 0.12) 1px, transparent 1px, transparent 22px),
          repeating-linear-gradient(-45deg, rgba(255, 69, 0, 0.08) 0, rgba(255, 69, 0, 0.08) 1px, transparent 1px, transparent 22px)
          `,
          backgroundSize: "44px 44px",
        }}
      />
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Study Dashboard
              </h1>
              <p className="text-gray-300">
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

        <div className="space-y-8">
            {/* Interview Prep Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">
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
                <h2 className="text-2xl font-semibold text-white">
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
      </div>
    </div>
  );
}