import express from "express";
import { checkuserlogin } from "../../checkuser";
import invoice from "../../models/invoice";
import customer from "../../models/customer";
import product from "../../models/product";
import Profit from "../../models/profit";
import { Counter } from "../../models/counter";
import { generateInvoicePdf } from "./pdf";
import fs from "fs";
import { PDFNet } from '@pdftron/pdfnet-node';

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

router.get('/:id/pdf', async (req: any, res: any) => {
    try {
        console.log("pdf making ....")
        const id = req.params.id;
        const data = await invoice.findById(id).populate('customer_id');
        if (!data) {
            return res.status(404).send("Invoice not found");
        }

        const outputPart = await generateInvoicePdf(data as any);

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