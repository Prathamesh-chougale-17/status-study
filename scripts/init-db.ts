import client from '../lib/mongodb';
import { StudyTopic } from '../lib/types';

const defaultTopics: StudyTopic[] = [
  {
    title: 'Data Structures & Algorithms',
    description: 'DSA: Data Structures & Algorithms',
    icon: 'Code',
    color: 'bg-green-500',
    category: 'interview-prep',
    resources: [
      {
        title: 'Striver\'s SDE Sheet',
        description: 'Comprehensive DSA problem sheet for interview preparation',
        url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/',
        type: 'practice',
        status: 'not-started',
        priority: 'high',
        tags: ['leetcode', 'interview', 'dsa'],
        notes: 'Start with arrays and strings, then move to advanced topics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'LeetCode Top 100',
        description: 'Most frequently asked coding interview questions',
        url: 'https://leetcode.com/problem-list/top-100-liked-questions/',
        type: 'practice',
        status: 'not-started',
        priority: 'high',
        tags: ['leetcode', 'interview', 'coding'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Low Level Design',
    description: 'LLD: Low Level Design',
    icon: 'Brain',
    color: 'bg-purple-500',
    category: 'interview-prep',
    resources: [
      {
        title: 'Design Patterns in Java',
        description: 'Comprehensive guide to design patterns',
        url: 'https://refactoring.guru/design-patterns',
        type: 'article',
        status: 'not-started',
        priority: 'medium',
        tags: ['design-patterns', 'java', 'oop'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Core Computer Science',
    description: 'CORE Computer Science',
    icon: 'BookOpen',
    color: 'bg-blue-500',
    category: 'interview-prep',
    resources: [
      {
        title: 'Operating System Concepts',
        description: 'Fundamental concepts of operating systems',
        type: 'book',
        status: 'not-started',
        priority: 'medium',
        tags: ['os', 'concepts', 'fundamentals'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Behavioral Interview Questions',
    description: 'Managerial, Behavioral & HR',
    icon: 'Users',
    color: 'bg-orange-500',
    category: 'interview-prep',
    resources: [
      {
        title: 'STAR Method Guide',
        description: 'How to answer behavioral questions using STAR method',
        type: 'article',
        status: 'not-started',
        priority: 'medium',
        tags: ['behavioral', 'interview', 'star-method'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'System Design',
    description: 'High-level system architecture and design patterns',
    icon: 'Target',
    color: 'bg-red-500',
    category: 'career-growth',
    resources: [
      {
        title: 'System Design Primer',
        description: 'Learn how to design large-scale systems',
        url: 'https://github.com/donnemartin/system-design-primer',
        type: 'article',
        status: 'not-started',
        priority: 'high',
        tags: ['system-design', 'architecture', 'scalability'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Software Engineering Best Practices',
    description: '20+ Software Engineering Best Practices for Modern Web Development',
    icon: 'Lightbulb',
    color: 'bg-yellow-500',
    category: 'career-growth',
    resources: [
      {
        title: 'Clean Code Principles',
        description: 'Writing clean, maintainable code',
        type: 'book',
        status: 'not-started',
        priority: 'high',
        tags: ['clean-code', 'best-practices', 'maintainability'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function initializeDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('study-dashboard');
    
    // Clear existing data
    await db.collection('topics').deleteMany({});
    console.log('Cleared existing topics');

    // Insert default topics
    const result = await db.collection('topics').insertMany(defaultTopics);
    console.log(`Inserted ${result.insertedCount} default topics`);

    // Initialize progress
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const week = Math.ceil(now.getDate() / 7);
    const day = now.getDate();

    await db.collection('progress').deleteMany({});
    await db.collection('progress').insertOne({
      year,
      month,
      week,
      day,
      yearProgress: 0,
      monthProgress: 0,
      weekProgress: 0,
      dayProgress: 0,
      updatedAt: new Date(),
    });
    console.log('Initialized progress tracking');

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await client.close();
  }
}

// Run the initialization
initializeDatabase();
