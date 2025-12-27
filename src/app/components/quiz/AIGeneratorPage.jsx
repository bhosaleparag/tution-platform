'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Check } from 'lucide-react';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DateInput from '../ui/DateInput';
import dayjs from 'dayjs';

export default function AIGeneratorPage({ classes, subjects }) {
  const router = useRouter();
  
  const [form, setForm] = useState({
    classLevel: '',
    subject: '',
    topic: '',
    numQuestions: 10,
    difficulty: 'medium',
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().add(7, 'days').format('YYYY-MM-DD')
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [error, setError] = useState(null);

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const generateQuiz = async () => {
    setIsGenerating(true);
    setError(null);

    const { classLevel, subject, topic, numQuestions, difficulty } = form;

    const systemPrompt = `You are a world-class academic quiz generator. Your task is to generate a multiple-choice quiz based on the user's specified parameters. Ensure the questions are relevant to the topic and the difficulty level. Provide exactly ${numQuestions} questions. Do not include any introductory or concluding text, only the raw JSON object.`;

    const userQuery = `Generate a quiz for:
      Class: ${classLevel}
      Subject: ${subject}
      Topic: ${topic}
      Number of Questions: ${numQuestions}
      Difficulty Level: ${difficulty}`;

    const responseSchema = {
      type: "OBJECT",
      properties: {
        quiz: {
          type: "ARRAY",
          description: `An array of exactly ${numQuestions} quiz question objects.`,
          items: {
            type: "OBJECT",
            properties: {
              id: { type: "INTEGER", description: "The sequential question number, starting from 1." },
              question: { type: "STRING", description: "The quiz question text." },
              options: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "An array of 4 multiple-choice options."
              },
              correct_answer: { type: "STRING", description: "The exact text of the correct option from the 'options' array." },
              explanation: { type: "STRING", description: "A concise explanation for the correct answer." }
            },
            propertyOrdering: ["id", "question", "options", "correct_answer", "explanation"]
          }
        }
      },
      propertyOrdering: ["quiz"]
    };

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    };

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const maxRetries = 5;
    let currentDelay = 1000;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!jsonText) {
          throw new Error("Received empty content from the model.");
        }

        const parsedQuiz = JSON.parse(jsonText);
        setGeneratedQuiz(parsedQuiz.quiz);
        setIsGenerating(false);
        return;

      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, currentDelay));
          currentDelay *= 2;
        } else {
          setError('Failed to generate quiz after multiple attempts. Please try again later.');
          setIsGenerating(false);
        }
      }
    }
  };

  const handleUseQuiz = () => {
    // Navigate to create page with pre-filled data
    const questions = generatedQuiz.map((q, idx) => ({
      id: `ai_${idx}`,
      questionNumber: idx + 1,
      question: q.question,
      options: q.options,
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
      marks: 5
    }));

    // Store in sessionStorage to pass data
    sessionStorage.setItem('aiQuizData', JSON.stringify({
      title: `${form.subject} - ${form.topic}`,
      classId: form.classLevel,
      startDate: form.startDate,
      endDate: form.endDate,
      questions,
      generatedBy: 'ai'
    }));

    router.push('/my-quiz/create');
  };

  const resetGenerator = () => {
    setForm({
      classLevel: '',
      subject: '',
      topic: '',
      numQuestions: 10,
      difficulty: 'medium',
      startDate: '',
      endDate: ''
    });
    setGeneratedQuiz(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          ← Back to Quizzes
        </button>

        <div className="bg-[#1a1a1a] rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Generate Quiz with AI</h2>
              <p className="text-gray-400">Let AI create a quiz based on your parameters</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Select
                  value={form.classLevel}
                  onChange={(value) => updateForm('classLevel', value)}
                  label="Class Level"
                  options={[
                    { value: '', label: 'Select Class' },
                    ...classes.map(c => ({ value: c.id, label: c.title }))
                  ]}
                  placeholder="Select Class"
                />
              </div>

              <div>
                <Select
                  value={form.subject}
                  onChange={(value) => updateForm('subject', value)}
                  label="Subject"
                  options={[
                    { value: '', label: 'Select Subject' },
                    ...subjects.map(s => ({ value: s.name, label: s.name }))
                  ]}
                  placeholder="Select Subject"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <Input
                type="text"
                theme="dark"
                value={form.topic}
                onChange={(e) => updateForm('topic', e.target.value)}
                placeholder="e.g., Photosynthesis, Algebra, World War II"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Number of Questions</label>
                <Input
                  type="number"
                  theme="dark"
                  value={form.numQuestions}
                  onChange={(e) => updateForm('numQuestions', parseInt(e.target.value))}
                  min="5"
                  max="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                <Select
                  value={form.difficulty}
                  onChange={(value) => updateForm('difficulty', value)}
                  options={[
                    { value: 'easy', label: 'Easy' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'hard', label: 'Hard' }
                  ]}
                  placeholder="Select Difficulty"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <DateInput 
                  value={form.startDate}
                  onChange={(date) => updateForm('startDate', date)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <DateInput 
                  value={form.endDate}
                  onChange={(date) => updateForm('endDate', date)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-xl p-4 mb-6 text-red-400">
              {error}
            </div>
          )}

          {generatedQuiz && (
            <div className="bg-[#262626] rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Generated Quiz Preview</h3>
                <span className="text-sm text-gray-400">{generatedQuiz.length} questions</span>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {generatedQuiz.slice(0, 3).map((q, idx) => (
                  <div key={idx} className="bg-[#1a1a1a] rounded-lg p-4">
                    <p className="font-medium mb-2">Q{idx + 1}. {q.question}</p>
                    <div className="space-y-1 text-sm text-gray-400">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <span className={opt === q.correct_answer ? 'text-green-400' : ''}>
                            {opt === q.correct_answer && '✓ '}
                            {opt}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {generatedQuiz.length > 3 && (
                  <p className="text-center text-gray-400 text-sm">
                    ... and {generatedQuiz.length - 3} more questions
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {!generatedQuiz ? (
              <Button
                variant="gradient"
                onClick={generateQuiz}
                loading={isGenerating}
                disabled={isGenerating || !form.classLevel || !form.subject || !form.topic}
                icon={!isGenerating && <Sparkles className="w-5 h-5" />}
                className="flex-1"
              >
                {isGenerating ? 'Generating...' : 'Generate Quiz'}
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={resetGenerator}
                  className="flex-1"
                >
                  Generate New
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUseQuiz}
                  icon={<Check className="w-5 h-5" />}
                  className="flex-1"
                >
                  Use This Quiz
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
