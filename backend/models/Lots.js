const mongoose = require('mongoose');

const lotSchema = new mongoose.Schema({

    name: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['closed', 'mixed', 'open'], required: true },
    owner : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    twoWheelerCapacity: { type: Number, required: true },
    fourWheelerCapacity: { type: Number, required: true },
    chargingPorts: { type: Number, required: true },

    // What more fields do we need?
    securityGuard: { type: Boolean, default: false },
    surveillanceCamera: { type: Boolean, default: false },

    parkingRate: { type: Number, required: false },

    openingHours: { type: String, required: true },
    closingHours: { type: String, required: true },

    contactNumber: { type: String, required: true },
    email: { type: String, required: false },

    amenities: [{ type: String }],

    availableSpots: { type: Number, required: true }, // number of empty slots right now
    isOpen: { type: Boolean, default: true }, // is the parking lot open right now?

    approved: { type: Boolean, default: false },

});

module.exports = mongoose.model("Lot", lotSchema);
