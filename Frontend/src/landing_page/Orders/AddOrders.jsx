import React from 'react'

const AddOrders = () => {
  return (
    <div className="pl-18 pt-2 pr-9 min-h-screen block rounded-lg w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2 mt-1">
        <div className="flex gap-3">
          {/* Ignore this d */}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-700">Orders</h1>
        </div>
      </div>
      <div className="w-full">
        <h1 className="text-xl font-semibold mb-3">Add Order</h1>

        {/* Order form */}
        <div className="mb-4">
          <div className="border p-4">
            {/* Order No */}
            <div className="mb-4">
              <label className="block mb-1">Order No:</label>
              <input
                type="number"
                placeholder="Enter your Order No"
                // ref={order_name}
                className="w-full border border-gray-300 px-4 py-2"
              />
            </div>

            {/* Order Creation date will be dynamically updated */}

            {/* Customer Name */}
            <div className="mb-4">
              <label className="block mb-1">Customer Name:</label>
              <input
                type="text"
                placeholder="Enter Customer Name"
                // ref={customer_name}
                className="w-full border border-gray-300 px-4 py-2"
              />
            </div>

            {/* Order Status */}
            <div className="mb-4">
              <label className="block mb-1">Order Status:</label>
              <input
                type="text"
                placeholder="Enter Order Status"
                // ref={order_status}
                className="w-full border border-gray-300 px-4 py-2"
              />
            </div>

            {/* Order due date */}
            <div className="mb-4">
              <label className="block mb-1">Order Due Date:</label>
              <input
                type="date"
                // ref={order_duedate}
                className="w-full border border-gray-300 px-4 py-2"
              />
            </div>

            {/* Add Order button */}
            <div className="mt-4">
              <button
                type="submit"
                // onClick={submit}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold py-2 px-4 mx-auto"
              >
                Add Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddOrders
