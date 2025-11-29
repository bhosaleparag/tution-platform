import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyTokenAndGetRole } from '@/lib/auth-helpers';

/**
 * API route to verify user role
 * This can be called from client components to check role
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('authToken');

    if (!sessionCookie) {
      return NextResponse.json({ role: null, error: 'No session' }, { status: 401 });
    }

    const userInfo = await verifyTokenAndGetRole(sessionCookie.value);

    if (!userInfo) {
      return NextResponse.json({ role: null, error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ 
      role: userInfo.role || 'student',
      uid: userInfo.uid 
    });
  } catch (error) {
    console.error('Error verifying role:', error);
    return NextResponse.json({ role: null, error: 'Verification failed' }, { status: 500 });
  }
}

