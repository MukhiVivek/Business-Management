import axios from "axios";
import {  useEffect, useState } from "react";
import { BACKEND_URL } from "../Config";

function useTransaction() {
    const [data , setData] = useState([]);

    function getdata() {
        axios.get(`${BACKEND_URL}/api/v1/transaction/data`, {
            headers: {
                "token": localStorage.getItem("token")
            }
        })
        .then((res) => {
            setData(res.data.data);
        })
    }

    useEffect(() => {
        getdata()
    }, []);
    
    return (data);
}

export default useTransaction;