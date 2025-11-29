// Server-side only - Use in Server Components and API Routes
import { cookies } from 'next/headers';
import { verifyTokenAndGetRole } from './auth-helpers';

/**
 * Get current user role from server-side
 * Use this in Server Components or API Routes
 * @returns {Promise<{role: string, uid: string} | null>}
 */
export async function getServerUserRole() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('authToken');

    if (!sessionCookie) {
      return null;
    }

    const userInfo = await verifyTokenAndGetRole(sessionCookie.value);
    return userInfo;
  } catch (error) {
    console.error('Error getting server user role:', error);
    return null;
  }
}

/**
 * Check if user has required role
 * @param {string} requiredRole - Required role ('student', 'teacher', 'admin')
 * @returns {Promise<boolean>}
 */
export async function hasRequiredRole(requiredRole) {
  const userInfo = await getServerUserRole();
  return userInfo?.role === requiredRole;
}

