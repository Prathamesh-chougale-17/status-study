import { NextResponse } from 'next/server';
import client from '@/lib/mongodb';

export async function GET() {
  try {
    await client.connect();
    const db = client.db('study-dashboard');
    
    // Get all topics with their resources and subtopics
    const topics = await db.collection('topics').find({}).toArray();
    
    const suggestions = {
      topics: topics.map(topic => ({
        _id: topic._id,
        title: topic.title,
        category: topic.category,
        icon: topic.icon,
        color: topic.color
      })),
      resources: topics.flatMap(topic => 
        (topic.resources || []).map((resource: any) => ({
          _id: resource._id,
          title: resource.title,
          type: resource.type,
          status: resource.status,
          priority: resource.priority,
          topicId: topic._id,
          topicTitle: topic.title
        }))
      ),
      subtopics: topics.flatMap(topic => 
        (topic.subtopics || []).map((subtopic: any) => ({
          _id: subtopic._id,
          title: subtopic.title,
          topicId: topic._id,
          topicTitle: topic.title
        }))
      )
    };
    
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}
