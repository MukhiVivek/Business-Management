const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const productSchema = new Schema({
    name:String,
    price:Number,
    product_type:String,
    description:String,
    stock:Number,
    creater_id:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    createdAt:Date,
    updatedAt:{
        type:Date,
        default:Date.now
    }
});

const product = mongoose.model("product" , productSchema);

export default product;