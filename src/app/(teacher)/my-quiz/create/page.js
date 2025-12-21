'use client';

import useAuth from '@/hooks/useAuth';
import QuizFormPage from '@/components/quiz/QuizFormPage';

export default function CreateQuizPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#703bf7] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <QuizFormPage classes={user?.classes || []} subjects={user?.subjects || []} />;
}