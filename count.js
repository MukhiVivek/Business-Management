const mongoose = require("mongoose");
const danev_son = require('./models/danev_son.js');

//database url
const dburl = 'mongodb://127.0.0.1:27017/kumar_gruh_udhyog';

//mongoose connection
let mongoose_url = dburl;

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(mongoose_url);
}

async function data() {
    let data = await danev_son.find({})

    
}

