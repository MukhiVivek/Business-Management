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
const invoicepayment_1 = __importDefault(require("../../models/invoicepayment"));
const router = express_1.default.Router({ mergeParams: true });
router.get("/data", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const data = yield invoicepayment_1.default.find({ creater_id: req.userId });
        res.json({
            data
        });
    }
    catch (e) {
        res.status(403).json({
            message: "You are not logged in"
        });
    }
}));
router.post("/add", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, payment_method, invoice_id, description, createdAt, payment_id // Accepting payment_id as requested by user ("right payment id")
         } = req.body;
        // @ts-ignore
        const newPayment = yield invoicepayment_1.default.create({
            amount,
            payment_method,
            invoice_id,
            description: description || `Payment ID: ${payment_id}`,
            createdAt: createdAt || new Date(),
            // @ts-ignore
            creater_id: req.userId,
            // @ts-ignore
            user_id: req.userId,
            status: "Completed"
        });
        // Update the invoice status and customer balance
        const invoiceModel = require("../../models/invoice").default;
        const customerModel = require("../../models/customer").default;
        const invoiceData = yield invoiceModel.findById(invoice_id);
        if (invoiceData) {
            yield invoiceModel.findByIdAndUpdate(invoice_id, { status: "Paid" });
            yield customerModel.findByIdAndUpdate(invoiceData.customer_id, {
                $inc: { balance: Number(amount) }
            });
        }
        res.status(201).json({
            message: "Payment recorded successfully",
            data: newPayment
        });
    }
    catch (e) {
        res.status(500).json({
            message: "Error recording payment: " + e.message
        });
    }
}));
router.post("/settle-all", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoiceModel = require("../../models/invoice").default;
        const customerModel = require("../../models/customer").default;
        // Find all pending invoices for this user
        const pendingInvoices = yield invoiceModel.find({
            creater_id: req.userId,
            status: "Pending"
        });
        if (pendingInvoices.length === 0) {
            return res.json({ message: "No pending invoices found to settle." });
        }
        const settlementPromises = pendingInvoices.map((inv) => __awaiter(void 0, void 0, void 0, function* () {
            // 1. Create payment record
            yield invoicepayment_1.default.create({
                amount: inv.Subtotal,
                payment_method: "Cash",
                invoice_id: inv._id,
                description: "Bulk historical settlement",
                createdAt: new Date(),
                creater_id: req.userId,
                user_id: req.userId,
                status: "Completed"
            });
            // 2. Update invoice status
            inv.status = "Paid";
            yield inv.save();
            // 3. Update customer balance
            return customerModel.findByIdAndUpdate(inv.customer_id, {
                $inc: { balance: Number(inv.Subtotal) }
            });
        }));
        yield Promise.all(settlementPromises);
        res.json({
            message: `Successfully settled ${pendingInvoices.length} invoices and updated customer balances.`,
            count: pendingInvoices.length
        });
    }
    catch (e) {
        res.status(500).json({
            message: "Error settling invoices: " + e.message
        });
    }
}));
router.get("/delete/:id", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const paymentData = yield invoicepayment_1.default.findById(id);
        if (!paymentData) {
            return res.status(404).json({ message: "Payment record not found" });
        }
        const invoiceModel = require("../../models/invoice").default;
        const customerModel = require("../../models/customer").default;
        // 1. Revert invoice status to Pending
        yield invoiceModel.findByIdAndUpdate(paymentData.invoice_id, { status: "Pending" });
        // 2. Revert customer balance (Subtract the amount since the payment is being removed)
        const invoiceData = yield invoiceModel.findById(paymentData.invoice_id);
        if (invoiceData) {
            yield customerModel.findByIdAndUpdate(invoiceData.customer_id, {
                $inc: { balance: -Number(paymentData.amount) }
            });
        }
        // 3. Delete the payment record
        yield invoicepayment_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Payment deleted and balance reverted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting payment: " + error.message });
    }
}));
exports.default = router;
