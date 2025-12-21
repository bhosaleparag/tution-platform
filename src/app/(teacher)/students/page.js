'use client';
import React, { useState, useEffect } from 'react';
import { Copy, Share2, Plus, Edit2, Trash2, Filter, Search } from 'lucide-react';
import Dialog, { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

const StudentManagement = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [invites, setInvites] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  
  // Filter states
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  
  // Dialog states
  const [isCreateInviteOpen, setIsCreateInviteOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [isDeleteStudentOpen, setIsDeleteStudentOpen] = useState(false);
  const [isViewInvitesOpen, setIsViewInvitesOpen] = useState(false);
  
  // Form states
  const [inviteForm, setInviteForm] = useState({ class: '', subject: '' });
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Load mock data
  useEffect(() => {
    loadStudents();
    loadInvites();
  }, []);

  // Filter students when filters change
  useEffect(() => {
    filterStudents();
  }, [students, selectedClass, selectedSubject]);

  const loadStudents = async () => {
    // Mock data - replace with actual Firestore query
    const mockStudents = [
      { id: '1', name: 'Alice Johnson', class: 'Class 10A', subject: 'Mathematics', email: 'alice@example.com', joinedDate: '2024-01-15' },
      { id: '2', name: 'Bob Smith', class: 'Class 10B', subject: 'Physics', email: 'bob@example.com', joinedDate: '2024-01-16' },
      { id: '3', name: 'Carol White', class: 'Class 9A', subject: 'Chemistry', email: 'carol@example.com', joinedDate: '2024-01-17' },
      { id: '4', name: 'David Brown', class: 'Class 10A', subject: 'Mathematics', email: 'david@example.com', joinedDate: '2024-01-18' },
      { id: '5', name: 'Emma Davis', class: 'Class 10B', subject: 'Physics', email: 'emma@example.com', joinedDate: '2024-01-19' },
    ];
    setStudents(mockStudents);
  };

  const loadInvites = async () => {
    // Mock data - replace with actual Firestore query from 'invites-student' collection
    const mockInvites = [
      { id: 'inv1', class: 'Class 10A', subject: 'Mathematics', code: 'MATH10A-ABC123', createdAt: '2024-12-01', usedCount: 3 },
      { id: 'inv2', class: 'Class 10B', subject: 'Physics', code: 'PHYS10B-XYZ789', createdAt: '2024-12-02', usedCount: 2 },
    ];
    setInvites(mockInvites);
  };

  const filterStudents = () => {
    let filtered = [...students];
    if (selectedClass) {
      filtered = filtered.filter(s => s.class === selectedClass);
    }
    if (selectedSubject) {
      filtered = filtered.filter(s => s.subject === selectedSubject);
    }
    setFilteredStudents(filtered);
  };

  const handleCreateInvite = async () => {
    if (!inviteForm.class || !inviteForm.subject) {
      alert('Please select both class and subject');
      return;
    }

    // Generate invite code
    const code = `${inviteForm.subject.substring(0, 4).toUpperCase()}${inviteForm.class.replace(/\s/g, '')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const newInvite = {
      id: `inv_${Date.now()}`,
      class: inviteForm.class,
      subject: inviteForm.subject,
      code: code,
      teacherId: user.id,
      instituteId: user.instituteId,
      createdAt: new Date().toISOString().split('T')[0],
      usedCount: 0
    };

    // TODO: Save to Firestore 'invites-student' collection
    // await addDoc(collection(db, 'invites-student'), newInvite);
    
    setInvites([...invites, newInvite]);
    setInviteForm({ class: '', subject: '' });
    setIsCreateInviteOpen(false);
    alert('Invite link created successfully!');
  };

  const handleEditStudent = async () => {
    if (!editingStudent.name || !editingStudent.email) {
      alert('Please fill in all required fields');
      return;
    }

    // TODO: Update in Firestore
    // await updateDoc(doc(db, 'students', editingStudent.id), editingStudent);
    
    setStudents(students.map(s => s.id === editingStudent.id ? editingStudent : s));
    setIsEditStudentOpen(false);
    setEditingStudent(null);
    alert('Student updated successfully!');
  };

  const handleDeleteStudent = async () => {
    // TODO: Delete from Firestore
    // await deleteDoc(doc(db, 'students', deletingStudent.id));
    
    setStudents(students.filter(s => s.id !== deletingStudent.id));
    setIsDeleteStudentOpen(false);
    setDeletingStudent(null);
    alert('Student deleted successfully!');
  };

  const copyToClipboard = (code) => {
    const inviteUrl = `${window.location.origin}/join/${code}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareToWhatsApp = (code, className, subject) => {
    const inviteUrl = `${window.location.origin}/join/${code}`;
    const message = `Join my ${subject} class (${className})! Use this invite link: ${inviteUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const classOptions = user?.classes?.map(c => ({ value: c.id, label: c.title })) || [];
  const subjectOptions = user?.subjects?.map(s => ({ value: s.id, label: s.name })) || [];

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Management</h1>
          <p className="text-gray-400">Manage your students and create invite links</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateInviteOpen(true)}
          >
            Create Invite Link
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Share2 className="w-4 h-4" />}
            onClick={() => setIsViewInvitesOpen(true)}
          >
            View Invite Links ({invites.length})
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="col-span-2">
            {/* <Input
              type="text"
              theme="dark"
              placeholder="Search quizzes..."
              startIcon={<Search className="w-5 h-5 text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            /> */}
          </div>
          <div className="col-span-1">
            <Select
              value={selectedClass}
              onChange={(value) => setSelectedClass(value)}
              options={[{ value: '', label: 'All Classes' }, ...classOptions]}
              placeholder="Filter by Class"
            />
          </div>
          <div className="col-span-1">
            <Select
              options={[{ value: '', label: 'All Subjects' }, ...subjectOptions]}
              value={selectedSubject}
              onChange={(value) => setSelectedSubject(value)}
              placeholder="Filter by Subject"
            />
          </div>
        </div>
        <div className=" rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter size={20} className="text-gray-400" />
            <div className="flex-1 grid grid-cols-2 gap-4">
              <Select
                label="Filter by Class"
                options={[{ value: '', label: 'All Classes' }, ...classOptions]}
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                placeholder="Select class"
              />
              <Select
                label="Filter by Subject"
                options={[{ value: '', label: 'All Subjects' }, ...subjectOptions]}
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                placeholder="Select subject"
              />
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className=" rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                      No students found. {(selectedClass || selectedSubject) && 'Try adjusting your filters.'}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-600 rounded text-sm">{student.class}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-purple-600 rounded text-sm">{student.subject}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">{student.joinedDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingStudent({ ...student });
                              setIsEditStudentOpen(true);
                            }}
                            className="p-2 text-blue-400 hover:bg-blue-600 hover:text-white rounded transition"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingStudent(student);
                              setIsDeleteStudentOpen(true);
                            }}
                            className="p-2 text-red-400 hover:bg-red-600 hover:text-white rounded transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Invite Dialog */}
        <Dialog open={isCreateInviteOpen} onOpenChange={setIsCreateInviteOpen}>
          <DialogContent className=" text-white">
            <DialogHeader>
              <DialogTitle>Create Invite Link</DialogTitle>
              <DialogDescription className="text-gray-400">
                Select class and subject to generate an invite link for students
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 px-2 py-4">
              <Select
                label="Class"
                options={classOptions}
                value={inviteForm.class}
                onChange={(e) => setInviteForm({ ...inviteForm, class: e.target.value })}
                placeholder="Select class"
              />
              <Select
                label="Subject"
                options={subjectOptions}
                value={inviteForm.subject}
                onChange={(e) => setInviteForm({ ...inviteForm, subject: e.target.value })}
                placeholder="Select subject"
              />
            </div>
            <DialogFooter>
              <Button variant='secondary' onClick={() => setIsCreateInviteOpen(false)}>
                Cancel
              </Button>
              <Button variant='primary' onClick={handleCreateInvite}>
                Create Invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Invites Dialog */}
        <Dialog open={isViewInvitesOpen} onOpenChange={setIsViewInvitesOpen}>
          <DialogContent className=" text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle>Invite Links</DialogTitle>
              <DialogDescription className="text-gray-400">
                Your created invite links for students
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4 px-2 max-h-96 overflow-y-auto">
              {invites.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No invite links created yet</p>
              ) : (
                invites.map((invite) => (
                  <div key={invite.id} className="rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-600 rounded text-sm">{invite.class}</span>
                          <span className="px-2 py-1 bg-purple-600 rounded text-sm">{invite.subject}</span>
                        </div>
                        <p className="text-sm text-gray-50">Created: {invite.createdAt}</p>
                        <p className="text-sm text-gray-50">Used by {invite.usedCount} students</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(invite.code)}
                          className="p-2 bg-gray-600 hover:bg-gray-500 rounded transition"
                          title="Copy link"
                        >
                          {copiedId === invite.code ? (
                            <span className="text-green-400 text-xs">Copied!</span>
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => shareToWhatsApp(invite.code, invite.class, invite.subject)}
                          className="p-2 bg-green-600 hover:bg-green-700 rounded transition"
                          title="Share to WhatsApp"
                        >
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className=" rounded px-3 py-2 font-mono text-sm break-all">
                      {window.location.origin}/join/{invite.code}
                    </div>
                  </div>
                ))
              )}
            </div>
            <DialogFooter>
              <Button
                variant='secondary'
                onClick={() => setIsViewInvitesOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Student Dialog */}
        <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
          <DialogContent className="text-white">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription className="text-gray-400">
                Update student information
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 py-4 space-y-4">
              {editingStudent && (
                <div className="space-y-4 py-4">
                  <Input
                    label="Name"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    placeholder="Enter student name"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                  <Select
                    label="Class"
                    options={classOptions}
                    value={editingStudent.class}
                    onChange={(e) => setEditingStudent({ ...editingStudent, class: e.target.value })}
                  />
                  <Select
                    label="Subject"
                    options={subjectOptions}
                    value={editingStudent.subject}
                    onChange={(e) => setEditingStudent({ ...editingStudent, subject: e.target.value })}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant='secondary'
                onClick={() => {
                  setIsEditStudentOpen(false);
                  setEditingStudent(null);
                }}
              >
                Cancel
              </Button>
              <Button variant='primary' onClick={handleEditStudent}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Student Dialog */}
        <Dialog open={isDeleteStudentOpen} onOpenChange={setIsDeleteStudentOpen}>
          <DialogContent className=" text-white">
            <DialogHeader>
              <DialogTitle>Delete Student</DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to delete this student? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {deletingStudent && (
              <div className="py-4">
                <div className=" rounded-lg p-4">
                  <p className="font-semibold mb-1">{deletingStudent.name}</p>
                  <p className="text-sm text-gray-400">{deletingStudent.email}</p>
                  <p className="text-sm text-gray-400">{deletingStudent.class} - {deletingStudent.subject}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <button
                onClick={() => {
                  setIsDeleteStudentOpen(false);
                  setDeletingStudent(null);
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStudent}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Delete Student
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StudentManagement;