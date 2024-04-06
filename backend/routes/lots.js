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
        const lots = await Lots.find({approved: true});
        return res.json(lots);
    });

// ROUTE-2 :: get nearby parking lots - GET - "/api/lots/getnearbylots" - DOES NOT REQUIRES LOGIN
// TODO :: implement this route
router.get("/getnearby", async (req, res) => {
    const lots = await Lots.find({approved: true});

    // get the user's location
    const userLocation = req.body.location;
    let cords = userLocation.split("_");
    let userlong = parseFloat(cords[0]);
    let userlat = parseFloat(cords[1]);

    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const earthRadius = 6371; // Earth radius in km
    
        const radiansLat1 = toRadians(lat1);
        const radiansLat2 = toRadians(lat2);
        const radiansDeltaLon = toRadians(lon2 - lon1);
    
        const distance = Math.acos(Math.sin(radiansLat1) * Math.sin(radiansLat2) + Math.cos(radiansLat1) * Math.cos(radiansLat2) * Math.cos(radiansDeltaLon)) * earthRadius;
        
        return distance;
    }


    function  distcmp(a , b){
        const cordsa = a.geoCoordinates.split("_");
        const cordsb = b.geoCoordinates.split("_");
        const longa = parseFloat(cordsa[0]);
        const lata = parseFloat(cordsa[1]);
        const longb = parseFloat(cordsb[0]);
        const latb = parseFloat(cordsb[1]);
        const dista = calculateDistance(lata, longa, userlat, userlong);
        const distb = calculateDistance(latb, longb, userlat, userlong);

        if (dista < distb) {
            return -1;
        }
        if (dista > distb) {
            return 1;
        }
    }

    lots.sort(distcmp);

    return res.json(lots);
});




// Add a new parking lot - POST - "/api/lots/addlot" - REQUIRES LOGIN
router.post("/addlot", fetchuser, async (req, res) => {
            
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userdata = await User.findById(req.user.id).select("-password");
    if(userdata.role.toLowerCase() !== "owner" && userdata.role.toLowerCase() !== "admin") 
    {
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

        // find if new lot is already saved
        const lot = await Lots.findOne({name: req.body.name, location: req.body.location});
        if(lot) {
            return res.status(400).send("Lot already exists");
        }
        
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

// show all lots of a particular owner - GET - "/api/lots/getownerlots" - REQUIRES LOGIN
router.get("/getownerlots", fetchuser, async (req, res) => {
    try {
        const lots = await Lots.find({owner: req.user.id});
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
        if(!lot) {
            return res.status(404).send("Not Found");
        }
        res.json(lot);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;