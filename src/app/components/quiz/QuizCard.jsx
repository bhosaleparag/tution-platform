import { FileUp, Clock, Users, Edit, Trash2, Share } from 'lucide-react';
import Button from '../ui/Button';

export default function QuizCard({ quiz, class_name, onEdit, onDelete, onShare }) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 hover:bg-[#262626] transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="px-2 py-1 bg-[#262626] rounded">Class {class_name}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <FileUp className="w-4 h-4" />
          <span>{quiz.questionsCount} Questions</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{Math.floor(quiz.timeLimitSeconds / 60)} minutes</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{quiz.totalMarks} marks</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="danger" size="sm" icon={<Trash2 className="w-4 h-4" />} onClick={() => onDelete(quiz)} className="flex-1">
          delete
        </Button>
        <Button variant="primary" size="sm" icon={<Edit className="w-4 h-4" />} onClick={() => onEdit(quiz)} className="flex-1">
          Edit
        </Button>
        <Button variant="secondary" size="sm" icon={<Share className="w-4 h-4" />} onClick={() => onShare(quiz)} />
      </div>
    </div>
  );
}
