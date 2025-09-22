import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';

export async function authenticateRequest(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in.' }, 
        { status: 401 }
      );
    }

    // For now, any authenticated user is allowed
    // You can add role checks here later if needed
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
