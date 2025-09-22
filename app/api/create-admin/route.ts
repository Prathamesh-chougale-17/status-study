import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@yourdomain.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    console.log('Creating admin user with email:', adminEmail);

    const result = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: "Admin"
      }
    });

    console.log('Sign up result:', result);

    if (result.error) {
      console.error('Error creating admin user:', result.error);
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user created successfully',
      email: adminEmail,
      user: result.data
    });
  } catch (error) {
    console.error('Failed to create admin user:', error);
    return NextResponse.json({ 
      error: 'Failed to create admin user', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Also allow GET for easy testing
export async function GET(request: NextRequest) {
  return POST(request);
}
