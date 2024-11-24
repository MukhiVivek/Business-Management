const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const party_paymentSchema = new Schema({
    party_name: String,
    amount: {
        type:Number,
        min:10,
    },
    payment_method:{
        type:String,
    },
    date:{
        type:Date,
    }
});

const party_payment = mongoose.model("party_payment" , party_paymentSchema);

module.exports = party_payment;