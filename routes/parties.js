const express = require("express");
const router = express.Router({ mergeParams: true });

const purchase = require('../models/party.js');
const party_name = require('../models/party_name.js');
const party_payment = require('../models/party_payment.js');

const today = new Date();
const formattedDate = today.toISOString().split('T')[0];

router.get("/", async (req, res) => {

  let data = await party_name.find({})

  res.render("pags/parties/parties.ejs", { data })
})

router.get("/add", (req, res) => {
  res.render("pags/parties/party_name.ejs")
})

router.post("/add", async (req, res) => {
  let data = new party_name(req.body.data);
  console.log(data);
  await data.save();
  res.redirect("/")
})

//purchase parties form

router.get("/purchase", async (req, res) => {

  const data = await party_name.find({})

  const data1 = await purchase.find({});

  const Purchase_no = data1.length;

  res.render("pags/parties/purchase.ejs", { data, formattedDate , Purchase_no})
});

//purchase party data save process 

router.post("/purchase", async (req, res) => {

  let data = new purchase(req.body.data);
  console.log(data);

  await party_name.findOneAndUpdate({ party_name: data.party_name }, { $inc: { payment: (data.box * data.box_weight * data.rate) } }, { new: true })

  await data.save()
  res.redirect("/parties");
})



// party payment out 

router.get("/party_payment", async (req, res) => {

  const data = await party_name.find({})

  const data1 = await party_payment.find({})

  payment_no = data1.length

  res.render("pags/parties/party_payment.ejs", { data, formattedDate ,payment_no })
})

router.post("/party_payment", async (req, res) => {

  let data = new party_payment(req.body.data);
  console.log(data)

  await party_name.findOneAndUpdate({ party_name: data.party_name }, { $inc: { payment: - (data.amount) } }, { new: true })

  await data.save();

  res.redirect("/home")

})

router.get('/delete/:id' , async (req,res) =>{
  let { id } = req.params;
  let data = await purchase.findById(id);
  await purchase.findByIdAndDelete(id);
    // req.flash("success" , "Listing Deleted!")
    await party_name.findOneAndUpdate({ party_name: data.party_name }, { $inc: { payment: - (data.box * data.box_weight * data.rate) } }, { new: true })
    
  res.redirect("/parties");
})

router.get('/api/purchases', async (req, res) => {
  try {
    const purchases = await purchase.find(); // Fetch all items
    res.json(purchases);
  } catch (err) {
    res.status(500).send('Error fetching data');
  }
});

router.get('/api/payment', async (req, res) => {
  try {
    const party_payments = await party_payment.find(); // Fetch all items
    res.json(party_payments);
  } catch (err) {
    res.status(500).send('Error fetching data');
  }
});


router.get('/:id', async (req, res) => {

  let { id } = req.params;

  let data = await party_name.findById(id);

  

  

  res.render("pags/parties/parties_detail.ejs", { data,  })
})

router.get('/:id/parchase' , async (req,res) => {

  let { id } = req.params;

  let data = await party_name.findById(id);

  let data1 = await purchase.find({ party_name: data.party_name })

  let total = 0;

  for (let i = 0; i < data1.length; i++) {
    total = total + data1[i];
  }

  res.render('pags/parties/details/purchase.ejs' , {data , data1, total})
  

})

router.get('/:id/transaction' , async (req,res) => {

  let { id } = req.params;

  let data = await party_name.findById(id);

  let data1 = await party_payment.find({ party_name: data.party_name })

  

  res.render('pags/parties/details/transaction.ejs', {data , data1})


})

module.exports = router;
