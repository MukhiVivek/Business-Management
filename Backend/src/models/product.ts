import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
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

        purchase_price: {
            type: Number,
            default: 0,
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

        tax_purchase_price: {
            type: Number,
            default: 0,
            min: 0,
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
    },
    {
        timestamps: true, // auto adds createdAt & updatedAt
    }
);

const product = mongoose.model("product", productSchema);
export default product;

