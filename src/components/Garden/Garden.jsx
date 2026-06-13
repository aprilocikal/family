/* ============================================================
   🌹 Garden — A Garden of Wishes
   ============================================================ */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Garden.css';
import { Sparkles } from 'lucide-react';

/* ── SVG Flowers with premium gradients ── */
function RoseSVG() {
  return (
    <svg viewBox="0 0 100 100" width="1em" height="1em" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="roseGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#EBF4FF" />
          <stop offset="40%" stopColor="#70B8FF" />
          <stop offset="85%" stopColor="#0076FF" />
          <stop offset="100%" stopColor="#003D80" />
        </radialGradient>
      </defs>
      {[0, 72, 144, 216, 288].map((angle) => (
        <path
          key={angle}
          d="M 50,50 C 30,10 70,10 50,50"
          fill="url(#roseGrad)"
          transform={`rotate(${angle} 50 50)`}
          stroke="#EBF4FF"
          strokeWidth="0.5"
          opacity="0.95"
        />
      ))}
      {[36, 108, 180, 252, 324].map((angle) => (
        <path
          key={angle}
          d="M 50,50 C 35,20 65,20 50,50"
          fill="url(#roseGrad)"
          transform={`rotate(${angle} 50 50) scale(0.8) translate(12.5 12.5)`}
          stroke="#EBF4FF"
          strokeWidth="0.5"
          opacity="0.9"
        />
      ))}
      <circle cx="50" cy="50" r="10" fill="url(#roseGrad)" stroke="#EBF4FF" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="5" fill="#EBF4FF" opacity="0.85" />
    </svg>
  );
}

function CherryBlossomSVG() {
  return (
    <svg viewBox="0 0 100 100" width="1em" height="1em" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="cherryGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#B8DEFF" />
          <stop offset="100%" stopColor="#5EB8F5" />
        </radialGradient>
      </defs>
      {[0, 72, 144, 216, 288].map((angle) => (
        <path
          key={angle}
          d="M 50,50 C 30,15 40,5 50,20 C 60,5 70,15 50,50"
          fill="url(#cherryGrad)"
          transform={`rotate(${angle} 50 50)`}
          stroke="#FFFFFF"
          strokeWidth="0.5"
        />
      ))}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <line
          key={angle}
          x1="50"
          y1="50"
          x2="50"
          y2="32"
          stroke="#4BA5FF"
          strokeWidth="1.2"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="7" fill="#4BA5FF" />
      <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
    </svg>
  );
}

function LotusSVG() {
  return (
    <svg viewBox="0 0 100 100" width="1em" height="1em" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="lotusGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#0056B3" />
          <stop offset="50%" stopColor="#5EB8F5" />
          <stop offset="100%" stopColor="#E8F4FF" />
        </linearGradient>
      </defs>
      <path d="M 50,75 C 20,75 10,55 50,30 C 90,55 80,75 50,75 Z" fill="url(#lotusGrad)" opacity="0.8" />
      {[
        { rot: -35, scale: 0.9 },
        { rot: 35, scale: 0.9 },
        { rot: -15, scale: 0.95 },
        { rot: 15, scale: 0.95 },
        { rot: 0, scale: 1 },
      ].map((p, i) => (
        <path
          key={i}
          d="M 50,70 C 30,50 40,20 50,10 C 60,20 70,50 50,70"
          fill="url(#lotusGrad)"
          transform={`rotate(${p.rot} 50 70) scale(${p.scale})`}
          stroke="#E8F4FF"
          strokeWidth="0.5"
        />
      ))}
      <circle cx="50" cy="62" r="6" fill="#4BA5FF" />
    </svg>
  );
}

