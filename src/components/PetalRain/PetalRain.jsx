/* ============================================================
   🌸 PetalRain — Canvas Falling Petals
   ============================================================ */
import { useRef, useEffect, useCallback } from 'react';
import './PetalRain.css';

const PETAL_COUNT = 18;

const PETAL_COLORS = [
  { r: 94, g: 184, b: 245 }, // sky blue
  { r: 184, g: 222, b: 255 }, // light blue
  { r: 140, g: 200, b: 255 }, // soft ice blue
  { r: 58, g: 142, b: 212 }, // azure blue
];

function createPetal(canvasWidth, canvasHeight, randomY = false) {
  const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
  return {
    x: Math.random() * canvasWidth,
    y: randomY ? Math.random() * canvasHeight : -10 - Math.random() * 40,
    size: 3 + Math.random() * 5,
    speedY: 0.3 + Math.random() * 0.5,
    swayAmplitude: 20 + Math.random() * 30,
    swaySpeed: 0.005 + Math.random() * 0.01,
    swayOffset: Math.random() * Math.PI * 2,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: 0.01 + Math.random() * 0.02,
    opacity: 0.3 + Math.random() * 0.3,
    color,
    originX: Math.random() * canvasWidth,
    aspectRatio: 0.5 + Math.random() * 0.3, // elongation
  };
}

export default function PetalRain({ isActive = true }) {
  const canvasRef = useRef(null);
  const petalsRef = useRef([]);
  const rafRef = useRef(null);
  const timeRef = useRef(0);

  /* ── Resize handler ── */
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  /* ── Initialize petals ── */
  useEffect(() => {
    handleResize();
    const canvas = canvasRef.current;
    if (!canvas) return;

    petalsRef.current = Array.from({ length: PETAL_COUNT }, () =>
      createPetal(canvas.width, canvas.height, true)
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

      petalsRef.current.forEach((petal) => {
        // Update position
        petal.y += petal.speedY;
        petal.x =
          petal.originX +
          Math.sin(timeRef.current * petal.swaySpeed + petal.swayOffset) *
            petal.swayAmplitude;
        petal.rotation += petal.rotationSpeed;

        // Reset when below viewport
        if (petal.y > canvas.height + 20) {
          Object.assign(petal, createPetal(canvas.width, canvas.height, false));
        }

        // Draw petal (rotated ellipse)
        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate(petal.rotation);
        ctx.globalAlpha = petal.opacity;

        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          petal.size,
          petal.size * petal.aspectRatio,
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(${petal.color.r}, ${petal.color.g}, ${petal.color.b}, ${petal.opacity})`;
        ctx.fill();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive]);

  return (
    <div className="petal-rain">
      <canvas ref={canvasRef} className="petal-rain__canvas" />
    </div>
  );
}
