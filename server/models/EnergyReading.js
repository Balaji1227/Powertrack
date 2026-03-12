const mongoose = require('mongoose');

const energyReadingSchema = new mongoose.Schema({
  meterId: {
    type: String,
    required: true,
    index: true,
  },
  meterType: {
    type: String,
    enum: ['residential', 'commercial', 'industrial'],
    required: true,
  },
  region: {
    type: String,
    enum: ['North', 'South', 'East', 'West', 'Central'],
    required: true,
  },
  consumption: {
    type: Number,   // kWh
    required: true,
    min: 0,
  },
  peakDemand: {
    type: Number,   // kW
    required: true,
    min: 0,
  },
  cost: {
    type: Number,   // USD
    required: true,
    min: 0,
  },
  timestamp: {
    type: Date,
    required: true,
    index: true,
  },
  carbonEmission: {
    type: Number,   // kg CO2
    required: true,
    min: 0,
  },
}, { timestamps: true });

// Compound index for efficient date-range + region queries
energyReadingSchema.index({ timestamp: -1, region: 1, meterType: 1 });

module.exports = mongoose.model('EnergyReading', energyReadingSchema);
