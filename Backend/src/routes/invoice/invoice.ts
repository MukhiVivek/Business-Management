import express from "express";
import { checkuserlogin } from "../../checkuser";
import invoice from "../../models/invoice";
import customer from "../../models/customer";
import product from "../../models/product";
import Profit from "../../models/profit";
import { Counter } from "../../models/counter";
import fs from "fs";
import path from "path";
import { PDFNet } from '@pdftron/pdfnet-node';
import { generateNewInvoicePdf } from "./new_pdf";

const router = express.Router({ mergeParams: true });

PDFNet.initialize("demo:1731769745328:7ef78d2c0300000000c4e7a408d8174e500aae5a205c09705bd6949150");

router.get("/data", checkuserlogin, async (req, res) => {
    try {
        // @ts-ignore
        const data = await invoice.find({ creater_id: req.userId })
            .populate('customer_id', 'name email phone_number display_name')
            .populate({
                path: 'items.product_id',
                select: 'product_type'
            })
            .sort({ invoice_number: -1 });

        res.json({
            data
        })
    } catch (e) {
        res.status(303).json({
            message: "Not Authorized"
        })
    }
});

router.get("/next-number", checkuserlogin, async (req: any, res: any) => {
    try {
        const counter = await Counter.findOne({ user_id: req.userId });
        const nextNumber = counter ? counter.seq + 1 : 1;
        res.json({ nextNumber });
    } catch (e) {
        res.status(500).json({ message: "Error fetching next invoice number" });
    }
});

