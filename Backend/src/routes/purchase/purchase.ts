import express from "express";
import Purchase from "../../models/purchase";
import Product from "../../models/product";
import Vendor from "../../models/vendor";
import { checkuserlogin } from "../../checkuser";

const router = express.Router();

// Get all purchases
router.get("/", checkuserlogin, async (req: any, res) => {
    try {
        const purchases = await Purchase.find({ creater_id: req.userId }).populate("vendor_id").sort({ createdAt: -1 });
        res.json({ data: purchases });
    } catch (error) {
        res.status(500).json({ message: "Error fetching purchases", error });
    }
});

// Get next purchase number
router.get("/next-number", checkuserlogin, async (req: any, res) => {
    try {
        const lastPurchase = await Purchase.findOne({ creater_id: req.userId }).sort({ createdAt: -1 });
        let nextNumber = 1;
        if (lastPurchase && lastPurchase.purchase_number) {
            const lastNum = parseInt(lastPurchase.purchase_number);
            if (!isNaN(lastNum)) {
                nextNumber = lastNum + 1;
            }
        }
        res.json({ nextNumber });
    } catch (error) {
        res.status(500).json({ message: "Error fetching next number", error });
    }
});

// Get single purchase
router.get("/:id", checkuserlogin, async (req: any, res) => {
    try {
        const purchase = await Purchase.findOne({ _id: req.params.id, creater_id: req.userId }).populate("vendor_id");
        if (!purchase) {
            res.status(404).json({ message: "Purchase not found" });
            return;
        }
        res.json({ data: purchase });
    } catch (error) {
        res.status(500).json({ message: "Error fetching purchase", error });
    }
});

// Add purchase
router.post("/add", checkuserlogin, async (req: any, res) => {
    try {
        const { vendor_id, purchase_number, purchase_date, items, Subtotal, status, description } = req.body;

        const processedItems = (items && Array.isArray(items)) ? items.map((item: any) => {
            const price = Number(item.price || 0);
            const qty = Number(item.qty || 0);
            const taxRate = Number(item.sgst || 0) + Number(item.cgst || 0) + Number(item.igst || 0);

            const amount = Number((price * qty).toFixed(2));
            const tax_purchase_price = Number((price * (1 + taxRate / 100)).toFixed(2));
            const tamount = Number((amount * (1 + taxRate / 100)).toFixed(2));

            return {
                ...item,
                amount,
                tax_purchase_price,
                tamount
            };
        }) : [];

        const newPurchase = new Purchase({
            vendor_id,
            purchase_number,
            purchase_date,
            items: processedItems,
            Subtotal,
            status,
            description,
            creater_id: req.userId
        });

        await newPurchase.save();

        // Update Vendor Balance
        if (vendor_id) {
            await Vendor.findByIdAndUpdate(vendor_id, {
                $inc: { balance: Number(Subtotal) }
            });
        }

        // Automatic Product Stock and Price Update
        if (processedItems && Array.isArray(processedItems)) {
            for (const item of processedItems) {
                if (item.product_id) {
                    await Product.findByIdAndUpdate(item.product_id, {
                        $inc: { stock: Number(item.qty) },
                        $set: {
                            purchase_price: Number(item.price),
                            tax_purchase_price: Number(item.tax_purchase_price)
                        }
                    });
                }
            }
        }

        res.status(201).json({ message: "Purchase added successfully and inventory updated", data: newPurchase });
    } catch (error) {
        console.error("Error adding purchase:", error);
        res.status(500).json({ message: "Error adding purchase", error });
    }
});

