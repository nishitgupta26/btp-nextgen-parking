// manage lot listing with this

const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Lots = require("../models/Lots");
const User = require("../models/Users");
const { body, validationResult, check } = require("express-validator");
const Validator = require("../middleware/Validator");
require("dotenv").config();


// grant manager access to a user for a lot
// ROUTE-1 :: add a manager to a lot - POST - "/api/manager/addmanager" - REQUIRES LOGIN
// send lotid and manager email in body to add the manager
router.post("/addmanager", fetchuser, async (req, res) => {

    const userdata = await User.findById(req.user.id).select("-password");
    const targetmanager = req.body.manageremail;

    if(userdata.role.toLowerCase() !== "owner" && userdata.role.toLowerCase() !== "admin")
    {
        return res.status(401).send("Not Allowed");
    }
    // find the lot with id targetlot
    const Lot = await Lots.findById(req.body.lotid);
    if(!Lot)
    {
        return res.status(404).send("Lot not found");
    }

    if(Lot.owner.toString() !== req.user.id.toString() && userdata.role.toLowerCase() !== "admin")
    {
        return res.status(401).send("Not Allowed");
    }

    // find the user with email targetmanager
    const Manager = await User.findOne({email: targetmanager});
    if(!Manager)
    {
        return res.status(404).send("User not found");
    }

    // add the manager to the lot
    Lots.findByIdAndUpdate(req.body.lotid, {$push: {managers: Manager._id}}, function(err, docs){
        if(err){
            console.log(err);
            return res.status(500).send(err);
        }
        else{
            return res.json(docs);
        }
    });

    if(userdata.role.toLowerCase() === "user")
    {
        // update the user to manager
        User.findByIdAndUpdate(req.user.id, {role: "Manager"}, function(err, docs){
            if(err)
            {
                console.log(err);
                return res.status(500).send(err);
            }
            else
            {
                return res.json(docs);
            }
        });
    }
    
});


// ROUTE-2 :: remove a manager from a lot - DELETE - "/api/manager/removemanager" - REQUIRES LOGIN
// send lotid and manager email in body to remove the manager
router.delete("/removemanager", fetchuser, async (req, res) => {

    const userdata = await User.findById(req.user.id).select("-password");
    const targetmanager = req.body.manageremail;

    if(userdata.role.toLowerCase() !== "owner" && userdata.role.toLowerCase() !== "admin")
    {
        return res.status(401).send("Not Allowed");
    }

    // find the lot with id targetlot

    const Lot = await Lots.findById(req.body.lotid);

    if(!Lot)
    {
        return res.status(404).send("Lot not found");
    }
    if(Lot.owner.toString() !== req.user.id.toString() && userdata.role.toLowerCase() !== "admin")
    {
        return res.status(401).send("Not Allowed");
    }
    // find the user with email targetmanager
    const Manager = await User.findOne({email: targetmanager});
    if(!Manager)
    {
        return res.status(404).send("User not found");
    }

    // remove the manager from the lot
    Lots.findByIdAndUpdate(req.body.lotid, {$pull: {managers: Manager._id}}, function(err, docs){
        if(err)
        {
            console.log(err);
            return res.status(500).send(err);
        }
        else
        {
            return res.json(docs);
        }
    }
    );
});

// ROUTE-3 :: get all managers of a lot - GET - "/api/manager/getmanagers" - REQUIRES LOGIN
// send lotid in params to get all managers of the lot
router.get("/getmanagers/:id", fetchuser, async (req, res) => {
    const userdata = await User.findById(req.user.id).select("-password");

    if(userdata.role.toLowerCase() !== "owner" && userdata.role.toLowerCase() !== "admin")
    {
        return res.status(401).send("Not Allowed");
    }
    // find the lot with id targetlot
    TargetLot = await Lots.findById(req.params.id);
    if(TargetLot.owner.toString() !== req.user.id.toString() && userdata.role.toLowerCase() !== "admin")
    {
        return res.status(401).send("Not Allowed");
    }
    if(!TargetLot)
    {
        return res.status(404).send("Lot not found");
    }

    // return all managers of the TargetLot
    Managers = TargetLot.managers;
    return res.json(Managers);

});

// ROUTE-4 :: let manager update a lot - PUT - "/api/manager/updatelot" - REQUIRES LOGIN
router.put("/updatelot/:id", fetchuser, async (req, res) => {
    const {name, location, type, twoWheelerCapacity, fourWheelerCapacity, chargingPorts, securityGuard, surveillanceCamera, parkingRate, openingHours, closingHours, contactNumber, email, amenities, availableSpots, isOpen} = req.body;
    const newLot = {name, location, type, twoWheelerCapacity, fourWheelerCapacity, chargingPorts, securityGuard, surveillanceCamera, parkingRate, openingHours, closingHours, contactNumber, email, amenities, availableSpots, isOpen};
    const userdata = await User.findById(req.user.id).select("-password");
    const TargetLot = await Lots.findById(req.params.id);
    if(!TargetLot)
    {
        return res.status(404).send("Lot not found");
    }
    if(userdata.role.toLowerCase() !== "manager")
    {
        return res.status(401).send("Not Allowed");
    }
    if(!TargetLot.managers.includes(req.user.id))
    {
        return res.status(401).send("Not Allowed");
    }
    // update the lot with newLot
    Lots.findByIdAndUpdate(req.params.id, newLot, function(err, docs){
        if(err)
        {
            console.log(err);
            return res.status(500).send(err);
        }
        else
        {
            return res.json(docs);
        }
    });
});





module.exports = router;