import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../Config";

export function useCustomer() {
  const [data, setData] = useState([]);

  async function getData() {
    await axios
      .get(`${BACKEND_URL}/api/v1/customer/data`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setData(
          res.data.data.map((customer) => ({
            ...customer,
            id: customer._id?.$oid || customer._id,
            _id: customer._id?.$oid || customer._id,
            createdAt: customer.createdAt?.$date || customer.createdAt,
            updatedAt: customer.updatedAt?.$date || customer.updatedAt,
            company: customer.company || "---",
            email: customer.email || "---",
          }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getData();
    let interval = setInterval(() => {
      getData();
    }, 10 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { data };
}
