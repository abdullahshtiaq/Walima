const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config(); 


const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000, 
  socketTimeoutMS: 45000, 
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); 
  });


const formDataSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  attending: String,
  guests: Number
}, { timestamps: true });

const FormData = mongoose.model('FormData', formDataSchema);


const upload = multer();

app.use(express.static('public'));


app.post('/api/submit', upload.none(), async (req, res) => {
  try {
    console.log('Form Data received:', req.body); 
    const formData = new FormData(req.body);
    await formData.save();
    console.log('Form Data saved:', formData);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error saving form data:', error); 
    res.status(500).send({ error: 'Error saving form data', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
