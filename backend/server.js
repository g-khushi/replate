require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Models
const Reminder = require('./models/reminder.model');
const User = require('./models/User');
const WasteEntry = require('./models/WasteEntry');
const Receiver = require('./models/receiver');
const Donation = require('./models/Donation');

// Initialize App
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    const dbName = mongoose.connection.name;
    console.log(`Connected to MongoDB database: ${dbName}`);
  })
  .catch((err) => console.error(' MongoDB connection error:', err));

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to RePlate backend API!');
});


// =======================
// DONATION SECTION
// =======================


// Save Donation

// Get All Donations
app.get('/api/donations', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});


// =======================
// REQUEST SECTION
// =======================

//  REQUEST MODEL
const requestSchema = new mongoose.Schema({
  name: String,
  contact: String,
  foodNeeded: String,
  location: String,
  createdAt: { type: Date, default: Date.now }
});
const Request = mongoose.model('Request', requestSchema);

//  POST /api/request
app.post('/api/request', async (req, res) => {
  try {
    const { name, contact, foodNeeded, location } = req.body;

    // Save the request
    const request = new Request({ name, contact, foodNeeded, location });
    await request.save();

    // Extract keywords
    const keywords = foodNeeded
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(word => word.length > 1);

    if (keywords.length === 0) {
      return res.status(201).json({ message: 'Request saved, but no valid food keywords provided.' });
    }

    // Match donation by location and keyword
    const donations = await Donation.find({ location });

    const matchedDonation = donations.find(donation => {
      const food = donation.food.toLowerCase();
      return keywords.some(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(food);
      });
    });

    if (matchedDonation) {
      return res.status(201).json({
        message: 'Request saved',
        matchedDonation: {
          donor: matchedDonation.name,
          contact: matchedDonation.contact,
          food: matchedDonation.food,
          quantity: matchedDonation.quantity
        }
      });
    } else {
      return res.status(201).json({
        message: 'Request saved, but no matching donation found yet.'
      });
    }
  } catch (error) {
    console.error(' Request error:', error.message);
    res.status(400).json({ error: error.message });
  }
});







// ==============================
//  EXPIRY REMINDER SECTION
// ==============================
app.post('/api/reminders', async (req, res) => {
  const { food, expiryDate } = req.body;
  try {
    const reminder = new Reminder({ food, expiryDate });
    await reminder.save();
    res.json({ message: 'Reminder saved successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving reminder' });
  }
});

app.get('/api/reminders', async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reminders' });
  }
});

app.delete('/api/reminders/:id', async (req, res) => {
  try {
    console.log("Backend received DELETE for ID:", req.params.id);

    const deletedReminder = await Reminder.findByIdAndDelete(req.params.id);
    if (!deletedReminder) {
      return res.status(404).json({ message: 'Reminder not found.' });
    }

    res.json({ message: 'Reminder deleted successfully.' });
  } catch (err) {
    console.error(' Error deleting reminder:', err.message);
    res.status(500).json({ message: 'Failed to delete reminder.' });
  }
});

// ==============================
// ML PREDICTION ROUTE
// ==============================
app.post("/api/waste-analyze", async (req, res) => {
  try {
    const response = await fetch("http://localhost:5500/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const result = await response.json();
    res.json({ ...req.body, predictedQuantity: result.predictedQuantity });
  } catch (err) {
    console.error("ML prediction failed:", err);
    res.status(500).json({ error: "Prediction failed" });
  }
});

// ==============================
//  USER AUTH ROUTES
// ==============================
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ username, password });
    await user.save();
    res.json({ message: 'Signup successful!' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ message: 'Login successful', userId: user._id });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// ==============================
// WASTE ANALYSIS ROUTES
// ==============================
app.post('/api/waste-data', async (req, res) => {
  const {
    userId,
    foodName,
    quantityWastedKg,
    produced,
    persons,
    mealType,
    occasion
  } = req.body;

  console.log("Incoming Waste Data:", {
    userId,
    foodName,
    quantityWastedKg,
    produced,
    persons,
    mealType,
    occasion
  });

  try {
    const entry = new WasteEntry({
      userId,
      foodName,
      quantityWastedKg,
      produced,
      persons,
      mealType,
      occasion,
      date: new Date()
    });

    await entry.save();
    console.log(" Waste data saved successfully!");
    res.json({ message: 'Data saved successfully!' });
  } catch (err) {
    console.error(' Error saving data:', err);
    res.status(500).json({ message: 'Error saving data.' });
  }
});

app.get('/api/waste-data/:userId', async (req, res) => {
  const { userId } = req.params;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  try {
    const data = await WasteEntry.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: "$foodName",
          totalWaste: { $sum: "$quantityWastedKg" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(data);
  } catch (err) {
    console.error(' Error fetching chart data:', err);
    res.status(500).json({ message: 'Error fetching chart data.' });
  }
});

// ==============================
//  Start the Server
// ==============================
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 
