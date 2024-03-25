const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parkedAt: { type: mongoose.Schema.Types.ObjectId, ref: 'Lot', required: true },
    vehicleNumber: { type: String, required: true },
    vehicleType: { type: String, required: true, default: 'fourWheeler'},
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: false },
    amount: { type: Number, required: false },
    isParked: { type: Boolean, default: true, required: false },
    hasPayed: { type: Boolean, default: false, required: true },
    
});