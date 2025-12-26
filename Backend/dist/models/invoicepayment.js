"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const invoicePaymentSchema = new Schema({
    amount: Number,
    payment_method: String,
    status: String,
    invoice_id: {
        type: Schema.Types.ObjectId,
        ref: "invoice"
    },
    description: String,
    createdAt: Date,
    creater_id: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
});
const invoicePayment = mongoose.model("invoicePayment", invoicePaymentSchema);
exports.default = invoicePayment;
