'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Search, UserCheck, UserPlus } from 'lucide-react';
import Input from '@/components/ui/Input';
import TeacherInviteDialog from '@/components/teachers/teacher-invite-dialog';
import DeleteConfirmDialog from '@/components/teachers/delete-confirm-dialog';
import TeacherCard from '@/components/teachers/teacher-card';
import { deleteInvite, deleteTeacher, fetchInvitedTeachers, fetchTeachers, updateTeacher } from '@/api/firebase/teachers';
import { fetchActiveInstitutes } from '@/api/firebase/schools';
import { createTeacherInvite, resendTeacherInvite } from '@/api/actions/teachers';

export default function TeacherManagementPage() {
  const [teachers, setTeachers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'invited'
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [teachersData, institutesData, inviteList] = await Promise.all([
          fetchTeachers(),
          fetchActiveInstitutes(),
          fetchInvitedTeachers()
        ]);
        setTeachers(teachersData);
        setInstitutes(institutesData);
        setInvites(inviteList);
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Invite teacher handler
  const handleInviteTeacher = async (formData) => {
    console.log('formData', formData);
    const result = await createTeacherInvite(formData);
    console.log('result', result);
    if (result.success) {
      // Refresh teachers list
      const updatedInvites = await fetchInvitedTeachers();
      setInvites(updatedInvites);
      alert('Invite sent successfully!');
    } else {
      alert(result.error || 'Failed to send invite');
    }
  };

  // Edit teacher handler
  const handleEditTeacher = async (formData) => {
    try {
      await updateTeacher(selectedTeacher.id, formData);
      const updatedTeachers = await fetchTeachers();
      setTeachers(updatedTeachers);
    } catch (error) {
      console.error('Error updating teacher:', error);
      alert('Failed to update teacher');
    }
  };

  // Delete teacher handler
  const handleDeleteTeacher = async () => {
    try {
      if (activeTab === "invited") {
        await deleteInvite(selectedTeacher.token);
        setInvites(invites.filter(inv => inv.token !== selectedTeacher.token));
      } else {
        await deleteTeacher(selectedTeacher.token);
        setTeachers(teachers.filter(t => t.token !== selectedTeacher.token));
      }
    } catch {
      alert("Failed to delete");
    }
  };

  // Resend invite handler
  const handleResendInvite = async (teacher) => {
    const result = await resendTeacherInvite(teacher.token);
    
    if (result.success) {
      const updatedInvites = await fetchInvitedTeachers();
      setInvites(updatedInvites);
      alert('Invite resent successfully!');
    } else {
      alert(result.error || 'Failed to resend invite');
    }
  };

  const openEditDialog = (teacher) => {
    setSelectedTeacher(teacher);
    setInviteDialogOpen(true);
  };

  const openDeleteDialog = (teacher) => {
    setSelectedTeacher(teacher);
    setDeleteDialogOpen(true);
  };

  const openInviteDialog = () => {
    setSelectedTeacher(null);
    setInviteDialogOpen(true);
  };

  // Filtered lists
  const filteredActiveTeachers = teachers.filter(t =>
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     t.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredInvitedTeachers = invites.filter(inv =>
    (inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     inv.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeTeachers = teachers.filter(t => !t.inviteToken && t.isActive);
  const inactiveTeachers = teachers.filter(t => !t.inviteToken && !t.isActive);

  return (
    <div className="min-h-screen bg-[#141414] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Teacher Management</h1>
              <p className="text-gray-60">Invite and manage teachers across institutes</p>
            </div>
            <button
              onClick={openInviteDialog}
              className="px-6 py-3 rounded-xl bg-purple-60 text-white hover:bg-purple-65 transition flex items-center gap-2 font-medium shadow-lg shadow-purple-60/20"
            >
              <Plus className="w-5 h-5" />
              Invite Teacher
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-15 rounded-2xl p-6">
              <p className="text-gray-60 text-sm mb-1">Total Teachers</p>
              <p className="text-3xl font-bold text-white">{teachers.length}</p>
            </div>
            <div className="bg-gray-15 rounded-2xl p-6">
              <p className="text-gray-60 text-sm mb-1">Active Teachers</p>
              <p className="text-3xl font-bold text-green-500">{activeTeachers.length}</p>
            </div>
            <div className="bg-gray-15 rounded-2xl p-6">
              <p className="text-gray-60 text-sm mb-1">Pending Invites</p>
              <p className="text-3xl font-bold text-yellow-500">{invites.length}</p>
            </div>
            <div className="bg-gray-15 rounded-2xl p-6">
              <p className="text-gray-60 text-sm mb-1">Inactive</p>
              <p className="text-3xl font-bold text-gray-60">{inactiveTeachers.length}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-15">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-3 font-medium transition relative ${
                activeTab === 'active'
                  ? 'text-purple-60'
                  : 'text-gray-60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Active Teachers ({teachers.length})
              </div>
              {activeTab === 'active' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-60" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('invited')}
              className={`px-6 py-3 font-medium transition relative ${
                activeTab === 'invited'
                  ? 'text-purple-60'
                  : 'text-gray-60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Invited ({invites.length})
              </div>
              {activeTab === 'invited' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-60" />
              )}
            </button>
          </div>

          {/* Search Bar */}
          <Input
            type="text"
            theme="light"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            startIcon={<Search className="w-5 h-5 text-gray-40" />}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>

        {/* Teacher Cards Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-60">Loading teachers...</div>
          </div>
        )  : activeTab === "active" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredActiveTeachers.map((t, idx) => (
              <TeacherCard
                key={`teacher-${idx}-${t.id}`}
                teacher={t}
                institutes={institutes}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredInvitedTeachers.map((inv, idx) => (
              <TeacherCard
                key={`invited-${idx}-${inv.id}`}
                teacher={inv}
                isInvited
                institutes={institutes}
                onDelete={openDeleteDialog}
                onResendInvite={handleResendInvite}
              />
            ))}
          </div>
        )}

        {/* Dialogs */}
        <TeacherInviteDialog
          open={inviteDialogOpen}
          onOpenChange={setInviteDialogOpen}
          teacher={selectedTeacher}
          onSubmit={selectedTeacher ? handleEditTeacher : handleInviteTeacher}
          institutes={institutes}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          teacher={selectedTeacher}
          onConfirm={handleDeleteTeacher}
        />
      </div>
    </div>
  );
}