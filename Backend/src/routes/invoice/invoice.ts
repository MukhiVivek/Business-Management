import express from "express";
import { checkuserlogin } from "../../checkuser";
import invoice from "../../models/invoice";
import customer from "../../models/customer";
import { generateInvoicePdf } from "./pdf";
import fs from "fs";
import { PDFNet } from '@pdftron/pdfnet-node';

const router = express.Router({ mergeParams: true });


interface item {
    id: number;
    name: string;
    qty: number;
    price: number;
    amount: number;
}

router.get("/data", checkuserlogin , async (req, res) => {
    try{
        // @ts-ignore
        const data = await invoice.find({creater_id :req.userId}).populate('customer_id', 'name email phone_number display_name').sort({createdAt: -1});

        res.json({
            data
        })
    } catch(e) {
        res.status(303).json({
            message: "Not Authorized"
        })  
    }
});

router.post("/add", checkuserlogin , async (req, res) => {

    try{
        let {
            customer_id,
            invoice_number,
            invoice_date,
            items,
            Subtotal,
            due_date,
            description,
        } = req.body;

        //@ts-ignore
        items = items.map(item  => {
            item.amount = Number(item.qty) * Number(item.price);
            return item;
        });
        
        const data = await invoice.create({
            customer_id,
            invoice_number,
            invoice_date,
            Subtotal,
            due_date,
            status: "Pending",
            description,
            items,
            // @ts-ignore
            creater_id: req?.userId,
            createdAt: Date.now(),
        })

        await customer.findByIdAndUpdate(customer_id , { $inc: { balance : - (Subtotal) , invoice : + (1)} },{ new: true })
        
        

        res.status(201).json({
            id : data._id,
            message:"invoice added"
        })
    }catch(e){
        res.status(500).json({
            //@ts-ignore
            message:"invoice already exists" + e.message 
        })
    }
})

router.get('/:id/pdf', async (req : any , res : any) => {
    try {
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