function HibiscusSVG() {
  return (
    <svg viewBox="0 0 100 100" width="1em" height="1em" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="hibiscusGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0076FF" />
          <stop offset="70%" stopColor="#3A8ED4" />
          <stop offset="100%" stopColor="#1D5480" />
        </radialGradient>
      </defs>
      {[0, 72, 144, 216, 288].map((angle) => (
        <path
          key={angle}
          d="M 50,50 C 15,35 25,5 50,30 C 75,5 85,35 50,50"
          fill="url(#hibiscusGrad)"
          transform={`rotate(${angle} 50 50)`}
          stroke="#B8DEFF"
          strokeWidth="0.5"
        />
      ))}
      {[0, 72, 144, 216, 288].map((angle) => (
        <path
          key={`lines-${angle}`}
          d="M 50,45 Q 45,35 50,20 M 50,45 Q 55,35 50,20"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="0.8"
          fill="none"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <g transform="rotate(-30 50 50)">
        <line x1="50" y1="50" x2="50" y2="15" stroke="#4BA5FF" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="15" r="4" fill="#FFFFFF" />
        <circle cx="46" cy="18" r="2.5" fill="#4BA5FF" />
        <circle cx="54" cy="18" r="2.5" fill="#4BA5FF" />
        <circle cx="48" cy="13" r="2.5" fill="#4BA5FF" />
        <circle cx="52" cy="13" r="2.5" fill="#4BA5FF" />
      </g>
    </svg>
  );
}

function DaisySVG() {
  return (
    <svg viewBox="0 0 100 100" width="1em" height="1em" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="daisyPetalGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#B8DEFF" />
        </linearGradient>
        <radialGradient id="daisyCenter" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFF5CC" />
          <stop offset="70%" stopColor="#4BA5FF" />
          <stop offset="100%" stopColor="#0056B3" />
        </radialGradient>
      </defs>
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (360 / 16) * i;
        return (
          <ellipse
            key={i}
            cx="50"
            cy="24"
            rx="6"
            ry="24"
            fill="url(#daisyPetalGrad)"
            transform={`rotate(${angle} 50 50)`}
            stroke="#B8DEFF"
            strokeWidth="0.3"
          />
        );
      })}
      <circle cx="50" cy="50" r="14" fill="url(#daisyCenter)" stroke="#B8DEFF" strokeWidth="0.5" />
      <circle cx="48" cy="48" r="10" fill="url(#daisyCenter)" opacity="0.9" />
    </svg>
  );
}

function TulipSVG() {
  return (
    <svg viewBox="0 0 100 100" width="1em" height="1em" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="tulipGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#0076FF" />
          <stop offset="50%" stopColor="#4BA5FF" />
          <stop offset="100%" stopColor="#E8F4FF" />
        </linearGradient>
      </defs>
      <path d="M 50,75 C 50,85 50,90 50,90" stroke="#2a5d31" strokeWidth="4" />
      <path d="M 50,80 C 30,50 35,20 50,10 C 65,20 70,50 50,80 Z" fill="url(#tulipGrad)" opacity="0.8" />
      <path d="M 50,80 C 22,50 25,25 42,12 C 58,35 55,60 50,80 Z" fill="url(#tulipGrad)" stroke="#E8F4FF" strokeWidth="0.5" />
      <path d="M 50,80 C 78,50 75,25 58,12 C 42,35 45,60 50,80 Z" fill="url(#tulipGrad)" stroke="#E8F4FF" strokeWidth="0.5" />
    </svg>
  );
}

function SunflowerSVG() {
  return (
    <svg viewBox="0 0 100 100" width="1em" height="1em" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="sunflowerPetal" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#0076FF" />
          <stop offset="100%" stopColor="#B8DEFF" />
        </linearGradient>
        <radialGradient id="sunflowerCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0A2640" />
          <stop offset="80%" stopColor="#1E3B70" />
          <stop offset="100%" stopColor="#4BA5FF" />
        </radialGradient>
      </defs>
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (360 / 24) * i;
        return (
          <path
            key={`outer-${i}`}
            d="M 50,50 L 44,12 C 47,8 53,8 56,12 Z"
            fill="url(#sunflowerPetal)"
            transform={`rotate(${angle} 50 50)`}
            stroke="#E8F4FF"
            strokeWidth="0.3"
          />
        );
      })}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (360 / 24) * i + 7.5;
        return (
          <path
            key={`inner-${i}`}
            d="M 50,50 L 45,18 C 47,15 53,15 55,18 Z"
            fill="url(#sunflowerPetal)"
            transform={`rotate(${angle} 50 50) scale(0.9) translate(5.5 5.5)`}
            stroke="#E8F4FF"
            strokeWidth="0.3"
            opacity="0.9"
          />
        );
      })}
      <circle cx="50" cy="50" r="22" fill="url(#sunflowerCenter)" stroke="#E8F4FF" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="17" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="50" cy="50" r="12" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

const FLOWERS = [
  { Component: RoseSVG, name: 'Rose', message: 'May health & happiness always accompany you' },
  { Component: CherryBlossomSVG, name: 'Cherry Blossom', message: 'May peace fill your hearts every day' },
  { Component: LotusSVG, name: 'Lotus', message: 'May you be blessed with abundant blessings' },
  { Component: HibiscusSVG, name: 'Hibiscus', message: 'May your days be filled with warmth' },
  { Component: DaisySVG, name: 'Daisy', message: 'May joy and laughter fill our home always' },
  { Component: TulipSVG, name: 'Tulip', message: 'May God ease your every step' },
  { Component: SunflowerSVG, name: 'Sunflower', message: 'May your golden years be bright & beautiful' },
];

