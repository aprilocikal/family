/* ============================================================
   ✨ ParticleCanvas — Gold Shimmer Particles
   ============================================================ */
import { useRef, useEffect, useCallback } from 'react';
import './ParticleCanvas.css';

const PARTICLE_COUNT = 35;

// Blue shimmer color (94, 184, 245)
const BLUE_SHIMMER = { r: 94, g: 184, b: 245 };

function createParticle(canvasWidth, canvasHeight, randomY = false) {
  return {
    x: Math.random() * canvasWidth,
    y: randomY ? Math.random() * canvasHeight : canvasHeight + 10 + Math.random() * 40,
    size: 1 + Math.random() * 2,
    speedY: -(0.15 + Math.random() * 0.35), // float upward
    driftX: (Math.random() - 0.5) * 0.3,
    opacity: 0.2 + Math.random() * 0.4,
    isStar: Math.random() > 0.6,
    twinkleSpeed: 0.01 + Math.random() * 0.02,
    twinkleOffset: Math.random() * Math.PI * 2,
  };
}

function drawStar(ctx, x, y, size) {
  const spikes = 4;
  const outerRadius = size;
  const innerRadius = size * 0.4;

  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

export default function ParticleCanvas({ isActive = true }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const timeRef = useRef(0);

  /* ── Resize handler ── */
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  /* ── Initialize particles ── */
  useEffect(() => {
    handleResize();
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(canvas.width, canvas.height, true)
    );

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  /* ── Animation loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const animate = () => {
      if (!isActive) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      timeRef.current += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        // Update position
        p.y += p.speedY;
        p.x += p.driftX;

        // Twinkle effect
        const twinkle =
          0.5 + 0.5 * Math.sin(timeRef.current * p.twinkleSpeed + p.twinkleOffset);
        const currentOpacity = p.opacity * (0.6 + 0.4 * twinkle);

        // Reset when above viewport
        if (p.y < -20) {
          Object.assign(p, createParticle(canvas.width, canvas.height, false));
        }
        // Also reset if drifted off screen
        if (p.x < -20 || p.x > canvas.width + 20) {
          Object.assign(p, createParticle(canvas.width, canvas.height, false));
        }

        // Draw particle
        ctx.globalAlpha = currentOpacity;
        ctx.fillStyle = `rgba(${BLUE_SHIMMER.r}, ${BLUE_SHIMMER.g}, ${BLUE_SHIMMER.b}, 1)`;

        if (p.isStar) {
          drawStar(ctx, p.x, p.y, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive]);

  return (
    <div className="particle-canvas">
      <canvas ref={canvasRef} className="particle-canvas__canvas" />
    </div>
  );
}
