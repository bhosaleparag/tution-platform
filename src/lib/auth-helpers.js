// Server-side only - Do not import in client components
"use server";
import { adminAuth, adminDb } from './firebase-admin';

/**
 * Verify Firebase ID token and get user role
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<{uid: string, role: string} | null>}
 */
export async function verifyTokenAndGetRole(idToken) {
  try {
    if (!adminAuth || !adminDb) {
      console.error('Firebase Admin not initialized');
      return null;
    }

    
    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Get user role from Firestore using Admin SDK
    const userRef = adminDb.collection('users').doc(uid);
    console.log('idToken', userRef)
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return { uid, role: 'student' }; // Default role
    }

    const userData = userSnap.data();
    const role = userData.role || 'student';

    return { uid, role, ...userData };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

/**
 * Get user role from Firestore by UID
 * @param {string} uid - User ID
 * @returns {Promise<string>}
 */
export async function getUserRole(uid) {
  try {
    if (!adminDb) {
      console.error('Firebase Admin not initialized');
      return 'student';
    }

    const userRef = adminDb.collection('users').doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return 'student'; // Default role
    }

    const userData = userSnap.data();
    return userData.role || 'student';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'student';
  }
}

