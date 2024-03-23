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
    Lots.find({}, async (err, lots) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        return res.json(lots);
      }
    });
});

// ROUTE-2 :: get nearby parking lots - GET - "/api/lots/getnearbylots" - DOES NOT REQUIRES LOGIN
// TODO :: implement this route





// Add a new parking lot - POST - "/api/lots/addlot" - REQUIRES LOGIN
router.post("/addlot", fetchuser, async (req, res) => {
            
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userdata = await User.findById(req.user.id).select("-password");
    if(userdata.role !== "owner" && userdata.role !== "admin") 
    {
        console.log(req.user);
        console.log(userRole);
        return res.status(401).send("Not Allowed");
    }
    
    else {
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

            openingHours: req.body.openingHours,
            closingHours: req.body.closingHours,

            contactNumber: req.body.contactNumber,
            email: req.body.email,

            amenities: req.body.amenities,

            availableSpots: req.body.availableSpots,
            isOpen: req.body.isOpen,
        });
        
        newLot.save((err, lot) => {
            if(err)
            {
                console.log(err);
                return res.status(500).send(err);
            }
            else {
                return res.json(lot);
            }
        });
    }
});

// Update a parking lot - PUT - "/api/lots/updatelot" - REQUIRES LOGIN
router.put("/updatelot/:id", fetchuser, async (req, res) => {
    const {name, location, type, twoWheelerCapacity, fourWheelerCapacity, chargingPorts, securityGuard, surveillanceCamera, parkingRate, openingHours, closingHours, contactNumber, email, amenities, availableSpots, isOpen} = req.body;
    const newLot = {name, location, type, twoWheelerCapacity, fourWheelerCapacity, chargingPorts, securityGuard, surveillanceCamera, parkingRate, openingHours, closingHours, contactNumber, email, amenities, availableSpots, isOpen};
    try {
        let lot = await Lots.findById(req.params.id);
        if(!lot) {
            return res.status(404).send("Not Found");
        }
        if(lot.owner.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        else if(lot.owner.toString() === req.user.id) {
            lot = await Lots.findByIdAndUpdate(req.params.id, {$set: newLot}, {new: true});
            console.log("Owner is updating the lot");
            res.json(lot);
        }
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});



// TODO :: add option for admin to delete parking lots as well
// Delete a parking lot - DELETE - "/api/lots/deletelot" - REQUIRES LOGIN
router.delete("/deletelot/:id", fetchuser, async (req, res) => {
    try {
        let lot = await Lots.findById(req.params.id);
        if(!lot) {
            return res.status(404).send("Not Found");
        }
        if(lot.owner.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        else if(lot.owner.toString() === req.user.id) {
            lot = await Lots.findByIdAndDelete(req.params.id);
            console.log("Owner is deleting the lot");
            res.json("Deleted Successfully");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});



module.exports = router;