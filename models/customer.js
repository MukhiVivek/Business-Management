const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const customerSchema = new Schema({
    customer_name:String,
    customer_phone_number:Number,
    customer_code:Number,
    payment:Number,
    customer_billing_address:{
        street_addres:String,
        state:String,
        pincode:Number,
        city:String,
        area:String,
    },
    customer_balance:String,
});

const customer = mongoose.model("customer" , customerSchema);

module.exports = customer;