import React from 'react'

function Top() {
    return (
        <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="text-3xl font-semibold">
                All Customers 
            </div>
            <div className="flex items-center gap-3">
                <button 
                className="bg-blue-600 font-bold hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => window.location.href = '/customers/add'}
                > 
                    + New
                </button>
            </div>
        </div>
    )
}

export default Top;