// Update purchase
router.put("/update/:id", checkuserlogin, async (req: any, res) => {
    try {
        let updateData = req.body;

        if (updateData.items && Array.isArray(updateData.items)) {
            updateData.items = updateData.items.map((item: any) => {
                const price = Number(item.price || 0);
                const qty = Number(item.qty || 0);
                const taxRate = Number(item.sgst || 0) + Number(item.cgst || 0) + Number(item.igst || 0);

                const amount = Number((price * qty).toFixed(2));
                const tax_purchase_price = Number((price * (1 + taxRate / 100)).toFixed(2));
                const tamount = Number((amount * (1 + taxRate / 100)).toFixed(2));

                return {
                    ...item,
                    amount,
                    tax_purchase_price,
                    tamount
                };
            });
        }

        const oldPurchase: any = await Purchase.findOne({ _id: req.params.id, creater_id: req.userId });
        if (!oldPurchase) {
            res.status(404).json({ message: "Purchase not found" });
            return;
        }

        const updatedPurchase = await Purchase.findOneAndUpdate(
            { _id: req.params.id, creater_id: req.userId },
            updateData,
            { new: true }
        );

        if (!updatedPurchase) {
            res.status(404).json({ message: "Purchase not found" });
            return;
        }

        // Revert old stock impact
        if (oldPurchase.items && Array.isArray(oldPurchase.items)) {
            for (const item of oldPurchase.items) {
                if (item.product_id) {
                    await Product.findByIdAndUpdate(item.product_id, {
                        $inc: { stock: -Number(item.qty || 0) }
                    });
                }
            }
        }

        // Apply new stock impact and update prices
        if (updatedPurchase.items && Array.isArray(updatedPurchase.items)) {
            for (const item of updatedPurchase.items) {
                if (item.product_id) {
                    const price = Number(item.price || 0);
                    const taxRate = Number(item.sgst || 0) + Number(item.cgst || 0) + Number(item.igst || 0);
                    const tax_purchase_price = Number((price * (1 + taxRate / 100)).toFixed(2));

                    await Product.findByIdAndUpdate(item.product_id, {
                        $inc: { stock: Number(item.qty || 0) },
                        $set: {
                            purchase_price: price,
                            tax_purchase_price: tax_purchase_price
                        }
                    });
                }
            }
        }

        // Update Vendor Balance with difference
        if (updatedPurchase.vendor_id) {
            const oldSubtotal = Number(oldPurchase.Subtotal || 0);
            const newSubtotal = Number(updatedPurchase.Subtotal || 0);
            const diff = newSubtotal - oldSubtotal;

            if (diff !== 0) {
                if (String(oldPurchase.vendor_id) !== String(updatedPurchase.vendor_id)) {
                    await Vendor.findByIdAndUpdate(oldPurchase.vendor_id, {
                        $inc: { balance: -oldSubtotal }
                    });
                    await Vendor.findByIdAndUpdate(updatedPurchase.vendor_id, {
                        $inc: { balance: newSubtotal }
                    });
                } else {
                    await Vendor.findByIdAndUpdate(updatedPurchase.vendor_id, {
                        $inc: { balance: diff }
                    });
                }
            } else if (String(oldPurchase.vendor_id) !== String(updatedPurchase.vendor_id)) {
                await Vendor.findByIdAndUpdate(oldPurchase.vendor_id, {
                    $inc: { balance: -oldSubtotal }
                });
                await Vendor.findByIdAndUpdate(updatedPurchase.vendor_id, {
                    $inc: { balance: newSubtotal }
                });
            }
        }

        res.json({ message: "Purchase updated successfully and inventory adjusted", data: updatedPurchase });
    } catch (error) {
        res.status(500).json({ message: "Error updating purchase", error });
    }
});

// Delete purchase
router.delete("/delete/:id", checkuserlogin, async (req: any, res) => {
    try {
        const purchase = await Purchase.findOne({ _id: req.params.id, creater_id: req.userId });
        if (!purchase) {
            res.status(404).json({ message: "Purchase not found" });
            return;
        }

        // Revert stock impact
        if (purchase.items && Array.isArray(purchase.items)) {
            for (const item of purchase.items) {
                if (item.product_id) {
                    await Product.findByIdAndUpdate(item.product_id, {
                        $inc: { stock: -Number(item.qty || 0) }
                    });
                }
            }
        }

        // Revert vendor balance
        if (purchase.vendor_id) {
            await Vendor.findByIdAndUpdate(purchase.vendor_id, {
                $inc: { balance: -Number(purchase.Subtotal || 0) }
            });
        }

        await Purchase.findByIdAndDelete(req.params.id);
        res.json({ message: "Purchase deleted and inventory/balances reverted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting purchase", error });
    }
});

export default router;
