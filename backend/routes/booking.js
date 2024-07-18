const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Lots = require("../models/Lots");
const User = require("../models/Users");
const Booking = require("../models/Booking");
const { body, validationResult, check } = require("express-validator");
const Validator = require("../middleware/Validator");
require("dotenv").config();

// ROUTE-1 :: LET USER BOOK A SLOT - POST - "/api/booking/bookslot" - REQUIRES LOGIN
router.post("/bookslot", fetchuser, async (req, res) => {
  try {
    // const { lotId, checkIn, checkOut, vehicleNumber, vehicleType } = req.body;

    const lot = await Lots.findById(req.body.lotId);
    if (!lot) {
      return res.status(404).send("Lot not found");
    }

    if (
      req.body.vehicleType.toLowerCase() == "twowheeler" &&
      lot.availableSpotsTwoWheeler <= 0
    ) {
      return res.status(400).send("No two wheeler spots available");
    }

    if (
      req.body.vehicleType.toLowerCase() == "fourwheeler" &&
      lot.availableSpots <= 0
    ) {
      return res.status(400).send("No four wheeler spots available");
    }
    if (
      req.body.vehicleType.toLowerCase() != "twowheeler" &&
      req.body.vehicleType.toLowerCase() != "fourwheeler"
    ) {
      return res.status(400).send("Invalid vehicle type");
    }

    function calculateTimeDifference(x, y) {
      const checkInDate = new Date(x);
      const checkOutDate = new Date(y);

      const differenceInMilliseconds = Math.abs(
        checkOutDate.getTime() - checkInDate.getTime()
      );

      // Convert the difference from milliseconds to hours
      const differenceInHours = differenceInMilliseconds / 1000 / 60 / 60;

      const roundedDifferenceInHours = Math.ceil(differenceInHours);

      return roundedDifferenceInHours;
    }

    function validatediff(x, y) {
      const checkInDate = new Date(x);
      const checkOutDate = new Date(y);

      const differenceInMilliseconds = Math.abs(
        checkOutDate.getTime() - checkInDate.getTime()
      );
      const diffInMinutes = differenceInMilliseconds / 1000 / 60;

      const valid = diffInMinutes <= 30 ? true : false;
      return valid;
    }

    // TODO: change parking rate according to veuhicle type

    const timeDifference = calculateTimeDifference(
      req.body.checkIn,
      req.body.checkOut
    );

    const bookingCheckindiff = validatediff(Date.now(), req.body.checkIn);

    if (!bookingCheckindiff) {
      return res
        .status(400)
        .send("CheckIn time should be within 30 minutes from now");
    }

    const amountPaid = timeDifference * req.body.parkingRate;

    const booking = {
      driver: req.user.id,
      parkedAt: lot.id,
      vehicleNumber: req.body.vehicleNumber,
      vehicleType: req.body.vehicleType,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      isParked: false,
      hasPayed: true,

      // TODO: update parking rate to be taken from the lot // dynamic pricing
      parkingRate: req.body.parkingRate,
      moneyPaid: amountPaid,
    };

    if (req.body.vehicleType.toLowerCase() == "twowheeler") {
      // update availableSpotsTwoWheeler in database

      const updatedLot = await Lots.findByIdAndUpdate(req.body.lotId, {
        availableSpotsTwoWheeler: lot.availableSpotsTwoWheeler - 1,
      });
    } else {
      // update availableSpots in database
      const updatedLot = await Lots.findByIdAndUpdate(req.body.lotId, {
        availableSpots: lot.availableSpots - 1,
      });
    }

    const newBooking = new Booking(booking);
    await newBooking.save();
    res.json(newBooking);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE-2 :: Checking a user into the parking by car number by manager :: PUT - "/api/booking/checkin/:id" - REQUIRES LOGIN

// Route-3 :: Checking a user out of the parking by car number by manager :: PUT - "/api/booking/checkout/:id" - REQUIRES LOGIN

// Route-4 :: Getting all bookings of a user :: GET - "/api/booking/getallbookings" - REQUIRES LOGIN
router.get("/getallbookings", fetchuser, async (req, res) => {
  try {
    const bookings = await Booking.find({ driver: req.user.id });
    res.json(bookings);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route-5 :: Getting current booking of a user :: GET - "/api/booking/currentbooking" - REQUIRES LOGIN
router.get("/currentbooking", fetchuser, async (req, res) => {
  try {
    console.log(req.user);
    const booking = await Booking.find({
      driver: req.user.id,
      isCurrent: true,
    });

    if (!booking) return res.status(404).send("No current booking found");
    res.json(booking);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE-6 :: MANAGER CHECKING VEHICLE ENTRY - GET - "/api/booking/checkentry/:vehicleNumber" - REQUIRES LOGIN
router.get("/checkentry/:vehicleNumber", fetchuser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(user);
    if (!user || user.role !== "Manager") {
      return res.status(403).json({ error: "Access denied" });
    }

    const vehicleNumber = req.params.vehicleNumber;
    const booking = await Booking.findOne({ vehicleNumber });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const lot = await Lots.findById(booking.parkedAt);
    if (!lot) {
      return res.status(404).json({ error: "Parking lot not found" });
    }

    let verifyManager = false;

    lot.managers.map((manager) => {
      if (manager.toString() === req.user.id) {
        verifyManager = true;
      }
    });

    if (!verifyManager) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(booking);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE-7 :: MANAGER CHECKING VEHICLE EXIT - DELETE - "/api/booking/exit/:id" - REQUIRES LOGIN
router.delete("/exit/:id", fetchuser, async (req, res) => {
  try {
    // Fetch the user from the token
    const user = await User.findById(req.user.id);

    // Check if the user is a manager
    if (!user || user.role !== "Manager") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get booking ID, parking lot ID, and vehicle type from the request body
    const bookingId = req.params.id;
    const { parkingLotId, vehicleType } = req.body;

    // Find and delete the booking
    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Find the parking lot
    const lot = await Lots.findById(parkingLotId);
    if (!lot) {
      return res.status(404).json({ error: "Parking lot not found" });
    }

    let verifyManager = false;

    lot.managers.map((manager) => {
      if (manager.toString() === req.user.id) {
        verifyManager = true;
      }
    });

    if (!verifyManager) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Update the available spots count based on the vehicle type
    if (vehicleType.toLowerCase() === "twowheeler") {
      lot.availableSpotsTwoWheeler += 1;
    } else if (vehicleType.toLowerCase() === "fourwheeler") {
      lot.availableSpots += 1;
    } else {
      return res.status(400).json({ error: "Invalid vehicle type" });
    }

    // Save the updated lot
    await lot.save();

    res.json({ message: "Allow user exit" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
