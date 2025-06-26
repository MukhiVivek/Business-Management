import "../../../App.css";
import { BsSliders } from "react-icons/bs";

function CustomersList({ customerdata }) {
  return (
    <div className="customers">
      <table className="w-full border-t text-left rounded-sm">
        <thead className="bg-gray-50 text-center text-gray-500 uppercase text-xs  border-b border-l border-r dark:bg-gray-100">
          <tr>
            <th className="px-2 py-1 pl-2">
              <input type="checkbox" />
            </th>
            <th className="px-4 py-3">Customer Name</th>
            <th className="px-4 py-3">Company Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Work Phone</th>
            <th className="px-4 py-3">Receivables (BCY)</th>
            <th className="px-4 py-3">Unused Credits (BCY)</th>
          </tr>
        </thead>
        <tbody className="divide-y border-b border-l border-r text-center whitespace-nowrap">
          {/* Mock entries */}
          <tr className="hover:bg-gray-50">
            <td className="px-2 py-1">
              <input type="checkbox" />
            </td>
            <td className="px-4 py-3">Lokeshbhai Ramesh Divani</td>
            <td className="px-4 py-3">Lokesh Gruh Udhyog</td>
            <td className="px-4 py-3">lokesh123@gmail.com</td>
            <td className="px-4 py-3">8794651651</td>
            <td className="px-4 py-3">20,784</td>
            <td className="px-4 py-3">12,125</td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-2 py-1">
              <input type="checkbox" />
            </td>
            <td className="px-4 py-3">Mehulbhai Suresh Patel</td>
            <td className="px-4 py-3">Patel Agro Exports</td>
            <td className="px-4 py-3">mehul.patel87@gmail.com</td>
            <td className="px-4 py-3">9827345610</td>
            <td className="px-4 py-3">35,600</td>
            <td className="px-4 py-3">18,200</td>
          </tr>

          <tr className="hover:bg-gray-50">
            <td className="px-2 py-1">
              <input type="checkbox" />
            </td>
            <td className="px-4 py-3">Jinalben Arvind Shah</td>
            <td className="px-4 py-3">Jinal Textiles</td>
            <td className="px-4 py-3">jinalshah1990@yahoo.com</td>
            <td className="px-4 py-3">9378124578</td>
            <td className="px-4 py-3">48,920</td>
            <td className="px-4 py-3">31,750</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CustomersList;
