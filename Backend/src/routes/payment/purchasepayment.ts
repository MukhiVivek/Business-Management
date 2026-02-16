import express from "express";
import PurchasePayment from "../../models/purchasepayment";
import Vendor from "../../models/vendor";
import { checkuserlogin } from "../../checkuser";


const router = express.Router();

// Get all purchase payments
router.get("/", checkuserlogin, async (req: any, res) => {

    try {
        const payments = await PurchasePayment.find({ creater_id: req.userId }).populate("purchase_id vendor_id").sort({ createdAt: -1 });
        res.json({ data: payments });
    } catch (error) {
        res.status(500).json({ message: "Error fetching payments", error });
    }
});

// Add purchase payment
router.post("/add", checkuserlogin, async (req: any, res) => {

    try {
        const { vendor_id, amount_paid } = req.body;
        const paymentData = { ...req.body, creater_id: req.userId };
        const newPayment = new PurchasePayment(paymentData);
        await newPayment.save();

        // Update Vendor Balance
        if (vendor_id) {
            await Vendor.findByIdAndUpdate(vendor_id, {
                $inc: { balance: -Number(amount_paid || 0) }
            });
        }

        res.status(201).json({ message: "Payment added successfully", data: newPayment });
    } catch (error) {
        res.status(500).json({ message: "Error adding payment", error });
    }
});

export default router;
