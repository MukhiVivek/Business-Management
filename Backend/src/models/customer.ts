const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const customerSchema = new Schema({
    name:String,
    phone_number:Number,
    type:String,
    balance:Number,
    location:String,
    customer_billing_address:{
        street_addres:String,
        state:String,
        pincode:Number,
        city:String,
        area:String,
    },
});

const customer = mongoose.model("customer" , customerSchema);

export default customer;