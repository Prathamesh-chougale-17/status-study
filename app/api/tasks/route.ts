import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/mongodb';
import { StudyTask } from '@/lib/types';

export async function GET() {
  try {
    await client.connect();
    const db = client.db('study-dashboard');
    const tasks = await db.collection('tasks').find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const task: StudyTask = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await client.connect();
    const db = client.db('study-dashboard');
    const result = await db.collection('tasks').insertOne(task as any);
    
    return NextResponse.json({ ...task, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
