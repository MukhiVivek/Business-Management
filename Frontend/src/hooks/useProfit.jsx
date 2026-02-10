import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL } from "../Config";

export const useProfit = () => {
    const [data, setData] = useState({ todayProfit: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }
            const response = await axios.get(`${BACKEND_URL}/api/v1/profit/today`, {
                headers: { token }
            });
            setData(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};
