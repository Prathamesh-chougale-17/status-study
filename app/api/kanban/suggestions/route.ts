import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('=== KANBAN SUGGESTIONS API ===');
    
    await client.connect();
    const db = client.db('study-dashboard');

    // Fetch topics
    const topics = await db.collection('topics').find({}, {
      projection: { _id: 1, title: 1, category: 1, icon: 1, color: 1 }
    }).toArray();

    // Fetch resources from topics
    const resources = await db.collection('topics').aggregate([
      { $unwind: '$resources' },
      {
        $project: {
          _id: '$resources._id',
          title: '$resources.title',
          type: '$resources.type',
          status: '$resources.status',
          priority: '$resources.priority',
          topicId: '$_id',
          topicTitle: '$title',
        }
      }
    ]).toArray();

    // Fetch subtopics from topics
    const subtopics = await db.collection('topics').aggregate([
      { $unwind: '$subtopics' },
      {
        $project: {
          _id: '$subtopics._id',
          title: '$subtopics.title',
          topicId: '$_id',
          topicTitle: '$title',
        }
      }
    ]).toArray();

    console.log(`Found: ${topics.length} topics, ${resources.length} resources, ${subtopics.length} subtopics`);

    return NextResponse.json({ topics, resources, subtopics });
  } catch (error) {
    console.error('Error fetching kanban suggestions:', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}