const PETAL_EMOJIS = ['🌸', '💙', '✨', '💙', '💙', '🌻', '💮'];

export default function Garden() {
  const [grown, setGrown] = useState(false);
  const sectionRef = useRef(null);

  /* ── Scroll-reveal: grow stems when section enters view ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reveals = section.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Trigger stem growth
            if (entry.target.classList.contains('garden-flowers')) {
              setTimeout(() => setGrown(true), 300);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    reveals.forEach((el) => observer.observe(el));
    return () => reveals.forEach((el) => observer.unobserve(el));
  }, []);

  /* ── Petal burst on flower click ── */
  const handleFlowerClick = useCallback((e, flower) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 8;
 
    const shapes = [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style="color: #4ba5ff"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style="color: #ffd700"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="15" height="15" style="color: #b3d9ff"><circle cx="12" cy="12" r="3"/><path d="M12 2a3 3 0 0 0-3 3v2.2a4.9 4.9 0 0 0-2 .8L5.4 6.4a3 3 0 0 0-4.24 4.24l1.6 1.6a4.9 4.9 0 0 0-.8 2L1 14.2a3 3 0 0 0 3 3h2.2a4.9 4.9 0 0 0 2-.8l1.6 1.6a3 3 0 0 0 4.24-4.24l-1.6-1.6c.3-.6.5-1.3.8-2h2.2a3 3 0 0 0 3-3v-2.2a4.9 4.9 0 0 0-2-.8l1.6-1.6a3 3 0 0 0-4.24-4.24l-1.6 1.6a4.9 4.9 0 0 0-.8-2Z"/></svg>`
    ];
 
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'garden-petal';
      petal.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];

      // Random directions
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const dist = 60 + Math.random() * 80;
      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * dist - 30; // bias upward
      const rotate = Math.random() * 360 - 180;

      petal.style.left = `${cx}px`;
      petal.style.top = `${cy}px`;
      petal.style.setProperty('--px', `${px}px`);
      petal.style.setProperty('--py', `${py}px`);
      petal.style.setProperty('--pr', `${rotate}deg`);

      document.body.appendChild(petal);

      // Cleanup after animation
      setTimeout(() => {
        petal.remove();
      }, 900);
    }
  }, []);

  return (
    <section id="garden" className="garden-section" ref={sectionRef}>
      <div className="section-inner">
        {/* Header */}
        <div className="garden-header reveal">
          <p className="section-eyebrow">a garden of wishes</p>
          <h2 className="section-title">
            Flowers Blooming <em>Just For You</em>
          </h2>
        </div>

        {/* Flowers */}
        <div className="garden-flowers reveal reveal-delay-2">
          {FLOWERS.map((flower, index) => {
            // Fan out angles and vertical offsets for a perfect bouquet dome
            const angles = [-36, -24, -12, 0, 12, 24, 36];
            const offsets = [-15, 0, 10, 15, 10, 0, -15];
            const angle = angles[index];
            const offset = offsets[index];

            return (
              <div
                key={index}
                className="garden-flower"
                onClick={(e) => handleFlowerClick(e, flower)}
                style={{
                  '--flower-angle': `${angle}deg`,
                  '--flower-offset': `${offset}px`,
                  '--flower-delay': `${index * 0.08}s`,
                }}
              >
                {/* Tooltip */}
                <div className="garden-tooltip">
                  <div className="garden-tooltip-name">{flower.name}</div>
                  <div className="garden-tooltip-message">"{flower.message}"</div>
                </div>

                {/* Bloom */}
                <span className="garden-bloom" role="img" aria-label={flower.name}>
                  <flower.Component />
                </span>

                {/* Stem */}
                <div
                  className={`garden-stem${grown ? ' grown' : ''}`}
                  style={{ transitionDelay: `${index * 0.08}s` }}
                />
              </div>
            );
          })}

          {/* Bouquet wrapper decoration */}
          <div className={`bouquet-wrapper${grown ? ' visible' : ''}`}>
            <div className="bouquet-paper" />
            <div className="bouquet-ribbon">💙</div>
          </div>
        </div>

        {/* Bottom Note */}
        <p className="garden-note reveal reveal-delay-4">
          hover each flower to find a special message hiding inside <Sparkles size={14} style={{ display: 'inline-block', verticalAlign: 'middle', color: 'var(--rose-gold)' }} />
        </p>
      </div>
    </section>
  );
}
