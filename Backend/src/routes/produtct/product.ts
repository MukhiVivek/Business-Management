import express from "express";
import { checkuserlogin } from "../../checkuser";
import product from "../../models/product";

const router = express.Router({ mergeParams: true });

// create : update , delete

// Done :  data , add 
 
router.get("/data" , checkuserlogin , async(req, res)=> {
    try {
        // @ts-ignore
        const data = await product.find({ creater_id: req.userId })

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
            unit,
            price,
            product_type,
            display_name,
            description,
            stock,
            image,
        } = req.body;
        
        const newCustomer =await product.create({
            name,
            unit,
            price,
            product_type,
            display_name,
            description,
            stock,
            image,
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