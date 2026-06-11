/* ============================================================
   🔥 Streak — Days Since June 1, 2024
   ============================================================ */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './Streak.css';
import { Heart, Flame, Sparkles, Trophy, Award, Flower, Share2 } from 'lucide-react';

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
  const [toast, setToast] = useState({ show: false, message: '' });

  // Calculate actual days
  const now = useMemo(() => new Date(), []);
  const diffMs = now - START_DATE;
  const actualDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  const showToast = useCallback((msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3500);
  }, []);

  const handleShareStory = useCallback(async () => {
    showToast('Generating Story image...');

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      // 1. Background (Dark Deep)
      ctx.fillStyle = '#0D020D';
      ctx.fillRect(0, 0, 1080, 1920);

      // 2. Mesh Glow Effects (Glowing Radial Orbs)
      // Top Right Pink Glow
      const glowTR = ctx.createRadialGradient(900, 300, 0, 900, 300, 800);
      glowTR.addColorStop(0, 'rgba(245, 126, 182, 0.25)');
      glowTR.addColorStop(1, 'rgba(13, 2, 13, 0)');
      ctx.fillStyle = glowTR;
      ctx.fillRect(0, 0, 1080, 1920);

      // Center Left Wine Glow
      const glowCL = ctx.createRadialGradient(100, 960, 0, 100, 960, 900);
      glowCL.addColorStop(0, 'rgba(128, 29, 84, 0.35)');
      glowCL.addColorStop(1, 'rgba(13, 2, 13, 0)');
      ctx.fillStyle = glowCL;
      ctx.fillRect(0, 0, 1080, 1920);

      // Bottom Right Rose Gold Glow
      const glowBR = ctx.createRadialGradient(980, 1600, 0, 980, 1600, 700);
      glowBR.addColorStop(0, 'rgba(245, 126, 182, 0.2)');
      glowBR.addColorStop(1, 'rgba(13, 2, 13, 0)');
      ctx.fillStyle = glowBR;
      ctx.fillRect(0, 0, 1080, 1920);

      // Bottom Left Gold Glow
      const glowBL = ctx.createRadialGradient(100, 1800, 0, 100, 1800, 600);
      glowBL.addColorStop(0, 'rgba(230, 194, 128, 0.15)');
      glowBL.addColorStop(1, 'rgba(13, 2, 13, 0)');
      ctx.fillStyle = glowBL;
      ctx.fillRect(0, 0, 1080, 1920);

      // 3. Constellation / Radar Grid
      ctx.strokeStyle = 'rgba(245, 126, 182, 0.03)';
      ctx.lineWidth = 2;
      for (let x = 120; x < 1080; x += 120) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1920);
        ctx.stroke();
      }
      for (let y = 120; y < 1920; y += 120) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1080, y);
        ctx.stroke();
      }

      // Draw faint stars at grid crossings
      ctx.fillStyle = 'rgba(255, 240, 245, 0.25)';
      for (let x = 120; x < 1080; x += 240) {
        for (let y = 120; y < 1920; y += 240) {
          if ((x + y) % 3 === 0) {
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 4. Background Floating Heart Outlines
      ctx.strokeStyle = 'rgba(245, 126, 182, 0.05)';
      ctx.lineWidth = 3;
      const drawHeartPath = (cx, cy, r) => {
        ctx.save();
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.05) {
          const x = cx + r * 16 * Math.sin(a) ** 3;
          const y = cy - r * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a));
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      };
      
      drawHeartPath(200, 400, 5);
      drawHeartPath(880, 1400, 8);
      drawHeartPath(150, 1500, 4);
      drawHeartPath(900, 500, 6);

      // 5. Central Glassmorphic Card
      const cardX = 90;
      const cardY = 340;
      const cardW = 900;
      const cardH = 1240;
      const radius = 50;

      // Glow Shadow behind card
      ctx.save();
      ctx.shadowColor = 'rgba(245, 126, 182, 0.25)';
      ctx.shadowBlur = 60;
      ctx.fillStyle = 'rgba(27, 6, 27, 0.75)';
      ctx.beginPath();
      ctx.moveTo(cardX + radius, cardY);
      ctx.lineTo(cardX + cardW - radius, cardY);
      ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + radius);
      ctx.lineTo(cardX + cardW, cardY + cardH - radius);
      ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - radius, cardY + cardH);
      ctx.lineTo(cardX + radius, cardY + cardH);
      ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - radius);
      ctx.lineTo(cardX, cardY + radius);
      ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Card border
      ctx.save();
      const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
      borderGrad.addColorStop(0, 'rgba(245, 126, 182, 0.45)');
      borderGrad.addColorStop(0.5, 'rgba(255, 240, 245, 0.1)');
      borderGrad.addColorStop(1, 'rgba(230, 194, 128, 0.45)');
      ctx.strokeStyle = borderGrad;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cardX + radius, cardY);
      ctx.lineTo(cardX + cardW - radius, cardY);
      ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + radius);
      ctx.lineTo(cardX + cardW, cardY + cardH - radius);
      ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - radius, cardY + cardH);
      ctx.lineTo(cardX + radius, cardY + cardH);
      ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - radius);
      ctx.lineTo(cardX, cardY + radius);
      ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      const centerX = 1080 / 2;

      // 6. Draw Content inside the Card
      // Eyebrow
      ctx.font = 'bold 26px sans-serif';
      ctx.fillStyle = 'rgba(255, 240, 245, 0.45)';
      ctx.textAlign = 'center';
      ctx.fillText('EVERY DAY WITH YOU IS SPECIAL', centerX, cardY + 120);

      // Title
      ctx.font = 'italic bold 70px Georgia, serif';
      const titleGrad = ctx.createLinearGradient(centerX - 300, 0, centerX + 300, 0);
      titleGrad.addColorStop(0, '#FFF0F5');
      titleGrad.addColorStop(0.5, '#FFD1E6');
      titleGrad.addColorStop(1, '#FFF0F5');
      ctx.fillStyle = titleGrad;
      ctx.fillText('Our Journey Together', centerX, cardY + 230);

      // Decorative divider with glowing heart
      const dividerY = cardY + 310;
      ctx.strokeStyle = 'rgba(245, 126, 182, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 220, dividerY);
      ctx.lineTo(centerX - 30, dividerY);
      ctx.moveTo(centerX + 30, dividerY);
      ctx.lineTo(centerX + 220, dividerY);
      ctx.stroke();

      // Mini heart in divider
      ctx.fillStyle = '#ff4b82';
      ctx.font = '28px Arial';
      ctx.fillText('💖', centerX, dividerY);

      // Flame row
      ctx.font = '72px sans-serif';
      ctx.fillText('🔥  ✨  🔥  ✨  🔥', centerX, cardY + 440);

      // Giant Streak number
      const numY = cardY + 740;
      const numGrad = ctx.createLinearGradient(0, numY - 160, 0, numY + 50);
      numGrad.addColorStop(0, '#FFF0F5');
      numGrad.addColorStop(0.35, '#ff70a6');
      numGrad.addColorStop(0.7, '#ff9f1c');
      numGrad.addColorStop(1, '#ff4b82');

      ctx.save();
      ctx.font = '900 240px sans-serif';
      ctx.shadowColor = 'rgba(255, 75, 130, 0.6)';
      ctx.shadowBlur = 60;
      ctx.fillStyle = numGrad;
      ctx.fillText(actualDays.toString(), centerX, numY);
      ctx.restore();

      // Label text
      ctx.font = 'italic 44px Georgia, serif';
      ctx.fillStyle = '#ffffd1';
      ctx.fillText('days of being my special person', centerX, cardY + 920);

      // Sub-label / status
      ctx.font = 'bold 30px sans-serif';
      ctx.fillStyle = 'rgba(255, 240, 245, 0.4)';
      ctx.fillText('AND COUNTING...', centerX, cardY + 1045);

      // Divider line in card bottom
      ctx.strokeStyle = 'rgba(245, 126, 182, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX - 350, cardY + 1140);
      ctx.lineTo(centerX + 350, cardY + 1140);
      ctx.stroke();

      // 7. Footer (Outside Card)
      ctx.font = 'italic 36px Georgia, serif';
      ctx.fillStyle = 'rgba(255, 240, 245, 0.4)';
      ctx.fillText('made with love 💖', centerX, 1740);

      // 8. Output to Blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          showToast('Failed to generate image');
          return;
        }

        const file = new File([blob], 'our-journey.png', { type: 'image/png' });
        const shareData = {
          files: [file],
          title: 'Our Journey Together',
          text: `We've been together for ${actualDays} days and counting! 💖`,
        };

        // Try to share natively
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
            showToast('Shared successfully! ✨');
            return;
          } catch (shareErr) {
            console.log('Native share failed, falling back to download:', shareErr);
          }
        }

        // Fallback: Download Image + Copy Caption to Clipboard
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'our-journey-streak.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        try {
          await navigator.clipboard.writeText(`We've been together for ${actualDays} days and counting! 💖`);
          showToast('Image downloaded & caption copied! Post to SG! 📸');
        } catch {
          showToast('Image downloaded! Share it on your Story! 📸');
        }
      }, 'image/png');

    } catch (err) {
      console.error('Error generating image:', err);
      showToast('Error sharing story');
    }
  }, [actualDays, showToast]);

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

          {/* Share Button */}
          <button className="btn-share-story" onClick={handleShareStory}>
            <Share2 size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }} />
            Share to Story
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`share-toast${toast.show ? ' show' : ''}`}>
        {toast.message}
      </div>
    </section>
  );
}
