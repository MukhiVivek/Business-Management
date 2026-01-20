import axios from "axios";
import {  useEffect, useState } from "react";
import { BACKEND_URL } from "../Config";

export function usePayment() {
    const [data , setData] = useState([]);

    async function getData() {
        await axios.get(`${BACKEND_URL}/api/v1/payment/data`, {
            headers:{
                "token": localStorage.getItem("token")
            }
        })
        .then((res) => {
            setData(res.data.data);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        getData()
        let interval = setInterval(() => {
            getData()
        }, 10 * 1000)

        return () => {
            clearInterval(interval);
        }
    }, []);
    
    return {data};
}

