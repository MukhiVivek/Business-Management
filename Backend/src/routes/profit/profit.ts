import express from "express";
import Profit from "../../models/profit";
import { checkuserlogin } from "../../checkuser";

const router = express.Router();

// Get today's profit
router.get("/today", checkuserlogin, async (req: any, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const profitRecord = await Profit.findOne({
            date: today,
            creater_id: req.userId
        });

        res.json({
            todayProfit: profitRecord ? profitRecord.totalProfit : 0
        });
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching profit", error: error.message });
    }
});

// Get all profit history (useful if we want a chart later)
router.get("/history", checkuserlogin, async (req: any, res) => {
    try {
        const history = await Profit.find({ creater_id: req.userId }).sort({ date: -1 });
        res.json({ data: history });
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching profit history", error: error.message });
    }
});

export default router;
