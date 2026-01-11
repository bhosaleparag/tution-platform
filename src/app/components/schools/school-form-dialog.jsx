'use client';

import { useEffect, useState } from "react";
import Dialog, { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/Dialog";
import Input from "../ui/Input";
import ToggleSwitch from "../ui/ToggleSwitch";

const SchoolFormDialog = ({ open, onOpenChange, school, onSubmit }) => {
  const [formData, setFormData] = useState({name: '', isActive: true});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (school) {
      setFormData({
        name: school.name,
        isActive: school.isActive
      });
    } else {
      setFormData({ name: '', isActive: true });
    }
  }, [school, open]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    
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
            {school ? 'Edit Institution' : 'Add New Institution'}
          </DialogTitle>
          <DialogDescription>
            {school ? 'Update Institution details below' : 'Enter Institution information to create new institute'}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          {/* School Name */}
            <Input
              type="text"
              value={formData.name}
              label='Institution Name *'
              placeholder="e.g., ABC Institute"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

          {/* Active Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#141414] rounded-xl border border-[#262626]">
            <div>
              <label className="text-sm font-medium text-[#e4e4e7] block">
                Active Status
              </label>
              <p className="text-xs text-[#999999] mt-1">
                {formData.isActive ? 'Institution is currently active' : 'Institution is currently inactive'}
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
            {loading ? 'Saving...' : school ? 'Update Institution' : 'Create Institution'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SchoolFormDialog;