import express from "express";
import { checkuserlogin } from "../../checkuser";
import invoice from "../../models/invoice";
import customer from "../../models/customer";
import product from "../../models/product";
import { generateInvoicePdf } from "./pdf";
import fs from "fs";
import { PDFNet } from '@pdftron/pdfnet-node';

const router = express.Router({ mergeParams: true });

PDFNet.initialize("demo:1731769745328:7ef78d2c0300000000c4e7a408d8174e500aae5a205c09705bd6949150");

router.get("/data", checkuserlogin, async (req, res) => {
    try {
        // @ts-ignore
        const data = await invoice.find({ creater_id: req.userId }).populate('customer_id', 'name email phone_number display_name').sort({ invoice_number: -1 });

        res.json({
            data
        })
    } catch (e) {
        res.status(303).json({
            message: "Not Authorized"
        })
    }
});

router.post("/add", checkuserlogin, async (req, res) => {

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

        const data = await invoice.create({
            customer_id,
            invoice_number,
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

        // Reduce stock for each product
        for (const item of items) {
            if (item.product_id) {
                await product.findByIdAndUpdate(
                    item.product_id,
                    { $inc: { stock: -Number(item.qty) } },
                    { new: true }
                );
            }
        }

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

        await customer.findByIdAndUpdate(inv.customer_id, { $inc: { balance: +(inv.Subtotal), invoice: -(1) } }, { new: true });

        // Increase stock for each product when invoice is deleted
        for (const item of inv.items) {
            if (item.product_id) {
                await product.findByIdAndUpdate(
                    item.product_id,
                    { $inc: { stock: Number(item.qty) } },
                    { new: true }
                );
            }
        }

        await invoice.findByIdAndDelete(id);

        res.status(200).json({ message: "Invoice deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting invoice" });
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


export default router;