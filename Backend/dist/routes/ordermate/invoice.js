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
const ordermate_invoice_1 = __importDefault(require("../../models/ordermate_invoice"));
const product_1 = __importDefault(require("../../models/product"));
const router = express_1.default.Router();
router.post("/add", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_id, invoice_number, items, subtotal, tax, total, status, customerName, customerPhone } = req.body;
        const newInvoice = yield ordermate_invoice_1.default.create({
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
            yield product_1.default.findByIdAndUpdate(item.product_id, {
                $inc: { stock: -item.qty }
            });
        }
        res.status(201).json({
            message: "OrderMate Invoice created successfully",
            id: newInvoice._id
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}));
exports.default = router;
