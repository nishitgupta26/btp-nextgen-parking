// manage lot listing with this

const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Lots = require("../models/Lots");
const User = require("../models/Users");
const { body, validationResult, check } = require("express-validator");
// const multer = require("multer");
// const fs = require("fs");
// const DatauriParser = require("datauri/parser");
const Validator = require("../middleware/Validator");
require("dotenv").config();

// ROUTE-1 :: get all parking lots listed - GET - "/api/lots/getlots" - DOES NOT REQUIRES LOGIN
router.get("/getlots", async (req, res) => {
  const lots = await Lots.find({ approved: true });
  return res.json(lots);
});

// ROUTE-2 :: get nearby parking lots - GET - "/api/lots/getnearby/:location" - DOES NOT REQUIRES LOGIN
// TODO :: implement this route
router.get("/getnearby/:location", async (req, res) => {
 
  // Helper function to check if today is a weekend
  function isTodayWeekend() {
    const today = new Date();
    const day = today.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  }

  // Helper function to check if today is a holiday
  function isTodayHoliday() {
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const holidays = ["2024-12-25", "2025-01-01"]; // Add actual holiday dates here

    return holidays.includes(today);
  }

  // Dynamic pricing function
  function calculateDynamicPrice(lot) {
    function calculateOccupancy(fourWheelerCapacity, availableSpots) {
      if (fourWheelerCapacity === 0) return 0; // Avoid division by zero
      return ((fourWheelerCapacity - availableSpots) * 100) / fourWheelerCapacity;
    }

    let price = lot.parkingRate;
    const occupancyPercentage = calculateOccupancy(lot.fourWheelerCapacity, lot.availableSpots);

    // Increase price if today is a weekend or holiday
    if (isTodayWeekend()) price *= 1.2; // 20% increase for weekends
    if (isTodayHoliday()) price *= 1.3; // 30% increase for holidays

    // Adjust price based on crowd level
    // switch (lot.crowdLevel) {
    //   case "high":
    //     price *= 1.5;
    //     break;
    //   case "medium":
    //     price *= 1.2;
    //     break;
    //   default:
    //     break;
    // }

    // Adjust price based on occupancy
    if (occupancyPercentage >= 75) {
      price *= 1.3;
    } else if (occupancyPercentage >= 50) {
      price *= 1.2;
    }
    // console.log(`Original Rate: ${lot.parkingRate}, New Rate: ${price}`);
    return Math.floor(price);
  }

  let lots = await Lots.find({ approved: true, isOpen: true });

  // Apply dynamic pricing and save to `currentRate`
  lots = await Promise.all(
    lots.map(async (lot) => {
      const newRate = calculateDynamicPrice(lot);
      lot.currentRate = newRate;
      await lot.save(); // Save the updated rate to the database
      return lot;
    }) 
  );
  const userLocation = req.params.location;
  const [userlong, userlat] = userLocation.split("_").map(parseFloat);

  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371;
    const radiansLat1 = toRadians(lat1);
    const radiansLat2 = toRadians(lat2);
    const radiansDeltaLon = toRadians(lon2 - lon1);

    return Math.acos(
      Math.sin(radiansLat1) * Math.sin(radiansLat2) +
      Math.cos(radiansLat1) * Math.cos(radiansLat2) * Math.cos(radiansDeltaLon)
    ) * earthRadius;
  }

  function distcmp(a, b) {
    if (!a.geoCoordinates || !b.geoCoordinates) return 0;

    const [longa, lata] = a.geoCoordinates.split("_").map(parseFloat);
    const [longb, latb] = b.geoCoordinates.split("_").map(parseFloat);
    const dista = calculateDistance(lata, longa, userlat, userlong);
    const distb = calculateDistance(latb, longb, userlat, userlong);

    return dista - distb;
  }

  lots.sort(distcmp);
  return res.json(lots);
});

