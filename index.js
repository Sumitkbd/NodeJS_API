const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db');
const User = require('./userModel');
//const jwt = require("jsonwebtoken");
//const secretKey = "secretKey"; 
const app = express();
const authRoute = require('./auth-routes')
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
// Connect to MongoDB
connectDB();
// Routes
// GET API - All data
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST API
app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT API - Update data
app.put('/api/user/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE API
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

//SEARCH API
app.get('/api/users/search/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const searchQuery = {

      $or: [
        { name: { $regex: new RegExp(key, 'i') } },
        { email: { $regex: new RegExp(key, 'i') } },
        { phone: { $regex: new RegExp(key, 'i') } },
        { address: { $regex: new RegExp(key, 'i') } }
      ]

    };
    const users = await User.find(searchQuery);
    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

app.use('/auth', authRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

