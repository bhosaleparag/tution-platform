'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, CheckCircle, XCircle, Trophy, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { startQuizAttempt, submitQuizAttempt } from '@/api/actions/quiz';
import useAuth from '@/hooks/useAuth';
import { getQuizWithQuestions } from '@/api/firebase/quizzes';

dayjs.extend(duration);

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [stage, setStage] = useState('preview'); // preview | playing | results
  const [attemptId, setAttemptId] = useState(null);
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(null);
  
  // Results state
  const [results, setResults] = useState(null);

  // Load quiz data
  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  // Timer logic
  useEffect(() => {
    if (stage !== 'playing' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        
        // Warning at 1 minute
        if (prev === 60) {
          toast.warning('⏰ Only 1 minute remaining!', {
            duration: 5000
          });
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, timeLeft]);

  async function loadQuiz() {
    try {
      const { success, quiz: quizData, questions: questionsData, error } = await getQuizWithQuestions(quizId);
      
      if (!success) {
        toast.error(error || 'Failed to load quiz');
        router.push('/student/quizzes');
        return;
      }

      setQuiz(quizData);
      setQuestions(questionsData);
    } catch (error) {
      toast.error('Failed to load quiz');
      router.push('/student/quizzes');
    } finally {
      setLoading(false);
    }
  }

  async function handleStartQuiz() {
    try {
      const { success, attemptId: newAttemptId, error } = await startQuizAttempt(quizId, user.uid, user.name);
      
      if (!success) {
        toast.error(error || 'Failed to start quiz');
        return;
      }

      setAttemptId(newAttemptId);
      setTimeLeft(quiz.timeLimitSeconds || 3600);
      setStartTime(Date.now());
      setStage('playing');
      toast.success('Quiz started! Good luck!');
    } catch (error) {
      toast.error('Failed to start quiz');
    }
  }

  function handleAnswerSelect(questionId, option) {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  }

  function handleNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  }

  function handlePrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }

  async function handleAutoSubmit() {
    toast.info('⏰ Time\'s up! Submitting quiz...');
    await handleSubmitQuiz(true);
  }

  async function handleSubmitQuiz(autoSubmit = false) {
    if (!autoSubmit) {
      const unanswered = questions.length - Object.keys(answers).length;
      if (unanswered > 0) {
        const confirm = window.confirm(
          `You have ${unanswered} unanswered questions. Submit anyway?`
        );
        if (!confirm) return;
      }
    }

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      // Calculate score
      let score = 0;
      let correctCount = 0;
      let wrongCount = 0;
  
      questions.forEach(question => {
        const studentAnswer = answers[question.id];
        if (studentAnswer === question.correctAnswer) {
          score += question.marks;
          correctCount++;
        } else if (studentAnswer) {
          wrongCount++;
        }
      });
      const unansweredCount = questions.length - correctCount - wrongCount;

      const { success, results: resultData, error } = await submitQuizAttempt(
        attemptId, quizId, score, correctCount, wrongCount, 
        unansweredCount, quiz.totalMarks, timeSpent, user.uid
      );
      if (!success) {
        toast.error(error || 'Failed to submit quiz');
        return;
      }

      setResults(resultData);
      setStage('results');
      toast.success('Quiz submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit quiz');
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-08 flex items-center justify-center">
        <div className="text-white-90">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-08 flex items-center justify-center">
        <div className="text-white-90">Quiz not found</div>
      </div>
    );
  }

  // Preview Stage
  if (stage === 'preview') {
    return (
      <div className="min-h-screen bg-gray-08 p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white-90 hover:text-white mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="bg-gray-10 rounded-2xl p-8 shadow-lg">
            <h1 className="text-3xl font-bold text-white mb-4">{quiz.title}</h1>
            
            {quiz.description && (
              <p className="text-white-90 mb-6">{quiz.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-15 rounded-xl p-4">
                <div className="text-gray-60 text-sm mb-1">Total Questions</div>
                <div className="text-2xl font-bold text-white">{quiz.questionsCount}</div>
              </div>
              
              <div className="bg-gray-15 rounded-xl p-4">
                <div className="text-gray-60 text-sm mb-1">Total Marks</div>
                <div className="text-2xl font-bold text-white">{quiz.totalMarks}</div>
              </div>
              
              <div className="bg-gray-15 rounded-xl p-4">
                <div className="text-gray-60 text-sm mb-1">Time Limit</div>
                <div className="text-2xl font-bold text-white">
                  {formatTime(quiz.timeLimitSeconds)}
                </div>
              </div>
              
              <div className="bg-gray-15 rounded-xl p-4">
                <div className="text-gray-60 text-sm mb-1">Subject</div>
                <div className="text-xl font-semibold text-white capitalize">{quiz.subjectId}</div>
              </div>
            </div>

            <div className="bg-gray-10 border border-gray-15 rounded-xl p-4 mb-8">
              <h3 className="font-semibold text-purple-60 mb-2">Instructions:</h3>
              <ul className="text-sm text-gray-40 space-y-1">
                <li>• You can navigate between questions using Next/Previous buttons</li>
                <li>• All questions must be answered before submission</li>
                <li>• Timer will start once you begin the quiz</li>
                <li>• Quiz will auto-submit when time runs out</li>
                {quiz.allowRetake && <li>• You can retake this quiz (only latest score counts)</li>}
              </ul>
            </div>

            <button
              onClick={handleStartQuiz}
              className="w-full bg-purple-60 hover:bg-purple-65 text-white font-semibold py-4 rounded-xl transition-colors"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing Stage
  if (stage === 'playing') {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    
    return (
      <div className="min-h-screen bg-gray-08 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gray-10 rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">{quiz.title}</h2>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeLeft < 60 ? 'bg-red-500/20 text-red-400' : 'bg-gray-15 text-white-90'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-15 rounded-full h-2">
              <div
                className="bg-purple-60 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-gray-10 rounded-2xl p-8 shadow-lg mb-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-60">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="bg-gray-15 text-purple-60 px-3 py-1 rounded-lg text-sm font-semibold">
                {question.marks} marks
              </span>
            </div>

            <h3 className="text-xl font-semibold text-white mb-6">{question.question}</h3>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const optionKey = String.fromCharCode(65 + index); // A, B, C, D
                const isSelected = answers[question.id] === option;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(question.id, option)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-purple-60 bg-gray-15'
                        : 'border-gray-20 bg-gray-15 hover:border-gray-30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-purple-60 bg-purple-60'
                          : 'border-gray-40'
                      }`}>
                        {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                      <span className={`font-medium ${
                        isSelected ? 'text-purple-60' : 'text-white-90'
                      }`}>
                        {optionKey}. {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-xl bg-gray-15 text-white font-semibold hover:bg-gray-20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="text-gray-60 text-sm">
              {Object.keys(answers).length} / {questions.length} answered
            </div>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={() => handleSubmitQuiz(false)}
                className="px-6 py-3 rounded-xl bg-purple-60 text-white font-semibold hover:bg-purple-65 transition-colors"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-purple-60 text-white font-semibold hover:bg-purple-65 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Results Stage
  if (stage === 'results') {
    const percentage = (results.score / results.totalMarks * 100).toFixed(1);
    const timeSpentFormatted = formatTime(results.timeSpent);

    return (
      <div className="min-h-screen bg-gray-08 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-10 rounded-2xl p-8 shadow-lg mb-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-15 mb-4">
                <Trophy className="w-10 h-10 text-purple-60" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h1>
              <p className="text-white-90">{quiz.title}</p>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-15 rounded-xl p-4 text-center">
                <div className="text-gray-60 text-sm mb-1">Score</div>
                <div className="text-2xl font-bold text-white">
                  {results.score}/{results.totalMarks}
                </div>
                <div className="text-purple-60 text-sm font-semibold">{percentage}%</div>
              </div>

              <div className="bg-gray-15 rounded-xl p-4 text-center">
                <div className="text-gray-60 text-sm mb-1">Correct</div>
                <div className="text-2xl font-bold text-green-400 flex items-center justify-center gap-1">
                  <CheckCircle className="w-5 h-5" />
                  {results.correctCount}
                </div>
              </div>

              <div className="bg-gray-15 rounded-xl p-4 text-center">
                <div className="text-gray-60 text-sm mb-1">Wrong</div>
                <div className="text-2xl font-bold text-red-400 flex items-center justify-center gap-1">
                  <XCircle className="w-5 h-5" />
                  {results.wrongCount}
                </div>
              </div>

              <div className="bg-gray-15 rounded-xl p-4 text-center">
                <div className="text-gray-60 text-sm mb-1">Time</div>
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                  <Clock className="w-5 h-5" />
                  {timeSpentFormatted}
                </div>
              </div>
            </div>

            {/* Rank Display */}
            {results.rank && (
              <div className="bg-gray-10 border border-purple-60 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <div className="text-purple-60 text-sm font-semibold mb-1">Your Rank</div>
                  <div className="text-4xl font-bold text-purple-60">#{results.rank}</div>
                </div>
              </div>
            )}

            {/* Top 5 Leaderboard */}
            {results.leaderboard && results.leaderboard.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">🏆 Top 5 Students</h3>
                <div className="space-y-2">
                  {results.leaderboard.map((entry, index) => (
                    <div
                      key={`${entry.studentId}-${index}`}
                      className={`flex items-center justify-between p-4 rounded-xl ${
                        entry.isCurrentUser
                          ? 'bg-gray-15'
                          : 'bg-gray-15'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-gray-20 text-gray-60'
                        }`}>
                          {index + 1}
                        </div>
                        <span className={`font-medium ${
                          entry.isCurrentUser ? 'text-purple-60' : 'text-white'
                        }`}>
                          {entry.studentName}
                          {entry.isCurrentUser && ' (You)'}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">{entry.score}/{results.totalMarks}</div>
                        <div className="text-xs text-gray-60">{formatTime(entry.timeSpent)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/student-dashboard')}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-15 text-white font-semibold hover:bg-gray-20 transition-colors"
              >
                Back to Quizzes
              </button>
              {quiz.allowRetake && (
                <button
                  onClick={() => {
                    setStage('preview');
                    setAnswers({});
                    setCurrentQuestion(0);
                    setResults(null);
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-purple-60 text-white font-semibold hover:bg-purple-65 transition-colors"
                >
                  Retake Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}