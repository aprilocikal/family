/* ============================================================
   🌹 Garden — A Garden of Wishes
   ============================================================ */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Garden.css';
import { Flower, Flower2, Heart, Sparkles } from 'lucide-react';

const FLOWERS = [
  { icon: Flower, color: '#ff4b82', name: 'Rose', message: 'May love always surround you' },
  { icon: Flower2, color: '#ffb3c6', name: 'Cherry Blossom', message: 'May life always be gentle with you' },
  { icon: Flower, color: '#d8b4fe', name: 'Lotus', message: 'May you bloom in all your glory' },
  { icon: Flower2, color: '#ff6b6b', name: 'Hibiscus', message: 'May passion light your every path' },
  { icon: Flower, color: '#fff0f5', name: 'Daisy', message: 'May joy follow you everywhere' },
  { icon: Flower2, color: '#d15e9c', name: 'Tulip', message: 'May all your dreams come true' },
  { icon: Flower, color: '#ffd700', name: 'Sunflower', message: 'May your days shine bright always' },
];

const PETAL_EMOJIS = ['🌸', '💗', '✨', '💕', '🩷', '🌺', '💮'];

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
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style="color: #ff4b82"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style="color: #ffd700"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="15" height="15" style="color: #ffb3c6"><circle cx="12" cy="12" r="3"/><path d="M12 2a3 3 0 0 0-3 3v2.2a4.9 4.9 0 0 0-2 .8L5.4 6.4a3 3 0 0 0-4.24 4.24l1.6 1.6a4.9 4.9 0 0 0-.8 2L1 14.2a3 3 0 0 0 3 3h2.2a4.9 4.9 0 0 0 2-.8l1.6 1.6a3 3 0 0 0 4.24-4.24l-1.6-1.6c.3-.6.5-1.3.8-2h2.2a3 3 0 0 0 3-3v-2.2a4.9 4.9 0 0 0-2-.8l1.6-1.6a3 3 0 0 0-4.24-4.24l-1.6 1.6a4.9 4.9 0 0 0-.8-2Z"/></svg>`
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
                <span className="garden-bloom" role="img" aria-label={flower.name} style={{ color: flower.color, display: 'inline-flex' }}>
                  <flower.icon size={36} />
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
            <div className="bouquet-ribbon" style={{ background: 'transparent', boxShadow: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={22} fill="currentColor" style={{ color: 'var(--rose-gold)' }} />
            </div>
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
