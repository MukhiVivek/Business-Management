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

  console.log(data);

  return (
    <div className="products">
      <table className="w-full border-t rounded-sm">
        <thead className="bg-gray-50 text-center text-gray-500 uppercase text-xs  border-b border-l border-r dark:bg-gray-100">
          <tr>
            <th className="px-2 py-1 pl-2">
              <input type="checkbox" name="customerCheckbox" onChange={handleSelectAll} />
            </th>
            <th className="px-4 py-3">Product Name</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Stock</th>
          </tr>
        </thead>
        <tbody className="divide-y border-b border-l text-center border-r whitespace-nowrap">
          {data.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-2 py-1">
                <input type="checkbox" name="customerCheckbox" />
              </td>
              <td className="px-4 py-3">{product.name}</td>
              <td className="px-4 py-3">{product.price}</td>
              <td className="px-4 py-3">{product.product_type}</td>
              <td className="px-4 py-3">{product.description}</td>
              <td className="px-4 py-3">{product.stock}</td>
            </tr>
          ))}          
        </tbody>
      </table>
    </div>
  );
}

export default ProductsList;
