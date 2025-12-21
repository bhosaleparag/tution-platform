'use client';
import { useState } from "react";
import Dialog, { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/Dialog";

const DeleteConfirmDialog = ({ open, onOpenChange, classData, onConfirm }) => {
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
          <DialogTitle>Delete Class</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this class? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="p-4 bg-[#141414] rounded-xl border border-[#4d4d4d]">
            <p className="text-white font-medium">{classData?.title}</p>
            {classData?.section && (
              <p className="text-sm text-[#999999]">Section: {classData.section}</p>
            )}
            <p className="text-sm text-[#999999]">{classData?.studentsCount || 0} students</p>
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
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-medium disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Class'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;