import dayjs from 'dayjs';
import { Building2, Edit2, Trash2 } from 'lucide-react';

const SchoolCard = ({ school, onEdit, onDelete }) => {

  return (
    <div className="bg-gray-15 rounded-2xl border border-gray-20 p-6 hover:border-purple-60/50 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-60/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-purple-60" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{school.name}</h3>
            <p className="text-sm text-gray-60">
              Created {dayjs(school.createdAt?.toDate()).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            school.isActive
              ? 'bg-green-500/10 text-green-500'
              : 'bg-gray-20 text-gray-60'
          }`}
        >
          {school.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-20">
        <button
          onClick={() => onEdit(school)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-gray-15 border border-gray-20 text-white-90 hover:border-purple-60/50 transition flex items-center justify-center gap-2 font-medium"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(school)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/10 border border-gray-20 text-red-400 hover:border-red-500/50 transition flex items-center justify-center gap-2 font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default SchoolCard;