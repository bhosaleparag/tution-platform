'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import QuestionForm from './QuestionForm';
import { Plus } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { createQuiz, updateQuiz, getQuizWithQuestions } from '@/api/firebase/quizzes';
import Checkbox from '../ui/Checkbox';
import { toast } from 'sonner';

export default function QuizFormPage({ quizId, classes, subjects }) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(!!quizId);
  const [form, setForm] = useState({
    title: '',
    description: '',
    classId: '',
    subjectId: '',
    timeLimitSeconds: 1800,
    allowRetake: false,
    questions: []
  });

  useEffect(() => {
    const aiQuizData = sessionStorage.getItem('aiQuizData');
    if (aiQuizData && !quizId) {
      const data = JSON.parse(aiQuizData);
      setForm(prev => ({
        ...prev,
        title: data.title,
        classId: data.classId,
        questions: data.questions
      }));
      sessionStorage.removeItem('aiQuizData');
    }
  }, []);

  // Load quiz for editing
  useEffect(() => {
    if (quizId) {
      loadQuiz();
    }
  }, [quizId]);

  const loadQuiz = async () => {
    setFetchLoading(true);
    const { success, quiz, questions } = await getQuizWithQuestions(quizId, user.uid);
    
    if (success) {
      setForm({
        title: quiz.title,
        description: quiz.description,
        classId: quiz.classId,
        subjectId: quiz.subjectId,
        timeLimitSeconds: quiz.timeLimitSeconds,
        allowRetake: quiz.allowRetake,
        questions: questions || []
      });
    }
    setFetchLoading(false);
  };

  // Handle form field updates
  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Add new question
  const addQuestion = () => {
    setForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: Date.now().toString(),
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          explanation: '',
          marks: 5
        }
      ]
    }));
  };

  // Update question
  const updateQuestion = (index, updates) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, idx) =>
        idx === index ? { ...q, ...updates } : q
      )
    }));
  };

  // Remove question
  const removeQuestion = (index) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, idx) => idx !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    const quizData = {
      ...form,
      generatedBy: 'manual'
    };

    let result;
    if (quizId) {
      result = await updateQuiz(quizId, quizData, user.uid);
    } else {
      result = await createQuiz(quizData, user.uid, user.instituteId);
    }

    setLoading(false);

    if (result.success) {
      toast.success('Successfully save quiz');
      router.push('/my-quiz');
    } else {
      toast.error(result.error || 'Failed to save quiz');
    }
  };

  // Validate form
  const validateForm = () => {
    if (!form.title || !form.classId || !form.subjectId) {
      toast.warning('Please fill in all required fields');
      return false;
    }

    if (form.questions.length === 0) {
      toast.warning('Please add at least one question');
      return false;
    }

    const hasInvalidQuestion = form.questions.some(q => 
      !q.question || !q.correctAnswer || q.options.some(o => !o)
    );

    if (hasInvalidQuestion) {
      toast.warning('Please complete all questions with valid options and correct answers');
      return false;
    }

    return true;
  };

  // Calculate stats
  const totalMarks = form.questions.reduce((sum, q) => sum + (q.marks || 0), 0);

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#703bf7] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          ← Back to Quizzes
        </button>

        <div className="bg-[#1a1a1a] rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">
            {quizId ? 'Edit Quiz' : 'Create New Quiz'}
          </h2>

          {/* Basic Information */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2">
                Quiz Title <span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                theme="dark"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g., Mathematics - Algebra Quiz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Brief description of the quiz"
                rows="3"
                className="w-full bg-[#262626] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#703bf7] text-white placeholder:text-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                value={form.classId}
                onChange={(value) => updateField('classId', value)}
                label={<>Class <span className="text-red-400">*</span></>}
                options={[
                  { value: '', label: 'Select Class' },
                  ...classes.map(c => ({ value: c.id, label: c.title }))
                ]}
                placeholder="Select Class"
              />

              <Select
                value={form.subjectId}
                onChange={(value) => updateField('subjectId', value)}
                label={<>Subject <span className="text-red-400">*</span></>}
                options={[
                  { value: '', label: 'Select Subject' },
                  ...subjects.map(s => ({ value: s.id, label: s.name }))
                ]}
                placeholder="Select Subject"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                theme="dark"
                label="Time Limit (minutes)"
                value={Math.floor(form.timeLimitSeconds / 60)}
                onChange={(e) => updateField('timeLimitSeconds', parseInt(e.target.value) * 60)}
                min="5"
                max="180"
              />

              <Checkbox
                id="allowRetake"
                label="Allow students to retake quiz"
                checked={form.allowRetake}
                onChange={(e) => updateField('allowRetake', e.target.checked)}
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Questions ({form.questions.length})</h3>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={addQuestion}
              >
                Add Question
              </Button>
            </div>

            <div className="space-y-6">
              {form.questions.map((question, index) => (
                <QuestionForm
                  key={question.id}
                  question={question}
                  index={index}
                  onUpdate={(updates) => updateQuestion(index, updates)}
                  onRemove={() => removeQuestion(index)}
                />
              ))}

              {form.questions.length === 0 && (
                <div className="text-center py-12 text-gray-400 bg-[#262626] rounded-xl">
                  <p className="text-lg mb-2">No questions added yet</p>
                  <p className="text-sm">Click "Add Question" to start creating your quiz</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {form.questions.length > 0 && (
            <div className="bg-[#262626] rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Quiz Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Total Questions</div>
                  <div className="text-2xl font-bold">{form.questions.length}</div>
                </div>
                <div>
                  <div className="text-gray-400">Total Marks</div>
                  <div className="text-2xl font-bold">{totalMarks}</div>
                </div>
                <div>
                  <div className="text-gray-400">Time Limit</div>
                  <div className="text-2xl font-bold">{Math.floor(form.timeLimitSeconds / 60)} min</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
              disabled={loading}
              className="flex-1"
            >
              {quizId ? 'Update Quiz' : 'Create Quiz'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}