/* ============================================================
   💗 CatchHearts — Catch Falling Hearts!
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from 'react';
import './CatchHearts.css';

const GOOD_HEARTS = ['💗', '💖', '💕'];
const BAD_HEART = '💔';
const POWER_UP = '🌹';
const BOMB = '💣';
const GAME_DURATION = 30;
const SPAWN_INTERVAL_MS = 800;

function getResultMessage(score) {
  if (score >= 20) return { emoji: '💕', text: 'You caught all my love! 💕' };
  if (score >= 10) return { emoji: '🌸', text: 'So much love collected! 🌸' };
  return { emoji: '💖', text: 'Every bit of love counts! 💖' };
}

import { sfx } from '../../utils/sfx';

export default function CatchHearts() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('idle'); // idle | playing | over
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isShaking, setIsShaking] = useState(false);

  // Refs for the game loop
  const heartsRef = useRef([]);
  const scoreRef = useRef(0);
  const timeRef = useRef(GAME_DURATION);
  const animRef = useRef(null);
  const spawnRef = useRef(null);
  const timerRef = useRef(null);
  const gameActiveRef = useRef(false);

  // Spawn a heart
  const spawnHeart = useCallback((canvasWidth) => {
    const elapsed = GAME_DURATION - timeRef.current;
    const speedMultiplier = 1 + elapsed * 0.04; // speed increases over time

    // 15% bad, 8% power-up, rest good
    const rand = Math.random();
    let emoji, points;
    if (rand < 0.08) {
      emoji = POWER_UP;
      points = 3;
    } else if (rand < 0.18) {
      emoji = BOMB;
      points = -3;
    } else if (rand < 0.33) {
      emoji = BAD_HEART;
      points = -1;
    } else {
      emoji = GOOD_HEARTS[Math.floor(Math.random() * GOOD_HEARTS.length)];
      points = 1;
    }

    const size = 28 + Math.random() * 16;
    heartsRef.current.push({
      x: 30 + Math.random() * (canvasWidth - 60),
      y: -size,
      size,
      emoji,
      points,
      speed: (1.5 + Math.random() * 1.5) * speedMultiplier,
      id: Date.now() + Math.random(),
    });
  }, []);

  // Handle canvas click/tap
  const handleCanvasClick = useCallback(
    (e) => {
      if (!gameActiveRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      // Calculate coordinates relative to canvas in CSS pixels
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Check hearts from top (newest) to bottom
      for (let i = heartsRef.current.length - 1; i >= 0; i--) {
        const h = heartsRef.current[i];
        const dist = Math.sqrt((clickX - h.x) ** 2 + (clickY - h.y) ** 2);
        if (dist < h.size * 1.2) {
          scoreRef.current = Math.max(0, scoreRef.current + h.points);
          setScore(scoreRef.current);
          
          if (h.points > 0) {
            sfx.heartCatch();
          } else {
            sfx.incorrect();
            if (h.emoji === BOMB) {
              setIsShaking(true);
              setTimeout(() => setIsShaking(false), 400);
            }
          }
          
          heartsRef.current.splice(i, 1);
          break;
        }
      }
    },
    []
  );

  // Game loop
  const startGame = useCallback(() => {
    sfx.click();
    heartsRef.current = [];
    scoreRef.current = 0;
    timeRef.current = GAME_DURATION;
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
    gameActiveRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Set actual pixel dimensions
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const w = rect.width;
    const h = rect.height;

    // Spawn interval
    spawnRef.current = setInterval(() => {
      if (gameActiveRef.current) spawnHeart(w);
    }, SPAWN_INTERVAL_MS);

    // Timer countdown
    timerRef.current = setInterval(() => {
      timeRef.current -= 1;
      setTimeLeft(timeRef.current);
      if (timeRef.current <= 0) {
        gameActiveRef.current = false;
        clearInterval(spawnRef.current);
        clearInterval(timerRef.current);
        cancelAnimationFrame(animRef.current);
        setGameState('over');
        sfx.victory();
      }
    }, 1000);

    // Render loop
    const render = () => {
      if (!gameActiveRef.current) return;

      ctx.clearRect(0, 0, w, h);

      // Update and draw hearts
      heartsRef.current = heartsRef.current.filter((heart) => {
        heart.y += heart.speed;
        // Draw emoji
        ctx.font = `${heart.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(heart.emoji, heart.x, heart.y);
        // Remove if off screen
        return heart.y < h + heart.size;
      });

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
  }, [spawnHeart]);

  // Cleanup
  useEffect(() => {
    return () => {
      gameActiveRef.current = false;
      clearInterval(spawnRef.current);
      clearInterval(timerRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const result = getResultMessage(score);

  return (
    <div className="catch-hearts">
      <h3 className="catch-hearts-title">Catch Hearts 💗</h3>

      <div className={`catch-canvas-container${isShaking ? ' shake' : ''}`}>
        <canvas
          ref={canvasRef}
          className="catch-canvas"
          onPointerDown={handleCanvasClick}
        />

        {/* HUD */}
        {gameState === 'playing' && (
          <div className="catch-hud">
            <div className="catch-hud-item">
              ⏱ <span>{timeLeft}s</span>
            </div>
            <div className="catch-hud-item">
              💗 <span>{score}</span>
            </div>
          </div>
        )}

        {/* Start Screen */}
        {gameState === 'idle' && (
          <div className="catch-overlay">
            <span className="catch-overlay-emoji">💗</span>
            <h4 className="catch-overlay-title">Catch Hearts!</h4>
            <p className="catch-overlay-msg">
              Tap the falling hearts to catch them!
              <br />
              Avoid 💔 broken hearts & 💣 bombs!
              <br />
              🌹 roses give bonus points!
            </p>
            <button className="btn-rose" onClick={startGame}>
              Start Game
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'over' && (
          <div className="catch-overlay">
            <span className="catch-overlay-emoji">{result.emoji}</span>
            <h4 className="catch-overlay-title">Time's Up!</h4>
            <div className="catch-overlay-score">{score}</div>
            <p className="catch-overlay-msg">{result.text}</p>
            <button className="btn-rose" onClick={startGame}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
