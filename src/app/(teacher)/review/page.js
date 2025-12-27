'use client';

import { useEffect, useState } from 'react';
import { Clock, Trophy, Target, TrendingUp, Search, Download, Users } from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import useAuth from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { getTeacherQuizzes } from '@/api/firebase/quizzes';
import { getQuizSubmissions } from '@/api/actions/quiz';

export default function TeacherReviewPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  
  // Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [dateRange, setDateRange] = useState('all'); // all, week, month

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    if (selectedQuiz) {
      loadSubmissions(selectedQuiz);
    }
  }, [selectedQuiz]);

  useEffect(() => {
    applyFilters();
  }, [submissions, studentSearch, dateRange]);

  async function loadQuizzes() {
    try {
      const { success, quizzes: quizzesData, error } = await getTeacherQuizzes(user.uid, user.instituteId);
      
      if (!success) {
        toast.error(error || 'Failed to load quizzes');
        return;
      }

      setQuizzes(quizzesData);
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  }

  async function loadSubmissions(quizId) {
    try {
      setLoading(true);
      const { success, submissions: submissionsData, stats: statsData, error } = await getQuizSubmissions(quizId, user.uid);
      
      if (!success) {
        toast.error(error || 'Failed to load submissions');
        return;
      }

      setSubmissions(submissionsData);
      setStats(statsData);
      setFilteredSubmissions(submissionsData);
    } catch (error) {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...submissions];

    // Student name filter
    if (studentSearch.trim()) {
      filtered = filtered.filter(sub =>
        sub.studentName.toLowerCase().includes(studentSearch.toLowerCase())
      );
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = dayjs();
      filtered = filtered.filter(sub => {
        const completedDate = dayjs(sub.completedAt);
        if (dateRange === 'week') {
          return completedDate.isAfter(now.subtract(7, 'days'));
        } else if (dateRange === 'month') {
          return completedDate.isAfter(now.subtract(30, 'days'));
        }
        return true;
      });
    }

    setFilteredSubmissions(filtered);
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  }

  function formatDate(dateString) {
    return dayjs(dateString).format('MMM DD, YYYY HH:mm');
  }

  function getPercentage(score, total) {
    return ((score / total) * 100).toFixed(1);
  }

  async function handleExportCSV() {
    try {
      const currentQuiz = quizzes.find(q => q.id === selectedQuiz);
      if (!currentQuiz) return;

      // Prepare CSV data
      const headers = ['Position', 'Student Name', 'Score', 'Percentage', 'Time Taken', 'Correct', 'Incorrect', 'Attempt', 'Completed'];
      const rows = filteredSubmissions.map((sub, index) => [
        index + 1,
        sub.studentName,
        `${sub.score}/${sub.totalMarks}`,
        `${getPercentage(sub.score, sub.totalMarks)}%`,
        formatTime(sub.timeSpent),
        sub.correctCount,
        sub.wrongCount,
        sub.attemptNumber,
        formatDate(sub.completedAt)
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentQuiz.title.replace(/[^a-z0-9]/gi, '_')}_submissions.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('CSV exported successfully!');
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  }

  const quizOptions = quizzes.map(quiz => ({
    value: quiz.id,
    label: quiz.title
  }));

  if (loading && quizzes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-08 flex items-center justify-center">
        <div className="text-white-90">Loading quizzes...</div>
      </div>
    );
  }

  // No quizzes created yet
  if (quizzes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-08 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Quiz Submissions</h1>
          
          <div className="bg-gray-10 rounded-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-15 mb-6">
              <Trophy className="w-10 h-10 text-gray-60" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No Quizzes Yet</h2>
            <p className="text-white-90 mb-6">
              Create quizzes to start receiving student submissions.
            </p>
            <a
              href="/my-quiz"
              className="inline-block px-6 py-3 bg-purple-60 hover:bg-purple-65 text-white font-semibold rounded-xl transition-colors"
            >
              Create Quiz
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-08 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Quiz Submissions</h1>
          {selectedQuiz && filteredSubmissions.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-purple-60 hover:bg-purple-65 text-white font-semibold rounded-xl transition-colors"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          )}
        </div>

        {/* Quiz Selection */}
        <div className="bg-gray-10 rounded-2xl p-6 mb-6">
          <label className="block text-sm font-medium text-white-90 mb-2">
            Select Quiz to Review
          </label>
          <Select
            value={selectedQuiz}
            onChange={(value) => setSelectedQuiz(value)}
            options={[
              { value: '', label: 'Select a quiz...' },
              ...quizOptions
            ]}
            placeholder="Choose quiz"
          />
        </div>

        {selectedQuiz && (
          <>
            {/* Statistics */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="bg-gray-10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-95 flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-60" />
                    </div>
                    <div>
                      <div className="text-gray-60 text-sm">Total Students</div>
                      <div className="text-2xl font-bold text-white">{stats.totalSubmissions}</div>
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
                      <div className="text-gray-60 text-sm">Highest Score</div>
                      <div className="text-2xl font-bold text-white">{stats.highestScore}%</div>
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

                <div className="bg-gray-10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-95 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-purple-60" />
                    </div>
                    <div>
                      <div className="text-gray-60 text-sm">Pass Rate</div>
                      <div className="text-2xl font-bold text-white">{stats.passRate}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-gray-10 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  type="text"
                  theme="dark"
                  placeholder="Search student name..."
                  startIcon={<Search className="w-5 h-5 text-gray-400" />}
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />

                <Select
                  value={dateRange}
                  onChange={(value) => setDateRange(value)}
                  options={[
                    { value: 'all', label: 'All Time' },
                    { value: 'week', label: 'This Week' },
                    { value: 'month', label: 'This Month' }
                  ]}
                  placeholder="Filter by Date"
                />
              </div>
            </div>

            {/* Submissions Table */}
            {loading ? (
              <div className="bg-gray-10 rounded-2xl p-12 text-center">
                <div className="text-white-90">Loading submissions...</div>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="bg-gray-10 rounded-2xl p-12 text-center">
                <p className="text-white-90">
                  No submissions found. {(studentSearch || dateRange !== 'all') && 'Try adjusting your filters.'}
                </p>
              </div>
            ) : (
              <div className="bg-gray-10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-15">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-40 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-40 uppercase tracking-wider">
                          Student Name
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
                          Attempt
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-40 uppercase tracking-wider">
                          Completed
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-20">
                      {filteredSubmissions.map((submission, index) => {
                        const percentage = getPercentage(submission.score, submission.totalMarks);
                        const isGood = parseFloat(percentage) >= 75;
                        const isAverage = parseFloat(percentage) >= 50 && parseFloat(percentage) < 75;

                        return (
                          <tr key={submission.attemptId} className="hover:bg-gray-15 transition-colors">
                            <td className="px-6 py-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                index === 0 ? 'bg-yellow-500 text-white' :
                                index === 1 ? 'bg-gray-400 text-white' :
                                index === 2 ? 'bg-orange-600 text-white' :
                                'bg-gray-20 text-gray-60'
                              }`}>
                                {index + 1}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-medium text-white">{submission.studentName}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className={`font-bold ${
                                  isGood ? 'text-green-400' : isAverage ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                  {submission.score}/{submission.totalMarks}
                                </span>
                                <span className="text-xs text-gray-60">{percentage}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-white-90">
                                <Clock className="w-4 h-4 text-gray-60" />
                                {formatTime(submission.timeSpent)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                                {submission.correctCount}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium">
                                {submission.wrongCount}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-purple-95 text-purple-60 rounded-lg text-sm font-medium">
                                {submission.attemptNumber}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-60 text-sm">
                              {formatDate(submission.completedAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}