"use client";
import { useRouter } from 'next/navigation';
import { School, GraduationCap, UserCheck, Users } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-08 text-white-99 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white-99">
            Admin Dashboard
          </h1>
          <p className="text-gray-60">Manage Institutions, subject, teachers</p>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/schools')}
            className="bg-gray-15 border border-gray-20 hover:border-purple-60/30 p-6 rounded-xl transition-all"
          >
            <School className="w-8 h-8 mb-2" />
            <div className="text-lg font-semibold">Educational Institutions</div>
            <div className="text-sm text-gray-50">Manage Educational Institutions</div>
          </button>

          <button
            onClick={() => router.push('/subjects')}
            className="bg-gray-15 border border-gray-20 hover:border-purple-60/30 p-6 rounded-xl transition-all"
          >
            <GraduationCap className="w-8 h-8 mb-2" />
            <div className="text-lg font-semibold">Subject</div>
            <div className="text-sm text-gray-60">Manage Subjects</div>
          </button>

          <button
            onClick={() => router.push('/teachers')}
            className="bg-gray-15 border border-gray-20 hover:border-purple-60/30 p-6 rounded-xl transition-all"
          >
            <UserCheck className="w-8 h-8 mb-2" />
            <div className="text-lg font-semibold">Teachers</div>
            <div className="text-sm text-gray-60">Manage teachers</div>
          </button>
        </div>
      </div>
    </div>
  );
}

