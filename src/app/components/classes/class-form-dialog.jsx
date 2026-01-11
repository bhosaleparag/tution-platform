'use client';
import { useEffect, useState } from "react";
import Dialog, { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/Dialog";
import Input from "../ui/Input";
import Select from "../ui/Select";
import ToggleSwitch from "../ui/ToggleSwitch";

const ClassFormDialog = ({ open, onOpenChange, classData, onSubmit, subjects }) => {
  const [formData, setFormData] = useState({
    title: '',
    section: '',
    subjects: [],
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (classData) {
      setFormData({
        title: classData.title,
        section: classData.section || '',
        subjects: classData.subjects || [],
        isActive: classData.isActive
      });
    } else {
      setFormData({ 
        title: '', 
        section: '', 
        subjects: [],
        isActive: true 
      });
    }
    setErrors({});
  }, [classData, open]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.subjects.length === 0) newErrors.subjects = 'Select at least one subject';
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
            {classData ? 'Edit Class' : 'Create New Class'}
          </DialogTitle>
          <DialogDescription>
            {classData ? 'Update class details' : 'Create a new class for your students'}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          {/* Title */}
          <div>
            <Input
              type="text"
              theme="light"
              value={formData.title}
              label='Class Title *'
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Class 8, Grade 10"
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
              Section (Optional)
            </label>
            <Input
              type="text"
              theme="light"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              placeholder="e.g., A, B, Batch-1"
            />
            <p className="text-xs text-[#999999] mt-1">
              Leave empty if no sections
            </p>
          </div>

          {/* Subjects */}
          <div>
            <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
              Subjects *
            </label>
            <Select
              value={formData.subjects}
              onChange={(value) => setFormData({ ...formData, subjects: value })}
              options={subjects?.map(s => ({ value: s.id, label: s.name }))}
              placeholder="Select subjects for this class"
              multiple
            />
            {errors.subjects && <p className="text-red-400 text-xs mt-1">{errors.subjects}</p>}
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-4 bg-[#141414] rounded-xl border border-[#262626]">
            <div>
              <label className="text-sm font-medium text-[#e4e4e7] block">
                Active Status
              </label>
              <p className="text-xs text-[#999999] mt-1">
                {formData.isActive ? 'Class is active' : 'Class is inactive'}
              </p>
            </div>
            <ToggleSwitch 
              checked={formData.isActive} 
              onChange={(value) => setFormData({ ...formData, isActive: value })}
            />
          </div>
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
            className="px-5 py-2.5 rounded-xl bg-[#703bf7] text-white hover:bg-[#8254f8] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : classData ? 'Update Class' : 'Create Class'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClassFormDialog;