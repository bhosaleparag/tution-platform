'use client';

import { useEffect, useState } from 'react';
import { Clock, Trophy, Target, TrendingUp, Search, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import useAuth from '@/hooks/useAuth';
import { getStudentResults } from '@/api/actions/quiz';

export default function StudentResultsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all'); // all, week, month

  useEffect(() => {
    loadResults();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [results, searchQuery, dateRange]);

  async function loadResults() {
    try {
      const { success, results: resultsData, stats: statsData, error } = await getStudentResults(user.uid);
      
      if (!success) {
        toast.error(error || 'Failed to load results');
        return;
      }

      setResults(resultsData);
      setStats(statsData);
      setFilteredResults(resultsData);
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...results];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(result =>
        result.quizTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = dayjs();
      filtered = filtered.filter(result => {
        const completedDate = dayjs(result.completedAt);
        if (dateRange === 'week') {
          return completedDate.isAfter(now.subtract(7, 'days'));
        } else if (dateRange === 'month') {
          return completedDate.isAfter(now.subtract(30, 'days'));
        }
        return true;
      });
    }

    setFilteredResults(filtered);
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  }

  function formatDate(dateString) {
    return dayjs(dateString).format('MMM DD, YYYY');
  }

  function getPercentage(score, total) {
    return ((score / total) * 100).toFixed(1);
  }

  // Group results by subject
  const groupedResults = filteredResults.reduce((acc, result) => {
    const subject = result.subject || 'Other';
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(result);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-08 flex items-center justify-center">
        <div className="text-white-90">Loading results...</div>
      </div>
    );
  }

  // Empty state
  if (!stats || stats.totalQuizzes === 0) {
    return (
      <div className="min-h-screen bg-gray-08 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Quiz Results</h1>
          
          <div className="bg-gray-10 rounded-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-15 mb-6">
              <Trophy className="w-10 h-10 text-gray-60" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No Results Yet</h2>
            <p className="text-white-90 mb-6">
              Complete quizzes to see your performance statistics and track your progress.
            </p>
            <a
              href="/student-dashboard"
              className="inline-block px-6 py-3 bg-purple-60 hover:bg-purple-65 text-white font-semibold rounded-xl transition-colors"
            >
              Browse Quizzes
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-08 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Quiz Results</h1>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-purple-95 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-60" />
              </div>
              <div>
                <div className="text-gray-60 text-sm">Total Quizzes</div>
                <div className="text-2xl font-bold text-white">{stats.totalQuizzes}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-gray-60 text-sm">Average Score</div>
                <div className="text-2xl font-bold text-white">{stats.averageScore}%</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-gray-60 text-sm">Best Score</div>
                <div className="text-2xl font-bold text-white">{stats.bestScore}%</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-gray-60 text-sm">Avg Time</div>
                <div className="text-2xl font-bold text-white">{formatTime(stats.averageTime)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-10 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-60" />
              <input
                type="text"
                placeholder="Search quiz name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-15 text-white pl-12 pr-4 py-3 rounded-xl border border-gray-20 focus:border-purple-60 focus:outline-none"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-60 pointer-events-none" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-gray-15 text-white pl-12 pr-10 py-3 rounded-xl border border-gray-20 focus:border-purple-60 focus:outline-none appearance-none cursor-pointer min-w-[180px]"
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table by Subject */}
        {Object.keys(groupedResults).length === 0 ? (
          <div className="bg-gray-10 rounded-2xl p-12 text-center">
            <p className="text-white-90">
              No results found. {(searchQuery || dateRange !== 'all') && 'Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedResults).map(([subject, subjectResults]) => (
              <div key={subject} className="bg-gray-10 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 bg-gray-15 border-b border-gray-20">
                  <h2 className="text-xl font-bold text-white capitalize">{user?.subjectNames[subject]}</h2>
                  <p className="text-sm text-gray-60">{subjectResults.length} quiz(es)</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-15">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-40 uppercase tracking-wider">
                          Quiz Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-40 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-40 uppercase tracking-wider">
                          Time Taken
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-40 uppercase tracking-wider">
                          Correct
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-40 uppercase tracking-wider">
                          Incorrect
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-40 uppercase tracking-wider">
                          Attempts
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-40 uppercase tracking-wider">
                          Completed
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-20">
                      {subjectResults.map((result) => {
                        const percentage = getPercentage(result.score, result.totalMarks);
                        const isGood = parseFloat(percentage) >= 75;
                        const isAverage = parseFloat(percentage) >= 50 && parseFloat(percentage) < 75;

                        return (
                          <tr key={result.attemptId} className="hover:bg-gray-15 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-white">{result.quizTitle}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className={`font-bold ${
                                  isGood ? 'text-green-400' : isAverage ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                  {result.score}/{result.totalMarks}
                                </span>
                                <span className="text-xs text-gray-60">{percentage}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-white-90">
                                <Clock className="w-4 h-4 text-gray-60" />
                                {formatTime(result.timeSpent)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                                {result.correctCount}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium">
                                {result.wrongCount}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-purple-95 text-purple-60 rounded-lg text-sm font-medium">
                                {result.attemptNumber}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-60 text-sm">
                              {formatDate(result.completedAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}