const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  food: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Reminder', reminderSchema);
