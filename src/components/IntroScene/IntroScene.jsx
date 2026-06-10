/* ============================================================
   🌹 IntroScene — Cinematic Envelope Opening
   ============================================================ */
import { useState, useCallback, useEffect, useRef } from 'react';
import './IntroScene.css';
import { Sparkles } from 'lucide-react';

/* ── Petal colors ── */
const PETAL_COLORS = [
  'rgba(245, 126, 182, 0.9)',  /* rose-gold */
  'rgba(255, 194, 222, 0.85)', /* blush */
  'rgba(212, 165, 116, 0.8)',  /* gold-shimmer */
  'rgba(213, 84, 146, 0.9)',    /* rose-dark */
  'rgba(245, 126, 182, 0.7)',
  'rgba(255, 194, 222, 0.7)',
];

/* ── Generate random petals ── */
function generatePetals(count = 20) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i + (Math.random() * 30 - 15);
    const rad = (angle * Math.PI) / 180;
    const distance = 60 + Math.random() * 80;
    return {
      id: i,
      tx: Math.cos(rad) * distance,
      ty: Math.sin(rad) * distance - 20,
      rot: Math.random() * 360,
      color: PETAL_COLORS[i % PETAL_COLORS.length],
      delay: Math.random() * 0.2,
      scale: 0.7 + Math.random() * 0.6,
    };
  });
}

/* ── Generate sparkles ── */
function generateSparkles(count = 12) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i + Math.random() * 20;
    const rad = (angle * Math.PI) / 180;
    const distance = 40 + Math.random() * 60;
    return {
      id: i,
      tx: Math.cos(rad) * distance,
      ty: Math.sin(rad) * distance,
      delay: Math.random() * 0.15,
    };
  });
}

/* ── Ambient particles ── */
function generateAmbientParticles(count = 15) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    size: 2 + Math.random() * 3,
    duration: 4 + Math.random() * 4,
  }));
}

const petals = generatePetals(22);
const sparkles = generateSparkles(14);
const ambientParticles = generateAmbientParticles(18);

export default function IntroScene({ onComplete, onOpen }) {
  const [opened, setOpened] = useState(false);
  const [burstActive, setBurstActive] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const timeoutsRef = useRef([]);

  const handleClick = useCallback(() => {
    if (opened) return;
    setOpened(true);
    onOpen?.();

    /* Trigger petal burst after lid opens */
    const t1 = setTimeout(() => setBurstActive(true), 500);

    /* Fade out and call onComplete */
    const t2 = setTimeout(() => setFadingOut(true), 2200);
    const t3 = setTimeout(() => {
      onComplete?.();
    }, 3000);

    timeoutsRef.current.push(t1, t2, t3);
  }, [opened, onComplete]);

  /* Cleanup timeouts on unmount */
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      className={`intro-overlay${fadingOut ? ' fading-out' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Tap to open the envelope"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
    >
      {/* Ambient floating particles */}
      {ambientParticles.map((p) => (
        <span
          key={p.id}
          className="intro-ambient-particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Envelope */}
      <div className={`envelope-container${opened ? ' opened' : ''}`}>
        <div className="envelope">
          {/* Lid / flap */}
          <div className="envelope-lid" />

          {/* Wax seal */}
          <div className="wax-seal">
            <span className="wax-seal-letter">N</span>
          </div>

          {/* Letter that slides out */}
          <div className="letter-slide">
            <span className="letter-line" />
            <span className="letter-line" />
            <span className="letter-line" />
            <span className="letter-line" />
            <span className="letter-heart">♥</span>
          </div>
        </div>

        {/* Petal burst */}
        <div className="petal-burst-container">
          {petals.map((p) => (
            <div
              key={p.id}
              className={`burst-petal${burstActive ? ' animate' : ''}`}
              style={{
                '--tx': `${p.tx}px`,
                '--ty': `${p.ty}px`,
                '--rot': `${p.rot}deg`,
                background: `radial-gradient(ellipse at 30% 30%, ${p.color}, rgba(213,84,146,0.6))`,
                animationDelay: `${p.delay}s`,
                transform: `scale(${p.scale})`,
              }}
            />
          ))}
          {sparkles.map((s) => (
            <div
              key={`sparkle-${s.id}`}
              className={`burst-sparkle${burstActive ? ' animate' : ''}`}
              style={{
                '--tx': `${s.tx}px`,
                '--ty': `${s.ty}px`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Prompt text */}
      {!opened && (
        <p className="intro-prompt">
          tap to open a letter for someone special{' '}
          <Sparkles size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px', color: 'var(--rose-gold)' }} />
        </p>
      )}
    </div>
  );
}
