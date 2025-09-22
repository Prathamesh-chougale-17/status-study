import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { withAuth } from '@/lib/auth-helpers';

export const GET = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    await client.connect();
    const db = client.db('study-dashboard');
    const topic = await db.collection('topics').findOne({ _id: new ObjectId(id) });
    
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }
    
    // Ensure all resources have IDs
    if (topic.resources) {
      let needsUpdate = false;
      topic.resources = topic.resources.map((resource: any) => {
        if (!resource._id) {
          resource._id = new ObjectId().toString();
          needsUpdate = true;
        }
        return resource;
      });
      
      // Update the topic in database if any resources were missing IDs
      if (needsUpdate) {
        await db.collection('topics').updateOne(
          { _id: new ObjectId(id) },
          { $set: { resources: topic.resources } }
        );
      }
    }
    
    return NextResponse.json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    return NextResponse.json({ error: 'Failed to fetch topic' }, { status: 500 });
  }
});

export const PUT = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    await client.connect();
    const db = client.db('study-dashboard');
    const result = await db.collection('topics').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating topic:', error);
    return NextResponse.json({ error: 'Failed to update topic' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
  ) => {
  try {
    const { id } = await params;
    await client.connect();
    const db = client.db('study-dashboard');
    const result = await db.collection('topics').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting topic:', error);
    return NextResponse.json({ error: 'Failed to delete topic' }, { status: 500 });
  }
});
