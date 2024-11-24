const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const purchaseSchema = new Schema({
    party_name: String,
    item: String,
    weight:Number,
    rate:Number,
    date:Date,
})

const purchase = mongoose.model("purchase" , purchaseSchema);

module.exports = purchase;

