import { useState } from "react";

function CustomerForm() {
  const [customerType, setCustomerType] = useState('Business');
  const [salutation, setSalutation] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      {/* Header */}
      <div className="max-w-screen mx-auto mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">New Customer</h1>
        <p className="text-blue-600 text-sm mt-2 cursor-pointer hover:underline">
          Fetch Customer Details From GSTN &gt;
        </p>
      </div>

      {/* Form */}
      <div className="bg-white max-w-6xl mx-auto p-8 rounded-lg shadow-sm space-y-8">
        {/* Customer Type */}
        <div className="space-y-2">
          <label className="text-gray-700 font-medium flex items-center gap-1">
            Customer Type <span className="text-gray-400 cursor-pointer">ⓘ</span>
          </label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="radio"
                name="customerType"
                value="Business"
                checked={customerType === 'Business'}
                onChange={() => setCustomerType('Business')}
                className="accent-blue-600"
              />
              Business
            </label>
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="radio"
                name="customerType"
                value="Individual"
                checked={customerType === 'Individual'}
                onChange={() => setCustomerType('Individual')}
                className="accent-blue-600"
              />
              Individual
            </label>
          </div>
        </div>

        {/* Primary Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-gray-700 font-medium flex items-center gap-1">
              Primary Contact <span className="text-gray-400 cursor-pointer">ⓘ</span>
            </label>
            <select
              value={salutation}
              onChange={(e) => setSalutation(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Salutation</option>
              <option>Mr.</option>
              <option>Mrs.</option>
              <option>Ms.</option>
              <option>Miss</option>
              <option>Dr.</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium">&nbsp;</label>
            <input
              type="text"
              placeholder="First Name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium">&nbsp;</label>
            <input
              type="text"
              placeholder="Last Name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Company Name */}
        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Company Name</label>
          <input
            type="text"
            className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Display Name */}
        <div className="space-y-2">
          <label className="text-red-600 font-medium flex items-center gap-1">
            Display Name* <span className="text-gray-400 cursor-pointer">ⓘ</span>
          </label>
          <select className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Select or type to add</option>
          </select>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Currency</label>
          <select disabled className="w-full md:w-1/2 border border-gray-300 bg-gray-100 rounded px-3 py-2 text-gray-500">
            <option>INR - Indian Rupee</option>
          </select>
          <p className="text-gray-500 text-sm mt-1">
            Currency cannot be edited as multi-currency handling is unavailable in Zoho Invoice.
          </p>
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <label className="text-gray-700 font-medium flex items-center gap-1">
            Email Address <span className="text-gray-400 cursor-pointer">ⓘ</span>
          </label>
          <input
            type="email"
            className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone Buttons */}
        <div className="space-y-2">
          <label className="text-gray-700 font-medium flex items-center gap-1">
            Phone <span className="text-gray-400 cursor-pointer">ⓘ</span>
          </label>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 w-40 border border-gray-300 rounded px-4 py-2 text-gray-700 hover:bg-gray-100">
              <i className="fas fa-phone"></i> Work Phone
            </button>
            <button className="flex items-center gap-2 w-40 border border-gray-300 rounded px-4 py-2 text-gray-700 hover:bg-gray-100">
              <i className="fas fa-mobile-alt"></i> Mobile
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-300 text-sm font-medium mt-8">
          <button className="border-b-2 border-blue-600 text-blue-600 py-2">Other Details</button>
          <button className="hover:text-blue-600 py-2">Address</button>
          <button className="hover:text-blue-600 py-2">Contact Persons</button>
          <button className="hover:text-blue-600 py-2">Custom Fields</button>
          <button className="hover:text-blue-600 py-2">Remarks</button>
        </div>

        {/* PAN */}
        <div className="space-y-2">
          <label className="text-gray-700 font-medium">PAN</label>
          <input
            type="text"
            className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded">
            Save
          </button>
          <button className="bg-white border hover:bg-gray-100 text-gray-700 font-semibold px-8 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerForm;
