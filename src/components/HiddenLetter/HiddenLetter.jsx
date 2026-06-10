/* ============================================================
   💌 HiddenLetter — Secret Love Letter Modal
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from 'react';
import './HiddenLetter.css';
import { triggerFireworks } from '../../utils/fireworks';
import { MailOpen, Heart, X } from 'lucide-react';


const LETTER_TEXT =
  'Dear Naylin, There are words I keep hidden in the corners of my heart, words too precious for ordinary moments. You are the reason I believe in magic, the reason my world has color. Every time I see you, my heart whispers that it has found its home. You are not just special, you are my everything. Forever yours. 💕';

const TYPING_SPEED = 38; // ms per character

export default function HiddenLetter({ isVisible = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const timerRef = useRef(null);
  const indexRef = useRef(0);

  /* ── Open modal & start typewriter ── */
  const openModal = useCallback(() => {
    setIsOpen(true);
    setDisplayText('');
    setTypingDone(false);
    indexRef.current = 0;
  }, []);

  /* ── Close modal ── */
  const closeModal = useCallback(() => {
    setIsOpen(false);
    if (timerRef.current) clearInterval(timerRef.current);
    // Reset for next open
    setTimeout(() => {
      setDisplayText('');
      setTypingDone(false);
      indexRef.current = 0;
    }, 400);
  }, []);

  /* ── Typewriter effect ── */
  useEffect(() => {
    if (!isOpen) return;

    timerRef.current = setInterval(() => {
      if (indexRef.current < LETTER_TEXT.length) {
        indexRef.current += 1;
        setDisplayText(LETTER_TEXT.slice(0, indexRef.current));
      } else {
        clearInterval(timerRef.current);
        setTypingDone(true);
      }
    }, TYPING_SPEED);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  /* ── Global event listener to open letter from other components ── */
  useEffect(() => {
    const handleOpenEvent = (e) => {
      const { x, y } = e.detail || {};
      openModal();
      triggerFireworks(x, y);
    };
    window.addEventListener('open-secret-letter', handleOpenEvent);
    return () => window.removeEventListener('open-secret-letter', handleOpenEvent);
  }, [openModal]);

  /* ── Floating envelope click handler ── */
  const handleEnvelopeClick = useCallback((e) => {
    openModal();
    triggerFireworks(e.clientX, e.clientY);
  }, [openModal]);


  /* ── Escape key handler ── */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, closeModal]);

  /* ── Prevent body scroll when open ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating envelope button */}
      {isVisible && (
        <button
          className="hidden-letter__trigger"
          onClick={handleEnvelopeClick}
          aria-label="Open secret letter"
          title="A secret letter for you"
        >
          <MailOpen size={24} style={{ color: 'var(--rose-gold)' }} />
        </button>
      )}

      {/* Modal overlay */}
      <div
        className={`hidden-letter__overlay ${isOpen ? 'hidden-letter__overlay--open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Secret letter"
      >
        <div className="hidden-letter__card">
          {/* Close button */}
          <button
            className="hidden-letter__close"
            onClick={closeModal}
            aria-label="Close letter"
          >
            <X size={18} />
          </button>

          {/* Title */}
          <h3 className="hidden-letter__title">
            A Secret Letter For You <Heart size={18} fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px', color: 'var(--rose-gold)' }} />
          </h3>

          {/* Letter body with typewriter */}
          <p className="hidden-letter__body">
            {displayText}
            <span
              className={`hidden-letter__cursor ${
                typingDone ? 'hidden-letter__cursor--done' : ''
              }`}
            />
          </p>

          {/* Decorative flourish */}
          <div
            className={`hidden-letter__flourish ${
              typingDone ? 'hidden-letter__flourish--visible' : ''
            }`}
          >
            ✿ ❀ ✿
          </div>
        </div>
      </div>
    </>
  );
}
