import express from "express";
import customer from "../../models/customer";
import { checkuserlogin } from "../../checkuser";

const router = express.Router({ mergeParams: true });

// create : update , delete

// Done : data , add
 
router.get("/data" , checkuserlogin , async(req, res)=> {
    try {
        // @ts-ignore
        const data = await customer.find({creater_id :req.userId})

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

    try{
        const {
            name,
            work_phone_number,
            phone_number,
            customer_type,
            balance,
            location,
            customer_billing_address,
            display_name,
            email,
        } = req.body;
        
        const newCustomer =await customer.create({
            name,
            work_phone_number,
            display_name,
            phone_number,
            customer_type,
            email,
            balance,
            location,
            customer_billing_address,
            // @ts-ignore
            creater_id: req?.userId,
            createdAt: Date.now(),
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