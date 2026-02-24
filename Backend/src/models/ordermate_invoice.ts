import mongoose, { Schema } from "mongoose";

const ordermateInvoiceSchema = new Schema({
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: "customer",
    },
    invoice_number: String,
    invoice_date: {
        type: Date,
        default: Date.now
    },
    items: [{
        product_id: {
            type: Schema.Types.ObjectId,
            ref: "product"
        },
        name: String,
        qty: Number,
        price: Number,
        tamount: Number
    }],
    subtotal: Number,
    tax: Number,
    total: Number,
    status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    customerName: String,
    customerPhone: String,
    notes: String,
    location: {
        latitude: Number,
        longitude: Number,
    },
    creater_id: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const OrdermateInvoice = mongoose.model("ordermate_invoice", ordermateInvoiceSchema);
export default OrdermateInvoice;
