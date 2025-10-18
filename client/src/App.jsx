// client/src/App.jsx

import React, { useState, useEffect } from 'react';

const styles = {
  container: { fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' },
  form: { marginBottom: '20px', display: 'flex' },
  input: { flexGrow: 1, padding: '8px', marginRight: '10px' },
  button: { padding: '8px 15px' },
  ul: { listStyle: 'none', padding: 0 },
  li: {
    backgroundColor: '#3d3939ff',
    padding: '15px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer'
  },
  card: { backgroundColor: '#524545ff', border: '1px solid #ddd', padding: '10px', marginBottom: '10px', position: 'relative' },
  deleteButton: { position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', cursor: 'pointer', color: 'red', fontSize: '1.2rem' },
  deleteDeckButton: { backgroundColor: '#ff4d4d', color: 'white', border: 'none', cursor: 'pointer', padding: '5px 10px' }
};

function App() {
  const [decks, setDecks] = useState([]);  //1. State for data
  const [selectedDeck, setSelectedDeck] = useState(null); //1. State for data

  const [view, setView] = useState('decks');  // State for UI control

  const [title, setTitle] = useState('');  // State for forms
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ front: '', back: '' });  //3. State for forms

  const [currentCardIndex, setCurrentCardIndex] = useState(0);  // State for Study Mode
  const [isFlipped, setIsFlipped] = useState(false);



  useEffect(() => {
    async function fetchDecks() {
      const response = await fetch('http://localhost:5001/api/decks');
      const data = await response.json();
      setDecks(data);
    }
    fetchDecks();
  }, []);

  useEffect(() => {
    if (selectedDeck) {
      setCards(selectedDeck.cards);
    }
  }, [selectedDeck]);
// --- Handlers for Cards ---
  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!selectedDeck || !newCard.front || !newCard.back) return;
    const response = await fetch(`http://localhost:5001/api/decks/${selectedDeck._id}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCard),
    });
    const updatedDeck = await response.json();
    setDecks(decks.map(deck => deck._id === updatedDeck._id ? updatedDeck : deck));
    setSelectedDeck(updatedDeck);
    setNewCard({ front: '', back: '' });
  };

  const handleDeleteCard = async (cardId) => {
    if (!selectedDeck) return;
    const response = await fetch(`http://localhost:5001/api/decks/${selectedDeck._id}/cards/${cardId}`, {
      method: 'DELETE',
    });
    const updatedDeck = await response.json();
    setDecks(decks.map(deck => deck._id === updatedDeck._id ? updatedDeck : deck));
    setSelectedDeck(updatedDeck);
  };
// --- Handlers for Decks ---
  const handleCreateDeck = async (e) => {
    e.preventDefault();
    if (!title) return;
    const response = await fetch('http://localhost:5001/api/decks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    const newDeck = await response.json();
    setDecks([...decks, newDeck]);
    setTitle('');
  };

  const handleDeleteDeck = async (e, deckId) => {
    e.stopPropagation(); // Prevents the li's onClick from firing
    await fetch(`http://localhost:5001/api/decks/${deckId}`, {
      method: 'DELETE',
    });
    setDecks(decks.filter(deck => deck._id !== deckId));
  };

  // --- Handlers for UI Navigation ---
  const handleSelectDeck = (deck) => {
    setSelectedDeck(deck);
    setView('cards');
  };
  const handleBackToDecks = () => {
    setSelectedDeck(null);
    setView('decks');
  };
  const handleStartStudy = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setView('study');
  };

  // --- Handlers for Study Mode ---
  const handleFlipCard = () => setIsFlipped(!isFlipped);
  const handleNextCard = () => {
    if (currentCardIndex < selectedDeck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };
  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };


  return (
    <div style={styles.container}>
      {/* VIEW 1: DECK LIST */}
      {view === 'decks' && (
        <div>
          <div style={styles.header}><h1>Flashcardify Decks</h1></div>
          <form onSubmit={handleCreateDeck} style={styles.form}>
            <input style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New deck title"/>
            <button type="submit" style={styles.button}>Create</button>
          </form>
          <ul style={styles.ul}>
            {decks.map((deck) => (
              <li key={deck._id} onClick={() => handleSelectDeck(deck)} style={styles.li}>
                {deck.title} ({deck.cards.length} cards)
                <button onClick={(e) => handleDeleteDeck(e, deck._id)} style={{...styles.button, ...styles.deleteDeckButton}}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* VIEW 2: CARD MANAGER */}
      {view === 'cards' && selectedDeck && (
        <div>
          <div style={styles.header}>
            <button onClick={handleBackToDecks} style={{...styles.button, ...styles.backButton}}>← Back</button>
            <h2>{selectedDeck.title}</h2>
            {selectedDeck.cards.length > 0 && <button onClick={handleStartStudy} style={{...styles.button, ...styles.studyButton}}>Study</button>}
          </div>
          <form onSubmit={handleCreateCard} style={styles.form}>
            <input style={styles.input} value={newCard.front} onChange={(e) => setNewCard({...newCard, front: e.target.value})} placeholder="Card Front (Question)"/>
            <input style={styles.input} value={newCard.back} onChange={(e) => setNewCard({...newCard, back: e.target.value})} placeholder="Card Back (Answer)"/>
            <button type="submit" style={styles.button}>Add Card</button>
          </form>
          <ul style={styles.ul}>
            {selectedDeck.cards.map((card) => (
              <li key={card._id} style={styles.card}>
                <p><strong>Front:</strong> {card.front}</p>
                <p><strong>Back:</strong> {card.back}</p>
                <button onClick={() => handleDeleteCard(card._id)} style={styles.deleteButton}>&times;</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* VIEW 3: STUDY MODE */}
      {view === 'study' && selectedDeck && (
        <div>
          <div style={styles.header}>
            <button onClick={() => setView('cards')} style={{...styles.button, ...styles.backButton}}>← Back to Deck</button>
            <h2>Studying: {selectedDeck.title}</h2>
          </div>
          <p>Card {currentCardIndex + 1} of {selectedDeck.cards.length}</p>
          <div onClick={handleFlipCard} style={{...styles.studyCard, ...(isFlipped ? styles.studyCardBack : {})}}>
            {isFlipped ? selectedDeck.cards[currentCardIndex].back : selectedDeck.cards[currentCardIndex].front}
          </div>
          <div style={styles.studyControls}>
            <button onClick={handlePrevCard} style={styles.button} disabled={currentCardIndex === 0}>Previous</button>
            <button onClick={handleFlipCard} style={{...styles.button, ...styles.studyButton}}>Flip</button>
            <button onClick={handleNextCard} style={styles.button} disabled={currentCardIndex === selectedDeck.cards.length - 1}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}


export default App;