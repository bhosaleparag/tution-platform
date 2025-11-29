'use client';
import { useState } from 'react';
import Dialog, { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/Dialog';

const DeleteConfirmDialog = ({ open, onOpenChange, subject, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Subject</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this subject? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="p-4 bg-gray-08 rounded-xl border border-gray-30">
            <p className="text-white font-medium">{subject?.name}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-60">
                {subject?.instituteId ? 'Institute-specific' : 'Global'}
              </span>
              <span className="text-gray-40">•</span>
              <span className={`text-xs ${subject?.isActive ? 'text-green-500' : 'text-gray-60'}`}>
                {subject?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-5 py-2.5 rounded-xl border border-gray-20 text-white-90 hover:bg-gray-15 transition font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-medium disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Subject'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;