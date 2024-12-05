const express = require("express");
const router = express.Router({mergeParams : true});
const customer = require('../models/customer.js');
const invoice = require("../models/invoice.js");

router.get("/" ,async (req,res) => {

    let data = await customer.find({});

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

router.get('/api/customers', async (req, res) => {
    try {
      const customers = await customer.find(); // Fetch all customer
      res.json(customers);
    } catch (err) {
      res.status(500).send('Error fetching data' , err);
    }
  });

  // API endpoint to search customer
router.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
      const results = await item.find({ item_name: { $regex: query, $options: 'i' } }); // Case-insensitive search
      res.json(results);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching data', error: err });
    }
});

router.get('/:id' ,async (req,res) => {
  let { id } = req.params;

  let data = await customer.findById(id);
  console.log(data);
  
  let data1 = await invoice.find({ customers : id})

  res.render("pags/customer/customer_detail.ejs" , {data , data1 })
})

module.exports = router;