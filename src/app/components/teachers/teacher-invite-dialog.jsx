'use client';
import { useState, useEffect } from 'react';
import Dialog, { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/Dialog';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Edit2, Mail, RefreshCw } from 'lucide-react';
import ToggleSwitch from '../ui/ToggleSwitch';

const TeacherInviteDialog = ({ open, onOpenChange, teacher, onSubmit, institutes }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    instituteId: '',
    isActive: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        email: teacher.email,
        contact: teacher.contact,
        instituteId: teacher.instituteId,
        isActive: teacher.isActive
      });
    } else {
      setFormData({ 
        name: '', 
        email: '', 
        contact: '', 
        instituteId: institutes.length > 0 ? institutes[0].id : '', 
        isActive: false 
      });
    }
    setErrors({});
  }, [teacher, open, institutes]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact is required';
    } else if (!/^\+?[1-9]\d{9,14}$/.test(formData.contact.replace(/\s/g, ''))) {
      newErrors.contact = 'Invalid phone number';
    }
    if (!formData.instituteId) newErrors.instituteId = 'Institute is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {teacher ? 'Edit Teacher' : 'Invite New Teacher'}
          </DialogTitle>
          <DialogDescription>
            {teacher 
              ? 'Update teacher details below' 
              : 'Send an email invite to add a new teacher. The invite link will be valid for 7 days.'}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
              Full Name *
            </label>
            <Input
              type="text"
              theme="light"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., John Doe"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
              Email Address *
            </label>
            <Input
              type="email"
              theme="light"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="teacher@example.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Contact */}
          <Input
            type="tel"
            theme="light"
            label='Phone Number *'
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            placeholder="+919876543210"
          />
          {errors.contact && <p className="text-red-400 text-xs mt-1">{errors.contact}</p>}

          {/* Institute */}
          <Select
            label='Institute *'
            value={formData.instituteId}
            onChange={(value) => setFormData({ ...formData, instituteId: value })}
            options={institutes.map(inst => ({
              value: inst.id,
              label: inst.name
            }))}
            error={errors.instituteId}
            placeholder="Select institute"
          />

          {/* Active Status (only for edit) */}
          {teacher && (
            <div className="flex items-center justify-between p-4 bg-[#141414] rounded-xl border border-[#262626]">
              <div>
                <label className="text-sm font-medium text-[#e4e4e7] block">
                  Active Status
                </label>
                <p className="text-xs text-[#999999] mt-1">
                  {formData.isActive ? 'Teacher is currently active' : 'Teacher is currently inactive'}
                </p>
              </div>
              <ToggleSwitch 
                checked={formData.isActive} 
                onChange={(value) => setFormData({ ...formData, isActive: value })}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-5 py-2.5 rounded-xl border border-[#333333] text-[#e4e4e7] hover:bg-[#262626] transition font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-[#703bf7] text-white hover:bg-[#8254f8] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                {teacher ? 'Updating...' : 'Sending Invite...'}
              </>
            ) : (
              <>
                {teacher ? (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Update Teacher
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Send Invite
                  </>
                )}
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherInviteDialog;