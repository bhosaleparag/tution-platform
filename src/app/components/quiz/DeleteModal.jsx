import Button from '../ui/Button';

export default function DeleteModal({ quiz, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1a1a] rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Delete Quiz</h3>
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete "{quiz?.title}"? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={loading} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading} className="flex-1">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
