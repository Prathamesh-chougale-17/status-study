import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/mongodb';
import { StudyResource } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topicId, ...resourceData } = body;
    
    const resource: StudyResource = {
      ...resourceData,
      status: resourceData.status || 'not-started',
      priority: resourceData.priority || 'medium',
      tags: resourceData.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await client.connect();
    const db = client.db('study-dashboard');
    
    // Add resource to the topic
    const result = await db.collection('topics').updateOne(
      { _id: new ObjectId(topicId) },
      { $push: { resources: resource } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, resource });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
  }
}
