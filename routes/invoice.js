const express = require("express");
const router = express.Router({mergeParams : true});
const path = require("path");


const { PDFNet } = require("@pdftron/pdfnet-node");
const fs = require("fs");

const item = require('../models/item_name.js');
const invoice = require('../models/invoice.js');
const customer = require('../models/customer.js');


async function item_data( ) {
    let data = await item.find({});

    return data;
}



router.get("/" , async(req,res) => {

    let subtotal = 0;

    res.render("pags/invoice/invoice.ejs" , {subtotal})
    
}) 

router.post("/" , async (req,res) => {
    let data = new invoice(req.body.data);
    console.log(data);
    await data.save();

    res.redirect("/home");
})




// Initialize PDFNet with your license key
PDFNet.initialize("demo:1731769745328:7ef78d2c0300000000c4e7a408d8174e500aae5a205c09705bd6949150");

router.post('/invoice', async (req, res) => {

  let data1 = new invoice(req.body.data);
  
  await data1.save();

  let data = await invoice.findById(data1._id).populate('customers');
  console.log(data);

  
  
  const inputPart = path.resolve(__dirname, `../files/invoicePdf.pdf`);
  const outputPart = path.resolve(__dirname, `../files/invoice.pdf`);

  const replaceText = async () => {
    const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(inputPart);
    await pdfdoc.initSecurityHandler();
    const replacer = await PDFNet.ContentReplacer.create();
    const page = await pdfdoc.getPage(1);

    await replacer.addString('bill_number' , `${data.invoice_number}`)
    await replacer.addString('date' , `${new Date(data.date).toLocaleDateString('en-GB')}`)
    await replacer.addString('customer_name' , `${data.customers.customer_name}`)

    
        for(i=0; i<data.item_name.length; i++){
            await replacer.addString(`no${i}` , `${[i + 1]}`)
            await replacer.addString(`item_name${i}` , `${data.item_name[i]}`)
            await replacer.addString(`qty${i}` , `${data.qty[i]}`)
            await replacer.addString(`rate${i}` , `${data.item_price[i]}`)
            await replacer.addString(`amont${i}` , `${data.amount[i]}`)
          }
          for(i=data.item_name.length; i<17; i++){
            await replacer.addString(`no${i}` ,  ``)
            await replacer.addString(`item_name${i}` , ``)
            await replacer.addString(`qty${i}` , ``)
            await replacer.addString(`rate${i}` , ``)
            await replacer.addString(`amont${i}` , ``)
        }

    
    
    if("" == data.customers.customer_billing_address.street_addres){
      await replacer.addString(`customer_address` ,  ``)
    }else{
      await replacer.addString(`customer_address` ,  `${data.customers.customer_billing_address.street_addres} , ${data.customers.customer_billing_address.area} , ${data.customers.customer_billing_address.city} , ${data.customers.customer_billing_address.state} - ${data.customers.customer_billing_address.pincode}    `)
    }
    
    await replacer.addString('total_amount' , `${data.subtotal}`)
    await replacer.process(page);

    pdfdoc.save(outputPart , PDFNet.SDFDoc.SaveOptions.e_linearized);
  }

  try {
    await PDFNet.runWithCleanup(replaceText);
    fs.readFile(outputPart, (err, data) => {
      if (err) {
        res.status(500).send("Error reading output PDF.");
      } else {
        res.setHeader("Content-Type", "application/pdf");
        res.end(data);
      }
    });
  } catch (err) {
    res.status(500).send(`Error during conversion: ${err.message}`);
  }
});






module.exports = router;