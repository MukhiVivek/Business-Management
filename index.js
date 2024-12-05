if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}  

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsmate = require('ejs-mate');
const cors = require('cors');

const {danev_son ,danev_son_mathiya } = require('./models/danev_son.js');


const metodoverride = require("method-override");
const router = express.Router({mergeParams : true} );
const PDFDocument = require('pdfkit');

// routes

const customer = require("./routes/customer.js");
const parties = require("./routes/parties.js");
const item = require("./routes/item.js");
const invoice = require("./routes/invoice.js");


app.use(express.json());
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(metodoverride("_method"));
app.use(express.urlencoded({extended: true}));
app.engine('ejs', ejsmate);
app.use (express.static(path.join(__dirname,"/public")))

//database url
const dburl = process.env.ATLASDB_URL;

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


// router

app.use("/customer" , customer);
app.use("/parties" , parties);
app.use("/item" , item);
app.use("/invoice" , invoice);





//home
app.get("/" ,async (req,res) => {


    res.redirect("/home"  )
});


//home
app.get("/home" , async (req,res) => {
    res.render("pags/home.ejs")
});

//Danev son pags

app.get("/danev_son" , async (req,res) => {

    const data = await danev_son.find({})

    let totall = 0;
    let totalladd = 0;

    
    for(let datas of data){
        totall += datas.amount;
        totalladd += datas.add;

    }

    // for (let i = 30; i < 40; i++) {
    //     totall += data[i].amount;  // Add the amount at the current index to totall
    // }

    const total = new Intl.NumberFormat('en-IN').format(totall);
    const totaladd = new Intl.NumberFormat('en-IN').format(totalladd);
    
    res.render("pags/danev_son.ejs" , {data , total , totaladd})
})

app.get("/danev_son/:id/edit" ,async (req,res) => {

    let { id } = req.params;
    const data = await danev_son.findById(id);

    res.render("pags/edit.ejs" , { data } )
})

app.put("/danev_son/:id" ,async (req,res) => {
    let { id } = req.params;
    console.log(req.body.data);

    
    await danev_son.findByIdAndUpdate( id , { ...req.body.data }, { new: true });

    res.redirect("/danev_son")
})
app.get("/danev_son_add_bill" , async (req,res) => {

    let nom = 0; 
    

    const data = await danev_son.find({})

    

    for (let datas of data ){
        nom =  datas.bill_number;
    }

    nom +=1
    
    res.render("pags/danev_son_add_bill.ejs" , {nom})
})



app.post('/danev_son_add_bill', async (req, res) => {
    
        let data = new danev_son(req.body.data);

        console.log(data)
        
        await data.save();

        res.redirect("/danev_son_add_bill")
        
});

app.get("/danev_son_mathiya" , async (req,res) => {

    const data = await danev_son_mathiya.find({})

    let totall = 0;

    for(let datas of data){
        totall += datas.amount;
    }

    const total = new Intl.NumberFormat('en-IN').format(totall);

    res.render("pags/danev_son_mathiya.ejs" , {data , total})    
})

app.get("/danev_son_mathiya_bill" ,async (req,res) => {
    let nom = 0; 
    

    const data = await danev_son_mathiya.find({})

    

    for (let datas of data ){
        nom =  datas.bill_number;
    }

    nom +=1
    res.render("pags/danev_son_mathiya_bill.ejs" , {nom})
})

app.post("/danev_son_mathiya_bill" ,async (req,res) => {
    let data = new danev_son_mathiya(req.body.data);

    console.log(data)
        
    await data.save();

    res.redirect("/danev_son_mathiya_bill")
})

app.listen(8000,  () => {
    console.log("server is listening to post on 8000");
});


