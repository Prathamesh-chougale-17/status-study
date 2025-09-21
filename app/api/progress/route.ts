import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/mongodb';
import { Progress } from '@/lib/types';

export async function GET() {
  try {
    await client.connect();
    const db = client.db('study-dashboard');
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const week = Math.ceil(now.getDate() / 7);
    const day = now.getDate();
    
    let progress = await db.collection('progress').findOne({ year, month, week, day });
    
    if (!progress) {
      // Create default progress if none exists
      const defaultProgress = {
        year,
        month,
        week,
        day,
        yearProgress: 0,
        monthProgress: 0,
        weekProgress: 0,
        dayProgress: 0,
        updatedAt: new Date(),
      };
      const result = await db.collection('progress').insertOne(defaultProgress);
      progress = { _id: result.insertedId, ...defaultProgress };
    }
    
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    await client.connect();
    const db = client.db('study-dashboard');
    
    const result = await db.collection('progress').updateOne(
      { year: body.year, month: body.month, week: body.week, day: body.day },
      { 
        $set: {
          ...body,
          updatedAt: new Date(),
        }
      },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
