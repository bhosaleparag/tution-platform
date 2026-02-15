'use server';
import { adminDb } from '../../../lib/firebase-admin';

/**
 * Fetches live statistics for the landing page
 * - Total exams conducted (quizzes collection count)
 * - Total students tested (users with role 'student')
 * - Total institutes (institutes collection count)
 */
export async function fetchLiveStats() {
  try {
    // Fetch total exams/quizzes
    const quizzesSnapshot = await adminDb.collection('quizzes').count().get();
    const totalExams = quizzesSnapshot.data().count;

    // Fetch total students
    const studentsSnapshot = await adminDb.collection('users')
      .where('role', '==', 'student')
      .count()
      .get();
    const totalStudents = studentsSnapshot.data().count;

    // Fetch total institutes
    // Note: You might need to adjust this based on your data structure
    // If you don't have an institutes collection, you can count unique teacherIds or organizations
    const institutesSnapshot = await adminDb.collection('institutes').count().get();
    const totalInstitutes = institutesSnapshot.data().count;

    return {
      success: true,
      stats: {
        exams: totalExams,
        students: totalStudents,
        institutes: totalInstitutes
      }
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    
    // Return default values if fetch fails
    return {
      success: false,
      stats: {
        exams: 15000,
        students: 50000,
        institutes: 500
      },
      error: error.message
    };
  }
}