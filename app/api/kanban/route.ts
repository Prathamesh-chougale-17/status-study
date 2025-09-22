import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/mongodb';
import { StudyTask } from '@/lib/types';
import { ObjectId } from 'mongodb';
import { withAuth } from '@/lib/auth-helpers';

// GET - Fetch all tasks for Kanban board
export const GET = withAuth(async (request: NextRequest) => {
  try {
    
    await client.connect();
    const db = client.db('study-dashboard');
    const tasks = await db.collection('tasks').find({}).toArray();    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching kanban tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
});

// POST - Create new task for Kanban board
export const POST = withAuth(async (request: NextRequest) => {
  try {
    
    const body = await request.json();
    
    const task = {
      name: body.name,
      description: body.description || '',
      column: body.column || 'todo',
      priority: body.priority || 'medium',
      category: body.category || 'interview-prep',
      tags: body.tags || [],
      topicId: body.topicId && body.topicId !== 'none' ? body.topicId : undefined,
      resourceId: body.resourceId && body.resourceId !== 'none' ? body.resourceId : undefined,
      subtopicId: body.subtopicId && body.subtopicId !== 'none' ? body.subtopicId : undefined,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      estimatedHours: body.estimatedHours ? parseInt(body.estimatedHours) : undefined,
      actualHours: body.actualHours || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await client.connect();
    const db = client.db('study-dashboard');
    const result = await db.collection('tasks').insertOne(task as any);    
    return NextResponse.json({ ...task, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating kanban task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
});

// PUT - Update task column (for drag and drop)
export const PUT = withAuth(async (request: NextRequest) => {
  try {
    
    const body = await request.json();
    const { tasks } = body;
    
    if (!tasks || !Array.isArray(tasks)) {
      return NextResponse.json({ error: 'Invalid tasks data' }, { status: 400 });
    }

    await client.connect();
    const db = client.db('study-dashboard');

    // Update multiple tasks
    const bulkOps = tasks.map((task: any) => ({
      updateOne: {
        filter: { _id: new ObjectId(task._id) },
        update: { 
          $set: { 
            column: task.column,
            updatedAt: new Date()
          } 
        }
      }
    }));

    const result = await db.collection('tasks').bulkWrite(bulkOps);
    
    
    return NextResponse.json({ 
      message: 'Tasks updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error bulk updating kanban tasks:', error);
    return NextResponse.json({ error: 'Failed to update tasks' }, { status: 500 });
  }
});
