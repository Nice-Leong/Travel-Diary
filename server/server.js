const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // Parse JSON requests

// Connect DB
connectDB();

// Routes
app.use('/api/user', require('./routes/userRoutes'));

// Define the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
