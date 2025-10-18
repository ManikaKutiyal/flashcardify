// models/deckModel.js

const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  front: String,
  back: String,
});

const deckSchema = new mongoose.Schema({
  title: String,
  cards: [cardSchema],
});

const Deck = mongoose.model('Deck', deckSchema);

// Export the model so we can use it elsewhere
module.exports = Deck;