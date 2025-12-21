'use client';
import { Trash2 } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function QuestionForm({ question, index, onUpdate, onRemove }) {
  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...question.options];
    const oldValue = newOptions[optionIndex];
    newOptions[optionIndex] = value;
    
    const updates = { options: newOptions };
    
    // If the correct answer was this option, update it to new value
    if (question.correctAnswer === oldValue) {
      updates.correctAnswer = value;
    }
    
    onUpdate(updates);
  };

  return (
    <div className="bg-[#262626] rounded-xl p-6">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-lg font-medium">Question {index + 1}</h4>
        <Button
          variant="ghost"
          size="sm"
          icon={<Trash2 className="w-5 h-5" />}
          onClick={onRemove}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
        />
      </div>

      <div className="space-y-4">
        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Question Text <span className="text-red-400">*</span>
          </label>
          <textarea
            value={question.question}
            onChange={(e) => onUpdate({ question: e.target.value })}
            placeholder="Enter your question"
            rows="2"
            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#703bf7] text-white placeholder:text-gray-400"
          />
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Options <span className="text-red-400">*</span>
          </label>
          <div className="space-y-2">
            {question.options.map((option, optIdx) => (
              <div key={optIdx} className="flex items-center gap-3">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  checked={question.correctAnswer === option}
                  onChange={() => onUpdate({ correctAnswer: option })}
                  className="w-4 h-4 text-[#703bf7] focus:ring-[#703bf7]"
                />
                <Input
                  type="text"
                  theme="dark"
                  value={option}
                  onChange={(e) => handleOptionChange(optIdx, e.target.value)}
                  placeholder={`Option ${optIdx + 1}`}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Select the radio button to mark the correct answer</p>
        </div>

        {/* Explanation */}
        <div>
          <label className="block text-sm font-medium mb-2">Explanation (Optional)</label>
          <textarea
            value={question.explanation}
            onChange={(e) => onUpdate({ explanation: e.target.value })}
            placeholder="Explain why this is the correct answer"
            rows="2"
            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#703bf7] text-white placeholder:text-gray-400"
          />
        </div>

        {/* Marks */}
        <div className="w-32">
          <label className="block text-sm font-medium mb-2">Marks</label>
          <Input
            type="number"
            theme="dark"
            value={question.marks}
            onChange={(e) => onUpdate({ marks: parseInt(e.target.value) || 0 })}
            min="1"
            max="100"
          />
        </div>
      </div>
    </div>
  );
}