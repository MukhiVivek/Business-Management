const express = require("express");
const router = express.Router({mergeParams : true});
const customer = require('../models/customer.js');

router.get("/" ,async (req,res) => {

    let data = await customer.find({})

    res.render("pags/customer/customer.ejs" , {data})
})

router.get("/add" , (req,res) => {

    res.render("pags/customer/add_customer.ejs")
})

router.post("/add" , async (req,res) => {

    let data = new customer(req.body.data);

    await data.save();

    console.log(data);

    res.redirect("/customer");
})

module.exports = router;