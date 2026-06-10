/* ============================================================
   🎮 GameSection — Play With Me
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from 'react';
import LoveQuiz from './LoveQuiz';
import MemoryMatch from './MemoryMatch';
import CatchHearts from './CatchHearts';
import './GameSection.css';

const GAMES = [
  {
    id: 'love-quiz',
    emoji: '💕',
    title: 'Love Quiz',
    desc: 'How well do you know me?',
    Component: LoveQuiz,
  },
  {
    id: 'memory-match',
    emoji: '🃏',
    title: 'Memory Match',
    desc: 'Find the matching pairs',
    Component: MemoryMatch,
  },
  {
    id: 'catch-hearts',
    emoji: '💗',
    title: 'Catch Hearts',
    desc: 'Catch falling hearts!',
    Component: CatchHearts,
  },
];

export default function GameSection() {
  const [activeGame, setActiveGame] = useState(null);
  const sectionRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!activeGame) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setActiveGame(null);
    };
    window.addEventListener('keydown', handleKey);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [activeGame]);

  // Scroll-reveal observer
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.reveal').forEach((r) => r.classList.add('visible'));
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleClose = useCallback(() => setActiveGame(null), []);

  const ActiveComponent = activeGame
    ? GAMES.find((g) => g.id === activeGame)?.Component
    : null;

  return (
    <section id="games" className="games" ref={sectionRef}>
      <div className="section-inner">
        <p className="section-eyebrow reveal">lets have some fun</p>
        <h2 className="section-title reveal reveal-delay-1">
          Play <em>With Me</em>
        </h2>

        <div className="games-grid">
          {GAMES.map((game, i) => (
            <div
              key={game.id}
              className={`game-card glass reveal reveal-delay-${i + 2}`}
            >
              <span className="game-card-emoji">{game.emoji}</span>
              <h3 className="game-card-title">{game.title}</h3>
              <p className="game-card-desc">{game.desc}</p>
              <button
                className="btn-rose"
                onClick={() => setActiveGame(game.id)}
              >
                Play Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeGame && ActiveComponent && (
        <div
          className="game-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="game-modal-content glass">
            <button className="game-modal-close" onClick={handleClose}>
              ✕
            </button>
            <ActiveComponent onClose={handleClose} />
          </div>
        </div>
      )}
    </section>
  );
}
