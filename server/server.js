// server/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const deckRoutes = require('./routes/deckRoutes');

require('dotenv').config(); // <-- 1. ADD THIS AT THE TOP

const app = express();
const PORT = 5001;

const connectionString = process.env.MONGODB_URL; 

if (!connectionString) {
  console.error("MongoDB connection string is missing. Check your .env file.");
  process.exit(1); // Exit the app if the connection string is missing
}

mongoose.connect(connectionString)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => console.error("MongoDB connection error:", err));

// === Middleware ===
app.use(cors());
app.use(express.json());

app.use('/api/decks', deckRoutes);

// === Start Server ===
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});