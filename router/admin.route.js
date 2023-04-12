const adminRoute = require("express").Router();
const fs = require("fs");

const { UserModel } = require("../model/user_model");
const { QRModel } = require("../model/qr.model");
const { QRAnaModel } = require("../model/qr_ana.model");


// -------------->>>>> All Users <<<<<---------------
adminRoute.get("/allData", async (req, res) => {
  try {
    let data = await UserModel.find();
    let qr = await QRModel.find();
    let qrAna = await QRAnaModel.find();
    let Blockcount=0;
    data.forEach((e)=>{
      e.status===false?Blockcount++:Blockcount+=0;
    })
    res.send({ msg: "All Data", data: data,qr:qr,count:Blockcount,qrAna:qrAna });
  } catch (error) {
    console.log(error);
    res.send({ msg: "Error in Fetching Details" });
  }
});

// ------------->>>>> Qr by Users <<<<<---------------
adminRoute.get("/usersQR/:email", async (req, res) => {
  const email = req.params.email;
  // console.log(req.params.email)
  try {
    let data = await QRModel.find({email:email});
    if(data.length==0){
      return res.send({ msg: "No QR Generated by User"});
    }
    res.send({ msg: "All QR Generated by User", data: data });
  } catch (error) {
    console.log(error);
    res.send({ msg: "Error in Fetching Details" });
  }
});

// ------------->>>>> QrAna by Users <<<<<---------------
adminRoute.get("/usersQRAna/:email", async (req, res) => {
  const email = req.params.email;
  try {
    let data = await QRAnaModel.find({email:email});
    if(data.length==0){
      return res.send({ msg: "No QR Analysed by User"});
    }
    res.send({ msg: "All QR Analysed by User", data: data });
  } catch (error) {
    console.log(error);
    res.send({ msg: "Error in Fetching Details" });
  }
});

// ------->>>>> Delete a User from DB <<<<<-----------
adminRoute.delete("/deleteUser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await UserModel.findByIdAndDelete({ _id: id });
    res.send({ msg: `User has been Deleted` });
  } catch (err) {
    console.log(err);
    res.send({ msg: `Can't Deleted` });
  }
});

// ------->>>>> Get all Blocked Users <<<<------------
adminRoute.get("/blocked/Users", async (req, res) => {
  try {
    let data = await UserModel.find({status:false})
    console.log(data)
    res.send({msg:'Blocked User',data:data});
  } catch (err) {
    res.send({ msg:'No Blocked Users' });
  }
});

// ------------->>>>> Block User <<<<<---------------
adminRoute.post("/blockUser/:id", async (req, res) => {
  let id = req.params.id;
  try {
    await UserModel.findByIdAndUpdate(id, { status: false });
    res.send({ msg: "User is Blocked Now" });
  } catch (err) {
    res.send({ msg: "Error in Blocking" });
  }
});

// ------------>>>>> Unblock User <<<<<--------------
adminRoute.post("/unblockUser/:id", async (req, res) => {

  let id = req.params.id;
  console.log(id)
  try {
    await UserModel.findByIdAndUpdate(id, { status: true });
    res.send({ msg: "User is Unblocked Now" });
  } catch (err) {
    res.send({ msg: "Error in UnBlocking" });
  }
});

module.exports = {
  adminRoute,
};