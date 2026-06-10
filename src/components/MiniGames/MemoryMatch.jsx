/* ============================================================
   🃏 MemoryMatch — Find the Matching Pairs
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from 'react';
import './MemoryMatch.css';

const EMOJIS = ['🌹', '💕', '🌸', '💖', '🌺', '✨'];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createDeck() {
  const pairs = EMOJIS.flatMap((emoji, i) => [
    { id: i * 2, emoji, pairId: i },
    { id: i * 2 + 1, emoji, pairId: i },
  ]);
  return shuffleArray(pairs);
}

export default function MemoryMatch({ onClose }) {
  const [cards, setCards] = useState(() => createDeck());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const timerRef = useRef(null);

  // Start timer
  useEffect(() => {
    if (gameWon) return;
    timerRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameWon]);

  // Check for match when 2 cards are flipped
  useEffect(() => {
    if (flipped.length !== 2) return;

    setIsChecking(true);
    setMoves((m) => m + 1);

    const [first, second] = flipped;
    const card1 = cards.find((c) => c.id === first);
    const card2 = cards.find((c) => c.id === second);

    if (card1.pairId === card2.pairId) {
      // Match found
      const newMatched = [...matched, card1.pairId];
      setMatched(newMatched);
      setFlipped([]);
      setIsChecking(false);

      // Check win
      if (newMatched.length === EMOJIS.length) {
        setGameWon(true);
        clearInterval(timerRef.current);
      }
    } else {
      // No match — flip back after 1s
      setTimeout(() => {
        setFlipped([]);
        setIsChecking(false);
      }, 1000);
    }
  }, [flipped, cards, matched]);

  const handleCardClick = useCallback(
    (cardId) => {
      if (isChecking) return;
      if (flipped.includes(cardId)) return;
      const card = cards.find((c) => c.id === cardId);
      if (matched.includes(card.pairId)) return;
      if (flipped.length >= 2) return;

      setFlipped((prev) => [...prev, cardId]);
    },
    [isChecking, flipped, matched, cards]
  );

  const restart = () => {
    setCards(createDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimer(0);
    setGameWon(false);
    setIsChecking(false);
  };

  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (gameWon) {
    return (
      <div className="memory-match">
        <h3 className="memory-title">Memory Match 🃏</h3>
        <div className="memory-victory">
          <span className="memory-victory-emoji">💕</span>
          <h4 className="memory-victory-title">You found all the love!</h4>
          <p className="memory-victory-stats">
            Time: <strong>{formatTime(timer)}</strong>
          </p>
          <p className="memory-victory-stats">
            Moves: <strong>{moves}</strong>
          </p>
          <p className="memory-victory-msg">
            Every match is like finding another reason to love you 💕
          </p>
          <button className="btn-rose" onClick={restart}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="memory-match">
      <h3 className="memory-title">Memory Match 🃏</h3>

      <div className="memory-stats">
        <div className="memory-stat">
          ⏱ <span>{formatTime(timer)}</span>
        </div>
        <div className="memory-stat">
          🎯 <span>{moves}</span> moves
        </div>
      </div>

      <div className="memory-grid">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.includes(card.pairId);

          return (
            <div
              key={card.id}
              className={`memory-card${isFlipped ? ' flipped' : ''}${isMatched ? ' matched' : ''}`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="memory-card-front">{card.emoji}</div>
              <div className="memory-card-back" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
