// manage lot listing with this

const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Lots = require("../models/Lots");
const User = require("../models/Users");
const { body, validationResult, check } = require("express-validator");
const Validator = require("../middleware/Validator");
require("dotenv").config();

// ROUTE-1 :: approve lots - POST - "/api/admin/approvelots" - REQUIRES LOGIN
// send lotid in body to approve the lot
router.post("/approvelots", fetchuser, async (req, res) => {
  const userdata = await User.findById(req.user.id).select("-password");
  const targetlot = req.body.lotid;
  if (userdata.role.toLowerCase() !== "admin") {
    return res.status(401).send("Not Allowed");
  }

  const geocord = req.body.location;

  // update lot having id targetlot to approved status also add geocordinates
  Lots.findByIdAndUpdate(
    targetlot,
    { approved: true, geoCoordinates: geocord },
    function (err, docs) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        return res.json(docs);
      }
    }
  );
});

// ROUTE-2 :: delete a lot - DELETE - "/api/admin/deletelot" - REQUIRES LOGIN
// send lotid in body to delete the lot
router.delete("/deletelot", fetchuser, async (req, res) => {
  const userdata = await User.findById(req.user.id).select("-password");
  const targetlot = req.body.lotid;
  if (userdata.role.toLowerCase() !== "admin") {
    return res.status(401).send("Not Allowed");
  }
  // delete lot having id targetlot
  Lots.findByIdAndDelete(targetlot, function (err, docs) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    } else {
      return res.json(docs);
    }
  });
});

// ROUTE-3 :: show all listings that are not approved - GET - "/api/admin/showpending" - REQUIRES LOGIN
router.get("/showpending", fetchuser, async (req, res) => {
  const userdata = await User.findById(req.user.id).select("-password");
  if (userdata.role.toLowerCase() !== "admin") {
    return res.status(401).send("Not Allowed");
  }
  // find all lots that are not approved
  const lots = await Lots.find({ approved: false });
  console.log(lots);
  return res.json(lots);
});

module.exports = router;
