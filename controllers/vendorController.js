const Vendor=require('../models/Vendor');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const dotEnv=require('dotenv');

dotEnv.config();

const secretkey=process.env.WhatIsYourName;



const vendorRegister=async(req,res)=>{
    const{username,email,password}=req.body;
    try{
      const vendorEmail=await Vendor.findOne({email});
      if(vendorEmail===true){
        return res.status(400).json("Email already taken");
      }
      const hashedPassword=await bcrypt.hash(password,10);
      
      const newVendor=new Vendor({
        username,
        email,
        password:hashedPassword
      });
      await newVendor.save();  //saving the data in the database
      res.status(201).json({message:"Vendor registered Successfully"});
      console.log("Registered")
    }
    catch(error){
      console.log(error);
      res.status(500).json({error:"Internal Server Error"});
    }
}

const vendorLogin=async(req,res)=>{
  const {email,password}=req.body;
  try{
     const vendor=await Vendor.findOne({email});
     if(!vendor || !(await bcrypt.compare(password,vendor.password))){
          return res.status(401).json({error:"Invalid username or password"})
     }
     const token=jwt.sign({vendorId: vendor._id},secretkey,{expiresIn:'1h'});


     res.status(200).json({success:"Login Successful",token});
     console.log(email,"this is token",token);
  }
  catch(error){
      console.log(error);
      res.status(500).json({error: "Internal server error"});
  }
}

const getAllVendors =async(req,res)=>{
  try{
    const vendors=await Vendor.find().populate('firm');
    res.json({vendors})
  }
  catch(error){
    console.log(error);
    res.status(500).json({error: "Internal server error"});
  }
}

const getVendorById=async(req,res)=>{
  const vendorId= req.params.apple;
  try{
    const vendor=await Vendor.findById(vendorId).populate('firm');
    if(!vendor){
      return res.status(404).json({error:"Vendor not found"})
    }
    res.status(200).json({vendor})
  }
  catch(error){
    console.log(error);
    res.status(500).json({error: "Internal server error"});
  }
}

module.exports = {vendorRegister,vendorLogin,getAllVendors,getVendorById}