router.post("/add", checkuserlogin, async (req: any, res: any) => {

    try {
        let {
            customer_id,
            invoice_number,
            invoice_date,
            Subtotal,
            items,
            due_date,
            description,
        } = req.body;

        //@ts-ignore
        items = items.map(item => {
            const qty = Number(item.qty || 1);
            const price = Number(item.price || 0);
            const taxRate = Number(item.sgst || 0) + Number(item.cgst || 0) + Number(item.igst || 0);

            const amount = Number((qty * price).toFixed(2));
            const tamount = Number((amount * (1 + taxRate / 100)).toFixed(2));
            const taxprice = qty > 0 ? Number((tamount / qty).toFixed(2)) : 0;

            item.amount = amount;
            item.taxprice = taxprice; // Unit price including tax
            item.tamount = tamount;

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

        let gst_table: any = {
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
                    if (item.igst === 5) gstRateKey = 'amount_2';
                    else if (item.igst === 12) gstRateKey = 'amount_3';
                    else if (item.igst === 18) gstRateKey = 'amount_4';
                    else if (item.igst === 24) gstRateKey = 'amount_5';
                    else if (item.igst === 0) gstRateKey = 'amount_1';
                    else return; // skip unknown IGST rate

                    gst_table.basic_amount[gstRateKey] = Number((gst_table.basic_amount[gstRateKey] + item.amount).toFixed(2));
                    gst_table.igst_amount[gstRateKey] = Number((gst_table.igst_amount[gstRateKey] + ((item.price * item.igst / 100) * item.qty)).toFixed(2));

                } else {
                    // SGST + CGST case
                    if (item.sgst === 0 && item.cgst === 0) gstRateKey = 'amount_1';
                    else if (item.sgst === 2.5 && item.cgst === 2.5) gstRateKey = 'amount_2';
                    else if (item.sgst === 6 && item.cgst === 6) gstRateKey = 'amount_3';
                    else if (item.sgst === 9 && item.cgst === 9) gstRateKey = 'amount_4';
                    else if (item.sgst === 12 && item.cgst === 12) gstRateKey = 'amount_5';
                    else return; // skip unknown SGST+CGST rate

                    gst_table.basic_amount[gstRateKey] = Number((gst_table.basic_amount[gstRateKey] + item.amount).toFixed(2));
                    gst_table.cgst_amount[gstRateKey] = Number((gst_table.cgst_amount[gstRateKey] + ((item.price * item.cgst / 100) * item.qty)).toFixed(2));
                    gst_table.sgst_amount[gstRateKey] = Number((gst_table.sgst_amount[gstRateKey] + ((item.price * item.sgst / 100) * item.qty)).toFixed(2));
                }
            });
        }


        // Update the GST table with the items data
        updateGSTTable(items);

        let finalInvoiceNumber = Number(invoice_number);

        if (!finalInvoiceNumber || finalInvoiceNumber <= 0) {
            const counter = await Counter.findOneAndUpdate(
                { user_id: req?.userId },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            finalInvoiceNumber = counter.seq;
        } else {
            // Update counter to the provided number if it's higher than the current sequence
            await Counter.findOneAndUpdate(
                { user_id: req?.userId },
                { $max: { seq: finalInvoiceNumber } },
                { upsert: true }
            );
        }

        const data = await invoice.create({
            customer_id,
            invoice_number: finalInvoiceNumber,
            invoice_date,
            due_date: invoice_date,
            Subtotal: Number(Number(Subtotal).toFixed(2)),
            status: "Pending",
            description,
            items,
            // @ts-ignore
            creater_id: req?.userId,
            createdAt: Date.now(),
            gst,
            gst_table,
        })

        await customer.findByIdAndUpdate(customer_id, { $inc: { balance: - Number(Number(Subtotal).toFixed(2)), invoice: + (1) } }, { new: true })

        // Reduce stock for each product and calculate profit
        let totalInvoiceProfit = 0;
        for (const item of items) {
            if (item.product_id) {
                const prod = await product.findByIdAndUpdate(
                    item.product_id,
                    { $inc: { stock: -Number(item.qty) } },
                    { new: true }
                );

                if (prod) {
                    const purchaseTaxPrice = prod.tax_purchase_price || 0;
                    const sellingTaxPrice = item.taxprice || 0;
                    const itemProfit = (sellingTaxPrice - purchaseTaxPrice) * Number(item.qty);
                    totalInvoiceProfit += itemProfit;
                }
            }
        }

        // Update Daily Profit
        const today = new Date().toISOString().slice(0, 10);
        await Profit.findOneAndUpdate(
            { date: today, creater_id: req.userId },
            { $inc: { totalProfit: Number(totalInvoiceProfit.toFixed(2)) } },
            { upsert: true, new: true }
        );

        res.status(201).json({
            id: data._id,
            message: "invoice added"
        })
    } catch (e) {
        res.status(500).json({
            //@ts-ignore
            message: "invoice already exists" + e.message
        })
    }
})

router.get('/delete/:id', checkuserlogin, async (req: any, res: any) => {
    try {
        const id = req.params.id;
        const inv: any = await invoice.findById(id);
        if (!inv) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        // Only increase balance if customer exists
        if (inv.customer_id) {
            await customer.findByIdAndUpdate(inv.customer_id, {
                $inc: {
                    balance: Number(inv.Subtotal || 0),
                    invoice: -1
                }
            });
        }

        // Increase stock for each product and calculate profit to subtract
        let totalProfitToRemove = 0;
        if (inv.items && Array.isArray(inv.items)) {
            for (const item of inv.items) {
                if (item.product_id) {
                    const prod = await product.findByIdAndUpdate(
                        item.product_id,
                        { $inc: { stock: Number(item.qty || 0) } },
                        { new: true }
                    );
                    if (prod) {
                        const purchaseTaxPrice = Number(prod.tax_purchase_price || 0);
                        const sellingTaxPrice = Number(item.taxprice || 0);
                        const qty = Number(item.qty || 0);
                        totalProfitToRemove += (sellingTaxPrice - purchaseTaxPrice) * qty;
                    }
                }
            }
        }

        // Update Daily Profit (Subtract)
        const today = new Date().toISOString().slice(0, 10);
        if (!isNaN(totalProfitToRemove)) {
            await Profit.findOneAndUpdate(
                { date: today, creater_id: req.userId },
                { $inc: { totalProfit: -Number(totalProfitToRemove.toFixed(2)) } },
                { upsert: true, new: true }
            );
        }

        await invoice.findByIdAndDelete(id);

        res.status(200).json({ message: "Invoice deleted successfully" });

    } catch (error: any) {
        console.error("Delete Invoice Error:", error);
        res.status(500).json({ message: "Error deleting invoice: " + error.message });
    }
});

