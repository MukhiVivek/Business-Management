import "../../../App.css";
import { BsSliders } from "react-icons/bs";

function CustomersList({ customerdata }) {
  return (
    <div className="customers overflow-y-auto">
      <table className="w-full table-fixed border-t text-left rounded-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider border-b border-l border-r dark:bg-gray-100">
          <tr>
            <th className="px-2 py-1 pl-17">
              <BsSliders size={20}/>
            </th>
            <th className="px-4 py-3">
              Name <i className="fas fa-sort text-xs ml-1"></i>
            </th>
            <th className="px-4 py-3">Company Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Work Phone</th>
            <th className="px-4 py-3">Receivables (BCY)</th>
            <th className="px-4 py-3">Unused Credits (BCY)</th>
            <th className="px-4 py-3">
              <i className="fas fa-search"></i>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y border-b border-l border-r whitespace-nowrap">
          <tr className="hover:bg-gray-50">
            <td className="px-2 py-1 pl-17">
              <input type="checkbox" />
            </td>
            <td className="px-4 py-3">Lokeshbhai Ramesh Divani</td>
            <td className="px-4 py-3">Lokesh Gruh Udhyog</td>
            <td className="px-4 py-3">lokesh123@gmail.com</td>
            <td className="px-4 py-3">8794651651</td>
            <td className="px-4 py-3">20,784</td>
            <td className="px-4 py-3">12,125</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CustomersList;
