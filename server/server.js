// server/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import mongoose
const deckRoutes = require('./routes/deckRoutes'); // Import our new routes

const app = express();
const PORT = 5001;
// mongodb+srv://manika:flashcardify1@manika.jx5dxnl.mongodb.net/?retryWrites=true&w=majority&appName=Manika
// schema
// === Database Connection ===
const connectionString = "mongodb+srv://manika:flashcardify1@manika.jx5dxnl.mongodb.net/?retryWrites=true&w=majority&appName=Manika";
mongoose.connect(connectionString)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => console.error("MongoDB connection error:", err));
// === Middleware ===
app.use(cors());
app.use(express.json()); // To parse JSON bodies

app.use('/api/decks', deckRoutes);
// === Start Server ===
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});