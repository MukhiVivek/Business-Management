
// function AddPayment() {
    
//     async function submit() {
//         await axios.post(
//             BACKEND_URL + "/api/v1/payment/add",
//             {
//                 payment_no: payment_no.current.value,
//                 invoice_no: invoice_no.current.value,
//                 amount: amount.current.value,
//                 payment_method: payment_method.current.value,
//                 description: description.current.value,
//                 payment_date: payment_date.current.value,
//             },
//             {
//                 headers: {
//                     token: localStorage.getItem("token"),
//                 },
//             }
//         );
//         alert("Payment Successfully Added");
//         window.location.href = "/payments";
//     }

//     return (
//         <div className="pl-18 pt-2 pr-9 min-h-screen block rounded-lg w-full">
//             <div className="flex justify-between items-start mb-2 mt-1">
//                 <div className="flex gap-3"></div>
//                 <div>
//                     <h1 className="text-xl font-semibold text-gray-700">Payments</h1>
//                 </div>
//             </div>
//             <div className="w-full">
//       <div className="w-full">
//         <h1 className="text-xl font-semibold mb-3">Add Product</h1>

//         {/* product form */}
//         <div className="mb-4">
//           <div className="border p-4">
//             {/* product name */}
//             <div className="mb-4">
//               <label className="block mb-1">Product Name:</label>
//               <input
//                 type="text"
//                 placeholder="Enter your Product Name"
//                 ref={product_name}
//                 className="w-full border border-gray-300 px-4 py-2"
//               />
//             </div>

//             {/* product price */}
//             <div className="mb-4">
//               <label className="block mb-1">Product Price:</label>
//               <input
//                 type="number"
//                 placeholder="Enter Product Price"
//                 ref={product_price}
//                 className="w-full border border-gray-300 px-4 py-2"
//               />
//             </div>

//             {/* product type */}
//             <div className="mb-4">
//               <label className="block mb-1">Product Type:</label>
//               <input
//                 type="text"
//                 placeholder="Enter Product Type"
//                 ref={product_type}
//                 className="w-full border border-gray-300 px-4 py-2"
//               />
//             </div>

//             {/* product description */}
//             <div className="mb-4">
//               <label className="block mb-1">Product Description:</label>
//               <input
//                 type="text"
//                 placeholder="Enter Product Description"
//                 ref={product_description}
//                 className="w-full border border-gray-300 px-4 py-2"
//               />
//             </div>

//             {/* product stock */}
//             <div className="mb-4">
//               <label className="block mb-1">Product Stock:</label>
//               <input
//                 type="number"
//                 placeholder="Enter Product Stock"
//                 ref={product_stock}
//                 className="w-full border border-gray-300 px-4 py-2"
//               />
//             </div>

//             {/* Add product button */}
//             <div className="mt-4">
//               <button
//                 type="submit"
//                 onClick={submit}
//                 className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 mx-auto"
//               >
//                 Add Product
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import axios from "axios";
import { useRef } from "react";
import { BACKEND_URL } from "../../Config";

function AddPayment() {
    const payment_no = useRef();
    const invoice_no = useRef();
    const amount = useRef();
    const payment_method = useRef();
    const description = useRef();
    const payment_date = useRef();

    const submit = () =>{

    }


    return (
        <div className="pl-18 pt-2 pr-9 min-h-screen block rounded-lg w-full">
            <div className="flex justify-between items-start mb-2 mt-1">
                <div className="flex gap-3"></div>
                <div>
                    <h1 className="text-xl font-semibold text-gray-700">Payments</h1>
                </div>
            </div>
            <div className="w-full">
                <h1 className="text-xl font-semibold mb-3">Add Payment</h1>

                <div className="mb-4">
                    <div className="border p-4">
                        {/* First row with three fields */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {/* Payment No */}
                            <div>
                                <label className="block mb-1">Payment No:</label>
                                <input
                                    type="text"
                                    placeholder="Enter Payment Number"
                                    ref={payment_no}
                                    className="w-full border border-gray-300 px-4 py-2"
                                />
                            </div>

                            {/* Invoice No */}
                            <div>
                                <label className="block mb-1">Invoice No:</label>
                                <input
                                    type="text"
                                    placeholder="Enter Invoice Number"
                                    ref={invoice_no}
                                    className="w-full border border-gray-300 px-4 py-2"
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block mb-1">Date:</label>
                                <input
                                    type="date"
                                    ref={payment_date}
                                    className="w-full border border-gray-300 px-4 py-2"
                                />
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="mb-4">
                            <label className="block mb-1">Amount:</label>
                            <input
                                type="number"
                                placeholder="Enter Amount"
                                ref={amount}
                                className="w-full border border-gray-300 px-4 py-2"
                            />
                        </div>

                        {/* Payment Method */}
                        <div className="mb-4">
                            <label className="block mb-1">Payment Method:</label>
                            <select
                                ref={payment_method}
                                className="w-full border border-gray-300 px-4 py-2"
                            >
                                <option value="">Select Payment Method</option>
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="upi">UPI</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="block mb-1">Description:</label>
                            <textarea
                                placeholder="Enter Description"
                                ref={description}
                                className="w-full border border-gray-300 px-4 py-2"
                            />
                        </div>

                        {/* Submit button */}
                        <div className="mt-4">
                            <button
                                type="submit"
                                onClick={submit}
                                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 mx-auto"
                            >
                                Add Payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddPayment;
