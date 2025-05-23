const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const invoiceSchema = new Schema({
    customer_id:{
        type:Schema.Types.ObjectId,
        ref:"customer",
    },
    invoice_number:Number,
    invoice_date:Date,
    due_date:Date,
    Subtotal:Number,
    status:String,
    description:String,
    items:[{
        id:Number,
        name:String,
        qty:Number,
        price:Number,
        amount:Number
    }],
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


const invoice = mongoose.model("invoice" , invoiceSchema);

export default invoice;