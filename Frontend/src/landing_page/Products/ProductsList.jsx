import "../.././App.css";
import React from "react";

function ProductsList({ data }) {

// Temporary Mock data
  const products = [
    {
      id: "prod001", 
      name: "SwamiNarayan Lot",
      price: 1000, // Price in INR (₹)
      type: "Lot",
      description:
        "A collection of spiritual items from the SwamiNarayan tradition.",
      stock: 20,
    },
    {
      id: "prod002",
      name: "Handcrafted Wooden Idol",
      price: 2500,
      type: "Idol",
      description: "Finely carved idol of a deity, perfect for home altars.",
      stock: 5,
    },
    {
      id: "prod003",
      name: "Organic Incense Sticks (Variety Pack)",
      price: 150,
      type: "Fragrance",
      description:
        "Assorted pack of natural, aromatic incense sticks for meditation.",
      stock: 150,
    },
    {
      id: "prod004",
      name: "Copper Water Bottle",
      price: 750,
      type: "Utensil",
      description: "Pure copper bottle, known for its health benefits.",
      stock: 30,
    },
    {
      id: "prod005",
      name: "Devotional Music CD",
      price: 300,
      type: "Media",
      description: "Collection of soothing devotional chants and bhajans.",
      stock: 45,
    },
    {
      id: "prod006",
      name: "Rudraksha Mala (108 beads)",
      price: 1200,
      type: "Accessory",
      description:
        "Authentic Rudraksha beads, ideal for chanting and spiritual practice.",
      stock: 12,
    },
    {
      id: "prod007",
      name: "Sandalwood Paste (50g)",
      price: 400,
      type: "Pooja Item",
      description:
        "Pure sandalwood paste for religious ceremonies and daily use.",
      stock: 70,
    },
    {
      id: "prod008",
      name: "Cotton Dhoti Set",
      price: 850,
      type: "Apparel",
      description:
        "Comfortable and traditional cotton dhoti with matching stole.",
      stock: 25,
    },
  ];

  return (
    <div className="products sm-rounded-lg pt-4">
      <table className="w-full text-black text-left">
        <thead className="bg-white text-gray-500 uppercase text-xs tracking-wider dark:bg-gray-100">
          <tr>
            <th className="px-4 py-3">
              <i className="fas fa-sliders-h"></i>
            </th>
            <th className="px-4 py-3">
              Name <i className="fas fa-sort text-xs ml-1"></i>
            </th>
            <th className="px-4 py-3">Price(₹)</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">
              <i className="fas fa-search"></i>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((product)=>(
            <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-4"><input type="checkbox" /></td>
                <td className="px-4 py-4">{product.name}</td>
                <td className="px-4 py-4">{product.price}</td>
                <td className="px-4 py-4">{product.type}</td>
                <td className="px-4 py-4">{product.description}</td>
                <td className="px-4 py-4">{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsList;


<tr className="hover:bg-gray-50">
            <td className="px-4 py-4">
              <input type="checkbox" />
            </td>
            <td className="px-4 py-4">SwamiNarayan Lot</td>
            <td className="px-4 py-4">₹1000</td>
            <td className="px-4 py-4">Lot</td>
            <td className="px-4 py-4">description of lot</td>
            <td className="px-4 py-4">20</td>
          </tr>