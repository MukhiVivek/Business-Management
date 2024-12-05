const express = require("express");
const router = express.Router({ mergeParams: true });

const item = require('../models/item_name.js');
const { route } = require("./invoice.js");
const purchase = require("../models/party.js");

router.get("/", async (req, res) => {

  let data = await item.find({})


  res.render("pags/item/item.ejs", { data })
})

router.get("/add", (req, res) => {
  res.render('pags/item/add_item.ejs')
})

router.post('/add', async (req, res) => {
  let data = new item(req.body.data);

  console.log(data);

  await data.save();

  res.redirect('/item')
})

router.get('/api/items', async (req, res) => {
  try {
    const items = await item.find(); // Fetch all items
    res.json(items);
  } catch (err) {
    res.status(500).send('Error fetching data');
  }
});

// API endpoint to search items
router.get('/search', async (req, res) => {
  const query = req.query.q;
  try {
    const results = await purchase.find({ item: { $regex: query, $options: 'i' } }); // Case-insensitive search
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data', error: err });
  }
});

module.exports = router;