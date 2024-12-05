const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const purchaseSchema = new Schema({
    party_name: String,
    Purchase_number:Number,
    item: String,
    box:Number,
    box_weight:Number,
    rate:Number,
    date:Date,
})

const purchase = mongoose.model("purchase" , purchaseSchema);

module.exports = purchase;

