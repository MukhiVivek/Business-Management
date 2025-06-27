import axios from "axios";
import { useRef } from "react";
import { BACKEND_URL } from "../../Config";

function Add_customer() {
  const customer_name = useRef();
  const custom_code = useRef();
  const customer_phone_number = useRef();
  const customer_balance = useRef();
  const customer_location = useRef();
  const customer_street_address = useRef();
  const customer_area = useRef();
  const customer_state = useRef();
  const customer_pincode = useRef();
  const customer_city = useRef();

  async function submit() {
    await axios.post(
      BACKEND_URL + "/api/v1/customer/add",
      {
        name: customer_name.current.value,
        work_phone_number: customer_phone_number.current.value,
        phone_number: customer_phone_number.current.value,
        customer_type: "individual",
        display_name: customer_name.current.value,
        // email: ,
        balance: customer_balance.current.value,
        location: customer_location.current.value,
        customer_billing_address: {
          street_addres: customer_street_address.current.value,
          state: customer_state.current.value,
          pincode: customer_pincode.current.value,
          city: customer_city.current.value,
          area: customer_area.current.value,
        },
      },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    alert("Customer Successfully Added");
  }

  return (
    <div className="pl-18 pt-2 pr-9 min-h-screen block rounded-lg w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2 mt-1">
        <div className="flex gap-3">{/* Ignore this d */}</div>
        <div>
          <h1 className="text-xl font-semibold text-gray-700">Customers</h1>
        </div>
      </div>
      <div className="w-full">
        <h1 className="text-xl font-semibold mb-3">Add Customer</h1>

        {/* customer form */}
        <div className="mb-4 ">

          <div className="border p-4">
            {/* Customer name */}
            <div className="mb-4">
              <label className="block mb-1">Customer Name:</label>
              <input
                type="text"
                placeholder="Enter customer Name"
                ref={customer_name}
                className="w-full border border-gray-300 px-4 py-2"
              />
            </div>

            {/* Customer code */}
            <div className="mb-4">
              <label className="block mb-1">Customer Code:</label>
              <input
                type="text"
                ref={custom_code}
                placeholder="Enter customer code"
                className="w-full border border-gray-300 px-4 py-2"
              />
            </div>

            {/* Customer phone_number */}
            <div className="mb-4">
              <label className="block mb-1">Customer Phone_Number:</label>
              <input
                type="text"
                ref={customer_phone_number}
                placeholder="Enter customer phone_number"
                className="w-full border border-gray-300 px-4 py-2"
              />
            </div>

            {/* Open Balance */}
            <div className="mb-4">
              <label className="block mb-1">Open Balance :</label>
              <input
                type="text"
                placeholder="Enter Balance"
                ref={customer_balance}
                className="w-full border border-gray-300 px-4 py-2"
              />
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="block mb-1">Location :</label>
              <input
                type="text"
                placeholder="Enter Location"
                ref={customer_location}
                className="w-full border border-gray-300 px-4 py-2"
              />
            </div>

            {/* Customer street address */}
            <div className="mb-4">
              <div>
                <label className="block mb-1">Customer Street Address:</label>
                <input
                  type="text"
                  placeholder="Enter customer Street Address"
                  ref={customer_street_address}
                  className="w-full border border-gray-300 px-4 py-2  "
                />
              </div>

              {/* Customer Area & City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {/* Customer Area */}
                <div>
                  <label className="block mb-1">Customer Area:</label>
                  <input
                    type="text"
                    placeholder="Enter customer Area"
                    ref={customer_area}
                    className="w-full border border-gray-300 px-4 py-2  "
                  />
                </div>

                {/* Customer city */}
                <div>
                  <label className="block mb-1">Customer City:</label>
                  <input
                    type="text"
                    placeholder="Enter customer city"
                    ref={customer_city}
                    className="w-full border border-gray-300 px-4 py-2"
                  />
                </div>
              </div>

              {/* Customer State & pincode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {/* Customer State */}
                <div>
                  <label className="block mb-1">Customer State:</label>
                  <input
                    type="text"
                    placeholder="Enter customer State"
                    ref={customer_state}
                    className="w-full border border-gray-300 px-4 py-2"
                  />
                </div>

                {/* Customer pincode */}
                <div>
                  <label className="block mb-1">Customer Pincode:</label>
                  <input
                    type="text"
                    placeholder="Enter customer pincode"
                    ref={customer_pincode}
                    className="w-full border border-gray-300 px-4 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Add customer button */}
            <div className="mt-4">
              <button
                type="submit"
                onClick={submit}
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 mx-auto shadow-2xl"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Add_customer;
