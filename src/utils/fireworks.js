/* ============================================================
   🎆 fireworks.js — Premium Full-Screen Fireworks Canvas Show
   ============================================================ */

/**
 * Triggers a beautiful, full-screen fireworks show.
 * @param {number} [startX] - Optional starting X coordinate for the first burst.
 * @param {number} [startY] - Optional starting Y coordinate for the first burst.
 */
export function triggerFireworks(startX, startY) {
  // Prevent duplicate canvases
  let canvas = document.getElementById('global-fireworks-canvas');
  let isNew = false;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'global-fireworks-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1000'; // Just above the modal overlay (z-index: 100)
    document.body.appendChild(canvas);
    isNew = true;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  if (isNew) {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  const w = canvas.width;
  const h = canvas.height;

  // Particle colors (Midnight Rose/Sunset Gold romantic theme)
  const COLORS = [
    '#F57EB6', // Rose Gold / Deep Blush
    '#FFD1E6', // Light Blush
    '#E6C280', // Gold Shimmer
    '#FF4B82', // Neon Pink
    '#FF9F1C', // Warm Orange
    '#D8B4FE', // Pastel Purple
    '#FFFFFF'  // White Diamond Sparks
  ];

  let particles = [];
  let timeouts = [];

  const addBurst = (x, y, type = 'normal') => {
    const particleCount = type === 'heart' ? 90 : 65;
    const baseColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const secondaryColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    if (type === 'heart') {
      // Create a heart shape pattern
      for (let i = 0; i < particleCount; i++) {
        // Parametric angle
        const t = (i / particleCount) * Math.PI * 2;
        
        // Heart shape mathematical coordinates
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        
        // Scale and add slight randomness to velocities
        const speed = 0.28 + Math.random() * 0.12;
        const vx = hx * speed;
        const vy = hy * speed;

        particles.push({
          x,
          y,
          vx,
          vy,
          size: 1.5 + Math.random() * 2.5,
          color: Math.random() > 0.35 ? baseColor : secondaryColor,
          opacity: 1,
          decay: 0.008 + Math.random() * 0.007,
          gravity: 0.06,
          friction: 0.965,
          sparkle: Math.random() > 0.4,
          history: []
        });
      }
    } else {
      // Classic radial burst
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6.5;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        particles.push({
          x,
          y,
          vx,
          vy,
          size: 1 + Math.random() * 2,
          color: Math.random() > 0.3 ? baseColor : secondaryColor,
          opacity: 1,
          decay: 0.01 + Math.random() * 0.012,
          gravity: 0.055,
          friction: 0.96,
          sparkle: Math.random() > 0.5,
          history: []
        });
      }
    }
  };

  // 1. Initial burst at click/tap location or screen center
  const initialX = startX !== undefined ? startX : w / 2;
  const initialY = startY !== undefined ? startY : h / 2;
  addBurst(initialX, initialY, 'heart');

  // 2. Queue follow-up explosions for a premium multi-burst display
  const scheduleBurst = (delay, type) => {
    const tId = setTimeout(() => {
      // Check if canvas is still in the DOM
      if (!document.getElementById('global-fireworks-canvas')) return;
      const rx = w * 0.15 + Math.random() * (w * 0.7);
      const ry = h * 0.2 + Math.random() * (h * 0.35);
      addBurst(rx, ry, type);
    }, delay);
    timeouts.push(tId);
  };

  scheduleBurst(250, 'normal');
  scheduleBurst(550, 'heart');
  scheduleBurst(900, 'normal');
  scheduleBurst(1300, 'heart');
  scheduleBurst(1700, 'normal');

  // Animation Loop
  let rafId;
  const animate = () => {
    // Clear with a transparent mask to allow page behind it to show
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      // Physics logic: apply friction and gravity
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;

      // Save trace history for high quality light trails
      p.history.push({ x: p.x, y: p.y });
      if (p.history.length > 5) {
        p.history.shift();
      }

      p.x += p.vx;
      p.y += p.vy;

      // Sparkle/twinkle effect: fluctuate opacity slightly if enabled
      let currentOpacity = p.opacity;
      if (p.sparkle) {
        currentOpacity = p.opacity * (0.4 + Math.random() * 0.6);
      }

      p.opacity -= p.decay;

      // Remove faded particles
      if (p.opacity <= 0) {
        particles.splice(i, 1);
        continue;
      }

      // Draw particle trails
      if (p.history.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.history[0].x, p.history[0].y);
        for (let hIdx = 1; hIdx < p.history.length; hIdx++) {
          ctx.lineTo(p.history[hIdx].x, p.history[hIdx].y);
        }
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size * 0.7;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = currentOpacity * 0.45;
        ctx.stroke();
      }

      // Draw particle glowing core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = currentOpacity;
      ctx.fill();
    }

    ctx.globalAlpha = 1.0;
    rafId = requestAnimationFrame(animate);
  };

  rafId = requestAnimationFrame(animate);

  // Clean up function
  const cleanup = () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resizeCanvas);
    timeouts.forEach(clearTimeout);
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  };

  // Run cleanup after 5 seconds
  setTimeout(cleanup, 5000);
}
