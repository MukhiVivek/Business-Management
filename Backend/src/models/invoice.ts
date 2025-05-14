const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const invoiceSchema = new Schema({
    customer_id:{
        type:Schema.Types.ObjectId,
        ref:"customer",
    },
    invoice_number:{
        type:String,
        required:true
    },
    invoice_date:{
        type:Date,
        required:true
    },
    due_date:{
        type:Date,
        required:true
    },
    Subtotal:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["paid" , "unpaid"],
        default:"unpaid"
    },
    description:String,
    items:[{
        item_id:{
            type:Schema.Types.ObjectId,
            ref:"item"
        },
        qty:Number,
        price:Number
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