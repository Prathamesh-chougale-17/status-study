import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/mongodb';
import { StudyTopic } from '@/lib/types';
import { withAuth } from '@/lib/auth-helpers';

export const GET = withAuth(async (request: NextRequest) => {
  try {
    await client.connect();
    const db = client.db('study-dashboard');
    const topics = await db.collection('topics').find({}).toArray();
    
    return NextResponse.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 });
  }
});

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const topic: StudyTopic = {
      ...body,
      resources: body.resources || [],
      subtopics: body.subtopics || [],
      progress: body.progress || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await client.connect();
    const db = client.db('study-dashboard');
    const result = await db.collection('topics').insertOne(topic as any);
    
    return NextResponse.json({ ...topic, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating topic:', error);
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 });
  }
});
