import axios from "axios";
import {  useEffect, useState } from "react";
import { BACKEND_URL } from "../Config";

interface transactionData {
  date: string;
  sender_id: {
    name: string;
    amount: number;
    phone: number;
  };
  s_amount: number;
  s_currency: "INR"| "RUB" | "USD";
  receiver_id: {
    name: string;
    amount: number; 
    phone: number;
  };
  r_balance: number;
  s_balance: number;
  r_amount: number;
  r_currency: "INR"| "RUB" | "USD";
  rate: number;
  status: string;
  note: string;
  runningBalances: {
    INR: number;
    RUB: number;
    USD: number;
  };
}

interface customerData {
  name: string;
  phone: number;
  INR: number;
  RUB: number;
  USD: number;
}

export function useCustomerDetailData(id : string | undefined) {

    const [transactionsdata , setTransactionsdata] = useState<transactionData[]>([]);
    const [customerdata , setCustomerdata] = useState<customerData>({
        name: "",
        phone: 0,
        INR: 0,
        RUB: 0, 
        USD: 0
    });
    
    async function getCustomerData() {
        await axios.get(`${BACKEND_URL}/api/v1/customer/${id}`, {
            headers: {
                "token": localStorage.getItem("token")
            }
        })
        .then((res) => {
            setCustomerdata(res.data.data);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    async function getTransactionData() {
        await axios.get(`${BACKEND_URL}/api/v1/transaction/${id}`, {
            headers: {
                "token": localStorage.getItem("token")
            }
        })
        .then((res) => {
            setTransactionsdata(res.data.data);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        getCustomerData()
        getTransactionData()
        let interval = setInterval(() => {
            getCustomerData()
            getTransactionData()
        }, 10 * 1000)

        return () => {
            clearInterval(interval);
        }
    }, []);
    
    return {transactionsdata , customerdata};
}

