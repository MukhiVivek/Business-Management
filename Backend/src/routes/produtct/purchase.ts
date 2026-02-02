import express from "express";
import { checkuserlogin } from "../../checkuser";
import product from "../../models/product";
import purchase from "../../models/purchase";

const router = express.Router();

router.post("/add-bill", checkuserlogin, async (req: any, res: any) => {
    try {
        const { items, bill_number, date } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            // Support single item for backward compatibility if needed, 
            // but the new frontend will send an array.
            if (req.body.product_id) {
                const { product_id, quantity, purchase_price } = req.body;
                const newLot = await purchase.create({
                    product_id,
                    bill_number,
                    purchase_price: Number(purchase_price),
                    quantity: Number(quantity),
                    remaining_stock: Number(quantity),
                    purchase_date: date || new Date(),
                    creater_id: req.userId
                });
                await product.findByIdAndUpdate(product_id, {
                    $inc: { stock: Number(quantity) }
                });
                return res.status(201).json({
                    message: "Purchase added and stock updated",
                    lot: newLot
                });
            }
            return res.status(400).json({ message: "No items provided" });
        }

        const createdLots = [];
        for (const item of items) {
            const { product_id, quantity, purchase_price } = item;

            if (!product_id || !quantity) continue;

            const newLot = await purchase.create({
                product_id,
                bill_number,
                purchase_price: Number(purchase_price),
                quantity: Number(quantity),
                remaining_stock: Number(quantity),
                purchase_date: date || new Date(),
                creater_id: req.userId
            });

            await product.findByIdAndUpdate(product_id, {
                $inc: { stock: Number(quantity) }
            });

            createdLots.push(newLot);
        }

        res.status(201).json({
            message: `${createdLots.length} purchase items added and stock updated`,
            lots: createdLots
        });
    } catch (error) {
        console.error("Error in add-bill:", error);
        res.status(500).json({ message: "Error adding purchase" });
    }
});

router.get("/data", checkuserlogin, async (req: any, res: any) => {
    try {
        const data = await purchase.find({ creater_id: req.userId })
            .populate('product_id', 'name product_type measuring_unit')
            .sort({ createdAt: -1 });

        res.json({ data });
    } catch (error) {
        res.status(500).json({ message: "Error fetching purchase data" });
    }
});

export default router;
