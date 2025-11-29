const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-lg mx-4">
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className = '' }) => (
  <div className={`bg-gray-10 rounded-2xl shadow-2xl border border-gray-20 ${className}`}>
    {children}
  </div>
);

export const DialogHeader = ({ children }) => (
  <div className="px-6 pt-6 pb-4 border-b border-gray-20">
    {children}
  </div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-2xl font-bold text-white">{children}</h2>
);

export const DialogDescription = ({ children }) => (
  <p className="text-sm text-gray-60 mt-1">{children}</p>
);

export const DialogFooter = ({ children }) => (
  <div className="px-6 py-4 flex justify-end gap-3 border-t border-gray-20">
    {children}
  </div>
);

export default Dialog;