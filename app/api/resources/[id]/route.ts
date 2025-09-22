import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { withAuth } from '@/lib/auth-helpers';

export const PUT = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id: resourceId } = await params;
    
    if (!resourceId) {
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 });
    }

    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    await client.connect();
    const db = client.db('study-dashboard');
    
    // Find the topic that contains this resource
    const topic = await db.collection('topics').findOne({
      'resources._id': resourceId
    });
    
    if (!topic) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }
    
    // Update the specific resource within the topic
    const result = await db.collection('topics').updateOne(
      { 
        _id: new ObjectId(topic._id),
        'resources._id': resourceId
      },
      { 
        $set: { 
          'resources.$.title': body.title,
          'resources.$.description': body.description,
          'resources.$.url': body.url,
          'resources.$.type': body.type,
          'resources.$.status': body.status,
          'resources.$.priority': body.priority,
          'resources.$.tags': body.tags || [],
          'resources.$.notes': body.notes,
          'resources.$.updatedAt': new Date()
        } as any
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id: resourceId } = await params;
    
    if (!resourceId) {
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 });
    }
    
    await client.connect();
    const db = client.db('study-dashboard');
    
    // Find the topic that contains this resource
    const topic = await db.collection('topics').findOne({
      'resources._id': resourceId
    });
    
    if (!topic) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }
    
    // Remove the specific resource from the topic
    const result = await db.collection('topics').updateOne(
      { _id: new ObjectId(topic._id) },
      { 
        $pull: { 
          resources: { _id: resourceId }
        } as any
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 });
  }
});
