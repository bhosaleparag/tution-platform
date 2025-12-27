'use server';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Get quiz with questions
export async function getQuizWithQuestions(quizId) {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    const quizDoc = await getDoc(quizRef);

    if (!quizDoc.exists()) {
      return { success: false, error: 'Quiz not found' };
    }

    const quiz = {
      id: quizDoc.id,
      ...quizDoc.data(),
      createdAt: quizDoc.data().createdAt?.toDate?.().toISOString(),
      updatedAt: quizDoc.data().updatedAt?.toDate?.().toISOString()
    };

    // Get questions
    const questionsQuery = query(
      collection(quizRef, 'questions'),
      orderBy('questionNumber', 'asc')
    );
    
    const questionsSnapshot = await getDocs(questionsQuery);
    const questions = questionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, quiz, questions };
  } catch (error) {
    console.error('Get quiz error:', error);
    return { success: false, error: error.message };
  }
}

// Start quiz attempt
export async function startQuizAttempt(quizId, userId, userName) {
  try {
    // Get quiz details
    const quizRef = doc(db, 'quizzes', quizId);
    const quizDoc = await getDoc(quizRef);

    if (!quizDoc.exists()) {
      return { success: false, error: 'Quiz not found' };
    }

    const quizData = quizDoc.data();

    // Check for existing attempts
    const attemptsQuery = query(
      collection(db, 'quizAttempts'),
      where('quizId', '==', quizId),
      where('studentId', '==', userId),
      orderBy('attemptNumber', 'desc'),
      limit(1)
    );

    const attemptsSnapshot = await getDocs(attemptsQuery);
    const attemptNumber = attemptsSnapshot.empty ? 1 : attemptsSnapshot.docs[0].data().attemptNumber + 1;

    // Create new attempt
    const batch = writeBatch(db);
    const attemptRef = doc(collection(db, 'quizAttempts'));

    batch.set(attemptRef, {
      quizId,
      studentId: userId,
      studentName: userName || 'Student',
      classId: quizData.classId,
      instituteId: quizData.instituteId,
      attemptNumber,
      answers: {},
      score: 0,
      totalMarks: quizData.totalMarks,
      correctCount: 0,
      wrongCount: 0,
      unansweredCount: quizData.questionsCount,
      timeSpent: 0,
      status: 'in-progress',
      startedAt: Timestamp.now(),
      completedAt: null
    });

    await batch.commit();

    return { success: true, attemptId: attemptRef.id };
  } catch (error) {
    console.error('Start quiz attempt error:', error);
    return { success: false, error: error.message };
  }
}

// Submit quiz attempt
export async function submitQuizAttempt(attemptId, quizId, score, correctCount, wrongCount, unansweredCount, totalMarks, timeSpent, userId) {
  try {
    
    // Update attempt
    const attemptRef = doc(db, 'quizAttempts', attemptId);
    const batch = writeBatch(db);

    batch.update(attemptRef, {
      score,
      correctCount,
      wrongCount,
      unansweredCount,
      timeSpent,
      status: 'completed',
      completedAt: Timestamp.now()
    });

    await batch.commit();

    // Get leaderboard (top 5)
    const leaderboardQuery = query(
      collection(db, 'quizAttempts'),
      where('quizId', '==', quizId),
      where('status', '==', 'completed'),
      orderBy('score', 'desc'),
      orderBy('timeSpent', 'asc'),
      limit(5)
    );

    const leaderboardSnapshot = await getDocs(leaderboardQuery);
    const leaderboard = leaderboardSnapshot.docs.map(doc => ({
      studentId: doc.data().studentId,
      studentName: doc.data().studentName,
      score: doc.data().score,
      timeSpent: doc.data().timeSpent,
      isCurrentUser: doc.data().studentId === userId
    }));

    // Calculate rank
    const allAttemptsQuery = query(
      collection(db, 'quizAttempts'),
      where('quizId', '==', quizId),
      where('status', '==', 'completed'),
      orderBy('score', 'desc'),
      orderBy('timeSpent', 'asc')
    );

    const allAttemptsSnapshot = await getDocs(allAttemptsQuery);
    let rank = 1;
    
    for (const doc of allAttemptsSnapshot.docs) {
      if (doc.id === attemptId) {
        break;
      }
      rank++;
    }

    return {
      success: true,
      results: {
        score,
        totalMarks: totalMarks,
        correctCount,
        wrongCount,
        unansweredCount,
        timeSpent,
        rank,
        leaderboard
      }
    };
  } catch (error) {
    console.error('Submit quiz attempt error:', error);
    return { success: false, error: error.message };
  }
}