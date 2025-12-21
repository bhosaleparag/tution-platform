import dayjs from 'dayjs';
import { Globe, Building2, Edit2, Trash2 } from 'lucide-react';

const SubjectCard = ({ subject, institutes, onEdit, onDelete }) => {
  const institute = institutes.find(i => i.id === subject.instituteId);

  return (
    <div className="bg-gray-15 rounded-2xl border border-gray-15 p-6 hover:border-purple-60/50 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            subject.instituteId 
              ? 'bg-blue-500/10' 
              : 'bg-purple-60/10'
          }`}>
            {subject.instituteId ? (
              <Building2 className="w-6 h-6 text-blue-500" />
            ) : (
              <Globe className="w-6 h-6 text-purple-60" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{subject.name}</h3>
            <p className="text-sm text-gray-60">
              {subject.instituteId ? institute?.name || 'Unknown Institute' : 'Global Subject'}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            subject.isActive
              ? 'bg-green-500/10 text-green-500'
              : 'bg-gray-20 text-gray-60'
          }`}
        >
          {subject.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-3 mb-4 text-xs text-gray-60">
        <span>Created {dayjs(subject?.createdAt?.toDate()).format("DD/MM/YYYY")}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-20">
        <button
          onClick={() => onEdit(subject)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-20 text-white-90 hover:bg-gray-15 hover:border-purple-60/50 transition flex items-center justify-center gap-2 font-medium"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(subject)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-20 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition flex items-center justify-center gap-2 font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;