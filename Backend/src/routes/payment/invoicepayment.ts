import express from "express";
import { checkuserlogin } from "../../checkuser";
import invoicePayment from "../../models/invoicepayment";

const router = express.Router({ mergeParams: true });

router.get("/data" , checkuserlogin , async(req, res)=> {
    try {
        // @ts-ignore
        const data = await invoicePayment.find({ creater_id: req.userId })

        res.json({
            data
        })
    } catch(e) {
        res.status(403).json({
            message: "You are not logged in"
        })
    }
})

router.post("/add" ,checkuserlogin , async (req, res)=> {

    
   
})

export default router;