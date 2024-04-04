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
    console.log(Manager)
    if(!Manager)
    {
        return res.status(404).send("User not found");
    }

    // TODO: dont add manager if already exists in manager of that lot;

    // add the manager to the lot
    Lots.findByIdAndUpdate(req.body.lotid, {$push: {managers: Manager._id}}, function(err, docs){
        if(err){
            console.log(err);
            return res.status(500).send(err);
        }
        
    });

    console.log(Manager._id);
    if(Manager.role.toLowerCase() === "user")
    {
        // update the user to manager
        User.findByIdAndUpdate(Manager._id, {role: "Manager"}, function(err, docs){
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
    else
    {
        return res.json("manager added successfully");
    }
    
});


// ROUTE-2 :: remove a manager from a lot - DELETE - "/api/manager/removemanager" - REQUIRES LOGIN
// send lotid and manager email in body to remove the manager
router.delete("/removemanager", fetchuser, async (req, res) => {

    const userdata = await User.findById(req.user.id).select("-password");
    const targetmanager = req.body.managerid;

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
    const Manager = await User.findById(targetmanager);
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
            return res.json("manager removed successfully");
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

    // return all users with id in Managers
    let managerDetails = [];
    for(let i=0; i<Managers.length; i++)
    {
        const manager = await User.findById(Managers[i]).select('name email');
        managerDetails.push(manager);
    }
    return res.json(managerDetails);

});




module.exports = router;