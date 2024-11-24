const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const itemSchema = new Schema({
    item_name:String,
    item_code:Number,
    item_stock:Number,
    item_unit:String,
    item_sellingprice:Number,
    item_purchaseprice:Number,
});

const item = mongoose.model("item" , itemSchema);

module.exports = item;