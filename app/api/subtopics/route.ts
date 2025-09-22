import { NextRequest, NextResponse } from 'next/server';
import  client  from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Subtopic } from '@/lib/types';
import { withAuth } from '@/lib/auth-helpers';

export const POST = withAuth(async (request: NextRequest) => {
  try {
    await client.connect();
    const db = client.db('study-dashboard');
    
    const body = await request.json();
    const { topicId, title, description, notes = '', links = [] } = body;
    
    if (!topicId || !title) {
      return NextResponse.json({ error: 'Topic ID and title are required' }, { status: 400 });
    }
    
    const subtopic: Omit<Subtopic, '_id'> = {
      title,
      description: description || '',
      topicId,
      notes,
      links,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection('subtopics').insertOne(subtopic as any);
    
    // Update the topic to include this subtopic
    await db.collection('topics').updateOne(
      { _id: new ObjectId(topicId) },
      { $push: { subtopics: { _id: result.insertedId, ...subtopic } } } as any
    );
    
    return NextResponse.json({ _id: result.insertedId, ...subtopic });
  } catch (error) {
    console.error('Error creating subtopic:', error);
    return NextResponse.json({ error: 'Failed to create subtopic' }, { status: 500 });
  }
});

export const GET = withAuth(async (request: NextRequest) => {
  try {
    await client.connect();
    const db = client.db('study-dashboard');
    
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get('topicId');
    
    if (!topicId) {
      return NextResponse.json({ error: 'Topic ID is required' }, { status: 400 });
    }
    
    const subtopics = await db.collection('subtopics')
      .find({ topicId })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(subtopics);
  } catch (error) {
    console.error('Error fetching subtopics:', error);
    return NextResponse.json({ error: 'Failed to fetch subtopics' }, { status: 500 });
  }
});
