const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const orderSchema = new Schema({
    name:{
        type : Schema.Types.ObjectId,
        ref: "customer",
    },
    item:[
        {
        type : Schema.Types.ObjectId,
        ref: "item",
        }
    ],
    weight:{
        type: String,
    }
});

const order = mongoose.model("order" , orderSchema);

module.exports = order;