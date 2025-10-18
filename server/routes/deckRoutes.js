// routes/deckRoutes.js

const express = require('express');
const router = express.Router(); // Create a new router object
const deckController = require('../controllers/deckController');

// Define the routes and connect them to the controller functions
router.get('/', deckController.getAllDecks);
router.post('/', deckController.createDeck);
router.delete('/:deckId', deckController.deleteDeck);

// Routes for cards within a deck
router.post('/:deckId/cards', deckController.createCardForDeck);
router.delete('/:deckId/cards/:cardId', deckController.deleteCardFromDeck);

module.exports = router;