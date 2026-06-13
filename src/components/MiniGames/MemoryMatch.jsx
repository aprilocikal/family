/* ============================================================
   🃏 MemoryMatch — Find the Matching Pairs
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from 'react';
import './MemoryMatch.css';
import { Heart, Sparkles, Flame, Smile, Flower, Gift, Gamepad2, Clock, Target, Share2 } from 'lucide-react';
import { sfx } from '../../utils/sfx';
import { generateScorecard } from '../../utils/scorecard';
import ScorecardModal from './ScorecardModal';

const CARD_ICONS = [
  { Icon: Heart, color: '#4ba5ff' },
  { Icon: Sparkles, color: '#ffd700' },
  { Icon: Flame, color: '#1c9fff' },
  { Icon: Smile, color: '#70b8ff' },
  { Icon: Flower, color: '#d1e8ff' },
  { Icon: Gift, color: '#aad4ff' },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createDeck() {
  const pairs = CARD_ICONS.flatMap((item, i) => [
    { id: i * 2, iconIndex: i, pairId: i },
    { id: i * 2 + 1, iconIndex: i, pairId: i },
  ]);
  return shuffleArray(pairs);
}

export default function MemoryMatch() {
  const [cards, setCards] = useState(() => createDeck());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const timerRef = useRef(null);

  // Scorecard modal state
  const [showScorecard, setShowScorecard] = useState(false);
  const [scorecardUrl, setScorecardUrl] = useState('');
  const [captionText, setCaptionText] = useState('');

  // Start timer
  useEffect(() => {
    if (gameWon) return;
    timerRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameWon]);

  const handleCardClick = useCallback(
    (cardId) => {
      if (isChecking) return;
      if (flipped.includes(cardId)) return;
      const card = cards.find((c) => c.id === cardId);
      if (matched.includes(card.pairId)) return;
      if (flipped.length >= 2) return;

      // Play card click/flip sound
      sfx.click();

      const nextFlipped = [...flipped, cardId];
      setFlipped(nextFlipped);

      if (nextFlipped.length === 2) {
        setIsChecking(true);
        setMoves((m) => m + 1);

        const [first, second] = nextFlipped;
        const card1 = cards.find((c) => c.id === first);
        const card2 = cards.find((c) => c.id === second);

        if (card1.pairId === card2.pairId) {
          // Match found
          const newMatched = [...matched, card1.pairId];
          setMatched(newMatched);
          setFlipped([]);
          setIsChecking(false);
          sfx.match();

          // Check win
          if (newMatched.length === CARD_ICONS.length) {
            setGameWon(true);
            clearInterval(timerRef.current);
            sfx.victory();
          }
        } else {
          // No match — flip back after 1s
          sfx.incorrect();
          setTimeout(() => {
            setFlipped([]);
            setIsChecking(false);
          }, 1000);
        }
      }
    },
    [isChecking, flipped, matched, cards]
  );

  const restart = () => {
    sfx.click();
    setCards(createDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimer(0);
    setGameWon(false);
    setIsChecking(false);
  };

  const handleShare = () => {
    sfx.click();
    const shareText = `Aku berhasil menyelesaikan game Memory Match dalam waktu ${formatTime(timer)} dengan ${moves} langkah! 🃏💙`;
    setCaptionText(shareText);

    const generatedUrl = generateScorecard({
      gameTitle: 'Memory Match',
      subtitle: 'Melatih Ingatan Bersama',
      stats: {
        'Waktu': formatTime(timer),
        'Langkah': `${moves}`
      },
      message: 'Setiap kecocokan kartu adalah pengingat kehangatan hubungan keluarga kita! 💙'
    });

    setScorecardUrl(generatedUrl);
    setShowScorecard(true);
  };

  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (gameWon) {
    return (
      <div className="memory-match">
        <h3 className="memory-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          Memory Match <Gamepad2 size={20} style={{ color: 'var(--rose-gold)' }} />
        </h3>
        <div className="memory-victory">
          <span className="memory-victory-emoji" style={{ color: 'var(--rose-gold)', display: 'inline-flex', marginBottom: '12px' }}>
            <Heart size={48} fill="currentColor" />
          </span>
          <h4 className="memory-victory-title">Hebat sekali! Semua kartu berhasil dicocokkan!</h4>
          <p className="memory-victory-stats">
            Waktu: <strong>{formatTime(timer)}</strong>
          </p>
          <p className="memory-victory-stats">
            Langkah: <strong>{moves}</strong>
          </p>
          <p className="memory-victory-msg">
            Setiap kecocokan kartu adalah pengingat kehangatan hubungan keluarga kita! 💙
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
            <button className="btn-rose" onClick={restart}>
              Main Lagi
            </button>
            <button className="btn-rose" onClick={handleShare} style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', border: '1px solid #128C7E', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)' }}>
              <Share2 size={16} style={{ marginRight: '6px' }} /> Bagikan Hasil
            </button>
          </div>
        </div>

        <ScorecardModal
          isOpen={showScorecard}
          onClose={() => setShowScorecard(false)}
          scorecardUrl={scorecardUrl}
          gameTitle="Memory Match"
          captionText={captionText}
        />
      </div>
    );
  }

  return (
    <div className="memory-match">
      <h3 className="memory-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        Memory Match <Gamepad2 size={20} style={{ color: 'var(--rose-gold)' }} />
      </h3>
 
      <div className="memory-stats">
        <div className="memory-stat" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={16} /> <span>{formatTime(timer)}</span>
        </div>
        <div className="memory-stat" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Target size={16} /> <span>{moves} langkah</span>
        </div>
      </div>

      <div className="memory-grid">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.includes(card.pairId);
          const iconData = CARD_ICONS[card.iconIndex];
          const IconComponent = iconData.Icon;
 
          return (
            <div
              key={card.id}
              className={`memory-card${isFlipped ? ' flipped' : ''}${isMatched ? ' matched' : ''}`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="memory-card-front" style={{ color: iconData.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconComponent size={32} fill={IconComponent === Heart ? 'currentColor' : 'none'} />
              </div>
              <div className="memory-card-back" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
