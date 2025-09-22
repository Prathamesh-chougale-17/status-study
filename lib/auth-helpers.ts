import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';

export async function authenticateRequest(request: NextRequest) {
  try {
    console.log('=== AUTH HELPER: Authenticating request ===');
    console.log('Request URL:', request.url);
    console.log('Headers:', Object.fromEntries(request.headers.entries()));
    
    const session = await auth.api.getSession({
      headers: request.headers
    });

    console.log('Session result:', session);

    if (!session) {
      console.log('No session found');
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    console.log('Session user:', session.user);
    console.log('User role:', session.user?.role);

    // Verify user is admin
    if (session.user.role !== 'admin') {
      console.log('User is not admin, role:', session.user.role);
      return NextResponse.json(
        { error: 'Admin access required' }, 
        { status: 403 }
      );
    }

    console.log('Authentication successful');
    return { session, user: session.user };
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' }, 
      { status: 401 }
    );
  }
}

export function withAuth<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const authResult = await authenticateRequest(request);
    
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    // Add user info to request for use in handler
    (request as any).user = authResult.user;
    (request as any).session = authResult.session;
    
    return handler(request, ...args);
  };
}
