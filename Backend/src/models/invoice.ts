import mongoose, { Schema } from "mongoose";

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
    gst:{
        sgst:Number,
        cgst:Number,
        igst:Number
    },
    gst_table:{
        basic_amount:{
            amount_1: Number,
            amount_2: Number,
            amount_3: Number,
            amount_4: Number,
            amount_5: Number,
        },
        cgst_amount:{
            amount_1: Number,
            amount_2: Number,
            amount_3: Number,   
            amount_4: Number,
            amount_5: Number,
        },
        sgst_amount:{
            amount_1: Number,
            amount_2: Number,
            amount_3: Number,
            amount_4: Number,
            amount_5: Number,
        },
        igst_amount:{
            amount_1: Number,
            amount_2: Number,
            amount_3: Number,
            amount_4: Number,
            amount_5: Number,
        },
    },
    items:[{
        id:Number,
        name:String,
        qty:Number,
        price:Number,
        amount:Number,
        sgst:Number,
        cgst:Number,
        igst:Number,
        tamount:Number
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
    },
    tax:{
        type:Boolean,
    }
});


const invoice = mongoose.model("invoice" , invoiceSchema);

export default invoice;