const express = require("express");
const router = express.Router({mergeParams : true});

const purchase = require('../models/party.js');
const party_name = require('../models/party_name.js');
const party_payment = require('../models/party_payment.js');

const today = new Date();
const formattedDate = today.toISOString().split('T')[0];

router.get("/" , async(req,res) => {

    let data = await party_name.find({})

    console.log(data)
    
    res.render("pags/parties/parties.ejs" , {data})
}) 

router.get("/add" , (req,res) => {
    res.render("pags/parties/party_name.ejs")
})

router.post("/add" , async (req,res) => {
    let data = new party_name(req.body.data);
    console.log(data);
    await data.save();
    res.redirect("/")
})  

//purchase parties form

router.get("/purchase" , async (req,res) => {

    const data = await party_name.find({})

    res.render("pags/parties/purchase.ejs" , {data ,formattedDate})
});

//purchase party data save process 

router.post("/purchase" , async (req,res) => {

    let data = new purchase(req.body.data);
    console.log(data);
    await data.save()
    res.redirect("/");
    // res.send(data);
})

// party payment out 

router.get("/party_payment" , async (req,res) => {

    const data = await party_name.find({})

    
    

    res.render("pags/parties/party_payment.ejs" , {data , formattedDate})
})

router.post("/party_payment" , async (req,res) => {

    let data = new party_payment(req.body.data);

    console.log(data)
        
    await data.save();

    res.redirect("/home")
    
})

router.get('/:id' , async (req,res) => {

    let { id }= req.params;

    let data = await party_name.findById(id);

    let data1= await purchase.find({party_name: data.party_name})

    let total = 0;

    for(let i=0; i<data1.length; i++){
        total = total + data1[i];
    }

    res.render("pags/parties/parties_detail.ejs", {data , data1 , total   })
})

module.exports = router;
