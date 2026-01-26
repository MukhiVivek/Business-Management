"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    product_type: {
        type: String,
        required: true,
        enum: [
            "Flour",
            "Farali",
            "Instant",
            "Premium",
            "Spices",
            "Whole",
            "Hing",
            "Papad",
        ],
    },
    description: {
        type: String,
        trim: true,
    },
    stock: {
        type: Number,
        default: 0,
        min: 0,
    },
    gst_tax_rate: {
        type: Number,
        enum: [0, 5, 12, 18, 28],
        default: 0,
    },
    measuring_unit: {
        type: String,
        enum: ["KG", "PCS", "Box", "Packet"],
        required: true,
    },
    creater_id: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, {
    timestamps: true, // auto adds createdAt & updatedAt
});
const product = mongoose_1.default.model("product", productSchema);
exports.default = product;
