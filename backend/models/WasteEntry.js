// models/WasteEntry.js
const mongoose = require('mongoose');

const wasteEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  foodName: { type: String, required: true },
  quantityWastedKg: { type: Number, required: true },
  produced: { type: Number },
  persons: { type: Number },
  mealType: { type: String },
  occasion: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WasteEntry', wasteEntrySchema);
