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
            packet_size,
            box_size,
            purchase_price,
            mrp,
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
            packet_size: Number(packet_size) || 0,
            box_size: Number(box_size) || 0,
            tax_purchase_price: Number(purchase_price) || 0,
            mrp: Number(mrp) || 0,
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

// Get a single product by ID
router.get("/:id", checkuserlogin, async (req: any, res: any) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const productData = await product.findOne({ _id: id, creater_id: req.userId });

        if (!productData) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ product: productData });
    } catch (e) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update a product by ID
router.put("/update/:id", checkuserlogin, async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const {
            name,
            price,
            purchase_price,
            product_type,
            description,
            stock,
            gst_tax_rate,
            measuring_unit,
            packet_size,
            box_size,
            mrp,
        } = req.body;

        if (!name || price === undefined || !product_type) {
            return res.status(400).json({
                message: "Required fields missing",
            });
        }

        // @ts-ignore
        const updatedProduct = await product.findOneAndUpdate(
            { _id: id, creater_id: req.userId },
            {
                name: name.trim(),
                price: Number(price),
                tax_purchase_price: Number(purchase_price) || 0,
                product_type,
                description: description?.trim(),
                stock: Number(stock) || 0,
                gst_tax_rate: Number(gst_tax_rate) || 0,
                measuring_unit,
                packet_size: Number(packet_size) || 0,
                box_size: Number(box_size) || 0,
                mrp: Number(mrp) || 0,
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found or unauthorized" });
        }

        res.json({
            message: "Product updated successfully",
            product: updatedProduct,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;