// Bulk PDF generation - POST /bulk-pdf
router.post('/bulk-pdf', async (req: any, res: any) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).send("No invoice IDs provided");
        }

        console.log(`Bulk PDF: generating ${ids.length} invoices...`);

        const tmpDir = path.resolve(__dirname, '../files');

        // ── 1. Fetch all invoice data ──────────────────────────────────────────
        const invoicesData: any[] = [];
        for (const id of ids) {
            const data = await invoice.findById(id).populate('customer_id');
            if (data) invoicesData.push(data);
        }

        if (invoicesData.length === 0) {
            return res.status(404).send("No valid invoices found");
        }

        // ── 2. Build aggregated product summary ───────────────────────────────
        const productMap: Record<string, { name: string; qty: number; hsn: string }> = {};
        for (const inv of invoicesData) {
            for (const item of (inv.items || [])) {
                const key = String(item.name || '').trim().toLowerCase();
                if (!key) continue;
                if (productMap[key]) {
                    productMap[key].qty += Number(item.qty || 0);
                } else {
                    productMap[key] = {
                        name: String(item.name || ''),
                        qty: Number(item.qty || 0),
                        hsn: String(item.hsn_code || ''),
                    };
                }
            }
        }
        const productSummary = Object.values(productMap);

        // ── 3. Generate summary PDF using PDFKit ──────────────────────────────
        const summaryPdfPath = path.join(tmpDir, `summary_${Date.now()}.pdf`);

        await new Promise<void>((resolve, reject) => {
            const PDFDocument = require('pdfkit');
            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            const stream = fs.createWriteStream(summaryPdfPath);
            doc.pipe(stream);

            // ─── Helper functions ───
            const COL_WIDTHS_ORDER = [32, 58, 250, 60, 35, 40, 45];
            const COL_WIDTHS_PROD = [40, 60, 220, 110, 80];
            const TABLE_X = 40;
            const ROW_H = 24;
            const HEADER_H = 28;

            const drawRow = (
                y: number, cols: string[], widths: number[],
                bgColor: string, textColor: string, fontSize: number, bold: boolean
            ) => {
                let x = TABLE_X;
                // draw row background
                doc.rect(x, y, widths.reduce((a, b) => a + b, 0), ROW_H).fill(bgColor);
                doc.fillColor(textColor).fontSize(fontSize);
                for (let i = 0; i < cols.length; i++) {
                    const opts: any = { width: widths[i] - 8, lineBreak: false };
                    if (bold) doc.font('Helvetica-Bold'); else doc.font('Helvetica');
                    doc.text(cols[i], x + 4, y + (ROW_H - fontSize) / 2, opts);
                    x += widths[i];
                }
                // border lines
                x = TABLE_X;
                doc.strokeColor('#c0c0c0').lineWidth(0.5);
                let totalW = widths.reduce((a, b) => a + b, 0);
                doc.rect(TABLE_X, y, totalW, ROW_H).stroke();
                for (let i = 0; i < widths.length; i++) {
                    doc.moveTo(x, y).lineTo(x, y + ROW_H).stroke();
                    x += widths[i];
                }
                doc.moveTo(x, y).lineTo(x, y + ROW_H).stroke();
            };

            const pageW = doc.page.width - 80;

            // ════════════════════════════ PAGE 1: ORDER SUMMARY ══════════════
            doc.font('Helvetica-Bold').fontSize(13).fillColor('#1a3a6b')
                .text('Order Summary', TABLE_X, 40);
            doc.moveDown(0.3);

            let y = 70;

            // Header row
            drawRow(y, ['S.No.', 'Bill No.', 'Name of Retailer', 'Amount', 'Del', 'Method', 'Sign'],
                COL_WIDTHS_ORDER, '#2d5fa6', '#ffffff', 9, true);
            y += HEADER_H;

            invoicesData.forEach((inv, idx) => {
                const bg = idx % 2 === 0 ? '#f5f7fc' : '#ffffff';
                const custName = inv.customer_id?.name || 'N/A';
                const amount = Number(inv.Subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
                const orderNo = String(inv.invoice_number || '');
                const payStatus = String(inv.status || '');
                drawRow(y, [String(idx + 1), orderNo, custName, amount, '', '', ''],
                    COL_WIDTHS_ORDER, bg, '#333333', 9, false);
                y += ROW_H;
            });

            for (let i = 0; i < 5; i++) {
                drawRow(y, ['', '', '', '', '', '', ''], COL_WIDTHS_ORDER, '#ffffff', '#333333', 9, false);
                y += ROW_H;
            }

            doc.moveDown(1);
            doc.font('Helvetica-Oblique').fontSize(8).fillColor('#666666')
                .text('*This is a system generated copy. Signature not required', TABLE_X, y + 10);

            // ════════════════════════════ PAGE 2: PRODUCT SUMMARY ════════════
            doc.addPage();

            doc.font('Helvetica-Bold').fontSize(13).fillColor('#1a3a6b')
                .text('Product Summary', TABLE_X, 40);

            y = 70;

            // Header row
            drawRow(y, ['S.No.', 'Picture', 'Goods / Service', 'Product Code', 'Quantity'],
                COL_WIDTHS_PROD, '#2d5fa6', '#ffffff', 9, true);
            y += HEADER_H;

            productSummary.forEach((prod, idx) => {
                const bg = idx % 2 === 0 ? '#f5f7fc' : '#ffffff';
                const qtyStr = `${prod.qty} PCS`;
                drawRow(y, [String(idx + 1), '', prod.name, prod.hsn, qtyStr],
                    COL_WIDTHS_PROD, bg, '#333333', 9, false);
                y += ROW_H;
            });

            doc.moveDown(1);
            doc.font('Helvetica-Oblique').fontSize(8).fillColor('#666666')
                .text('*This is a system generated copy. Signature not required', TABLE_X, y + 10);

            doc.end();
            stream.on('finish', resolve);
            stream.on('error', reject);
        });

        // ── 4. Generate individual invoice PDFs ───────────────────────────────
        const pdfPaths: string[] = [];
        for (let i = 0; i < invoicesData.length; i++) {
            const singlePdfPath = await generateNewInvoicePdf(invoicesData[i] as any);
            const tmpPath = path.join(tmpDir, `bulk_tmp_${i}_${Date.now()}.pdf`);
            fs.copyFileSync(singlePdfPath, tmpPath);
            pdfPaths.push(tmpPath);
        }

        // ── 5. Merge: summary pages first, then individual invoices ───────────
        const mergedOutputPath = path.join(tmpDir, `bulk_invoices_${Date.now()}.pdf`);

        await PDFNet.runWithCleanup(async () => {
            // Start with summary doc
            const mergedDoc = await PDFNet.PDFDoc.createFromFilePath(summaryPdfPath);
            await mergedDoc.initSecurityHandler();

            // Append each individual invoice
            for (const p of pdfPaths) {
                const srcDoc = await PDFNet.PDFDoc.createFromFilePath(p);
                await srcDoc.initSecurityHandler();
                const srcPageCount = await srcDoc.getPageCount();
                await mergedDoc.insertPages(
                    await mergedDoc.getPageCount() + 1,
                    srcDoc, 1, srcPageCount,
                    PDFNet.PDFDoc.InsertFlag.e_none
                );
            }

            await mergedDoc.save(mergedOutputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
        });

        // ── 6. Send merged PDF ────────────────────────────────────────────────
        const mergedData = fs.readFileSync(mergedOutputPath);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="bulk_invoices.pdf"`);
        res.end(mergedData);

        // ── 7. Cleanup temp files ─────────────────────────────────────────────
        for (const p of [...pdfPaths, summaryPdfPath, mergedOutputPath]) {
            try { fs.unlinkSync(p); } catch { }
        }

    } catch (err: any) {
        console.error("Bulk PDF error:", err);
        res.status(500).send(`Error during bulk PDF generation: ${err.message}`);
    }
});

router.get('/:id/pdf', async (req: any, res: any) => {
    try {
        console.log("pdf making ....")
        const id = req.params.id;
        const data = await invoice.findById(id).populate('customer_id');
        if (!data) {
            return res.status(404).send("Invoice not found");
        }

        const outputPart = await generateNewInvoicePdf(data as any);

        fs.readFile(outputPart, (err: NodeJS.ErrnoException | null, fileData: Buffer) => {
            if (err) {
                res.status(500).send("Error reading output PDF.");
            } else {
                res.setHeader("Content-Type", "application/pdf");
                res.end(fileData);
            }
        });
    } catch (err: any) {
        res.status(500).send(`Error during conversion: ${err.message}`);
    }
});

router.get("/:id", checkuserlogin, async (req: any, res: any) => {
    try {
        const data = await invoice.findById(req.params.id)
            .populate('customer_id', 'name email phone_number display_name')
            .populate({
                path: 'items.product_id',
                select: 'product_type'
            });
        if (!data) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.json({ data });
    } catch (e) {
        res.status(500).json({ message: "Error fetching invoice" });
    }
});

router.put("/update/:id", checkuserlogin, async (req: any, res: any) => {
    try {
        const id = req.params.id;
        let {
            customer_id,
            invoice_number,
            invoice_date,
            Subtotal,
            items,
            description,
        } = req.body;

        const oldInvoice: any = await invoice.findById(id);
        if (!oldInvoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        // Calculate old profit to reverse it
        let oldTotalProfit = 0;
        for (const item of oldInvoice.items) {
            if (item.product_id) {
                const prod = await product.findById(item.product_id);
                if (prod) {
                    const purchaseTaxPrice = prod.tax_purchase_price || 0;
                    const sellingTaxPrice = item.taxprice || 0;
                    oldTotalProfit += (sellingTaxPrice - purchaseTaxPrice) * Number(item.qty);
                }
            }
        }

        // 1. Reverse old impact on customer balance
        await customer.findByIdAndUpdate(oldInvoice.customer_id, {
            $inc: {
                balance: +(oldInvoice.Subtotal),
                invoice: -(1)
            }
        });

        // 2. Reverse old impact on product stock
        for (const item of oldInvoice.items) {
            if (item.product_id) {
                await product.findByIdAndUpdate(
                    item.product_id,
                    { $inc: { stock: Number(item.qty) } }
                );
            }
        }

        // 3. Prepare new data
        //@ts-ignore
        items = items.map(item => {
            const qty = Number(item.qty || 1);
            const price = Number(item.price || 0);
            const taxRate = Number(item.sgst || 0) + Number(item.cgst || 0) + Number(item.igst || 0);

            const amount = Number((qty * price).toFixed(2));
            const tamount = Number((amount * (1 + taxRate / 100)).toFixed(2));
            const taxprice = qty > 0 ? Number((tamount / qty).toFixed(2)) : 0;

            item.amount = amount;
            item.taxprice = taxprice; // Unit price including tax
            item.tamount = tamount;

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

        let gst_table: any = {
            basic_amount: { amount_1: 0, amount_2: 0, amount_3: 0, amount_4: 0, amount_5: 0 },
            cgst_amount: { amount_1: 0, amount_2: 0, amount_3: 0, amount_4: 0, amount_5: 0 },
            sgst_amount: { amount_1: 0, amount_2: 0, amount_3: 0, amount_4: 0, amount_5: 0 },
            igst_amount: { amount_1: 0, amount_2: 0, amount_3: 0, amount_4: 0, amount_5: 0 }
        };

        //@ts-ignore
        items.forEach(item => {
            let gstRateKey = '';
            if (item.igst > 0) {
                if (item.igst === 5) gstRateKey = 'amount_2';
                else if (item.igst === 12) gstRateKey = 'amount_3';
                else if (item.igst === 18) gstRateKey = 'amount_4';
                else if (item.igst === 24) gstRateKey = 'amount_5';
                else if (item.igst === 0) gstRateKey = 'amount_1';
                else return;
                gst_table.basic_amount[gstRateKey] = Number((gst_table.basic_amount[gstRateKey] + item.amount).toFixed(2));
                gst_table.igst_amount[gstRateKey] = Number((gst_table.igst_amount[gstRateKey] + ((item.price * item.igst / 100) * item.qty)).toFixed(2));
            } else {
                if (item.sgst === 0 && item.cgst === 0) gstRateKey = 'amount_1';
                else if (item.sgst === 2.5 && item.cgst === 2.5) gstRateKey = 'amount_2';
                else if (item.sgst === 6 && item.cgst === 6) gstRateKey = 'amount_3';
                else if (item.sgst === 9 && item.cgst === 9) gstRateKey = 'amount_4';
                else if (item.sgst === 12 && item.cgst === 12) gstRateKey = 'amount_5';
                else return;
                gst_table.basic_amount[gstRateKey] = Number((gst_table.basic_amount[gstRateKey] + item.amount).toFixed(2));
                gst_table.cgst_amount[gstRateKey] = Number((gst_table.cgst_amount[gstRateKey] + ((item.price * item.cgst / 100) * item.qty)).toFixed(2));
                gst_table.sgst_amount[gstRateKey] = Number((gst_table.sgst_amount[gstRateKey] + ((item.price * item.sgst / 100) * item.qty)).toFixed(2));
            }
        });

        // 4. Update the invoice
        const updatedInvoice = await invoice.findByIdAndUpdate(id, {
            customer_id,
            invoice_number,
            invoice_date,
            due_date: invoice_date,
            Subtotal: Number(Number(Subtotal).toFixed(2)),
            description,
            items,
            gst,
            gst_table,
            updatedAt: Date.now()
        }, { new: true });

        // 5. Apply new impact on customer balance
        await customer.findByIdAndUpdate(customer_id, {
            $inc: {
                balance: - Number(Number(Subtotal).toFixed(2)),
                invoice: 1
            }
        });

        // 6. Apply new impact on product stock and calculate new profit
        let newTotalProfit = 0;
        for (const item of items) {
            if (item.product_id) {
                const prod = await product.findByIdAndUpdate(
                    item.product_id,
                    { $inc: { stock: -Number(item.qty) } },
                    { new: true }
                );
                if (prod) {
                    const purchaseTaxPrice = prod.tax_purchase_price || 0;
                    const sellingTaxPrice = item.taxprice || 0;
                    newTotalProfit += (sellingTaxPrice - purchaseTaxPrice) * Number(item.qty);
                }
            }
        }

        // Update Daily Profit with Difference
        const today = new Date().toISOString().slice(0, 10);
        const profitDiff = Number((newTotalProfit - oldTotalProfit).toFixed(2));
        await Profit.findOneAndUpdate(
            { date: today, creater_id: req.userId },
            { $inc: { totalProfit: profitDiff } },
            { upsert: true, new: true }
        );

        res.status(200).json({
            id: updatedInvoice?._id,
            message: "Invoice updated successfully"
        });

    } catch (e: any) {
        res.status(500).json({ message: "Error updating invoice: " + e.message });
    }
});


export default router;