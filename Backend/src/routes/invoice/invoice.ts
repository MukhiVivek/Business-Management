import express from "express";
import { checkuserlogin } from "../../checkuser";
import invoice from "../../models/invoice";
import customer from "../../models/customer";

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
        const invoicedata = await invoice.find({creator_id :req.userId});
        res.json(invoicedata);
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

        await customer.findByIdAndUpdate(customer_id , { $inc: { balance : - (Subtotal) , invoice : + (1)} },{ new: true })
        
        await invoice.create({
            customer_id,
            invoice_number,
            invoice_date,
            Subtotal,
            due_date,
            status: "Pending",
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
            //@ts-ignore
            message:"invoice already exists" + e.message 
        })
    }
})


export default router;