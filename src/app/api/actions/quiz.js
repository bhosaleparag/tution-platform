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

export async function getStudentResults(userId) {
  try {
    // Get all attempts for this student
    const attemptsQuery = query(
      collection(db, 'quizAttempts'),
      where('studentId', '==', userId),
      where('status', '==', 'completed'),
      orderBy('completedAt', 'desc')
    );

    const attemptsSnapshot = await getDocs(attemptsQuery);

    if (attemptsSnapshot.empty) {
      return { 
        success: true, 
        results: [], 
        stats: {
          totalQuizzes: 0,
          averageScore: 0,
          bestScore: 0,
          averageTime: 0
        }
      };
    }

    // Group attempts by quizId to get only the latest attempt
    const latestAttempts = new Map();
    
    for (const doc of attemptsSnapshot.docs) {
      const data = doc.data();
      const quizId = data.quizId;
      
      if (!latestAttempts.has(quizId)) {
        latestAttempts.set(quizId, {
          attemptId: doc.id,
          ...data
        });
      } else {
        // Keep the one with higher attempt number
        const existing = latestAttempts.get(quizId);
        if (data.attemptNumber > existing.attemptNumber) {
          latestAttempts.set(quizId, {
            attemptId: doc.id,
            ...data
          });
        }
      }
    }

    // Fetch quiz details for each attempt
    const results = [];
    let totalScore = 0;
    let totalPossible = 0;
    let totalTime = 0;
    let bestPercentage = 0;

    for (const [quizId, attempt] of latestAttempts.entries()) {
      try {
        const quizRef = doc(db, 'quizzes', quizId);
        const quizDoc = await getDoc(quizRef);

        if (quizDoc.exists()) {
          const quizData = quizDoc.data();
          const percentage = (attempt.score / attempt.totalMarks) * 100;

          results.push({
            attemptId: attempt.attemptId,
            quizId,
            quizTitle: quizData.title,
            subject: quizData.subjectId,
            score: attempt.score,
            totalMarks: attempt.totalMarks,
            correctCount: attempt.correctCount,
            wrongCount: attempt.wrongCount,
            timeSpent: attempt.timeSpent,
            attemptNumber: attempt.attemptNumber,
            completedAt: attempt.completedAt?.toDate?.().toISOString() || new Date().toISOString()
          });

          totalScore += attempt.score;
          totalPossible += attempt.totalMarks;
          totalTime += attempt.timeSpent;
          bestPercentage = Math.max(bestPercentage, percentage);
        }
      } catch (error) {
        console.error(`Error fetching quiz ${quizId}:`, error);
      }
    }

    // Calculate statistics
    const averageScore = totalPossible > 0 ? ((totalScore / totalPossible) * 100).toFixed(1) : 0;
    const averageTime = results.length > 0 ? Math.floor(totalTime / results.length) : 0;

    const stats = {
      totalQuizzes: results.length,
      averageScore: parseFloat(averageScore),
      bestScore: bestPercentage.toFixed(1),
      averageTime
    };

    return { 
      success: true, 
      results,
      stats
    };
  } catch (error) {
    console.error('Get student results error:', error);
    return { 
      success: false, 
      error: error.message,
      results: [],
      stats: null
    };
  }
}

// Get quiz submissions with statistics
export async function getQuizSubmissions(quizId, userId) {
  try {
    // Verify quiz ownership
    const quizRef = doc(db, 'quizzes', quizId);
    const quizDoc = await getDoc(quizRef);

    if (!quizDoc.exists()) {
      return { success: false, error: 'Quiz not found' };
    }

    if (quizDoc.data().createdBy !== userId) {
      return { success: false, error: 'Not authorized to view submissions' };
    }

    const quizData = quizDoc.data();

    // Get all completed attempts for this quiz
    const attemptsQuery = query(
      collection(db, 'quizAttempts'),
      where('quizId', '==', quizId),
      where('status', '==', 'completed'),
      orderBy('score', 'desc'),
      orderBy('timeSpent', 'asc')
    );

    const attemptsSnapshot = await getDocs(attemptsQuery);

    if (attemptsSnapshot.empty) {
      return { 
        success: true, 
        submissions: [], 
        stats: {
          totalSubmissions: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          averageTime: 0,
          passRate: 0
        }
      };
    }

    // Group by studentId to get only latest attempt per student
    const latestAttempts = new Map();
    
    for (const doc of attemptsSnapshot.docs) {
      const data = doc.data();
      const studentId = data.studentId;
      
      if (!latestAttempts.has(studentId)) {
        latestAttempts.set(studentId, {
          attemptId: doc.id,
          ...data
        });
      } else {
        // Keep the one with higher attempt number
        const existing = latestAttempts.get(studentId);
        if (data.attemptNumber > existing.attemptNumber) {
          latestAttempts.set(studentId, {
            attemptId: doc.id,
            ...data
          });
        }
      }
    }

    // Convert to array and sort by score desc, then time asc
    const submissions = Array.from(latestAttempts.values()).sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.timeSpent - b.timeSpent;
    });

    // Format submissions
    const formattedSubmissions = submissions.map(attempt => ({
      attemptId: attempt.attemptId,
      quizId: attempt.quizId,
      studentId: attempt.studentId,
      studentName: attempt.studentName,
      classId: attempt.classId,
      subject: quizData.subjectId,
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      correctCount: attempt.correctCount,
      wrongCount: attempt.wrongCount,
      timeSpent: attempt.timeSpent,
      attemptNumber: attempt.attemptNumber,
      completedAt: attempt.completedAt?.toDate?.().toISOString() || new Date().toISOString()
    }));

    // Calculate statistics
    const totalScore = submissions.reduce((sum, s) => sum + s.score, 0);
    const totalPossible = submissions.reduce((sum, s) => sum + s.totalMarks, 0);
    const totalTime = submissions.reduce((sum, s) => sum + s.timeSpent, 0);
    
    const scores = submissions.map(s => (s.score / s.totalMarks) * 100);
    const passCount = scores.filter(score => score >= 50).length; // 50% as pass threshold

    const stats = {
      totalSubmissions: submissions.length,
      averageScore: totalPossible > 0 ? ((totalScore / totalPossible) * 100).toFixed(1) : 0,
      highestScore: scores.length > 0 ? Math.max(...scores).toFixed(1) : 0,
      lowestScore: scores.length > 0 ? Math.min(...scores).toFixed(1) : 0,
      averageTime: submissions.length > 0 ? Math.floor(totalTime / submissions.length) : 0,
      passRate: submissions.length > 0 ? ((passCount / submissions.length) * 100).toFixed(1) : 0
    };

    return { 
      success: true, 
      submissions: formattedSubmissions,
      stats
    };
  } catch (error) {
    console.error('Get quiz submissions error:', error);
    return { 
      success: false, 
      error: error.message,
      submissions: [],
      stats: null
    };
  }
}