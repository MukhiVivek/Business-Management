"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const purchase_1 = __importDefault(require("../../models/purchase"));
const product_1 = __importDefault(require("../../models/product"));
const vendor_1 = __importDefault(require("../../models/vendor"));
const checkuser_1 = require("../../checkuser");
const router = express_1.default.Router();
// Get all purchases
router.get("/", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchases = yield purchase_1.default.find({ creater_id: req.userId }).populate("vendor_id").sort({ createdAt: -1 });
        res.json({ data: purchases });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching purchases", error });
    }
}));
// Get next purchase number
router.get("/next-number", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lastPurchase = yield purchase_1.default.findOne({ creater_id: req.userId }).sort({ createdAt: -1 });
        let nextNumber = 1;
        if (lastPurchase && lastPurchase.purchase_number) {
            const lastNum = parseInt(lastPurchase.purchase_number);
            if (!isNaN(lastNum)) {
                nextNumber = lastNum + 1;
            }
        }
        res.json({ nextNumber });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching next number", error });
    }
}));
// Get single purchase
router.get("/:id", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchase = yield purchase_1.default.findOne({ _id: req.params.id, creater_id: req.userId }).populate("vendor_id");
        if (!purchase) {
            res.status(404).json({ message: "Purchase not found" });
            return;
        }
        res.json({ data: purchase });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching purchase", error });
    }
}));
// Add purchase
router.post("/add", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vendor_id, purchase_number, purchase_date, items, Subtotal, status, description } = req.body;
        const processedItems = (items && Array.isArray(items)) ? items.map((item) => {
            const price = Number(item.price || 0);
            const qty = Number(item.qty || 0);
            const taxRate = Number(item.sgst || 0) + Number(item.cgst || 0) + Number(item.igst || 0);
            const amount = Number((price * qty).toFixed(2));
            const tax_purchase_price = Number((price * (1 + taxRate / 100)).toFixed(2));
            const tamount = Number((amount * (1 + taxRate / 100)).toFixed(2));
            return Object.assign(Object.assign({}, item), { amount,
                tax_purchase_price,
                tamount });
        }) : [];
        const newPurchase = new purchase_1.default({
            vendor_id,
            purchase_number,
            purchase_date,
            items: processedItems,
            Subtotal,
            status,
            description,
            creater_id: req.userId
        });
        yield newPurchase.save();
        // Update Vendor Balance
        if (vendor_id) {
            yield vendor_1.default.findByIdAndUpdate(vendor_id, {
                $inc: { balance: Number(Subtotal) }
            });
        }
        // Automatic Product Stock and Price Update
        if (processedItems && Array.isArray(processedItems)) {
            for (const item of processedItems) {
                if (item.product_id) {
                    yield product_1.default.findByIdAndUpdate(item.product_id, {
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
    }
    catch (error) {
        console.error("Error adding purchase:", error);
        res.status(500).json({ message: "Error adding purchase", error });
    }
}));
// Update purchase
router.put("/update/:id", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let updateData = req.body;
        if (updateData.items && Array.isArray(updateData.items)) {
            updateData.items = updateData.items.map((item) => {
                const price = Number(item.price || 0);
                const qty = Number(item.qty || 0);
                const taxRate = Number(item.sgst || 0) + Number(item.cgst || 0) + Number(item.igst || 0);
                const amount = Number((price * qty).toFixed(2));
                const tax_purchase_price = Number((price * (1 + taxRate / 100)).toFixed(2));
                const tamount = Number((amount * (1 + taxRate / 100)).toFixed(2));
                return Object.assign(Object.assign({}, item), { amount,
                    tax_purchase_price,
                    tamount });
            });
        }
        const oldPurchase = yield purchase_1.default.findOne({ _id: req.params.id, creater_id: req.userId });
        if (!oldPurchase) {
            res.status(404).json({ message: "Purchase not found" });
            return;
        }
        const updatedPurchase = yield purchase_1.default.findOneAndUpdate({ _id: req.params.id, creater_id: req.userId }, updateData, { new: true });
        if (!updatedPurchase) {
            res.status(404).json({ message: "Purchase not found" });
            return;
        }
        // Revert old stock impact
        if (oldPurchase.items && Array.isArray(oldPurchase.items)) {
            for (const item of oldPurchase.items) {
                if (item.product_id) {
                    yield product_1.default.findByIdAndUpdate(item.product_id, {
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
                    yield product_1.default.findByIdAndUpdate(item.product_id, {
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
                    yield vendor_1.default.findByIdAndUpdate(oldPurchase.vendor_id, {
                        $inc: { balance: -oldSubtotal }
                    });
                    yield vendor_1.default.findByIdAndUpdate(updatedPurchase.vendor_id, {
                        $inc: { balance: newSubtotal }
                    });
                }
                else {
                    yield vendor_1.default.findByIdAndUpdate(updatedPurchase.vendor_id, {
                        $inc: { balance: diff }
                    });
                }
            }
            else if (String(oldPurchase.vendor_id) !== String(updatedPurchase.vendor_id)) {
                yield vendor_1.default.findByIdAndUpdate(oldPurchase.vendor_id, {
                    $inc: { balance: -oldSubtotal }
                });
                yield vendor_1.default.findByIdAndUpdate(updatedPurchase.vendor_id, {
                    $inc: { balance: newSubtotal }
                });
            }
        }
        res.json({ message: "Purchase updated successfully and inventory adjusted", data: updatedPurchase });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating purchase", error });
    }
}));
// Delete purchase
router.delete("/delete/:id", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchase = yield purchase_1.default.findOne({ _id: req.params.id, creater_id: req.userId });
        if (!purchase) {
            res.status(404).json({ message: "Purchase not found" });
            return;
        }
        // Revert stock impact
        if (purchase.items && Array.isArray(purchase.items)) {
            for (const item of purchase.items) {
                if (item.product_id) {
                    yield product_1.default.findByIdAndUpdate(item.product_id, {
                        $inc: { stock: -Number(item.qty || 0) }
                    });
                }
            }
        }
        // Revert vendor balance
        if (purchase.vendor_id) {
            yield vendor_1.default.findByIdAndUpdate(purchase.vendor_id, {
                $inc: { balance: -Number(purchase.Subtotal || 0) }
            });
        }
        yield purchase_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: "Purchase deleted and inventory/balances reverted" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting purchase", error });
    }
}));
exports.default = router;
