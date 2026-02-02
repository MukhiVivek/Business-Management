import mongoose, { Schema } from "mongoose";

const purchaseSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    bill_number: String,
    purchase_price: {
        type: Number, // The price you paid to your supplier
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    remaining_stock: {
        type: Number, // Tracks how much of THIS lot is still available to sell
        required: true
    },
    purchase_date: {
        type: Date,
        default: Date.now
    },
    creater_id: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
}, { timestamps: true });

const purchase = mongoose.model("purchase", purchaseSchema);
export default purchase;
