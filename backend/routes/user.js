const express=require("express");
const Userrouter=express.Router();

const z =require('zod');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const otpgenerator=require("otp-generator");
const sendemail=require("../otplogic/otp");
const OtpModel=require("../models/OtpModel");
const UserModel = require("../models/UserModel");
const JWT_KEY=process.env.JWT_KEY;

Userrouter.post("/register", async function(req,res){
    console.log("register api called");
    console.log("body ",req.body);

   const requiredatas=z.object({
      name:z.string().min(3).max(100),
      email:z.string().min(5).max(100).email(),
      password:z.string().min(5).max(100),
   })



   let registerUser=null;
   const checkdata=requiredatas.safeParse(req.body);

   if(!checkdata.success){
      res.json({ message: "Invalid_types" });
      return;
   }

   const {
      name,
      email,
      password,
   } = req.body;
   //   console.log(req);
   const hashedpassword=await bcrypt.hash(password,5);
      // console.log("check errors ",checkAlreadyEmailExistOrNot);
         const checkAlreadyEmailExistOrNot=await UserModel.findOne({email:email});

      if(checkAlreadyEmailExistOrNot){
         res.json({
            message:"Email_Present"
         })
         return;
      }

      registerUser=await UserModel.create({
         name:name,
         password:hashedpassword,
         email:email,
         lastLoginDate: null
      });

     // console.log("check errors ",checkAlreadyEmailExistOrNot);
    
      res.json({
        registerUser
      })
})


Userrouter.post("/login", async function (req, res) {
  const requiredatas = z.object({
    email: z.string().min(3).max(100).email(),
    password: z.string().min(5).max(100),
  });

  const checkdata = requiredatas.safeParse(req.body);
  if (!checkdata.success) {
    return res.json({ message: checkdata.error });
  }

  const { email, password } = req.body;

  // ---------------- PATIENT LOGIN ----------------

    const checkedUser = await UserModel.findOne({ email });

    if (!checkedUser) {
      return res.json({ message: "User_not_exists" });
    }

    const finduser = await bcrypt.compare(password, checkedUser.password);

    if (!finduser) {
      return res.json({ message: "User_not_exists" });
    }

    // GET LAST LOGIN DATE BEFORE UPDATING
    const lastLoginDate = checkedUser.lastLoginDate;
    // console.log(lastLoginDate)

    // UPDATE LAST LOGIN DATE
    await UserModel.findOneAndUpdate(
      { _id: checkedUser._id },
      { $set: { lastLoginDate: new Date() } }
    );

    // console.log(lastLoginDate)

    const token = jwt.sign({ id: checkedUser._id }, JWT_KEY);

    return res.json({
      token,
      message: "logedin",
      userId: checkedUser._id,
    });

});



module.exports=Userrouter;