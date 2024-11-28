const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const invoiceSchema = new Schema({
    invoice_number:Number,
    date:Date,
    item_name:[String],
    qty:[Number],
    item_price:[Number],
    amount:[Number],
    subtotal:Number,
    customers:{
        type : Schema.Types.ObjectId,
        ref: "customer",
    },
});

const invoice = mongoose.model("invoice" , invoiceSchema);

module.exports = invoice;