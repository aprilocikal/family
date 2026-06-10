/* ============================================================
   🔥 Streak — Days Since June 1, 2024
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from 'react';
import './Streak.css';
import { Heart, Flame, Sparkles, Trophy, Award, Flower } from 'lucide-react';

const START_DATE = new Date(2026, 4, 30); // May 30, 2026 (Month is 0-indexed, 4 = May)

const MILESTONES = [
  { icon: Heart, color: '#ff70a6', days: 100, label: '100 days' },
  { icon: Sparkles, color: '#ffd700', days: 365, label: '365 days' },
  { icon: Award, color: '#f57eb6', days: 500, label: '500 days' },
  { icon: Trophy, color: '#ffd700', days: 700, label: '700 days' },
];

export default function Streak() {
  const [displayCount, setDisplayCount] = useState(0);
  const hasAnimatedRef = useRef(false);
  const [dots, setDots] = useState('');
  const sectionRef = useRef(null);
  const animFrameRef = useRef(null);

  // Calculate actual days
  const now = new Date();
  const diffMs = now - START_DATE;
  const actualDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  // Debug logger
  useEffect(() => {
    console.log('Streak Debug Info:', {
      now: now.toString(),
      startDate: START_DATE.toString(),
      diffMs,
      actualDays
    });
  }, [actualDays, diffMs, now]);

  // Animate counting up
  const animateCount = useCallback(() => {
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * actualDays);
      setDisplayCount(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, [actualDays]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Intersection Observer for scroll reveal + trigger count
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.reveal').forEach((r) => r.classList.add('visible'));
          if (!hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            animateCount();
          }
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [animateCount]);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="streak" className="streak" ref={sectionRef}>
      {/* Floating Hearts */}
      <div className="streak-floating-hearts">
        <span className="streak-float-heart" style={{ color: '#ff4b82' }}><Heart size={20} fill="currentColor" /></span>
        <span className="streak-float-heart" style={{ color: '#ffb3c6' }}><Flower size={18} /></span>
        <span className="streak-float-heart" style={{ color: '#ffd1e6' }}><Heart size={16} fill="currentColor" /></span>
        <span className="streak-float-heart" style={{ color: '#ffd700' }}><Sparkles size={14} /></span>
        <span className="streak-float-heart" style={{ color: '#ff70a6' }}><Heart size={22} fill="currentColor" /></span>
        <span className="streak-float-heart" style={{ color: '#d8b4fe' }}><Sparkles size={18} /></span>
      </div>

      <div className="section-inner">
        <p className="section-eyebrow reveal">every day with you is special</p>
        <h2 className="section-title reveal reveal-delay-1">
          Our Journey <em>Together</em>
        </h2>

        <div className="streak-card glass reveal reveal-delay-2">
          {/* Fire Row */}
          <div className="streak-fires" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <span className="streak-fire-emoji" style={{ color: '#ff9f1c', display: 'inline-flex' }}><Flame size={28} fill="currentColor" /></span>
            <span className="streak-fire-emoji" style={{ color: '#ff4b82', display: 'inline-flex' }}><Flame size={28} fill="currentColor" /></span>
            <span className="streak-fire-emoji" style={{ color: '#ff9f1c', display: 'inline-flex' }}><Flame size={28} fill="currentColor" /></span>
            <span className="streak-fire-emoji" style={{ color: '#ff4b82', display: 'inline-flex' }}><Flame size={28} fill="currentColor" /></span>
            <span className="streak-fire-emoji" style={{ color: '#ff9f1c', display: 'inline-flex' }}><Flame size={28} fill="currentColor" /></span>
          </div>

          {/* Giant Number */}
          <div className="streak-number-wrapper">
            <div className="streak-number">{displayCount}</div>
          </div>

          <p className="streak-label">days of being my special person</p>

          {/* Milestones */}
          <div className="streak-milestones">
            {MILESTONES.map((m) => {
              const MilestoneIcon = m.icon;
              return (
                <div
                  key={m.days}
                  className={`milestone-badge ${actualDays >= m.days ? 'earned' : 'unearned'}`}
                >
                  <span className="milestone-emoji" style={{ color: actualDays >= m.days ? m.color : 'rgba(255,255,255,0.25)', display: 'inline-flex' }}>
                    <MilestoneIcon size={20} fill={m.icon === Heart ? 'currentColor' : 'none'} />
                  </span>
                  <span className="milestone-label">{m.label}</span>
                </div>
              );
            })}
          </div>

          {/* Counting text */}
          <p className="streak-counting">
            and counting<span className="streak-dots">{dots}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
