import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Subtopic } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await client.connect();
    const db = client.db('study-dashboard');
    
    const subtopic = await db.collection('subtopics').findOne({ _id: new ObjectId(id) });
    
    if (!subtopic) {
      return NextResponse.json({ error: 'Subtopic not found' }, { status: 404 });
    }
    
    return NextResponse.json(subtopic);
  } catch (error) {
    console.error('Error fetching subtopic:', error);
    return NextResponse.json({ error: 'Failed to fetch subtopic' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await client.connect();
    const db = client.db('study-dashboard');
    
    const body = await request.json();
    const { title, description, notes, links } = body;
    
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (notes !== undefined) updateData.notes = notes;
    if (links !== undefined) updateData.links = links;
    
    const result = await db.collection('subtopics').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Subtopic not found' }, { status: 404 });
    }
    
    // Update the topic's subtopics array as well
    const subtopic = await db.collection('subtopics').findOne({ _id: new ObjectId(id) });
    if (subtopic) {
      await db.collection('topics').updateOne(
        { _id: new ObjectId(subtopic.topicId) },
        { $set: { 'subtopics.$[elem]': { ...subtopic, ...updateData } } },
        { arrayFilters: [{ 'elem._id': new ObjectId(id) }] }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating subtopic:', error);
    return NextResponse.json({ error: 'Failed to update subtopic' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await client.connect();
    const db = client.db('study-dashboard');
    
    // Get the subtopic to find the topicId
    const subtopic = await db.collection('subtopics').findOne({ _id: new ObjectId(id) });
    
    if (!subtopic) {
      return NextResponse.json({ error: 'Subtopic not found' }, { status: 404 });
    }
    
    // Delete the subtopic
    await db.collection('subtopics').deleteOne({ _id: new ObjectId(id) });
    
    // Remove from topic's subtopics array
    await db.collection('topics').updateOne(
      { _id: new ObjectId(subtopic.topicId) },
      { $pull: { subtopics: { _id: new ObjectId(id) } } } as any
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subtopic:', error);
    return NextResponse.json({ error: 'Failed to delete subtopic' }, { status: 500 });
  }
}
