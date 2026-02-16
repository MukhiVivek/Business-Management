import mongoose, { Schema } from "mongoose";

const purchaseSchema = new Schema({
    vendor_id: {
        type: Schema.Types.ObjectId,
        ref: "vendor",
    },
    purchase_number: String,
    purchase_date: Date,
    due_date: Date,
    Subtotal: Number,
    status: {
        type: String,
        default: "Pending"
    },
    description: String,
    items: [{
        product_id: {
            type: Schema.Types.ObjectId,
            ref: "product"
        },
        name: String,
        qty: Number,
        price: Number,
        amount: Number,
        sgst: Number,
        cgst: Number,
        igst: Number,
        tax_purchase_price: Number,
        tamount: Number
    }],
    creater_id: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Purchase = mongoose.model("purchase", purchaseSchema);

export default Purchase;
