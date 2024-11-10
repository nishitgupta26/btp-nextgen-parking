const mongoose = require("mongoose");

const lotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ["closed", "mixed", "open"], required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  geoCoordinates: { type: String, required: false },

  twoWheelerCapacity: { type: Number, required: true },
  fourWheelerCapacity: { type: Number, required: true },
  chargingPorts: { type: Number, required: true },

  securityGuard: { type: Boolean, default: false },
  surveillanceCamera: { type: Boolean, default: false },

  
  openingHours: { type: String, required: true },
  closingHours: { type: String, required: true },
  
  contactNumber: { type: String, required: false },
  email: { type: String, required: false },
  
  amenities: [{ type: String, required: false }],
  
  availableSpots: { type: Number, required: false }, // number of empty slots right now
  availableSpotsTwoWheeler: { type: Number, required: false }, // number of empty two wheeler slots right now
  
  isOpen: { type: Boolean, default: true, required: true }, // is the parking lot open right now?
  
  approved: { type: Boolean, default: false, required: false },

  // an array of managers who can manage this lot
  managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" , required: false}],


  parkingRate: { type: Number, required: false, default: 30 }, // base parking rate   
  dynamicPricingEnabled: { type: Boolean, default: true },  // Toggle for dynamic pricing
  currentRate: { type: Number, required: false, default: 30 },              // dynamically updated rate

  // Fields for dynamic pricing factors
  // crowdLevel: { type: String, enum: ['low', 'medium', 'high'], required: false },  // Crowdedness of the area 
  // occupancyPercentage: { type: Number, required: false },  // Percentage of lot filled

});



module.exports = mongoose.model("Lot", lotSchema);
