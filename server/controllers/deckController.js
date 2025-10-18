// controllers/deckController.js

// We need to import the model to interact with the database
const Deck = require('../models/deckModel');

// 1. Get all decks
exports.getAllDecks = async (req, res) => {
  try {
    const decks = await Deck.find();
    res.json(decks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching decks", error: err });
  }
};
// throw
// 2. Create a new deck
exports.createDeck = async (req, res) => {
  try {
    const newDeck = new Deck({ title: req.body.title, cards: [] });
    const savedDeck = await newDeck.save();
    res.json(savedDeck);
  } catch (err) {
    res.status(500).json({ message: "Error creating deck", error: err });
  }
};

// 3. Delete a deck
exports.deleteDeck = async (req, res) => {
  try {
    const { deckId } = req.params;
    const deletedDeck = await Deck.findByIdAndDelete(deckId);
    res.json(deletedDeck);
  } catch (err) {
    res.status(500).json({ message: "Error deleting deck", error: err });
  }
};

// 4. Create a card for a deck
exports.createCardForDeck = async (req, res) => {
  try {
    const { deckId } = req.params;
    const deck = await Deck.findById(deckId);
    if (!deck) return res.status(404).json({ message: "Deck not found" });
    const { front, back } = req.body;
    deck.cards.push({ front, back });
    const updatedDeck = await deck.save();
    res.json(updatedDeck);
  } catch (err) {
    res.status(500).json({ message: "Error adding card", error: err });
  }
};

// 5. Delete a card from a deck
exports.deleteCardFromDeck = async (req, res) => {
  try {
    const { deckId, cardId } = req.params;
    const updatedDeck = await Deck.findByIdAndUpdate(
      deckId,
      { $pull: { cards: { _id: cardId } } },
      { new: true }
    );
    res.json(updatedDeck);
  } catch (err) {
    res.status(500).json({ message: "Error deleting card", error: err });
  }
};