// search parking lots according to location - POST - "/api/lots/searchlot"
router.post("/searchlot/:searchTerm", async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const { lots } = req.body;

    if (!Array.isArray(lots)) {
      return res.status(400).json({ error: "Invalid 'lots' array in request body" });
    }

    const filteredLots = lots.filter((lot) =>
      lot.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    res.json(filteredLots);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Add a new parking lot - POST - "/api/lots/addlot" - REQUIRES LOGIN
router.post("/addlot", fetchuser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userdata = await User.findById(req.user.id).select("-password");
  if (
    userdata.role.toLowerCase() !== "owner" &&
    userdata.role.toLowerCase() !== "admin"
  ) {
    return res.status(401).send("Not Allowed");
  } else {
    // let otherAmmenities = [req.body.amm1,req.body.amm2,req.body.amm3];

    const newLot = new Lots({
      name: req.body.name,
      location: req.body.location,
      type: req.body.type,
      owner: req.user.id,

      twoWheelerCapacity: req.body.twoWheelerCapacity,
      fourWheelerCapacity: req.body.fourWheelerCapacity,
      chargingPorts: req.body.chargingPorts,

      securityGuard: req.body.securityGuard,
      surveillanceCamera: req.body.surveillanceCamera,

      parkingRate: req.body.parkingRate,
      currentRate: req.body.currentRate,

      openingHours: req.body.openingHours,
      closingHours: req.body.closingHours,

      contactNumber: req.body.contactNumber,
      email: req.body.email,

      amenities: req.body.amenities,

      availableSpots: req.body.availableSpots,
      availableSpotsTwoWheeler: req.body.availableSpotsTwoWheeler,
      isOpen: req.body.isOpen,
    });

    // find if new lot is already saved
    const lot = await Lots.findOne({
      name: req.body.name,
      location: req.body.location,
    });
    if (lot) {
      return res.status(400).send("Lot already exists");
    }

    newLot.save((err, lot) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        return res.json(lot);
      }
    });
  }
});

// Update a parking lot - PUT - "/api/lots/updatelot" - REQUIRES LOGIN
router.put("/updatelot/:id", fetchuser, async (req, res) => {
  const {
    name,
    location,
    type,
    twoWheelerCapacity,
    fourWheelerCapacity,
    chargingPorts,
    securityGuard,
    surveillanceCamera,
    parkingRate,
    currentRate,
    openingHours,
    closingHours,
    contactNumber,
    email,
    amenities,
    availableSpots,
    availableSpotsTwoWheeler,
    isOpen,
  } = req.body;
  const newLot = {
    name,
    location,
    type,
    twoWheelerCapacity,
    fourWheelerCapacity,
    chargingPorts,
    securityGuard,
    surveillanceCamera,
    parkingRate,
    currentRate,
    openingHours,
    closingHours,
    contactNumber,
    email,
    amenities,
    availableSpots,
    availableSpotsTwoWheeler,
    isOpen,
  };
  try {
    let lot = await Lots.findById(req.params.id);
    if (!lot) {
      return res.status(404).send("Not Found");
    }
    if (lot.owner.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    } else if (lot.owner.toString() === req.user.id) {
      lot = await Lots.findByIdAndUpdate(
        req.params.id,
        { $set: newLot },
        { new: true }
      );
      console.log("Owner is updating the lot");
      res.json(lot);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Delete a parking lot - DELETE - "/api/lots/deletelot" - REQUIRES LOGIN
router.delete("/deletelot/:id", fetchuser, async (req, res) => {
  try {
    let lot = await Lots.findById(req.params.id);
    if (!lot) {
      return res.status(404).send("Not Found");
    }
    if (lot.owner.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    } else if (lot.owner.toString() === req.user.id) {
      lot = await Lots.findByIdAndDelete(req.params.id);
      console.log("Owner is deleting the lot");
      res.json("Deleted Successfully");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// show all lots of a particular owner - GET - "/api/lots/getownerlots" - REQUIRES LOGIN
router.get("/getownerlots", fetchuser, async (req, res) => {
  try {
    const lots = await Lots.find({ owner: req.user.id });
    res.json(lots);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// show details of a particular lot - GET - "/api/lots/getlot" - DOES NOT REQUIRES LOGIN
router.get("/getlot/:id", async (req, res) => {
  try {
    const lot = await Lots.findById(req.params.id);
    if (!lot) {
      return res.status(404).send("Not Found");
    }
    res.json(lot);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
