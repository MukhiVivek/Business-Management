import express from "express";
import Vendor from "../../models/vendor";
import { checkuserlogin } from "../../checkuser";


const router = express.Router();

// Get all vendors
router.get("/", checkuserlogin, async (req: any, res) => {

    try {
        const vendors = await Vendor.find({ creater_id: req.userId }).sort({ name: 1 });
        res.json({ data: vendors });
    } catch (error) {
        res.status(500).json({ message: "Error fetching vendors", error });
    }
});

// Add vendor
router.post("/add", checkuserlogin, async (req: any, res) => {

    try {
        const vendorData = { ...req.body, creater_id: req.userId };
        const newVendor = new Vendor(vendorData);
        await newVendor.save();
        res.status(201).json({ message: "Vendor added successfully", data: newVendor });
    } catch (error) {
        res.status(500).json({ message: "Error adding vendor", error });
    }
});

// Get vendor by ID
router.get("/:id", checkuserlogin, async (req: any, res) => {
    try {
        const vendor = await Vendor.findOne({ _id: req.params.id, creater_id: req.userId });
        if (!vendor) {
            res.status(404).json({ message: "Vendor not found" });
            return;
        }
        res.json({ data: vendor });
    } catch (error) {
        res.status(500).json({ message: "Error fetching vendor", error });
    }
});

// Update vendor
router.put("/update/:id", checkuserlogin, async (req: any, res) => {
    try {
        const updatedVendor = await Vendor.findOneAndUpdate(
            { _id: req.params.id, creater_id: req.userId },
            req.body,
            { new: true }
        );
        if (!updatedVendor) {
            res.status(404).json({ message: "Vendor not found" });
            return;
        }
        res.json({ message: "Vendor updated successfully", data: updatedVendor });
    } catch (error) {
        res.status(500).json({ message: "Error updating vendor", error });
    }
});

export default router;
