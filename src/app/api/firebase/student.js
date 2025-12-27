import { db } from '@/lib/firebase';
import crypto from 'crypto';
import dayjs from 'dayjs';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc,orderBy,serverTimestamp, getDoc, setDoc } from 'firebase/firestore';

/**
 * Load all students for a specific teacher
 */
export const loadStudents = async (classes, instituteId) => {
  try {
    const studentsRef = collection(db, 'users');
    const q = query(
      studentsRef,
      where('role', '==', 'student'),
      where('instituteId', '==', instituteId),
      where('class', 'in', classes),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const studentsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      joinedDate: doc.data().createdAt?.toDate().toLocaleDateString() || 'N/A'
    }));
    
    return { success: true, data: studentsData };
  } catch (error) {
    console.error('Error loading students:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Load all invite links for a specific teacher
 */
export const loadInvites = async (teacherId, instituteId) => {
  try {
    const invitesRef = collection(db, 'invites-student');
    const q = query(
      invitesRef,
      where('teacherId', '==', teacherId),
      where('instituteId', '==', instituteId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const invitesData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || 'N/A'
    }));
    
    return { success: true, data: invitesData };
  } catch (error) {
    console.error('Error loading invites:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Create a new invite link
 */
export const createInvite = async (inviteData) => {
  try {
    const { className, subjects, teacherId, teacherName, instituteId } = inviteData;
    
    // Generate invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    
    const newInvite = {
      class: className,
      subjects: subjects,
      token: inviteToken,
      teacherId: teacherId,
      teacherName: teacherName,
      instituteId: instituteId,
      usedCount: 0,
      isActive: true,
      createdAt: serverTimestamp()
    };

    // Use inviteToken as document ID
    await setDoc(doc(db, 'invites-student', inviteToken), newInvite);
    
    return { 
      success: true, 
      data: {
        id: inviteToken,
        ...newInvite,
        createdAt: new Date().toLocaleDateString()
      }
    };
  } catch (error) {
    console.error('Error creating invite:', error);
    return { success: false, error: error.message };
  }
};

// Get invite by token
export async function getInviteByToken(token) {
  const inviteRef = doc(db, 'invites-student', token);
  const inviteDoc = await getDoc(inviteRef);

  if (!inviteDoc.exists()) return null;

  return { token, ...inviteDoc.data() };
}

export async function getStudentQuizzes(classId, instituteId, studentId) {
  try {
    // Fetch all quizzes
    const quizzesQuery = query(
      collection(db, 'quizzes'),
      where('classId', '==', classId),
      where('instituteId', '==', instituteId),
      orderBy('startDate', 'asc')
    );

    // Fetch all student attempts at once
    const attemptsQuery = query(
      collection(db, 'quizAttempts'),
      where('studentId', '==', studentId),
      where('status', '==', 'completed')
    );

    const [quizzesSnapshot, attemptsSnapshot] = await Promise.all([
      getDocs(quizzesQuery),
      getDocs(attemptsQuery)
    ]);

    // Create a map of completed quiz attempts
    const completedQuizMap = new Map();
    attemptsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      completedQuizMap.set(data.quizId, {
        attemptId: doc.id,
        score: data.score,
        completedAt: data.completedAt?.toDate?.().toISOString()
      });
    });

    const today = dayjs().format('YYYY-MM-DD');
    const categorized = {
      upcoming: [],
      active: [],
      completed: []
    };

    quizzesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const quiz = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString()
      };

      const startDate = data.startDate;
      const endDate = data.endDate;
      const attemptData = completedQuizMap.get(doc.id);

      if (attemptData) {
        // Student has completed this quiz
        categorized.completed.push({
          ...quiz,
          ...attemptData
        });
      } else if (dayjs(today).isBefore(startDate)) {
        // Quiz hasn't started yet
        categorized.upcoming.push(quiz);
      } else if (dayjs(today).isBefore(endDate) || dayjs(today).isSame(endDate)) {
        // Quiz is currently active
        categorized.active.push(quiz);
      } else {
        // Quiz ended but student didn't complete (missed)
        categorized.completed.push({
          ...quiz,
          missed: true
        });
      }
    });

    return { 
      success: true, 
      quizzes: categorized 
    };
  } catch (error) {
    console.error('Get student quizzes error:', error);
    return { 
      success: false, 
      error: error.message, 
      quizzes: { upcoming: [], active: [], completed: [] } 
    };
  }
}

/**
 * Update student information
 */
export const updateStudent = async (studentId, updateData) => {
  try {
    const studentRef = doc(db, 'users', studentId);
    await updateDoc(studentRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating student:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Deactivate an invite link
 */
export const deactivateInvite = async (inviteId) => {
  try {
    const inviteRef = doc(db, 'invites-student', inviteId);
    await updateDoc(inviteRef, {
      isActive: false,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deactivating invite:', error);
    return { success: false, error: error.message };
  }
};