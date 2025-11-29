'use client'; 
import { useEffect, useState } from "react";
import Dialog, { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/Dialog";
import ToggleSwitch from "../ui/ToggleSwitch";
import Input from "../ui/Input";
import Select from "../ui/Select";

const SubjectFormDialog = ({ open, onOpenChange, subject, onSubmit, institutes }) => {
  const [formData, setFormData] = useState({ name: '', instituteId: '', isActive: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name,
        instituteId: subject.instituteId || '',
        isActive: subject.isActive
      });
    } else {
      setFormData({ name: '', instituteId: '', isActive: true });
    }
  }, [subject, open]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    onOpenChange(false);
  };

  const instituteOptions = [
    { value: '', label: 'Global (All Institutes)' },
    ...institutes.map(inst => ({
      value: inst.id,
      label: inst.name
    }))
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {subject ? 'Edit Subject' : 'Add New Subject'}
          </DialogTitle>
          <DialogDescription>
            {subject ? 'Update subject details below' : 'Enter subject information to create new subject'}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          {/* Subject Name */}
          <Input
            type="text"
            theme="dark"
            label='Subject Name *'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Mathematics, Biology, Scholarship 10th"
          />

          {/* Institute Selection */}
          
          <Select
            label='Institute'
            value={formData.instituteId}
            onChange={(value) => setFormData({ ...formData, instituteId: value })}
            options={instituteOptions}
            placeholder="Select institute"
          />
          <p className="text-xs text-[#999999]">
            Leave as "Global" to make this subject available to all institutes
          </p>

          {/* Active Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#141414] rounded-xl border border-[#262626]">
            <div>
              <label className="text-sm font-medium text-[#e4e4e7] block">
                Active Status
              </label>
              <p className="text-xs text-[#999999] mt-1">
                {formData.isActive ? 'Subject is currently active' : 'Subject is currently inactive'}
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
            disabled={loading || !formData.name.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#703bf7] text-white hover:bg-[#8254f8] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : subject ? 'Update Subject' : 'Create Subject'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubjectFormDialog;