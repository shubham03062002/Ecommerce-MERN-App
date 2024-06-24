const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const app = express();
const secretKey = process.env.SECRET_KEY // Replace with your actual secret key

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_SERVERLINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// User schema and model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Contact schema and model
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', ContactSchema);

// Registration route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received registration request:', { email, password }); // Debugging line
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    const savedUser = await newUser.save();
    console.log('User saved:', savedUser); // Debugging line
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error); // Debugging line
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request:', { email, password }); // Debugging line
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found'); // Debugging line
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match'); // Debugging line
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    console.log('Login successful, token generated'); // Debugging line
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error); // Debugging line
    res.status(500).json({ error: 'Error during login' });
  }
});

// Contact route
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  console.log('Received contact request:', { name, email, message }); // Debugging line
  try {
    const newContact = new Contact({ name, email, message });
    const savedContact = await newContact.save();
    console.log('Contact saved:', savedContact); // Debugging line
    res.status(201).json({ message: 'Message received!' });
  } catch (error) {
    console.error('Error saving contact:', error); // Debugging line
    res.status(500).json({ error: 'Failed to save message' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
