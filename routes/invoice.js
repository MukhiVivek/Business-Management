const express = require("express");
const router = express.Router({mergeParams : true});

const item = require('../models/item_name.js');



async function item_data( ) {
    let data = await item.find({});

    return data;
}



router.get("/" , async(req,res) => {

    let subtotal = 0;

    res.render("pags/invoice/invoice.ejs" , {subtotal})
    
}) 

router.post("/" , async (req,res) => {
    let data = req.body.data;

    console.log(data);
})

module.exports = router;