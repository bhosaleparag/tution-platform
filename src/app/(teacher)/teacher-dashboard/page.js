"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, PlusCircle, Calendar, CheckCircle2 } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { getTeacherQuizzes, getTeacherQuizEvents } from '@/lib/db/quizHelpers';
import DashboardCard from '@/components/dashboard/DashboardCard';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [quizzesData, eventsData] = await Promise.all([
        getTeacherQuizzes(user.uid),
        getTeacherQuizEvents(user.uid)
      ]);
      setQuizzes(quizzesData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-08 text-white-99 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white-99">
            Teacher Dashboard
          </h1>
          <p className="text-gray-60">Manage your quizzes and events</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => router.push('/teacher/create-quiz')}
            className="bg-gradient-to-br from-purple-60 to-purple-70 hover:from-purple-70 hover:to-purple-80 p-6 rounded-xl border border-purple-60/30 transition-all"
          >
            <PlusCircle className="w-8 h-8 mb-2" />
            <div className="text-lg font-semibold">Create Quiz</div>
            <div className="text-sm text-gray-50">Create a new quiz</div>
          </button>

          <button
            onClick={() => router.push('/teacher/quizzes')}
            className="bg-gray-15 border border-gray-20 hover:border-purple-60/30 p-6 rounded-xl transition-all"
          >
            <BookOpen className="w-8 h-8 mb-2" />
            <div className="text-lg font-semibold">My Quizzes</div>
            <div className="text-sm text-gray-60">{quizzes.length} quizzes</div>
          </button>

          <button
            onClick={() => router.push('/teacher/events')}
            className="bg-gray-15 border border-gray-20 hover:border-purple-60/30 p-6 rounded-xl transition-all"
          >
            <Calendar className="w-8 h-8 mb-2" />
            <div className="text-lg font-semibold">Quiz Events</div>
            <div className="text-sm text-gray-60">{events.length} events</div>
          </button>

          <button
            onClick={() => router.push('/teacher/review')}
            className="bg-gray-15 border border-gray-20 hover:border-purple-60/30 p-6 rounded-xl transition-all"
          >
            <CheckCircle2 className="w-8 h-8 mb-2" />
            <div className="text-lg font-semibold">Review</div>
            <div className="text-sm text-gray-60">Review submissions</div>
          </button>
        </div>

        {/* Recent Quizzes */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Recent Quizzes</h2>
          {quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.slice(0, 6).map((quiz) => (
                <DashboardCard key={quiz.id} title={quiz.title}>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-60 line-clamp-2">{quiz.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-50">
                      <span>{quiz.questions?.length || 0} questions</span>
                      <span>{new Date(quiz.createdAt?.toDate?.() || quiz.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => router.push(`/teacher/quizzes/${quiz.id}`)}
                      className="w-full py-2 bg-purple-60 hover:bg-purple-70 text-white rounded-lg transition-all"
                    >
                      View Quiz
                    </button>
                  </div>
                </DashboardCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-15 border border-gray-20 rounded-xl">
              <BookOpen className="w-16 h-16 text-gray-60 mx-auto mb-4" />
              <p className="text-gray-60">No quizzes yet. Create your first quiz!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

