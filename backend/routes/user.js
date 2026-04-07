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
const caseModel=require("../models/CaseModel");

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

  console.log("login api called");
  console.log("body ", req.body);


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

    console.log("checked user ", checkedUser);

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
      name: checkedUser.name,
    });

});



Userrouter.post("/addcase", async (req, res) => {
  try {
    const {
      caseTitle,
      client,
      clientEmail,
      priority,
      status,
      assignedTo,
      caseDescription,
      nextHearing,
      documentsCount,
    } = req.body;

    if (!caseTitle || !client) {
      return res.status(400).json({
        message: "caseTitle and client are required",
      });
    }

    // ✅ find user
    const user = await UserModel.findOne({ email: clientEmail });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

   
    const newcase=await caseModel.create({
        caseTitle,
        client,
        clientEmail,
        priority,
        status,
        assignedTo,
        caseDescription,
        nextHearing,
        documentsCount,
        createdBy:user._id
    });

    user.cases.push(newcase._id);
    await user.save();

    res.json({
      message: "Case added successfully",
      case: newcase,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

Userrouter.get("/getcases", async (req, res) => {
  try {
    const cases = await caseModel.find({}).sort({ createdAt: -1 });
    res.json({ cases });
  } catch (err) {
    console.error("Error fetching cases:", err);
    res.status(500).json({ message: "Failed to fetch cases" });
  }
});

const sendFeedbackEmail = require("../utils/sendFeedbackEmail");

Userrouter.put("/updatestatus/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const caseId = req.params.id;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedCase = await caseModel.findByIdAndUpdate(
      caseId,
      { status },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    // If status changed to closed, send feedback email
    if (status.toLowerCase() === "closed") {
      const clientEmail = updatedCase.clientEmail;
      if (clientEmail) {
        // Send email in background
        sendFeedbackEmail(clientEmail, updatedCase.caseTitle, updatedCase._id, updatedCase.assignedTo)
          .catch(err => console.error("Failed to send feedback email in background:", err));
      }
    }

    res.json({ message: "Status updated successfully", case: updatedCase });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

const sendAlertEmail = require("../utils/sendAlertEmail");

Userrouter.post("/sendalert", async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    
    if (!email || !subject || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await sendAlertEmail(email, subject, message);
    
    res.json({ message: "Alert sent successfully" });
  } catch (err) {
    console.error("Error sending alert:", err);
    res.status(500).json({ message: "Failed to send alert email" });
  }
});

Userrouter.put("/updatecase/:id", async (req, res) => {
  try {
    const caseId = req.params.id;
    const updateData = req.body;
    
    const updatedCase = await caseModel.findByIdAndUpdate(
      caseId,
      updateData,
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    // Intercept "closed" status and send feedback email
    if (updateData.status && updateData.status.toLowerCase() === "closed") {
      const clientEmail = updatedCase.clientEmail;
      if (clientEmail) {
        sendFeedbackEmail(clientEmail, updatedCase.caseTitle, updatedCase._id, updatedCase.assignedTo)
          .catch(err => console.error("Failed to send feedback email in background:", err));
      }
    }

    res.json({ message: "Case updated successfully", case: updatedCase });
  } catch (err) {
    console.error("Error updating case:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports=Userrouter;