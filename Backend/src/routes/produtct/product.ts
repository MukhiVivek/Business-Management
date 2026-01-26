import express from "express";
import { checkuserlogin } from "../../checkuser";
import product from "../../models/product";

const router = express.Router({ mergeParams: true });

// create : update , delete

// Done :  data , add 

router.get("/data", checkuserlogin, async (req: any, res: any) => {
    try {
        // @ts-ignore
        const data = await product.find({ creater_id: req.userId })

        res.json({
            data
        })
    } catch (e) {
        res.status(403).json({
            message: "You are not logged in"
        })
    }
})

router.post("/add", checkuserlogin, async (req: any, res: any) => {
    try {
        const {
            name,
            price,
            product_type,
            description,
            stock,
            gst_tax_rate,
            measuring_unit,
            image,
        } = req.body;

        // Validation
        if (!name || !price || !product_type) {
            return res.status(400).json({
                message: "Required fields missing",
            });
        }

        const newProduct = await product.create({
            name: name.trim(),
            price: Number(price),
            product_type,
            description: description?.trim(),
            stock: Number(stock) || 0,
            gst_tax_rate: Number(gst_tax_rate) || 0,
            measuring_unit,
            image,
            creater_id: req.userId,
            createdAt: new Date(),
        });

        res.status(201).json({
            message: "Product added successfully",
            product: newProduct,
        });

    } catch (error) {
        console.error(error);

        // @ts-ignore
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Product already exists",
            });
        }

        res.status(500).json({
            message: "Internal server error",
        });
    }
});


export default router;