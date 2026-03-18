const mongoose = require('mongoose');

const receiverSchema = new mongoose.Schema({
  name: String,
  location: String, // City or pin code
  type: String      // 'NGO' or 'Individual'
});

module.exports = mongoose.model('Receiver', receiverSchema);
