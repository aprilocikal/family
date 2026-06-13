/* ============================================================
   🌹 Finale — Cinematic Closing Section
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from 'react';
import './Finale.css';

const FLOWERS = ['💙', '✨', '💐', '💙', '🏡'];

const CONFETTI_COLORS = [
  'var(--rose-gold)',
  'var(--blush)',
  'var(--gold-shimmer)',
  '#A0C8E8',
  '#D0E0F5',
  '#74A5D4',
  '#748AC8',
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
        <p className="finale__eyebrow">with all my love</p>

        <h2 className="finale__title section-title">
          Thank You, Papa & Bunda
          <em>You Are My Everything</em>
        </h2>

        <p className="finale__message">
          Papa & Bunda, kehadiran kalian di hidupku adalah anugerah terindah. Kalian adalah 
          tiang penyangga yang kokoh, pemberi teladan terbaik, dan pelindung yang tak pernah 
          lelah merawatku. Semua dedikasi, air mata, serta peluh yang kalian tumpahkan untuk 
          membesarkanku adalah utang budi yang tak akan pernah bisa kulunasi. Terima kasih karena 
          selalu percaya padaku, memelukku di kala sulit, dan menyirami hari-hariku dengan kasih 
          sayang tak bersyarat. Semoga kalian selalu diberikan kesehatan, kebahagiaan, dan kedamaian 
          di setiap langkah hidup kalian.
        </p>
      </div>

      {/* Pulsing heart */}
      <div className={`reveal reveal-delay-3 ${isVisible ? 'visible' : ''}`}>
        <span className="finale__heart">💙</span>
      </div>

      {/* Signature */}
      <p className={`finale__signature reveal reveal-delay-4 ${isVisible ? 'visible' : ''}`}>
        Dibuat dengan cinta dan rasa syukur yang tak terhingga 💙
      </p>

      {/* Footer */}
      <p className="finale__footer">
        💙 Dibuat dengan segenap cinta &amp; rasa terima kasih yang mendalam 💙
      </p>
    </section>
  );
}
