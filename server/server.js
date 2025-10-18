// server/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import mongoose
const deckRoutes = require('./routes/deckRoutes'); // Import our new routes

const app = express();
const PORT = 5001;
// mongodb+srv://manika:krishnajiaurmai15@manika.jx5dxnl.mongodb.net/?retryWrites=true&w=majority&appName=Manika
// schema
// === Database Connection ===
const connectionString = "mongodb+srv://manika:krishnajiaurmai15@manika.jx5dxnl.mongodb.net/?retryWrites=true&w=majority&appName=Manika";
mongoose.connect(connectionString)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => console.error("MongoDB connection error:", err));

// server/server.js

app.use('/api/decks', deckRoutes);

// ... (keep your express, cors, mongoose, app, PORT, and connection code)

// === Middleware ===
// app.use(cors());
// app.use(express.json()); // To parse JSON bodies

// // === Mongoose Schema & Model ===
// // This is the blueprint for our individual cards
// const cardSchema = new mongoose.Schema({
//   front: String,
//   back: String,
// });

// // This is the blueprint for our decks, which will contain an array of cards
// const deckSchema = new mongoose.Schema({
//   title: String,
//   cards: [cardSchema], // An array of documents that follow the cardSchema
// });

// // The Model is the tool we use to interact with the 'decks' collection
// const Deck = mongoose.model('Deck', deckSchema);


// === API Routes ===

// // 1. CREATE a new Deck
// app.post('/api/decks', async (req, res) => {
//   try {
//     const newDeck = new Deck({
//       title: req.body.title,
//       cards: [] // Start with an empty array of cards
//     });
//     const savedDeck = await newDeck.save();
//     res.json(savedDeck);
//   } catch (err) {
//     res.status(500).json({ message: "Error creating deck", error: err });
//   }
// });

// // 2. GET all Decks
// app.get('/api/decks', async (req, res) => {
//   try {
//     const decks = await Deck.find(); // Find all deck documents
//     res.json(decks);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching decks", error: err });
//   }
// });

// // 3. DELETE a Deck
// app.delete('/api/decks/:deckId', async (req, res) => {
//     try {
//         const { deckId } = req.params;
//         const deletedDeck = await Deck.findByIdAndDelete(deckId);
//         res.json(deletedDeck);
//     } catch (err) {
//         res.status(500).json({ message: "Error deleting deck", error: err });
//     }
// });

// server/server.js

// ... your other routes are here ...

// // 4. ADD a Card to a specific Deck
// app.post('/api/decks/:deckId/cards', async (req, res) => {
//   try {
//     const { deckId } = req.params;
//     const deck = await Deck.findById(deckId); // Find the deck

//     if (!deck) {
//       return res.status(404).json({ message: "Deck not found" });
//     }

//     const { front, back } = req.body; // Get front and back text from the request

//     // Add the new card to the deck's 'cards' array
//     deck.cards.push({ front, back }); 

//     const updatedDeck = await deck.save(); // Save the change

//     res.json(updatedDeck);
//   } catch (err) {
//     res.status(500).json({ message: "Error adding card to deck", error: err });
//   }
// });

// server/server.js

// ... your other routes are here ...

// // 5. DELETE a Card from a specific Deck
// app.delete('/api/decks/:deckId/cards/:cardId', async (req, res) => {
//   try {
//     const { deckId, cardId } = req.params;

//     // Find the deck and use Mongoose's $pull operator to remove the card
//     const updatedDeck = await Deck.findByIdAndUpdate(
//       deckId,
//       { $pull: { cards: { _id: cardId } } },
//       { new: true } // This option returns the document after the update
//     );

//     if (!updatedDeck) {
//       return res.status(404).json({ message: "Deck not found" });
//     }

//     res.json(updatedDeck);
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting card", error: err });
//   }
// });


// ... app.listen is at the end ...

// ... (keep your app.listen code at the very end)
// ... your app.listen is here ...
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});