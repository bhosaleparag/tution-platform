"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Clock, CheckCircle2, Play, Calendar } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { getStudentQuizEvents } from '@/lib/db/quizHelpers';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { SoundButton } from '@/components/ui/SoundButton';

export default function StudentDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState({ upcoming: [], active: [], completed: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      loadQuizEvents();
    }
  }, [user]);

  const loadQuizEvents = async () => {
    try {
      setLoading(true);
      const studentEvents = await getStudentQuizEvents(
        user.uid,
        user.class,
        user.division
      );
      setEvents(studentEvents);
    } catch (error) {
      console.error('Error loading quiz events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeQuiz = (eventId) => {
    router.push(`/student/quizzes/${eventId}`);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading quizzes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-08 text-white-99 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white-99">
            Welcome back, {user?.username || 'Student'}! 👋
          </h1>
          <p className="text-gray-60">
            {user?.class && `Class: ${user.class}`}
            {user?.division && ` • Division: ${user.division}`}
          </p>
        </div>

        {/* Active Quizzes */}
        {events.active.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2">
              <Play className="w-6 h-6 text-green-400" />
              Active Quizzes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.active.map((event) => (
                <DashboardCard key={event.id} title={event.quizTitle || 'Quiz'}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Active Now</span>
                    </div>
                    <p className="text-sm text-gray-60">
                      Ends: {formatDate(event.endTime)}
                    </p>
                    <SoundButton
                      onClick={() => handleTakeQuiz(event.id)}
                      className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                    >
                      Take Quiz
                    </SoundButton>
                  </div>
                </DashboardCard>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Quizzes */}
        {events.upcoming.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-400" />
              Upcoming Quizzes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.upcoming.map((event) => (
                <DashboardCard key={event.id} title={event.quizTitle || 'Quiz'}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Scheduled</span>
                    </div>
                    <p className="text-xs text-gray-60">
                      Starts: {formatDate(event.startTime)}
                    </p>
                    <p className="text-xs text-gray-60">
                      Ends: {formatDate(event.endTime)}
                    </p>
                    <div className="text-sm text-gray-50">
                      Quiz will be available at the start time
                    </div>
                  </div>
                </DashboardCard>
              ))}
            </div>
          </div>
        )}

        {/* Completed Quizzes */}
        {events.completed.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-gray-50" />
              Completed Quizzes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.completed.map((event) => (
                <DashboardCard key={event.id} title={event.quizTitle || 'Quiz'}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-50">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                    <p className="text-xs text-gray-60">
                      Ended: {formatDate(event.endTime)}
                    </p>
                    <SoundButton
                      onClick={() => router.push(`/student/results?eventId=${event.id}`)}
                      className="w-full py-2 bg-gray-20 hover:bg-gray-30 text-white rounded-lg transition-all"
                    >
                      View Results
                    </SoundButton>
                  </div>
                </DashboardCard>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {events.active.length === 0 && events.upcoming.length === 0 && events.completed.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-gray-60" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Quizzes Assigned</h3>
            <p className="text-gray-60">
              Your teacher will assign quizzes to you. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

