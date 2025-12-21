'use client';
import { Calendar, Clock, Edit2, Mail, Phone, RefreshCw, Trash2, UserCheck } from 'lucide-react';
import { useState } from 'react';

const TeacherCard = ({ teacher, institutes, onEdit, onDelete, onResendInvite, isInvited }) => {
  const institute = institutes?.find(i => i.id === teacher?.instituteId);
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    setResending(true);
    await onResendInvite(teacher);
    setResending(false);
  };

  const isExpired = isInvited && teacher?.expiresAt && teacher.expiresAt < Date.now();
  const daysLeft = isInvited && teacher?.expiresAt ? Math.ceil((teacher.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="bg-gray-15 rounded-2xl p-6 hover:border-purple-60 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isInvited 
              ? 'bg-yellow-500/10' 
              : teacher.isActive 
                ? 'bg-green-500/10' 
                : 'bg-gray-20'
          }`}>
            {isInvited ? (
              <Mail className="w-6 h-6 text-yellow-500" />
            ) : (
              <UserCheck className="w-6 h-6 text-green-500" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{teacher.name}</h3>
            <p className="text-sm text-gray-60">{institute?.name || 'Unknown Institute'}</p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isInvited
              ? isExpired
                ? 'bg-red-500/10 text-red-400'
                : 'bg-yellow-500/10 text-yellow-500'
              : teacher.isActive
                ? 'bg-green-500/10 text-green-500'
                : 'bg-gray-20 text-gray-60'
          }`}
        >
          {isInvited ? (isExpired ? 'Expired' : 'Invited') : (teacher.isActive ? 'Active' : 'Inactive')}
        </span>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-60">
          <Mail className="w-4 h-4" />
          <span>{teacher.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-60">
          <Phone className="w-4 h-4" />
          <span>{teacher.contact}</span>
        </div>
      </div>

      {/* Invite Status (for invited teachers) */}
      {isInvited && (
        <div className={`p-3 rounded-xl mb-4 ${
          isExpired ? 'bg-red-500/10 border border-red-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'
        }`}>
          <div className="flex items-center gap-2 text-sm">
            <Clock className={`w-4 h-4 ${isExpired ? 'text-red-400' : 'text-yellow-500'}`} />
            <span className={isExpired ? 'text-red-400' : 'text-yellow-500'}>
              {isExpired 
                ? 'Invite expired' 
                : `Expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>
      )}

      {/* Subscription Expiry (for active teachers) */}
      {!isInvited && teacher.subscriptionExpiry && (
        <div className="p-3 rounded-xl bg-gray-08 border border-gray-15 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-60">
            <Calendar className="w-4 h-4" />
            <span>Subscription expires: {new Date(teacher.subscriptionExpiry).toLocaleDateString()}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-15">
        {isInvited ? (
          <>
            <button
              onClick={handleResend}
              disabled={resending}
              className="flex-1 px-4 py-2.5 rounded-xl bg-purple-60 text-white hover:bg-purple-65 transition flex items-center justify-center gap-2 font-medium disabled:opacity-50"
            >
              {resending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Resend Invite
                </>
              )}
            </button>
            <button
              onClick={() => onDelete(teacher)}
              className="px-4 py-2.5 rounded-xl border border-gray-20 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition flex items-center justify-center gap-2 font-medium"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onEdit(teacher)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-20 text-[#e4e4e7] hover:bg-gray-15 hover:border-purple-60 transition flex items-center justify-center gap-2 font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(teacher)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-20 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition flex items-center justify-center gap-2 font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherCard;