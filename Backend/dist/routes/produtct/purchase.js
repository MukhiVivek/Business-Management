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
const checkuser_1 = require("../../checkuser");
const product_1 = __importDefault(require("../../models/product"));
const purchase_1 = __importDefault(require("../../models/purchase"));
const router = express_1.default.Router();
router.post("/add-bill", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { items, bill_number, date } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            // Support single item for backward compatibility if needed, 
            // but the new frontend will send an array.
            if (req.body.product_id) {
                const { product_id, quantity, purchase_price } = req.body;
                const newLot = yield purchase_1.default.create({
                    product_id,
                    bill_number,
                    purchase_price: Number(purchase_price),
                    quantity: Number(quantity),
                    remaining_stock: Number(quantity),
                    purchase_date: date || new Date(),
                    creater_id: req.userId
                });
                yield product_1.default.findByIdAndUpdate(product_id, {
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
            if (!product_id || !quantity)
                continue;
            const newLot = yield purchase_1.default.create({
                product_id,
                bill_number,
                purchase_price: Number(purchase_price),
                quantity: Number(quantity),
                remaining_stock: Number(quantity),
                purchase_date: date || new Date(),
                creater_id: req.userId
            });
            yield product_1.default.findByIdAndUpdate(product_id, {
                $inc: { stock: Number(quantity) }
            });
            createdLots.push(newLot);
        }
        res.status(201).json({
            message: `${createdLots.length} purchase items added and stock updated`,
            lots: createdLots
        });
    }
    catch (error) {
        console.error("Error in add-bill:", error);
        res.status(500).json({ message: "Error adding purchase" });
    }
}));
router.get("/data", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield purchase_1.default.find({ creater_id: req.userId })
            .populate('product_id', 'name product_type measuring_unit')
            .sort({ createdAt: -1 });
        res.json({ data });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching purchase data" });
    }
}));
exports.default = router;
