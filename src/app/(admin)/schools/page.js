'use client';   
import React, { useState, useEffect } from 'react';
import { Plus, Search, Building2 } from 'lucide-react';
import SchoolFormDialog from '@/components/schools/school-form-dialog';
import DeleteConfirmDialog from '@/components/schools/delete-confirm-dialog';
import SchoolCard from '@/components/schools/school-card';
import Input from '@/components/ui/Input';
import { fetchSchools, addSchool, updateSchool, deleteSchool, fetchSchool } from '@/api/firebase/schools';
import useAuth from '@/hooks/useAuth';
 
export default function SchoolManagementPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Handlers
  const handleAddSchool = async (formData) => {
    const newId = await addSchool(formData, user.uid);
    const newSchool = await fetchSchool(newId);
    setSchools([newSchool, ...schools]);
  };

  const handleEditSchool = async (formData) => {
    await updateSchool(selectedSchool.id, formData);
    setSchools(schools.map(s => 
      s.id === selectedSchool.id 
        ? { ...s, name: formData.name, isActive: formData.isActive }
        : s
    ));
  };

  const handleDeleteSchool = async () => {
    await deleteSchool(selectedSchool.id);
    setSchools(schools.filter(s => s.id !== selectedSchool.id));
  };

  const openEditDialog = (school) => {
    setSelectedSchool(school);
    setFormDialogOpen(true);
  };

  const openDeleteDialog = (school) => {
    setSelectedSchool(school);
    setDeleteDialogOpen(true);
  };

  const openAddDialog = () => {
    setSelectedSchool(null);
    setFormDialogOpen(true);
  };

  useEffect(() => {
    async function loadSchools() {
      setLoading(true);
      const data = await fetchSchools();
      setSchools(data);
      setFilteredSchools(data);
      setLoading(false);
    }
    loadSchools();
  }, []);

  // Filter schools by search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSchools(schools);
    } else {
      setFilteredSchools(
        schools.filter(school =>
          school.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, schools]);

  return (
    <div className="min-h-screen bg-gray-08 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">School Management</h1>
              <p className="text-gray-60">Manage all institutes in the platform</p>
            </div>
            <button
              onClick={openAddDialog}
              className="px-6 py-3 rounded-xl bg-purple-60 text-white hover:bg-purple-65 transition flex items-center gap-2 font-medium shadow-lg shadow-purple-60/20"
            >
              <Plus className="w-5 h-5" />
              Add School
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-15 rounded-2xl p-6">
              <p className="text-gray-60 text-sm mb-1">Total Schools</p>
              <p className="text-3xl font-bold text-white">{schools.length}</p>
            </div>
            <div className="bg-gray-15 rounded-2xl p-6">
              <p className="text-gray-60 text-sm mb-1">Active Schools</p>
              <p className="text-3xl font-bold text-green-500">
                {schools.filter(s => s.isActive).length}
              </p>
            </div>
            <div className="bg-gray-15 rounded-2xl p-6">
              <p className="text-gray-60 text-sm mb-1">Inactive Schools</p>
              <p className="text-3xl font-bold text-gray-60">
                {schools.filter(s => !s.isActive).length}
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

        {/* School Cards Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-60">Loading schools...</div>
          </div>
        ) : filteredSchools.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-gray-20 mx-auto mb-4" />
            <p className="text-gray-60 text-lg">
              {searchQuery ? 'No schools found' : 'No schools yet'}
            </p>
            {!searchQuery && (
              <button
                onClick={openAddDialog}
                className="mt-4 px-6 py-3 rounded-xl bg-purple-60 text-white hover:bg-purple-65 transition font-medium"
              >
                Add Your First School
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map(school => (
              <SchoolCard
                key={school.id}
                school={school}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
              />
            ))}
          </div>
        )}

        {/* Dialogs */}
        <SchoolFormDialog
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
          school={selectedSchool}
          onSubmit={selectedSchool ? handleEditSchool : handleAddSchool}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          school={selectedSchool}
          onConfirm={handleDeleteSchool}
        />
      </div>
    </div>
  );
}