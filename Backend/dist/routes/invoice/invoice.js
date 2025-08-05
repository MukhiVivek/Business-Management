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
const pdf_1 = require("./pdf");
const fs_1 = __importDefault(require("fs"));
const pdfnet_node_1 = require("@pdftron/pdfnet-node");
const router = express_1.default.Router({ mergeParams: true });
pdfnet_node_1.PDFNet.initialize("demo:1731769745328:7ef78d2c0300000000c4e7a408d8174e500aae5a205c09705bd6949150");
router.get("/data", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const data = yield invoice_1.default.find({ creater_id: req.userId }).populate('customer_id', 'name email phone_number display_name').sort({ createdAt: -1 });
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
            item.amount = Number(item.qty) * Number(item.price);
            item.tamount = item.amount + (item.amount * (item.sgst + item.cgst + item.igst) / 100);
            return item;
        });
        let gst = {
            sgst: 0,
            cgst: 0,
            igst: 0
        };
        //@ts-ignore
        items.map(item => {
            gst.sgst += ((item.price * item.sgst / 100) * item.qty);
            gst.cgst += ((item.price * item.cgst / 100) * item.qty);
            gst.igst += ((item.price * item.igst / 100) * item.qty);
            return item;
        });
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
                    gst_table.basic_amount[gstRateKey] += item.amount;
                    gst_table.igst_amount[gstRateKey] += ((item.price * item.igst / 100) * item.qty);
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
                    gst_table.basic_amount[gstRateKey] += item.amount;
                    gst_table.cgst_amount[gstRateKey] += ((item.price * item.cgst / 100) * item.qty);
                    gst_table.sgst_amount[gstRateKey] += ((item.price * item.sgst / 100) * item.qty);
                }
            });
        }
        // Update the GST table with the items data
        updateGSTTable(items);
        const data = yield invoice_1.default.create({
            customer_id,
            invoice_number,
            invoice_date,
            due_date,
            Subtotal,
            status: "Pending",
            description,
            items,
            // @ts-ignore
            creater_id: req === null || req === void 0 ? void 0 : req.userId,
            createdAt: Date.now(),
            gst,
            gst_table,
        });
        yield customer_1.default.findByIdAndUpdate(customer_id, { $inc: { balance: -(Subtotal), invoice: +(1) } }, { new: true });
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
exports.default = router;
