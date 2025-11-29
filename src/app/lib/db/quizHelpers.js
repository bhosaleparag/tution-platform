import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, Timestamp, writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ============ QUIZ FUNCTIONS ============

/**
 * Create a new quiz
 * @param {Object} quizData - Quiz data
 * @param {string} quizData.title - Quiz title
 * @param {string} quizData.description - Quiz description
 * @param {Array} quizData.questions - Array of questions
 * @param {string} quizData.createdBy - Teacher user ID
 * @returns {Promise<Object>} Created quiz data
 */
export const createQuiz = async (quizData) => {
  try {
    const quizRef = doc(collection(db, 'quizzes'));
    const quiz = {
      ...quizData,
      id: quizRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isActive: true
    };
    await setDoc(quizRef, quiz);
    return quiz;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

/**
 * Get quiz by ID
 */
export const getQuiz = async (quizId) => {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    const quizSnap = await getDoc(quizRef);
    if (quizSnap.exists()) {
      return { id: quizSnap.id, ...quizSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting quiz:', error);
    throw error;
  }
};

/**
 * Get all quizzes created by a teacher
 */
export const getTeacherQuizzes = async (teacherId) => {
  try {
    const quizzesRef = collection(db, 'quizzes');
    const q = query(
      quizzesRef,
      where('createdBy', '==', teacherId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting teacher quizzes:', error);
    throw error;
  }
};

/**
 * Update quiz
 */
export const updateQuiz = async (quizId, updates) => {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    await updateDoc(quizRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating quiz:', error);
    throw error;
  }
};

/**
 * Delete quiz
 */
export const deleteQuiz = async (quizId) => {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    await deleteDoc(quizRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting quiz:', error);
    throw error;
  }
};

// ============ QUIZ EVENT FUNCTIONS ============

/**
 * Create a quiz event
 * @param {Object} eventData - Event data
 * @param {string} eventData.quizId - Quiz ID
 * @param {Date} eventData.startTime - Start time
 * @param {Date} eventData.endTime - End time
 * @param {Object} eventData.assignedTo - Assignment object
 * @param {boolean} eventData.showScoreInstantly - Show score immediately
 * @param {string} eventData.createdBy - Teacher user ID
 */
export const createQuizEvent = async (eventData) => {
  try {
    const eventRef = doc(collection(db, 'quizEvents'));
    const event = {
      ...eventData,
      id: eventRef.id,
      startTime: Timestamp.fromDate(new Date(eventData.startTime)),
      endTime: Timestamp.fromDate(new Date(eventData.endTime)),
      createdAt: Timestamp.now(),
      status: 'scheduled' // 'scheduled', 'active', 'ended'
    };
    await setDoc(eventRef, event);
    return event;
  } catch (error) {
    console.error('Error creating quiz event:', error);
    throw error;
  }
};

/**
 * Get quiz event by ID
 */
export const getQuizEvent = async (eventId) => {
  try {
    const eventRef = doc(db, 'quizEvents', eventId);
    const eventSnap = await getDoc(eventRef);
    if (eventSnap.exists()) {
      const data = eventSnap.data();
      return {
        id: eventSnap.id,
        ...data,
        startTime: data.startTime?.toDate(),
        endTime: data.endTime?.toDate()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting quiz event:', error);
    throw error;
  }
};

/**
 * Get quiz events for a student (assigned to them)
 */
export const getStudentQuizEvents = async (studentId, studentClass, studentDivision) => {
  try {
    const eventsRef = collection(db, 'quizEvents');
    const now = Timestamp.now();
    
    // Get events where student is directly assigned
    const studentQuery = query(
      eventsRef,
      where('assignedTo.students', 'array-contains', studentId),
      orderBy('startTime', 'desc')
    );
    
    // Get events assigned to student's class
    const classQuery = query(
      eventsRef,
      where('assignedTo.classes', 'array-contains', studentClass),
      orderBy('startTime', 'desc')
    );
    
    const [studentSnap, classSnap] = await Promise.all([
      getDocs(studentQuery),
      getDocs(classQuery)
    ]);
    
    const events = new Map();
    
    // Process student assignments
    studentSnap.docs.forEach(doc => {
      const data = doc.data();
      events.set(doc.id, {
        id: doc.id,
        ...data,
        startTime: data.startTime?.toDate(),
        endTime: data.endTime?.toDate()
      });
    });
    
    // Process class assignments
    classSnap.docs.forEach(doc => {
      if (!events.has(doc.id)) {
        const data = doc.data();
        events.set(doc.id, {
          id: doc.id,
          ...data,
          startTime: data.startTime?.toDate(),
          endTime: data.endTime?.toDate()
        });
      }
    });
    
    // Filter by time and categorize
    const nowDate = new Date();
    const categorized = {
      upcoming: [],
      active: [],
      completed: []
    };
    
    Array.from(events.values()).forEach(event => {
      if (event.endTime < nowDate) {
        categorized.completed.push(event);
      } else if (event.startTime <= nowDate && event.endTime >= nowDate) {
        categorized.active.push(event);
      } else {
        categorized.upcoming.push(event);
      }
    });
    
    return categorized;
  } catch (error) {
    console.error('Error getting student quiz events:', error);
    throw error;
  }
};

/**
 * Get quiz events created by a teacher
 */
export const getTeacherQuizEvents = async (teacherId) => {
  try {
    const eventsRef = collection(db, 'quizEvents');
    const q = query(
      eventsRef,
      where('createdBy', '==', teacherId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startTime: data.startTime?.toDate(),
        endTime: data.endTime?.toDate()
      };
    });
  } catch (error) {
    console.error('Error getting teacher quiz events:', error);
    throw error;
  }
};

/**
 * Update quiz event status
 */
export const updateQuizEventStatus = async (eventId, status) => {
  try {
    const eventRef = doc(db, 'quizEvents', eventId);
    await updateDoc(eventRef, { status });
    return { success: true };
  } catch (error) {
    console.error('Error updating quiz event status:', error);
    throw error;
  }
};

// ============ QUIZ SUBMISSION FUNCTIONS ============

/**
 * Submit quiz answers
 */
export const submitQuiz = async (submissionData) => {
  try {
    const submissionRef = doc(collection(db, 'quizSubmissions'));
    const submission = {
      ...submissionData,
      id: submissionRef.id,
      submittedAt: Timestamp.now(),
      status: 'submitted' // 'submitted', 'reviewed'
    };
    await setDoc(submissionRef, submission);
    return submission;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw error;
  }
};

/**
 * Get quiz submission by ID
 */
export const getQuizSubmission = async (submissionId) => {
  try {
    const submissionRef = doc(db, 'quizSubmissions', submissionId);
    const submissionSnap = await getDoc(submissionRef);
    if (submissionSnap.exists()) {
      const data = submissionSnap.data();
      return {
        id: submissionSnap.id,
        ...data,
        submittedAt: data.submittedAt?.toDate()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting quiz submission:', error);
    throw error;
  }
};

/**
 * Get student's quiz submissions
 */
export const getStudentSubmissions = async (studentId) => {
  try {
    const submissionsRef = collection(db, 'quizSubmissions');
    const q = query(
      submissionsRef,
      where('studentId', '==', studentId),
      orderBy('submittedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate()
      };
    });
  } catch (error) {
    console.error('Error getting student submissions:', error);
    throw error;
  }
};

/**
 * Get submissions for a quiz event (for teacher review)
 */
export const getEventSubmissions = async (eventId) => {
  try {
    const submissionsRef = collection(db, 'quizSubmissions');
    const q = query(
      submissionsRef,
      where('eventId', '==', eventId),
      orderBy('submittedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate()
      };
    });
  } catch (error) {
    console.error('Error getting event submissions:', error);
    throw error;
  }
};

/**
 * Review and update quiz submission (for short answers)
 */
export const reviewSubmission = async (submissionId, reviewData) => {
  try {
    const submissionRef = doc(db, 'quizSubmissions', submissionId);
    await updateDoc(submissionRef, {
      ...reviewData,
      reviewedAt: Timestamp.now(),
      status: 'reviewed'
    });
    return { success: true };
  } catch (error) {
    console.error('Error reviewing submission:', error);
    throw error;
  }
};

// ============ SCHOOL/CLASS FUNCTIONS ============

/**
 * Get all schools
 */
export const getSchools = async () => {
  try {
    const schoolsRef = collection(db, 'schools');
    const snapshot = await getDocs(schoolsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting schools:', error);
    throw error;
  }
};

/**
 * Get classes for a school
 */
export const getSchoolClasses = async (schoolId) => {
  try {
    const classesRef = collection(db, 'classes');
    const q = query(classesRef, where('schoolId', '==', schoolId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting school classes:', error);
    throw error;
  }
};

/**
 * Get students by class
 */
export const getStudentsByClass = async (schoolId, className) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('role', '==', 'student'),
      where('schoolId', '==', schoolId),
      where('class', '==', className)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting students by class:', error);
    throw error;
  }
};

