const mongoose = require('mongoose');

// MongoDB Atlas URI (same DB as backend)
const uri = 'mongodb+srv://dbuser:pass123pass@cluster0.gpitw5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
  .then(async () => {
    console.log(' Connected to MongoDB Atlas');

    //  Force the collection name to 'receivers' to match backend
    const receiverSchema = new mongoose.Schema({
      name: String,
      location: String,
      type: String
    }, {
      collection: 'receivers'
    });

    const Receiver = mongoose.model('Receiver', receiverSchema);

    const realNGOs = [
      { name: "Robin Hood Army", location: "Delhi", type: "NGO" },
      { name: "Feeding India by Zomato", location: "Noida", type: "NGO" },
      { name: "Akshaya Patra Foundation", location: "Bangalore", type: "NGO" },
      { name: "Roti Bank", location: "Mumbai", type: "NGO" },
      { name: "Sneh Foundation", location: "Pune", type: "NGO" },
      { name: "Uday Foundation", location: "Delhi", type: "NGO" },
      { name: "The Earth Saviours Foundation", location: "Gurgaon", type: "NGO" },
      { name: "Goonj", location: "Delhi", type: "NGO" },
      { name: "Annakshetra Foundation", location: "Jaipur", type: "NGO" },
      { name: "Daan Patra", location: "Indore", type: "NGO" },
      { name: "Roti Ghar", location: "Bangalore", type: "NGO" }
    ];

    await Receiver.insertMany(realNGOs);
    console.log(' All receivers added successfully!');

    await mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error inserting receivers:', err);
  });
