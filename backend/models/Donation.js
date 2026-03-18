
// models/Donation.js
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  name: String,
  contact: String,
  food: String,
  location: String,
  quantity: Number,
  receiverName: {
    type: String,
    default: "Not assigned"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
