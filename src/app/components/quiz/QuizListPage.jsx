'use client';
import { useState, useEffect } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import QuizCard from './QuizCard';
import QuizFilters from './QuizFilters';
import DeleteModal from './DeleteModal';
import { deleteQuiz, getTeacherQuizzes } from '@/api/firebase/quizzes';
import useAuth from '@/hooks/useAuth';

export default function QuizListPage({ classes, subjects }) {
  const router = useRouter();
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  // Fetch quizzes
  useEffect(() => {
    loadQuizzes();
  }, [user, filterClass, filterSubject]);

  const loadQuizzes = async () => {
    if (!user) return;
    
    setLoading(true);
    const { success, quizzes: data } = await getTeacherQuizzes(
      user.uid, 
      user.instituteId,
      {
        classId: filterClass,
        subjectId: filterSubject
      }
    );
    
    if (success) {
      setQuizzes(data);
    }
    setLoading(false);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!quizToDelete) return;
    
    setDeleteLoading(true);
    const { success } = await deleteQuiz(quizToDelete.id, user.uid);
    
    if (success) {
      setQuizzes(quizzes.filter(q => q.id !== quizToDelete.id));
      setShowDeleteModal(false);
      setQuizToDelete(null);
    }
    setDeleteLoading(false);
  };

  // Filter quizzes
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: quizzes.length,
    totalQuestions: quizzes.reduce((sum, q) => sum + q.questionsCount, 0),
    quizCreated: quizzes.length
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Quizzes</h1>
            <p className="text-gray-400">Manage and create quizzes for your students</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="gradient"
              icon={<Sparkles className="w-5 h-5" />}
              onClick={() => router.push('/my-quiz/ai-generate')}
            >
              Generate with AI
            </Button>
            <Button
              variant="primary"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => router.push('/my-quiz/create')}
            >
              Create Quiz
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a1a1a] rounded-2xl p-6">
            <div className="text-gray-400 text-sm mb-2">Total Quizzes</div>
            <div className="text-3xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-[#1a1a1a] rounded-2xl p-6">
            <div className="text-gray-400 text-sm mb-2">Total Questions</div>
            <div className="text-3xl font-bold">{stats.totalQuestions}</div>
          </div>
          <div className="bg-[#1a1a1a] rounded-2xl p-6">
            <div className="text-gray-400 text-sm mb-2">Quiz Created</div>
            <div className="text-3xl font-bold">{stats.quizCreated}</div>
          </div>
        </div>

        {/* Filters */}
        <QuizFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterClass={filterClass}
          setFilterClass={setFilterClass}
          filterSubject={filterSubject}
          setFilterSubject={setFilterSubject}
          classes={classes}
          subjects={subjects}
        />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 text-gray-400">
            <div className="inline-block w-8 h-8 border-4 border-[#703bf7] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading quizzes...</p>
          </div>
        )}

        {/* Quiz Grid */}
        {!loading && filteredQuizzes.length > 0 && (
          <div className="grid grid-cols-3 gap-6">
            {filteredQuizzes.map(quiz => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                class_name={classes.find(c => c.id === quiz.classId)?.title || ''}
                onEdit={(quiz) => router.push(`/my-quiz/edit/${quiz.id}`)}
                onDelete={(quiz) => {
                  setQuizToDelete(quiz);
                  setShowDeleteModal(true);
                }}
                onShare={()=>{}}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredQuizzes.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No quizzes found</p>
            <p className="text-sm mt-2">
              {searchTerm ? 'Try adjusting your search' : 'Create your first quiz to get started'}
            </p>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <DeleteModal
            quiz={quizToDelete}
            onConfirm={handleDelete}
            onCancel={() => {
              setShowDeleteModal(false);
              setQuizToDelete(null);
            }}
            loading={deleteLoading}
          />
        )}
      </div>
    </div>
  );
}