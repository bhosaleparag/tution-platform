'use client';
import { useState } from 'react';
import Dialog, { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/Dialog';

const DeleteConfirmDialog = ({ open, onOpenChange, teacher, onConfirm }) => {
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
          <DialogTitle>Delete Teacher</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this teacher? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="p-4 bg-gray-08 rounded-xl border border-gray-30">
            <p className="text-white font-medium">{teacher?.name}</p>
            <p className="text-sm text-gray-60 mt-1">{teacher?.email}</p>
            <p className="text-sm text-gray-60">{teacher?.contact}</p>
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
            {loading ? 'Deleting...' : 'Delete Teacher'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;