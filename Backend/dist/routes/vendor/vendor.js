"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vendor_1 = __importDefault(require("../../models/vendor"));
const checkuser_1 = require("../../checkuser");
const router = express_1.default.Router();
// Get all vendors
router.get("/", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendors = yield vendor_1.default.find({ creater_id: req.userId }).sort({ name: 1 });
        res.json({ data: vendors });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching vendors", error });
    }
}));
// Add vendor
router.post("/add", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorData = Object.assign(Object.assign({}, req.body), { creater_id: req.userId });
        const newVendor = new vendor_1.default(vendorData);
        yield newVendor.save();
        res.status(201).json({ message: "Vendor added successfully", data: newVendor });
    }
    catch (error) {
        res.status(500).json({ message: "Error adding vendor", error });
    }
}));
// Get vendor by ID
router.get("/:id", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = yield vendor_1.default.findOne({ _id: req.params.id, creater_id: req.userId });
        if (!vendor) {
            res.status(404).json({ message: "Vendor not found" });
            return;
        }
        res.json({ data: vendor });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching vendor", error });
    }
}));
// Update vendor
router.put("/update/:id", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedVendor = yield vendor_1.default.findOneAndUpdate({ _id: req.params.id, creater_id: req.userId }, req.body, { new: true });
        if (!updatedVendor) {
            res.status(404).json({ message: "Vendor not found" });
            return;
        }
        res.json({ message: "Vendor updated successfully", data: updatedVendor });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating vendor", error });
    }
}));
exports.default = router;
