import express from "express";
import { checkuserlogin } from "../../checkuser";
import invoice from "../../models/invoice";

const router = express.Router({ mergeParams: true });

router.get("/data", checkuserlogin , async (req, res) => {
    try{
        // @ts-ignore
        const invoicedata = await invoice.find({creator_id : req.userId});
        res.json(invoicedata);
    } catch(e) {
        res.status(303).json({
            message: "Not Authorized"
        })  
    }
});

router.post("/add", checkuserlogin , async (req, res) => {

    try{
        const {
            customer_id,
            invoiceNo,
            invoiceDate,
            due_date,
            items,
            Subtotal,
            status,
            description,
        } = req.body;

        const newInvoice = await invoice.create({
            customer_id,
            invoiceNo,
            invoiceDate,
            Subtotal,
            due_date,
            status,
            description,
            items,
            // @ts-ignore
            creator_id: req?.userId,
            createdAt: Date.now(),
        })
        res.status(201).json({
            message:"invoice added"
        })
    }catch(e){
        res.status(500).json({
            message:"invoice already exists"
        })
    }
})


export default router;