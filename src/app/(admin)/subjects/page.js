"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Search, BookOpen } from 'lucide-react';
import Input from '@/components/ui/Input';
import SubjectCard from '@/components/subjects/subject-card';
import SubjectFormDialog from '@/components/subjects/subject-form-dialog';
import DeleteConfirmDialog from '@/components/subjects/delete-confirm-dialog';
import Select from '@/components/ui/Select';
import useAuth from '@/hooks/useAuth';
import { addSubject, deleteSubject, fetchSubjects, updateSubject } from '@/api/firebase/subjects';
import { fetchActiveInstitutes } from '@/api/firebase/schools';
 
export default function SubjectManagementPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInstitute, setFilterInstitute] = useState('all');
  const [loading, setLoading] = useState(true);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Handlers
  const handleAddSubject = async (formData) => {
    const newId = await addSubject(formData, user.uid);
    const updatedSubjects = await fetchSubjects();
    setSubjects(updatedSubjects);
  };

  const handleEditSubject = async (formData) => {
    await updateSubject(selectedSubject.id, formData);
    const updatedSubjects = await fetchSubjects();
    setSubjects(updatedSubjects);
  };

  const handleDeleteSubject = async () => {
    await deleteSubject(selectedSubject.id);
    setSubjects(subjects.filter(s => s.id !== selectedSubject.id));
  };

  const openEditDialog = (subject) => {
    setSelectedSubject(subject);
    setFormDialogOpen(true);
  };

  const openDeleteDialog = (subject) => {
    setSelectedSubject(subject);
    setDeleteDialogOpen(true);
  };

  const openAddDialog = () => {
    setSelectedSubject(null);
    setFormDialogOpen(true);
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [subjectsData, institutesData] = await Promise.all([
        fetchSubjects(),
        fetchActiveInstitutes()
      ]);
      setSubjects(subjectsData);
      setInstitutes(institutesData);
      setFilteredSubjects(subjectsData);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filter subjects
  useEffect(() => {
    let filtered = subjects;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(subject =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by institute
    if (filterInstitute !== 'all') {
      if (filterInstitute === 'global') {
        filtered = filtered.filter(s => !s.instituteId);
      } else {
        filtered = filtered.filter(s => s.instituteId === filterInstitute);
      }
    }

    setFilteredSubjects(filtered);
  }, [searchQuery, filterInstitute, subjects]);

  const globalCount = subjects.filter(s => !s.instituteId).length;
  const instituteSpecificCount = subjects.filter(s => s.instituteId).length;
  const activeCount = subjects.filter(s => s.isActive).length;

  return (
    <div className="min-h-screen bg-gray-08 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Subject Management</h1>
              <p className="text-gray-60">Manage global and institute-specific subjects</p>
            </div>
            <button
              onClick={openAddDialog}
              className="px-6 py-3 rounded-xl bg-purple-60 text-white hover:bg-[#8254f8] transition flex items-center gap-2 font-medium shadow-lg shadow-purple-60/20"
            >
              <Plus className="w-5 h-5" />
              Add Subject
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-15 rounded-2xl p-6">
              <p className="text-gray-60 text-sm mb-1">Total Subjects</p>
              <p className="text-3xl font-bold text-white">{subjects.length}</p>
            </div>
            <div className="bg-gray-15 rounded-2xl p-6">
              <p className="text-gray-60 text-sm mb-1">Global Subjects</p>
              <p className="text-3xl font-bold text-purple-60">{globalCount}</p>
            </div>
            <div className="bg-gray-15 rounded-2xl p-6">
              <p className="text-gray-60 text-sm mb-1">Institute Subjects</p>
              <p className="text-3xl font-bold text-blue-500">{instituteSpecificCount}</p>
            </div>
            <div className="bg-gray-15 rounded-2xl p-6">
              <p className="text-gray-60 text-sm mb-1">Active Subjects</p>
              <p className="text-3xl font-bold text-green-500">{activeCount}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-40 pointer-events-none" />
              <Input
                type="text"
                theme="light"
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Institute Filter */}
            <div className="w-full md:w-64">
              <Select
                value={filterInstitute}
                onChange={(value) => setFilterInstitute(value)}
                options={[
                  { value: 'all', label: 'All Subjects' },
                  { value: 'global', label: 'Global Only' },
                  ...institutes.map(inst => ({
                    value: inst.id,
                    label: inst.name
                  }))
                ]}
                placeholder="Filter by institute"
              />
            </div>
          </div>
        </div>

        {/* Subject Cards Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-60">Loading subjects...</div>
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-20 mx-auto mb-4" />
            <p className="text-gray-60 text-lg">
              {searchQuery || filterInstitute !== 'all' ? 'No subjects found' : 'No subjects yet'}
            </p>
            {!searchQuery && filterInstitute === 'all' && (
              <button
                onClick={openAddDialog}
                className="mt-4 px-6 py-3 rounded-xl bg-purple-60 text-white hover:bg-[#8254f8] transition font-medium"
              >
                Add Your First Subject
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                institutes={institutes}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
              />
            ))}
          </div>
        )}

        {/* Dialogs */}
        <SubjectFormDialog
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
          subject={selectedSubject}
          onSubmit={selectedSubject ? handleEditSubject : handleAddSubject}
          institutes={institutes}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          subject={selectedSubject}
          onConfirm={handleDeleteSubject}
        />
      </div>
    </div>
  );
}