import invoice from "./invoice";

const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const customerSchema = new Schema({
    name:String,
    company:String,
    work_phone_number:Number,
    phone_number:Number,
    customer_type:String,
    display_name:String,
    email:String,
    balance:Number,
    location:String,
    customer_billing_address:{
        street_addres:String,
        state:String,
        pincode:Number,
        city:String,
        area:String,
    },
    invoice:{
        type: Number,
        default: 0
    },
    creater_id:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
});


const customer = mongoose.model("customer" , customerSchema);

export default customer;