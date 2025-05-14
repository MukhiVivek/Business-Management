import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors());

//mongose 

const dburl :any  = process.env.MONGO_URI ;

main().then(() => {
  console.log("connected to DB");
}).catch((err) => {
  console.log(err);
})

async function main() {
  await mongoose.connect(dburl);
}

//routes

import user from "./routes/user/user";
import customer from "./routes/customer/customer"
import invoice from "./routes/invoice/invoice"

app.use("/api/v1/user", user);
app.use("/api/v1/customer", customer);
app.use("/api/v1/invoice", invoice);
 
app.get("/", (req, res) =>{
  res.send("Server is on test-1");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});