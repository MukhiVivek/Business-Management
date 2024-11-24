const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const party_nameSchema = new Schema({
    party_name: String,
    phone_number: {
        type:Number,
        min:10,
    },
    payment:Number,

});

const party_name = mongoose.model("party_name" , party_nameSchema);

module.exports = party_name;
