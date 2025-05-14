import React from 'react';

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-white/30">
      <div className="bg-white rounded-lg w-96 p-4 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
