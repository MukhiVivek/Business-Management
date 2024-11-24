const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const danev_sonSchema = new Schema({
    bill_number: {
        type:Number,
        required: true,
        unique: true, // Ensure that bill numbers are unique
    },
    amount: Number,
    add:Number,
    date:Date,
})

const danev_son_mathiyaSchema = new Schema({
    bill_number: {
        type:Number,
        required: true,
        unique: true, // Ensure that bill numbers are unique
    },
    amount: Number,
    add:Number,
    date:Date,
})

const danev_son = mongoose.model("danev_son" , danev_sonSchema);
const danev_son_mathiya = mongoose.model("danev_son_mathiya" , danev_son_mathiyaSchema);

module.exports = {danev_son , danev_son_mathiya};
