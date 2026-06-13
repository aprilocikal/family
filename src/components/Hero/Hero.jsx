/* ============================================================
   🌹 Hero — Full-screen Hero Section
   ============================================================ */
import { useEffect, useRef, useCallback } from 'react';
import './Hero.css';

/* ── 6-petal rose SVG ── */
function RoseFlower() {
  return (
    <svg
      className="hero-flower"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="petalGrad" cx="30%" cy="30%">
          <stop offset="0%" stopColor="var(--blush)" stopOpacity="0.9" />
          <stop offset="60%" stopColor="var(--rose-gold)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--rose-dark, #3A5C8B)" stopOpacity="0.6" />
        </radialGradient>
        <radialGradient id="centerGrad" cx="40%" cy="40%">
          <stop offset="0%" stopColor="var(--gold-shimmer)" />
          <stop offset="100%" stopColor="var(--rose-gold)" />
        </radialGradient>
      </defs>
      {/* 6 petals rotated around center */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <ellipse
          key={angle}
          cx="60"
          cy="32"
          rx="18"
          ry="28"
          fill="url(#petalGrad)"
          transform={`rotate(${angle} 60 60)`}
          opacity="0.85"
        />
      ))}
      {/* Inner smaller petals */}
      {[30, 90, 150, 210, 270, 330].map((angle) => (
        <ellipse
          key={`inner-${angle}`}
          cx="60"
          cy="40"
          rx="11"
          ry="18"
          fill="url(#petalGrad)"
          transform={`rotate(${angle} 60 60)`}
          opacity="0.65"
        />
      ))}
      {/* Center */}
      <circle cx="60" cy="60" r="10" fill="url(#centerGrad)" opacity="0.9" />
      <circle cx="60" cy="60" r="5" fill="var(--gold-shimmer)" opacity="0.7" />
    </svg>
  );
}

export default function Hero() {
  const contentRef = useRef(null);
  const rafRef = useRef(null);

  /* ── Parallax scroll effect ── */
  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!contentRef.current) return;
      const scrollY = window.scrollY;
      const offset = scrollY * 0.25;
      contentRef.current.style.transform = `translateY(${offset}px)`;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  return (
    <section className="hero" id="hero">
      {/* Decorative side lines */}
      <span className="hero-deco-line hero-deco-line--left" />
      <span className="hero-deco-line hero-deco-line--right" />

      {/* Main content */}
      <div className="hero-content" ref={contentRef}>
        {/* Eyebrow */}
        <span className="section-eyebrow hero-eyebrow">thank you for everything</span>

        {/* Title */}
        <h1 className="hero-title">
          Beloved Parents,
          <span className="hero-name">Papa & Bunda</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          In a world full of people, you are my home and anchor
        </p>

        {/* Flower decoration */}
        <div className="hero-flower-wrap">
          <RoseFlower />
        </div>
      </div>

    </section>
  );
}
