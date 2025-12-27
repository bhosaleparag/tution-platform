'use server';
import { adminDb } from '../../../lib/firebase-admin';

export async function deleteStudent(studentId) {
  try {
    // Delete authentication account
    await adminDb.auth().deleteUser(studentId);
    
    // Delete Firestore user document
    await adminDb.firestore().collection('users').doc(studentId).delete();
    
    return { success: true, message: 'Student deleted successfully' };
  } catch (error) {
    console.error('Error deleting student:', error);
    return { success: false, error: error.message };
  }
}