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
const purchasepayment_1 = __importDefault(require("../../models/purchasepayment"));
const checkuser_1 = require("../../checkuser");
const router = express_1.default.Router();
// Get all purchase payments
router.get("/", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield purchasepayment_1.default.find({ creater_id: req.userId }).populate("purchase_id vendor_id").sort({ createdAt: -1 });
        res.json({ data: payments });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching payments", error });
    }
}));
// Add purchase payment
router.post("/add", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentData = Object.assign(Object.assign({}, req.body), { creater_id: req.userId });
        const newPayment = new purchasepayment_1.default(paymentData);
        yield newPayment.save();
        res.status(201).json({ message: "Payment added successfully", data: newPayment });
    }
    catch (error) {
        res.status(500).json({ message: "Error adding payment", error });
    }
}));
exports.default = router;
