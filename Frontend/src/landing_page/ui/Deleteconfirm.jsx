import React, { useState } from "react";

export default function Deletefunction() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    // Your delete logic here
    alert("Item deleted");
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className="flex flex-col items-center mt-12">
      <button
        onClick={handleDeleteClick}
        className="px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
      >
        Delete
      </button>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-80">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={handleCancel}
                className="px-5 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}