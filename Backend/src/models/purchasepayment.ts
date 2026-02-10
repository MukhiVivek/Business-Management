import mongoose, { Schema } from "mongoose";

const purchasePaymentSchema = new Schema({
    purchase_id: {
        type: Schema.Types.ObjectId,
        ref: "purchase"
    },
    vendor_id: {
        type: Schema.Types.ObjectId,
        ref: "vendor"
    },
    payment_date: {
        type: Date,
        default: Date.now
    },
    amount_paid: Number,
    payment_mode: String,
    reference_number: String,
    notes: String,
    creater_id: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PurchasePayment = mongoose.model("purchasepayment", purchasePaymentSchema);

export default PurchasePayment;
