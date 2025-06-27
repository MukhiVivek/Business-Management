import "../../App.css";
import { BsSliders } from "react-icons/bs";

function ProductsList({ data }) {
  
  // Checks all the row entries
  const handleSelectAll = (e) => {
    const checkboxes = document.querySelectorAll(
      'input[name="customerCheckbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked;
    });
  };

  return (
    <div className="products">
      <table className="w-full border-t rounded-sm">
        <thead className="bg-gray-50 text-center text-gray-500 uppercase text-xs  border-b border-l border-r dark:bg-gray-100">
          <tr>
            <th className="px-2 py-1 pl-2">
              <input type="checkbox" name="customerCheckbox" onChange={handleSelectAll} />
            </th>
            <th className="px-4 py-3">Product Id</th>
            <th className="px-4 py-3">Product Name</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Stock</th>
          </tr>
        </thead>
        <tbody className="divide-y border-b border-l text-center border-r whitespace-nowrap">
          {/* Mock Entries */}
          <tr className="hover:bg-gray-50">
            <td className="px-2 py-1">
              <input type="checkbox" name="customerCheckbox" />
            </td>
            <td className="px-4 py-3 text-blue-600">#101</td>
            <td className="px-4 py-3">Swaminarayan Wheat</td>
            <td className="px-4 py-3">₹1,000</td>
            <td className="px-4 py-3">Wheat</td>
            <td className="px-4 py-3">High-quality processed wheat</td>
            <td className="px-4 py-3">20</td>
          </tr>

          <tr className="hover:bg-gray-50">
            <td className="px-2 py-1">
              <input type="checkbox" name="customerCheckbox" />
            </td>
            <td className="px-4 py-3 text-blue-600">#102</td>
            <td className="px-4 py-3">Amul Gold Milk</td>
            <td className="px-4 py-3">₹580</td>
            <td className="px-4 py-3">Dairy</td>
            <td className="px-4 py-3">Full cream milk 1L packs</td>
            <td className="px-4 py-3">50</td>
          </tr>

          <tr className="hover:bg-gray-50">
            <td className="px-2 py-1">
              <input type="checkbox" name="customerCheckbox" />
            </td>
            <td className="px-4 py-3 text-blue-600">#103</td>
            <td className="px-4 py-3">Rajwadi Basmati Rice</td>
            <td className="px-4 py-3">₹1,800</td>
            <td className="px-4 py-3">Rice</td>
            <td className="px-4 py-3">Premium long grain basmati</td>
            <td className="px-4 py-3">35</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ProductsList;
