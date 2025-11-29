import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// Revalidate daily quiz every 2 hours (7200 seconds)
export const revalidate = 7200;
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Get today's date range
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Query Firestore for daily quizzes
    const quizzesRef = collection(db, 'quizzes');
    const q = query(
      quizzesRef,
      where('isDaily', '==', true),
      where('createdAt', '>=', todayStart),
      where('createdAt', '<=', todayEnd),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    
    let quizData = null;
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      quizData = { id: doc.id, ...doc.data() };
    } else {
      // If no daily quiz for today, get the most recent daily quiz
      const fallbackQuery = query(
        quizzesRef,
        where('isDaily', '==', true),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const fallbackSnapshot = await getDocs(fallbackQuery);
      if (!fallbackSnapshot.empty) {
        const doc = fallbackSnapshot.docs[0];
        quizData = { id: doc.id, ...doc.data() };
      }
    }

    if (!quizData) {
      return NextResponse.json({ error: "No daily quiz found." }, { status: 404 });
    }
    
    // Check if user has completed this quiz
    const progressRef = doc(db, 'userProgress', userId);
    const progressSnap = await getDoc(progressRef);
    
    let isCompleted = false;
    if (progressSnap.exists()) {
      const progressData = progressSnap.data();
      isCompleted = progressData.challenges?.[quizData.id]?.completed || false;
    }
    
    return NextResponse.json({
      ...quizData,
      completed: isCompleted
    });

  } catch (error) {
    console.error("Error fetching daily quiz:", error);
    return NextResponse.json({ error: "Failed to fetch daily quiz" }, { status: 500 });
  }
}
