import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    
    const session = await auth.api.getSession({
      headers: request.headers
    });


    return NextResponse.json({
      hasSession: !!session,
      session: session,
      user: session?.user,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Auth status error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      hasSession: false
    });
  }
}
