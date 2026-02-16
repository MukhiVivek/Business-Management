import express from "express";
import { checkuserlogin } from "../../checkuser";
import OrdermateInvoice from "../../models/ordermate_invoice";
import product from "../../models/product";

const router = express.Router();

router.post("/add", checkuserlogin, async (req: any, res: any) => {
    try {
        const {
            customer_id,
            invoice_number,
            items,
            subtotal,
            tax,
            total,
            status,
            customerName,
            customerPhone
        } = req.body;

        const newInvoice = await OrdermateInvoice.create({
            customer_id,
            invoice_number,
            items,
            subtotal,
            tax,
            total,
            status,
            customerName,
            customerPhone,
            creater_id: req.userId
        });

        // Update stock for each item
        for (const item of items) {
            await product.findByIdAndUpdate(item.product_id, {
                $inc: { stock: -item.qty }
            });
        }

        res.status(201).json({
            message: "OrderMate Invoice created successfully",
            id: newInvoice._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

export default router;
