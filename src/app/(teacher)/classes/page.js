'use client';
import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Search } from 'lucide-react';
import Input from '@/components/ui/Input';
import ClassFormDialog from '@/components/classes/class-form-dialog';
import ClassCard from '@/components/classes/class-card';
import DeleteConfirmDialog from '@/components/classes/delete-confirm-dialog';
import useAuth from '@/hooks/useAuth';
import { fetchClassesByInstitute, createClass, updateClass, addTeacherToClass, deleteClass, fetchTeacherClasses } from '@/api/firebase/classes';

export default function TeacherClassesPage() {
  const { user, setUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      setLoading(true);
      try {
        const classesData = await fetchTeacherClasses(user.instituteId, user.uid);
        setClasses(classesData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setLoading(false);
    }
    loadData();
  }, [user.instituteId, user.uid]);

  // Filter classes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClasses(classes);
    } else {
      setFilteredClasses(
        classes.filter(c =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.section?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.code.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, classes]);

  // Create class handler
  const handleCreateClass = async (formData) => {
    try {
      const newId = await createClass(formData, user?.uid, user.instituteId);
      const updatedClasses = await fetchClassesByInstitute(user.instituteId);
      setClasses(updatedClasses);
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Failed to create class');
    }
  };

  // Edit class handler
  const handleEditClass = async (formData) => {
    try {
      await updateClass(selectedClass.id, formData);
      const updatedClasses = await fetchClassesByInstitute(user.instituteId);
      setClasses(updatedClasses);
    } catch (error) {
      console.error('Error updating class:', error);
      alert('Failed to update class');
    }
  };

  // Delete class handler
  const handleDeleteClass = async () => {
    try {
      await deleteClass(selectedClass.id);
      setClasses(classes.filter(c => c.id !== selectedClass.id));
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Failed to delete class');
    }
  };

  // Add self to class handler
  const handleAddSelfToClass = async (classData) => {
    try {
      await addTeacherToClass(classData.id, user.uid);
      const updatedClasses = await fetchClassesByInstitute(user.instituteId);
      setClasses(updatedClasses);
    } catch (error) {
      console.error('Error adding to class:', error);
      alert('Failed to add to class');
    }
  };

  const openEditDialog = (classData) => {
    setSelectedClass(classData);
    setFormDialogOpen(true);
  };

  const openDeleteDialog = (classData) => {
    setSelectedClass(classData);
    setDeleteDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedClass(null);
    setFormDialogOpen(true);
  };

  const myClasses = classes.filter(c => c.teachers.includes(user?.uid));
  const otherClasses = classes.filter(c => !c.teachers.includes(user?.uid));

  useEffect(()=>{
    setUser({...user, classes: myClasses});
  },[JSON.stringify(myClasses)])

  return (
    <div className="min-h-screen bg-[#141414] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My Classes</h1>
              <p className="text-[#999999]">Manage your classes and students</p>
            </div>
            <button
              onClick={openCreateDialog}
              className="px-6 py-3 rounded-xl bg-[#703bf7] text-white hover:bg-[#8254f8] transition flex items-center gap-2 font-medium shadow-lg shadow-[#703bf7]/20"
            >
              <Plus className="w-5 h-5" />
              Create Class
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#262626] p-6">
              <p className="text-[#999999] text-sm mb-1">Total Classes</p>
              <p className="text-3xl font-bold text-white">{classes.length}</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#262626] p-6">
              <p className="text-[#999999] text-sm mb-1">My Classes</p>
              <p className="text-3xl font-bold text-[#703bf7]">{myClasses.length}</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#262626] p-6">
              <p className="text-[#999999] text-sm mb-1">Total Students</p>
              <p className="text-3xl font-bold text-green-500">
                {myClasses.reduce((sum, c) => sum + (c.studentsCount || 0), 0)}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <Input
            type="text"
            theme='light'
            placeholder="Search schools..."
            startIcon={<Search className="w-5 h-5 text-gray-40" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Classes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-[#999999]">Loading classes...</div>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-[#333333] mx-auto mb-4" />
            <p className="text-[#999999] text-lg">
              {searchQuery ? 'No classes found' : 'No classes yet'}
            </p>
            {!searchQuery && (
              <button
                onClick={openCreateDialog}
                className="mt-4 px-6 py-3 rounded-xl bg-[#703bf7] text-white hover:bg-[#8254f8] transition font-medium"
              >
                Create Your First Class
              </button>
            )}
          </div>
        ) : (
          <>
            {/* My Classes Section */}
            {myClasses.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">My Classes ({myClasses.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myClasses.map(classData => (
                    <ClassCard
                      key={classData.id}
                      classData={classData}
                      subjects={user?.subjects}
                      currentTeacherId={user?.uid}
                      onEdit={openEditDialog}
                      onDelete={openDeleteDialog}
                      onAddSelf={handleAddSelfToClass}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Classes Section */}
            {otherClasses.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Other Classes ({otherClasses.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherClasses.map(classData => (
                    <ClassCard
                      key={classData.id}
                      classData={classData}
                      subjects={user?.subjects}
                      currentTeacherId={user?.uid}
                      onEdit={openEditDialog}
                      onDelete={openDeleteDialog}
                      onAddSelf={handleAddSelfToClass}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Dialogs */}
        <ClassFormDialog
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
          classData={selectedClass}
          onSubmit={selectedClass ? handleEditClass : handleCreateClass}
          subjects={user?.subjects}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          classData={selectedClass}
          onConfirm={handleDeleteClass}
        />
      </div>
    </div>
  );
}