'use client';
import { useState } from "react";
import { Users, UserPlus, Edit2, Trash2, Copy, Check } from 'lucide-react';

const ClassCard = ({ classData, subjects, currentTeacherId, onEdit, onDelete, onAddSelf }) => {
  const [copied, setCopied] = useState(false);
  const isTeacherAdded = classData.teachers.includes(currentTeacherId);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const classSubjects = subjects.filter(s => classData.subjects.includes(s.id));

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-[#262626] p-6 hover:border-[#703bf7] transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            {classData.title}
            {classData.section && (
              <span className="text-[#999999] ml-2">• {classData.section}</span>
            )}
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-2 text-sm text-[#999999]">
              <Users className="w-4 h-4" />
              <span>{classData.studentsCount || 0} students</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            classData.isActive
              ? 'bg-green-500/10 text-green-500'
              : 'bg-[#333333] text-[#999999]'
          }`}
        >
          {classData.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Subjects */}
      <div className="mb-4">
        <p className="text-xs text-[#999999] mb-2">Subjects:</p>
        <div className="flex flex-wrap gap-2">
          {classSubjects.length > 0 ? (
            classSubjects.map(subject => (
              <span
                key={subject.id}
                className="px-2 py-1 bg-[#703bf7]/10 text-[#703bf7] rounded-lg text-xs"
              >
                {subject.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-[#666666]">No subjects assigned</span>
          )}
        </div>
      </div>

      {/* Class Code */}
      <div className="p-3 bg-[#141414] rounded-xl border border-[#262626] mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#999999] mb-1">Class Code</p>
            <p className="text-lg font-mono font-bold text-white">{classData.code}</p>
          </div>
          <button
            onClick={handleCopyCode}
            className="p-2 rounded-lg hover:bg-[#262626] transition"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5 text-[#999999]" />
            )}
          </button>
        </div>
      </div>

      {/* Teacher Status */}
      {!isTeacherAdded && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mb-4">
          <p className="text-sm text-yellow-500">
            You're not added to this class yet
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-[#262626]">
        {isTeacherAdded ? (
          <>
            <button
              onClick={() => onEdit(classData)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#333333] text-[#e4e4e7] hover:bg-[#262626] hover:border-[#703bf7] transition flex items-center justify-center gap-2 font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(classData)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#333333] text-red-400 hover:bg-red-500/10 hover:border-red-500 transition flex items-center justify-center gap-2 font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </>
        ) : (
          <button
            onClick={() => onAddSelf(classData)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#703bf7] text-white hover:bg-[#8254f8] transition flex items-center justify-center gap-2 font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Add Me to This Class
          </button>
        )}
      </div>
    </div>
  );
};

export default ClassCard;