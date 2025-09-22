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
    const task = await db.collection('tasks').findOne({ _id: new ObjectId(id) });
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
});

export const PUT = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) =>{
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log('=== API PUT REQUEST ===');
    console.log('Task ID:', id);
    console.log('Update body:', body);
    
    await client.connect();
    const db = client.db('study-dashboard');
    
    // Check if task exists first
    const existingTask = await db.collection('tasks').findOne({ _id: new ObjectId(id) });
    console.log('Existing task found:', existingTask ? 'YES' : 'NO');
    
    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...body, 
          updatedAt: new Date() 
        } 
      } as any
    );
    
    console.log('Update result:', { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
    
    if (result.matchedCount === 0) {
      console.log('ERROR: Task not found in database');
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    console.log('SUCCESS: Task updated successfully');
    return NextResponse.json({ message: 'Task updated successfully', result });
  } catch (error) {
    console.error('ERROR in PUT /api/tasks/[id]:', error);
    return NextResponse.json({ 
      error: 'Failed to update task', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
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
    
    const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
});
