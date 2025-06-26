import React from "react";

const OrdersList = () => {
  return (
    <div className="orders">
      <table className="w-full border-t text-left rounded-sm">
        <thead className="bg-gray-50 text-center text-gray-500 uppercase text-xs  border-b border-l border-r dark:bg-gray-100">
          <tr>
            <th className="px-2 py-1 pl-2">
              <input type="checkbox" />
            </th>
            <th className="px-4 py-3">Order No</th>
            <th className="px-4 py-3">Date Created</th>
            <th className="px-4 py-3">Customer Name</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Due Date</th>
            <th className="px-4 py-3">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y border-b border-l border-r text-center whitespace-nowrap">
          {/* Mock entries */}
          <tr className="hover:bg-gray-50">
            <td className="px-2 py-1">
              <input type="checkbox" />
            </td>
            <td className="px-4 py-3 text-blue-600">#001</td>
            <td className="px-4 py-3">12/06/2025</td>
            <td className="px-4 py-3">Jinalben Arvind Shah</td>
            <td className="px-4 py-3">Pending</td>
            <td className="px-4 py-3">20/06/2025</td>
            <td className="px-4 py-3">32,125</td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-2 py-1">
              <input type="checkbox" />
            </td>
            <td className="px-4 py-3 text-blue-600">#002</td>
            <td className="px-4 py-3">14/06/2025</td>
            <td className="px-4 py-3">Mehulbhai Suresh Patel</td>
            <td className="px-4 py-3">Shipped</td>
            <td className="px-4 py-3">21/06/2025</td>
            <td className="px-4 py-3">18,900</td>
          </tr>

          <tr className="hover:bg-gray-50">
            <td className="px-2 py-1">
              <input type="checkbox" />
            </td>
            <td className="px-4 py-3 text-blue-600">#003</td>
            <td className="px-4 py-3">16/06/2025</td>
            <td className="px-4 py-3">Lokeshbhai Ramesh Divani</td>
            <td className="px-4 py-3">Delivered</td>
            <td className="px-4 py-3">22/06/2025</td>
            <td className="px-4 py-3">12,500</td>
          </tr>

          <tr className="hover:bg-gray-50">
            <td className="px-2 py-1">
              <input type="checkbox" />
            </td>
            <td className="px-4 py-3 text-blue-600">#004</td>
            <td className="px-4 py-3">18/06/2025</td>
            <td className="px-4 py-3">Rajeshbhai Nitin Thakkar</td>
            <td className="px-4 py-3">Cancelled</td>
            <td className="px-4 py-3">—</td>
            <td className="px-4 py-3">9,850</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrdersList;
