
const express = require('express');
const app=express();

const dotEnv=require('dotenv')
const mongoose=require('mongoose');

const vendorRoutes=require('./Routes/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes=require('./Routes/firmRoutes');
const productRoutes=require('./Routes/productRoutes');
const cors=require("cors");
const path= require("path");

dotEnv.config()

console.log("Mongo URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected Successfully"))
.catch((error) => console.log("MongoDB connection error:", error));

  app.use(bodyParser.json()); //sends the input data in the form of json()
  app.use('/vendor',vendorRoutes); // craetes a route /vendor/<specifiedRoute>
  app.use('/firm',firmRoutes); 
  app.use('/product',productRoutes);
  app.use('/uploads',express.static('uploads'));

const PORT=4000;

app.listen(PORT,()=>{
    console.log(`Server Started and running at ${PORT}`);
})


app.use('/home',(req,res)=>{
    res.send('<h1>Welcome to the Home Page');
})