import "../../App.css";
import { BsSliders } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function ProductsList({ data }) {
  const navigate = useNavigate();

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
            <th className="px-1 py-3 text-left">Product Name</th>
            <th className="px-1 py-3">MRP</th>
            <th className="px-1 py-3">Sales Price</th>
            <th className="px-1 py-3">Purchase Price</th>
            <th className="px-1 py-3">Stock</th>
            <th className="px-1 py-3">Type</th>
            <th className="px-1 py-3">Packet Size</th>
            <th className="px-1 py-3">Box Size</th>
            <th className="px-1 py-3">Description</th>
            <th className="px-1 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y border-b border-l text-center border-r whitespace-nowrap">
          {data.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-2 py-1 ">
                <input type="checkbox" name="customerCheckbox" />
              </td>
              <td className="px-1 py-3 text-blue-600 cursor-pointer text-left">{product.name}</td>
              <td className="px-1 py-3">{product.mrp || 0}</td>
              <td className="px-1 py-3">{product.price}</td>
              <td className="px-1 py-3 font-semibold text-gray-500">{product.tax_purchase_price || 0}</td>
              <td className="px-1 py-3">{product.stock}</td>
              <td className="px-1 py-3">{product.product_type}</td>
              <td className="px-1 py-3">{product.packet_size || 0}</td>
              <td className="px-1 py-3">{product.box_size || 0}</td>
              <td className="px-1 py-3 text-left pr-4">{product.description}</td>
              <td className="px-1 py-3">
                <button
                  onClick={() => navigate(`/products/edit/${product._id}`)}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsList;
