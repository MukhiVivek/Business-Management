import React from 'react';

const LatestTransaction = () => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-black dark:bg-gray-100">
          Latest Transactions
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-200 dark:text-black">
          <tr>
            <th scope="col" className="px-4 py-3">Party name</th>
            <th scope="col" className="px-4 py-3">Type</th>
            <th scope="col" className="px-4 py-3">Date</th>
            <th scope="col" className="px-4 py-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: "Mukhi Vivek", type: "Sales", date: "12/2/2025", amount: "₹12000" },
            { name: "Chirag Mishra", type: "Invoice", date: "10/2/2025", amount: "₹25500" },
            { name: "Rameshbhai Patel", type: "Sales", date: "15/2/2025", amount: "₹9000" },
          ].map((transaction, index) => (
            <tr key={index} className="bg-white border-b dark:bg-gray-100 dark:border-gray-100">
              <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-black">
                {transaction.name}
              </th>
              <td className="px-4 py-4">{transaction.type}</td>
              <td className="px-4 py-4">{transaction.date}</td>
              <td className="px-4 py-4">{transaction.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LatestTransaction;