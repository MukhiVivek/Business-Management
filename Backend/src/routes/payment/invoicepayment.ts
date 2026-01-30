import express from "express";
import { checkuserlogin } from "../../checkuser";
import invoicePayment from "../../models/invoicepayment";

const router = express.Router({ mergeParams: true });

router.get("/data", checkuserlogin, async (req, res) => {
    try {
        // @ts-ignore
        const data = await invoicePayment.find({ creater_id: req.userId })

        res.json({
            data
        })
    } catch (e) {
        res.status(403).json({
            message: "You are not logged in"
        })
    }
})

router.post("/add", checkuserlogin, async (req, res) => {
    try {
        const {
            amount,
            payment_method,
            invoice_id,
            description,
            createdAt,
            payment_id // Accepting payment_id as requested by user ("right payment id")
        } = req.body;

        // @ts-ignore
        const newPayment = await invoicePayment.create({
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

        const invoiceData = await invoiceModel.findById(invoice_id);
        if (invoiceData) {
            await invoiceModel.findByIdAndUpdate(invoice_id, { status: "Paid" });
            await customerModel.findByIdAndUpdate(invoiceData.customer_id, {
                $inc: { balance: Number(amount) }
            });
        }

        res.status(201).json({
            message: "Payment recorded successfully",
            data: newPayment
        });
    } catch (e: any) {
        res.status(500).json({
            message: "Error recording payment: " + e.message
        });
    }
});

router.post("/settle-all", checkuserlogin, async (req: any, res: any) => {
    try {
        const invoiceModel = require("../../models/invoice").default;
        const customerModel = require("../../models/customer").default;

        // Find all pending invoices for this user
        const pendingInvoices = await invoiceModel.find({
            creater_id: req.userId,
            status: "Pending"
        });

        if (pendingInvoices.length === 0) {
            return res.json({ message: "No pending invoices found to settle." });
        }

        const settlementPromises = pendingInvoices.map(async (inv: any) => {
            // 1. Create payment record
            await invoicePayment.create({
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
            await inv.save();

            // 3. Update customer balance
            return customerModel.findByIdAndUpdate(inv.customer_id, {
                $inc: { balance: Number(inv.Subtotal) }
            });
        });

        await Promise.all(settlementPromises);

        res.json({
            message: `Successfully settled ${pendingInvoices.length} invoices and updated customer balances.`,
            count: pendingInvoices.length
        });
    } catch (e: any) {
        res.status(500).json({
            message: "Error settling invoices: " + e.message
        });
    }
});


router.get("/delete/:id", checkuserlogin, async (req: any, res: any) => {
    try {
        const id = req.params.id;
        const paymentData: any = await invoicePayment.findById(id);

        if (!paymentData) {
            return res.status(404).json({ message: "Payment record not found" });
        }

        const invoiceModel = require("../../models/invoice").default;
        const customerModel = require("../../models/customer").default;

        // 1. Revert invoice status to Pending
        await invoiceModel.findByIdAndUpdate(paymentData.invoice_id, { status: "Pending" });

        // 2. Revert customer balance (Subtract the amount since the payment is being removed)
        const invoiceData = await invoiceModel.findById(paymentData.invoice_id);
        if (invoiceData) {
            await customerModel.findByIdAndUpdate(invoiceData.customer_id, {
                $inc: { balance: -Number(paymentData.amount) }
            });
        }

        // 3. Delete the payment record
        await invoicePayment.findByIdAndDelete(id);

        res.status(200).json({ message: "Payment deleted and balance reverted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Error deleting payment: " + error.message });
    }
});


export default router;