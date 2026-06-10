/* ============================================================
   🌹 Finale — Cinematic Closing Section
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from 'react';
import './Finale.css';

const FLOWERS = ['🌸', '🌺', '🌹', '🌸', '🌷'];

const CONFETTI_COLORS = [
  'var(--rose-gold)',
  'var(--blush)',
  'var(--gold-shimmer)',
  '#E8A0B4',
  '#F5D0D8',
  '#D4A574',
  '#C8748A',
];

export default function Finale() {
  const sectionRef = useRef(null);
  const confettiRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const confettiFired = useRef(false);

  /* ── Confetti burst ── */
  const fireConfetti = useCallback(() => {
    if (confettiFired.current || !confettiRef.current) return;
    confettiFired.current = true;

    const container = confettiRef.current;
    const count = 50;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'finale__confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor =
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      piece.style.animationDelay = `${Math.random() * 1.5}s`;
      piece.style.animationDuration = `${2 + Math.random() * 2}s`;
      piece.style.width = `${5 + Math.random() * 8}px`;
      piece.style.height = `${5 + Math.random() * 8}px`;
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(piece);

      // Cleanup after animation
      setTimeout(() => {
        piece.remove();
      }, 5000);
    }
  }, []);

  /* ── Intersection Observer for reveal + confetti ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          fireConfetti();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [fireConfetti]);

  return (
    <section id="finale" className="finale" ref={sectionRef}>
      {/* Confetti container */}
      <div className="finale__confetti-container" ref={confettiRef} />

      {/* Floating flowers */}
      <div className={`finale__flowers reveal ${isVisible ? 'visible' : ''}`}>
        {FLOWERS.map((flower, i) => (
          <span key={i} className="finale__flower">
            {flower}
          </span>
        ))}
      </div>

      {/* Main content */}
      <div className={`finale__content reveal reveal-delay-1 ${isVisible ? 'visible' : ''}`}>
        <p className="finale__eyebrow">from me to you</p>

        <h2 className="finale__title section-title">
          You Are Loved
          <em>More Than You Know</em>
        </h2>

        <p className="finale__message">
          Naylin, some people come into your life and change the way you see
          everything, from the way light falls, the way music sounds, to the way your
          heart remembers how to feel. You are that person for me. You are the
          warmth I reach for on my coldest days, the calm in every storm I
          face, and the reason I believe that beautiful things are still
          possible in this world. You don't just mean the world to me, you are
          my world, my gravity, my reason for smiling at nothing at all. I hope
          you never forget how deeply, truly, endlessly you are loved.
        </p>
      </div>

      {/* Pulsing heart */}
      <div className={`reveal reveal-delay-3 ${isVisible ? 'visible' : ''}`}>
        <span className="finale__heart">💗</span>
      </div>

      {/* Signature */}
      <p className={`finale__signature reveal reveal-delay-4 ${isVisible ? 'visible' : ''}`}>
        Made with endless love, just for you 🌸
      </p>

      {/* Footer */}
      <p className="finale__footer">
        🌹 crafted with love &amp; rose petals 🌸
      </p>
    </section>
  );
}
