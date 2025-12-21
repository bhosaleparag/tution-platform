import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  writeBatch,
  Timestamp 
} from 'firebase/firestore';

export async function createQuiz(quizData, userId, instituteId) {
  try {
    // Validate required fields
    if (!quizData.title || !quizData.classId || !quizData.subjectId || !quizData.questions?.length) {
      throw new Error('Missing required fields');
    }

    // Calculate total marks
    const totalMarks = quizData.questions.reduce((sum, q) => sum + (q.marks || 0), 0);

    const quizRef = doc(collection(db, 'quizzes'));
    const batch = writeBatch(db);

    // Create quiz document
    const quiz = {
      id: quizRef.id,
      instituteId,
      classId: quizData.classId,
      subjectId: quizData.subjectId,
      title: quizData.title,
      description: quizData.description || '',
      createdBy: userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      startAt: quizData.startAt || null,
      endAt: quizData.endAt || null,
      allowRetake: quizData.allowRetake || false,
      timeLimitSeconds: quizData.timeLimitSeconds || null,
      totalMarks,
      questionsCount: quizData.questions.length,
      isPublished: true,
      generatedBy: quizData.generatedBy || 'manual'
    };

    batch.set(quizRef, quiz);

    // Add questions as subcollection
    quizData.questions.forEach((question, index) => {
      const questionRef = doc(collection(quizRef, 'questions'));
      batch.set(questionRef, {
        id: questionRef.id,
        quizId: quizRef.id,
        questionNumber: index + 1,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || '',
        marks: question.marks || 5,
        createdAt: Timestamp.now()
      });
    });

    await batch.commit();

    return { success: true, quizId: quizRef.id };
  } catch (error) {
    console.error('Create quiz error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateQuiz(quizId, quizData, userId) {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    const quizDoc = await getDoc(quizRef);

    if (!quizDoc.exists()) {
      throw new Error('Quiz not found');
    }

    if (quizDoc.data().createdBy !== userId) {
      throw new Error('Not authorized to edit this quiz');
    }

    const totalMarks = quizData.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
    const batch = writeBatch(db);

    // Update quiz document
    batch.update(quizRef, {
      title: quizData.title,
      description: quizData.description || '',
      classId: quizData.classId,
      subjectId: quizData.subjectId,
      timeLimitSeconds: quizData.timeLimitSeconds,
      allowRetake: quizData.allowRetake,
      totalMarks,
      questionsCount: quizData.questions.length,
      updatedAt: Timestamp.now()
    });

    // Delete old questions
    const oldQuestionsSnapshot = await getDocs(collection(quizRef, 'questions'));
    oldQuestionsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Add new questions
    quizData.questions.forEach((question, index) => {
      const questionRef = doc(collection(quizRef, 'questions'));
      batch.set(questionRef, {
        id: questionRef.id,
        quizId: quizId,
        questionNumber: index + 1,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || '',
        marks: question.marks || 5,
        createdAt: Timestamp.now()
      });
    });

    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error('Update quiz error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteQuiz(quizId, userId) {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    const quizDoc = await getDoc(quizRef);

    if (!quizDoc.exists()) {
      throw new Error('Quiz not found');
    }

    if (quizDoc.data().createdBy !== userId) {
      throw new Error('Not authorized to delete this quiz');
    }

    const batch = writeBatch(db);

    // Delete all questions
    const questionsSnapshot = await getDocs(collection(quizRef, 'questions'));
    questionsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete quiz
    batch.delete(quizRef);

    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error('Delete quiz error:', error);
    return { success: false, error: error.message };
  }
}

export async function getTeacherQuizzes(userId, instituteId, filters = {}) {
  try {
    let q = query(
      collection(db, 'quizzes'),
      where('createdBy', '==', userId),
      where('instituteId', '==', instituteId),
      orderBy('createdAt', 'desc')
    );

    if (filters.classId && filters.classId !== 'all') {
      q = query(q, where('classId', '==', filters.classId));
    }

    if (filters.subjectId && filters.subjectId !== 'all') {
      q = query(q, where('subjectId', '==', filters.subjectId));
    }

    const snapshot = await getDocs(q);

    const quizzes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.().toISOString() || new Date().toISOString()
    }));

    return { success: true, quizzes };
  } catch (error) {
    console.error('Get quizzes error:', error);
    return { success: false, error: error.message, quizzes: [] };
  }
}

export async function getQuizWithQuestions(quizId, userId) {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    const quizDoc = await getDoc(quizRef);

    if (!quizDoc.exists()) {
      throw new Error('Quiz not found');
    }

    if (quizDoc.data().createdBy !== userId) {
      throw new Error('Not authorized');
    }

    const questionsSnapshot = await getDocs(
      query(collection(quizRef, 'questions'), orderBy('questionNumber'))
    );

    const questions = questionsSnapshot.docs.map(doc => doc.data());

    return {
      success: true,
      quiz: {
        id: quizDoc.id,
        ...quizDoc.data(),
        createdAt: quizDoc.data().createdAt?.toDate?.().toISOString(),
        updatedAt: quizDoc.data().updatedAt?.toDate?.().toISOString()
      },
      questions
    };
  } catch (error) {
    console.error('Get quiz with questions error:', error);
    return { success: false, error: error.message };
  }
}