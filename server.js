const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Patient = require('./models/patients'); // Change import to patient.js

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/patientsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Get all patients
app.get('/', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.render('index', { patients });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Add patient form
app.get('/add', (req, res) => {
  res.render('form');
});

// Add a new patient
app.post('/add', async (req, res) => {
  const { name, age, condition } = req.body;
  const patient = new Patient({ name, age, condition });
  try {
    await patient.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
