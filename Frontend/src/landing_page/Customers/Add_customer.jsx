import { useRef } from "react";

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
    
    
    function submit() {
    }
    
    return (
        <div className="flex min-h-screen justify-center bg-white px-6 py-10 mx-auto">
            <div className="md:w-160">
            <h1 className="text-3xl font-semibold mb-6">Add customer : </h1>
                <div className="mb-4 ">
                    <label className="block mb-1">customer Name:</label>
                    <input
                        type="text"
                        placeholder="Enter customer Name"
                        ref={customer_name}
                        className="w-full border border-gray-300 px-4 py-2 rounded-2xl"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">customer code:</label>
                    <input
                        type="text"
                        ref={custom_code}
                        placeholder="Enter customer code"
                        className="w-full border border-gray-300 px-4 py-2 rounded-2xl"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">customer phone_number:</label>
                    <input
                        type="text"
                        ref={customer_phone_number}
                        placeholder="Enter customer phone_number"
                        className="w-full border border-gray-300 px-4 py-2 rounded-2xl"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Open Balance :</label>
                    <input
                        type="text"
                        placeholder="Enter Balance"
                        ref={customer_balance}
                        className="w-full border border-gray-300 px-4 py-2 rounded-2xl"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Location :</label>
                    <input
                        type="text"
                        placeholder="Enter Location"
                        ref={customer_location}
                        className="w-full border border-gray-300 px-4 py-2 rounded-2xl"
                    />
                </div>

                <div className="mb-2">
                    <label className="block font-medium">customer Address: </label>
                </div>

                <div className="border border-black rounded-2xl p-4 space-y-4">
                    <div>
                        <label className="block mb-1">customer Street Address:</label>
                        <input
                            type="text"
                            placeholder="Enter customer Street Address"
                            ref={customer_street_address}
                            className="w-full border border-gray-300 px-4 py-2 rounded-2xl"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">customer Area:</label>
                            <input
                                type="text"
                                placeholder="Enter customer Area"
                                ref={customer_area}
                                className="w-full border border-gray-300 px-4 py-2 rounded-2xl"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">customer city:</label>
                            <input
                                type="text"
                                placeholder="Enter customer city"
                                ref={customer_city}
                                className="w-full border border-gray-300 px-4 py-2 rounded-2xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">customer State:</label>
                            <input
                                type="text"
                                placeholder="Enter customer State"
                                ref={customer_state}
                                className="w-full border border-gray-300 px-4 py-2 rounded-2xl"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">customer pincode:</label>
                            <input
                                type="text"
                                placeholder="Enter customer pincode"
                                ref={customer_pincode}
                                className="w-full border border-gray-300 px-4 py-2 rounded-2xl"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        onClick={submit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  my-2 mx-auto rounded-xl"
                    >
                        Add Customer    
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Add_customer;