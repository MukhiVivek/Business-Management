import React from "react";

const LatestTransaction = () => {
  const getTypeBadgeClass = (type) => {
    switch (type) {
      case "Sales":
        return "bg-green-100 text-green-700";
      case "Invoice":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const transactions = [
    {
      name: "Mukhi Vivek",
      type: "Sales",
      date: "12/2/2025",
      amount: "₹12,000",
    },
    {
      name: "Chirag Mishra",
      type: "Invoice",
      date: "10/2/2025",
      amount: "₹25,500",
    },
    {
      name: "OSIA LIMITED",
      type: "Invoice",
      date: "12/2/2025",
      amount: "₹90,500",
    },
    { name: "Mukeshbhai", type: "Sales", date: "15/2/2025", amount: "₹11,000" },
    {
      name: "Rameshbhai Patel",
      type: "Sales",
      date: "15/2/2025",
      amount: "₹9,000",
    },
  ];

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
      <table className="w-full text-sm text-left text-gray-200">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
          Latest Transactions
        </caption>
        <thead className="text-xs uppercase bg-gray-50 text-gray-600">
          <tr>
            <th scope="col" className="px-4 py-3">
              Party Name
            </th>
            <th scope="col" className="px-4 py-3">
              Type
            </th>
            <th scope="col" className="px-4 py-3">
              Date
            </th>
            <th scope="col" className="px-4 py-3">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="bg-white border-b hover:bg-gray-50">
              <th
                scope="row"
                className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {transaction.name}
              </th>
              <td className="px-4 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeClass(
                    transaction.type
                  )}`}
                >
                  {transaction.type}
                </span>
              </td>
              <td className="px-4 py-4 text-gray-800">{transaction.date}</td>
              <td className="px-4 py-4 font-semibold text-gray-900">
                {transaction.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LatestTransaction;
