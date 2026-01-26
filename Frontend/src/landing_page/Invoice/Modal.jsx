import React, { useEffect, useState } from 'react';

function Modal({ children, onClose, title = "Selection" }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
    return () => setIsOpen(false);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Modal Box */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-300 ease-out overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
