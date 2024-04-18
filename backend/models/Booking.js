const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parkedAt: { type: mongoose.Schema.Types.ObjectId, ref: 'Lot', required: true },
    vehicleNumber: { type: String, required: true },
    vehicleType: { type: String, required: true, default: 'fourWheeler'},
    BookingTime: { type: Date, default: Date.now },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: false },
    amount: { type: Number, required: false },
    isParked: { type: Boolean, default: true, required: false },
    hasPayed: { type: Boolean, default: false, required: true },
    parkingRate: { type: Number, required: true },
    moneyPaid: { type: Number, required: false },
});

module.exports = mongoose.model("Booking", bookingSchema);