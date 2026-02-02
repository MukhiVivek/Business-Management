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
const invoice_1 = __importDefault(require("../../models/invoice"));
const customer_1 = __importDefault(require("../../models/customer"));
const product_1 = __importDefault(require("../../models/product"));
const purchase_1 = __importDefault(require("../../models/purchase"));
const pdf_1 = require("./pdf");
const fs_1 = __importDefault(require("fs"));
const pdfnet_node_1 = require("@pdftron/pdfnet-node");
const router = express_1.default.Router({ mergeParams: true });
pdfnet_node_1.PDFNet.initialize("demo:1731769745328:7ef78d2c0300000000c4e7a408d8174e500aae5a205c09705bd6949150");
router.get("/data", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const data = yield invoice_1.default.find({ creater_id: req.userId })
            .populate('customer_id', 'name email phone_number display_name')
            .populate({
            path: 'items.product_id',
            select: 'product_type'
        })
            .sort({ invoice_number: -1 });
        res.json({
            data
        });
    }
    catch (e) {
        res.status(303).json({
            message: "Not Authorized"
        });
    }
}));
router.post("/add", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { customer_id, invoice_number, invoice_date, Subtotal, items, due_date, description, } = req.body;
        //@ts-ignore
        items = items.map(item => {
            item.amount = Number((Number(item.qty) * Number(item.price)).toFixed(2));
            item.tamount = Number((item.amount + (item.amount * (Number(item.sgst || 0) + Number(item.cgst || 0) + Number(item.igst || 0)) / 100)).toFixed(2));
            return item;
        });
        let gst = {
            sgst: 0,
            cgst: 0,
            igst: 0
        };
        //@ts-ignore
        items.map(item => {
            gst.sgst += ((Number(item.price) * Number(item.sgst || 0) / 100) * Number(item.qty));
            gst.cgst += ((Number(item.price) * Number(item.cgst || 0) / 100) * Number(item.qty));
            gst.igst += ((Number(item.price) * Number(item.igst || 0) / 100) * Number(item.qty));
            return item;
        });
        // Round GST totals to 2 decimal places
        gst.sgst = Number(gst.sgst.toFixed(2));
        gst.cgst = Number(gst.cgst.toFixed(2));
        gst.igst = Number(gst.igst.toFixed(2));
        let gst_table = {
            basic_amount: {
                amount_1: 0,
                amount_2: 0,
                amount_3: 0,
                amount_4: 0,
                amount_5: 0,
            },
            cgst_amount: {
                amount_1: 0,
                amount_2: 0,
                amount_3: 0,
                amount_4: 0,
                amount_5: 0,
            },
            sgst_amount: {
                amount_1: 0,
                amount_2: 0,
                amount_3: 0,
                amount_4: 0,
                amount_5: 0,
            },
            igst_amount: {
                amount_1: 0,
                amount_2: 0,
                amount_3: 0,
                amount_4: 0,
                amount_5: 0,
            }
        };
        // Function to update GST amounts in gst_table
        //@ts-ignore
        function updateGSTTable(items) {
            //@ts-ignore
            items.forEach(item => {
                let gstRateKey = '';
                // IGST case
                if (item.igst > 0) {
                    if (item.igst === 5)
                        gstRateKey = 'amount_2';
                    else if (item.igst === 12)
                        gstRateKey = 'amount_3';
                    else if (item.igst === 18)
                        gstRateKey = 'amount_4';
                    else if (item.igst === 24)
                        gstRateKey = 'amount_5';
                    else if (item.igst === 0)
                        gstRateKey = 'amount_1';
                    else
                        return; // skip unknown IGST rate
                    gst_table.basic_amount[gstRateKey] = Number((gst_table.basic_amount[gstRateKey] + item.amount).toFixed(2));
                    gst_table.igst_amount[gstRateKey] = Number((gst_table.igst_amount[gstRateKey] + ((item.price * item.igst / 100) * item.qty)).toFixed(2));
                }
                else {
                    // SGST + CGST case
                    if (item.sgst === 0 && item.cgst === 0)
                        gstRateKey = 'amount_1';
                    else if (item.sgst === 2.5 && item.cgst === 2.5)
                        gstRateKey = 'amount_2';
                    else if (item.sgst === 6 && item.cgst === 6)
                        gstRateKey = 'amount_3';
                    else if (item.sgst === 9 && item.cgst === 9)
                        gstRateKey = 'amount_4';
                    else if (item.sgst === 12 && item.cgst === 12)
                        gstRateKey = 'amount_5';
                    else
                        return; // skip unknown SGST+CGST rate
                    gst_table.basic_amount[gstRateKey] = Number((gst_table.basic_amount[gstRateKey] + item.amount).toFixed(2));
                    gst_table.cgst_amount[gstRateKey] = Number((gst_table.cgst_amount[gstRateKey] + ((item.price * item.cgst / 100) * item.qty)).toFixed(2));
                    gst_table.sgst_amount[gstRateKey] = Number((gst_table.sgst_amount[gstRateKey] + ((item.price * item.sgst / 100) * item.qty)).toFixed(2));
                }
            });
        }
        // Update the GST table with the items data
        updateGSTTable(items);
        // Prepare items with FIFO stock deduction and purchase price tracking
        const detailedItems = [];
        for (const item of items) {
            let remainingToDeduct = Number(item.qty);
            let totalPurchaseCost = 0;
            const lotDeductions = [];
            if (item.product_id) {
                // Find available lots sorted by date (FIFO)
                const lots = yield purchase_1.default.find({
                    product_id: item.product_id,
                    remaining_stock: { $gt: 0 }
                }).sort({ purchase_date: 1 });
                for (const lot of lots) {
                    if (remainingToDeduct <= 0)
                        break;
                    const deduction = Math.min(lot.remaining_stock, remainingToDeduct);
                    lot.remaining_stock -= deduction;
                    remainingToDeduct -= deduction;
                    totalPurchaseCost += (deduction * lot.purchase_price);
                    lotDeductions.push({
                        lot_id: lot._id,
                        qty: deduction
                    });
                    yield lot.save();
                }
                // Update total product stock
                yield product_1.default.findByIdAndUpdate(item.product_id, {
                    $inc: { stock: -Number(item.qty) }
                });
            }
            const avgPurchasePrice = item.qty > 0 ? (totalPurchaseCost / Number(item.qty)) : 0;
            detailedItems.push(Object.assign(Object.assign({}, item), { purchase_price: Number(avgPurchasePrice.toFixed(2)), lot_details: lotDeductions }));
        }
        const data = yield invoice_1.default.create({
            customer_id,
            invoice_number,
            invoice_date,
            due_date: invoice_date,
            Subtotal: Number(Number(Subtotal).toFixed(2)),
            status: "Pending",
            description,
            items: detailedItems,
            // @ts-ignore
            creater_id: req === null || req === void 0 ? void 0 : req.userId,
            createdAt: Date.now(),
            gst,
            gst_table,
        });
        yield customer_1.default.findByIdAndUpdate(customer_id, { $inc: { balance: -Number(Number(Subtotal).toFixed(2)), invoice: +(1) } }, { new: true });
        res.status(201).json({
            id: data._id,
            message: "invoice added"
        });
    }
    catch (e) {
        res.status(500).json({
            //@ts-ignore
            message: "invoice already exists" + e.message
        });
    }
}));
router.get('/delete/:id', checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const inv = yield invoice_1.default.findById(id);
        if (!inv) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        yield customer_1.default.findByIdAndUpdate(inv.customer_id, { $inc: { balance: +(inv.Subtotal), invoice: -(1) } }, { new: true });
        // Reverse impact on product stock and purchase lots when invoice is deleted
        for (const item of inv.items) {
            if (item.product_id) {
                // 1. Add back to purchase lots
                if (item.lot_details && item.lot_details.length > 0) {
                    for (const detail of item.lot_details) {
                        yield purchase_1.default.findByIdAndUpdate(detail.lot_id, {
                            $inc: { remaining_stock: detail.qty }
                        });
                    }
                }
                // 2. Add back to total product stock
                yield product_1.default.findByIdAndUpdate(item.product_id, { $inc: { stock: Number(item.qty) } }, { new: true });
            }
        }
        yield invoice_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Invoice deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting invoice" });
    }
}));
router.get('/:id/pdf', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("pdf making ....");
        const id = req.params.id;
        const data = yield invoice_1.default.findById(id).populate('customer_id');
        if (!data) {
            return res.status(404).send("Invoice not found");
        }
        const outputPart = yield (0, pdf_1.generateInvoicePdf)(data);
        fs_1.default.readFile(outputPart, (err, fileData) => {
            if (err) {
                res.status(500).send("Error reading output PDF.");
            }
            else {
                res.setHeader("Content-Type", "application/pdf");
                res.end(fileData);
            }
        });
    }
    catch (err) {
        res.status(500).send(`Error during conversion: ${err.message}`);
    }
}));
router.get("/:id", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield invoice_1.default.findById(req.params.id)
            .populate('customer_id', 'name email phone_number display_name')
            .populate({
            path: 'items.product_id',
            select: 'product_type'
        });
        if (!data) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ message: "Error fetching invoice" });
    }
}));
router.put("/update/:id", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        let { customer_id, invoice_number, invoice_date, Subtotal, items, description, } = req.body;
        const oldInvoice = yield invoice_1.default.findById(id);
        if (!oldInvoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        // 1. Reverse old impact on customer balance
        yield customer_1.default.findByIdAndUpdate(oldInvoice.customer_id, {
            $inc: {
                balance: +(oldInvoice.Subtotal),
                invoice: -(1)
            }
        });
        // 2. Reverse old impact on product stock and purchase lots
        for (const item of oldInvoice.items) {
            if (item.product_id) {
                // Reverse purchase lots
                if (item.lot_details && item.lot_details.length > 0) {
                    for (const detail of item.lot_details) {
                        yield purchase_1.default.findByIdAndUpdate(detail.lot_id, {
                            $inc: { remaining_stock: detail.qty }
                        });
                    }
                }
                // Reverse total product stock
                yield product_1.default.findByIdAndUpdate(item.product_id, { $inc: { stock: Number(item.qty) } });
            }
        }
        // 3. Prepare new data
        //@ts-ignore
        items = items.map(item => {
            item.amount = Number((Number(item.qty) * Number(item.price)).toFixed(2));
            item.tamount = Number((item.amount + (item.amount * (Number(item.sgst || 0) + Number(item.cgst || 0) + Number(item.igst || 0)) / 100)).toFixed(2));
            return item;
        });
        let gst = { sgst: 0, cgst: 0, igst: 0 };
        //@ts-ignore
        items.forEach(item => {
            gst.sgst += ((Number(item.price) * Number(item.sgst || 0) / 100) * Number(item.qty));
            gst.cgst += ((Number(item.price) * Number(item.cgst || 0) / 100) * Number(item.qty));
            gst.igst += ((Number(item.price) * Number(item.igst || 0) / 100) * Number(item.qty));
        });
        gst.sgst = Number(gst.sgst.toFixed(2));
        gst.cgst = Number(gst.cgst.toFixed(2));
        gst.igst = Number(gst.igst.toFixed(2));
        let gst_table = {
            basic_amount: { amount_1: 0, amount_2: 0, amount_3: 0, amount_4: 0, amount_5: 0 },
            cgst_amount: { amount_1: 0, amount_2: 0, amount_3: 0, amount_4: 0, amount_5: 0 },
            sgst_amount: { amount_1: 0, amount_2: 0, amount_3: 0, amount_4: 0, amount_5: 0 },
            igst_amount: { amount_1: 0, amount_2: 0, amount_3: 0, amount_4: 0, amount_5: 0 }
        };
        //@ts-ignore
        items.forEach(item => {
            let gstRateKey = '';
            if (item.igst > 0) {
                if (item.igst === 5)
                    gstRateKey = 'amount_2';
                else if (item.igst === 12)
                    gstRateKey = 'amount_3';
                else if (item.igst === 18)
                    gstRateKey = 'amount_4';
                else if (item.igst === 24)
                    gstRateKey = 'amount_5';
                else if (item.igst === 0)
                    gstRateKey = 'amount_1';
                else
                    return;
                gst_table.basic_amount[gstRateKey] = Number((gst_table.basic_amount[gstRateKey] + item.amount).toFixed(2));
                gst_table.igst_amount[gstRateKey] = Number((gst_table.igst_amount[gstRateKey] + ((item.price * item.igst / 100) * item.qty)).toFixed(2));
            }
            else {
                if (item.sgst === 0 && item.cgst === 0)
                    gstRateKey = 'amount_1';
                else if (item.sgst === 2.5 && item.cgst === 2.5)
                    gstRateKey = 'amount_2';
                else if (item.sgst === 6 && item.cgst === 6)
                    gstRateKey = 'amount_3';
                else if (item.sgst === 9 && item.cgst === 9)
                    gstRateKey = 'amount_4';
                else if (item.sgst === 12 && item.cgst === 12)
                    gstRateKey = 'amount_5';
                else
                    return;
                gst_table.basic_amount[gstRateKey] = Number((gst_table.basic_amount[gstRateKey] + item.amount).toFixed(2));
                gst_table.cgst_amount[gstRateKey] = Number((gst_table.cgst_amount[gstRateKey] + ((item.price * item.cgst / 100) * item.qty)).toFixed(2));
                gst_table.sgst_amount[gstRateKey] = Number((gst_table.sgst_amount[gstRateKey] + ((item.price * item.sgst / 100) * item.qty)).toFixed(2));
            }
        });
        // 6. Apply new impact on product stock and apply FIFO logic
        const detailedItems = [];
        for (const item of items) {
            let remainingToDeduct = Number(item.qty);
            let totalPurchaseCost = 0;
            const lotDeductions = [];
            if (item.product_id) {
                // Find available lots sorted by date (FIFO)
                const lots = yield purchase_1.default.find({
                    product_id: item.product_id,
                    remaining_stock: { $gt: 0 }
                }).sort({ purchase_date: 1 });
                for (const lot of lots) {
                    if (remainingToDeduct <= 0)
                        break;
                    const deduction = Math.min(lot.remaining_stock, remainingToDeduct);
                    lot.remaining_stock -= deduction;
                    remainingToDeduct -= deduction;
                    totalPurchaseCost += (deduction * lot.purchase_price);
                    lotDeductions.push({
                        lot_id: lot._id,
                        qty: deduction
                    });
                    yield lot.save();
                }
                // Update total product stock
                yield product_1.default.findByIdAndUpdate(item.product_id, {
                    $inc: { stock: -Number(item.qty) }
                });
            }
            const avgPurchasePrice = item.qty > 0 ? (totalPurchaseCost / Number(item.qty)) : 0;
            detailedItems.push(Object.assign(Object.assign({}, item), { purchase_price: Number(avgPurchasePrice.toFixed(2)), lot_details: lotDeductions }));
        }
        // 4. Update the invoice
        const updatedInvoice = yield invoice_1.default.findByIdAndUpdate(id, {
            customer_id,
            invoice_number,
            invoice_date,
            due_date: invoice_date,
            Subtotal: Number(Number(Subtotal).toFixed(2)),
            description,
            items: detailedItems,
            gst,
            gst_table,
            updatedAt: Date.now()
        }, { new: true });
        // 5. Apply new impact on customer balance
        yield customer_1.default.findByIdAndUpdate(customer_id, {
            $inc: {
                balance: -Number(Number(Subtotal).toFixed(2)),
                invoice: 1
            }
        });
        res.status(200).json({
            id: updatedInvoice === null || updatedInvoice === void 0 ? void 0 : updatedInvoice._id,
            message: "Invoice updated successfully"
        });
    }
    catch (e) {
        res.status(500).json({ message: "Error updating invoice: " + e.message });
    }
}));
exports.default = router;
