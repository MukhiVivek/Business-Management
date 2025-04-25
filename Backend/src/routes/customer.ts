import express from "express";
import customer from "../models/customer";

const router = express.Router({ mergeParams: true });

// create : add , update , delete

// Done : data
 
router.get("/data" , (req, res)=> {
    res.send("customers");
})

router.post("/add" , async (req, res)=> {

    try{
        const {
            name,
            phone_number,
            type,
            balance,
            location,
            customer_billing_address
        } = req.body;
        
        const newCustomer =await customer.create({
            name,
            phone_number,
            type,
            balance,
            location,
            customer_billing_address
        })
        res.status(201).json({
            message:"customer added"
        })
    }catch(e){
        res.status(500).json({
            message:"customer already exists"
        })
    }
   
})

export default router;