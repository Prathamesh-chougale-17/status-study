import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@yourdomain.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";


    const result = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: "Admin"
      }
    });


    // Better Auth returns { user: ..., token: ... } on success
    if (result && result.user) {
      return NextResponse.json({ 
        success: true, 
        message: 'Admin user created successfully',
        email: adminEmail,
        user: result.user
      });
    } else {
      return NextResponse.json({ 
        error: 'Failed to create admin user - no user returned' 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Failed to create admin user:', error);
    
    // Better Auth throws errors for validation issues
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: 'Failed to create admin user', 
        details: error.message
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create admin user', 
      details: 'Unknown error'
    }, { status: 500 });
  }
}

// Also allow GET for easy testing
export async function GET(request: NextRequest) {
  return POST(request);
}
