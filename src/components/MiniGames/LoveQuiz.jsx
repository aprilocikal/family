/* ============================================================
   💕 LoveQuiz — How Well Do You Know Me?
   ============================================================ */
import { useState, useCallback } from 'react';
import './LoveQuiz.css';
import { Heart, Sparkles, Trophy, ArrowLeft, Share2 } from 'lucide-react';
import { sfx } from '../../utils/sfx';
import { generateScorecard } from '../../utils/scorecard';
import ScorecardModal from './ScorecardModal';

const BUNDA_QUESTIONS = [
  {
    q: "Selasa, Kamis, Sabtu Papa biasanya ngapain?",
    options: ['Tenis', 'Padel', 'Basket', 'Badminton'],
    correct: 3,
  },
  {
    q: "Ketika Papa potong rambut di Captain, produk apa yang akan dibeli?",
    options: ['Serum', 'Minyak Rambut', 'Pomade', 'Hair Mask'],
    correct: 2,
  },
  {
    q: "Warna sepatu baru Papa?",
    options: ['Hitam', 'Biru', 'Putih', 'Abu-abu'],
    correct: 2,
  },
  {
    q: "Dulu Papa olahraganya apa?",
    options: ['Badminton', 'Basket', 'Lari', 'Tenis'],
    correct: 1,
  },
  {
    q: "Slogannya Papa?",
    options: ['Hidup itu santai', 'One for all, all for one', 'Yang penting bahagia', 'Makan dulu, urusan nanti'],
    correct: 1,
  }
];

const PAPA_QUESTIONS = [
  {
    q: "Live TikTok siapa yang paling Bunda sukai?",
    options: ['Artis', 'Menyanyi', 'Travelling', 'Edis TV'],
    correct: 3,
  },
  {
    q: "Apa hobi Bunda saat luang?",
    options: ['Baking', 'Jalan-jalan', 'Menjahit', 'Menyetrika'],
    correct: 0,
  },
  {
    q: "Tanggal 13 Juni 2026, Bunda membeli kue apa?",
    options: ['Roti', 'Bolu', 'Donat', 'Teripang'],
    correct: 3,
  },
  {
    q: "Bunda kalau beli di Bakwan Mandala, baksonya berapa?",
    options: ['2', '3', '4', '5'],
    correct: 1,
  },
  {
    q: "Kalau di mall, Bunda biasanya beli make up di mana?",
    options: ['Sephora', 'Sociolla', 'BeautyHaul', 'Sensatia'],
    correct: 0,
  }
];

function getResultMessage(score, mode) {
  if (mode === 'bunda') {
    if (score === 5) return { icon: Trophy, color: '#ffd700', text: 'Bunda mengenal Papa dengan sangat sempurna! Pasangan idaman selamanya 💙' };
    if (score >= 3) return { icon: Sparkles, color: '#5eb8f5', text: 'Luar biasa! Bunda sangat memahami Papa, pertahankan kemesraan ini! 💙' };
    return { icon: Heart, color: '#4ba5ff', text: 'Ayo lebih banyak mengobrol dan quality time berdua dengan Papa! 💙' };
  } else {
    if (score === 5) return { icon: Trophy, color: '#ffd700', text: 'Papa mengenal Bunda dengan sangat sempurna! Suami terbaik sedunia 💙' };
    if (score >= 3) return { icon: Sparkles, color: '#5eb8f5', text: 'Hebat sekali! Papa sangat peka terhadap perasaan Bunda, pertahankan! 💙' };
    return { icon: Heart, color: '#4ba5ff', text: 'Ayo luangkan waktu lebih banyak untuk memanjakan Bunda tercinta! 💙' };
  }
}

function Confetti() {
  const [pieces] = useState(() => Array.from({ length: 40 }, (_, i) => {
    const colors = ['#748AC8', '#C4D8F2', '#74A5D4', '#FFD700', '#69B4FF', '#1493FF'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 2;
    const duration = 2 + Math.random() * 2;
    const size = 6 + Math.random() * 8;
    const isCircle = Math.random() > 0.5;

    return {
      id: i,
      color,
      left,
      delay,
      duration,
      size,
      isCircle,
    };
  }));

  return (
    <div className="quiz-confetti">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            borderRadius: p.isCircle ? '50%' : '2px',
            opacity: 1,
          }}
        />
      ))}
    </div>
  );
}

export default function LoveQuiz() {
  const [quizMode, setQuizMode] = useState(null); // 'bunda' or 'papa'
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Scorecard modal state
  const [showScorecard, setShowScorecard] = useState(false);
  const [scorecardUrl, setScorecardUrl] = useState('');
  const [captionText, setCaptionText] = useState('');

  const selectMode = (mode) => {
    sfx.click();
    setQuizMode(mode);
    const bank = mode === 'bunda' ? BUNDA_QUESTIONS : PAPA_QUESTIONS;
    const shuffled = [...bank].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    setShowConfetti(false);
  };

  const handleAnswer = useCallback(
    (index) => {
      if (selected !== null) return; // already answered
      setSelected(index);

      const isCorrect = index === questions[currentQ].correct;
      const newScore = isCorrect ? score + 1 : score;
      if (isCorrect) {
        setScore(newScore);
        sfx.correct();
      } else {
        sfx.incorrect();
      }

      // Auto-advance after 1 second
      setTimeout(() => {
        if (currentQ + 1 < questions.length) {
          setCurrentQ((prev) => prev + 1);
          setSelected(null);
        } else {
          setFinished(true);
          if (newScore === 5) {
            setShowConfetti(true);
            sfx.victory();
          } else if (newScore >= 3) {
            sfx.correct();
          } else {
            sfx.incorrect();
          }
        }
      }, 1000);
    },
    [selected, currentQ, score, questions]
  );

  const restart = () => {
    sfx.click();
    setQuizMode(null);
    setQuestions([]);
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    setShowConfetti(false);
  };

  const handleShare = () => {
    sfx.click();
    const roleText = quizMode === 'bunda' ? 'Kuis Bunda (tentang Papa)' : 'Kuis Papa (tentang Bunda)';
    const shareText = `Aku baru saja menyelesaikan permainan ${roleText}! Aku berhasil menjawab ${score} dari 5 pertanyaan dengan benar! 👩‍🦰👨💙`;
    setCaptionText(shareText);

    const result = getResultMessage(score, quizMode);
    const generatedUrl = generateScorecard({
      gameTitle: quizMode === 'bunda' ? 'Kuis Bunda' : 'Kuis Papa',
      subtitle: quizMode === 'bunda' ? 'Kuis tentang Papa' : 'Kuis tentang Bunda',
      stats: { 'Skor': `${score} / 5` },
      message: result.text
    });

    setScorecardUrl(generatedUrl);
    setShowScorecard(true);
  };

  // ── Render Selection Screen ──
  if (!quizMode) {
    return (
      <div className="love-quiz">
        <div className="quiz-selection-screen">
          <h3 className="love-quiz-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            Family Trivia <Heart size={20} fill="currentColor" style={{ color: 'var(--rose-gold)' }} />
          </h3>
          <p className="quiz-selection-desc">Pilih kuis yang ingin dimainkan:</p>
          <div className="quiz-mode-buttons">
            <button className="quiz-mode-btn" onClick={() => selectMode('bunda')}>
              <span className="mode-emoji">👩‍🦰</span>
              <span className="mode-title">Kuis Bunda</span>
              <span className="mode-desc">Bunda menjawab pertanyaan tentang Papa</span>
            </button>
            <button className="quiz-mode-btn" onClick={() => selectMode('papa')}>
              <span className="mode-emoji">👨</span>
              <span className="mode-title">Kuis Papa</span>
              <span className="mode-desc">Papa menjawab pertanyaan tentang Bunda</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render Finished Screen ──
  if (finished) {
    const result = getResultMessage(score, quizMode);
    return (
      <div className="love-quiz">
        {showConfetti && <Confetti />}
        <div className="quiz-header">
          <button className="quiz-back-btn" onClick={restart} title="Kembali">
            <ArrowLeft size={18} />
          </button>
          <h3 className="love-quiz-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: 0 }}>
            {quizMode === 'bunda' ? 'Kuis Bunda' : 'Kuis Papa'} <Heart size={20} fill="currentColor" style={{ color: 'var(--rose-gold)' }} />
          </h3>
        </div>
        <div className="quiz-result">
          <span className="quiz-result-emoji" style={{ color: result.color, display: 'inline-flex', marginBottom: '12px' }}>
            <result.icon size={48} fill={result.icon === Heart ? 'currentColor' : 'none'} />
          </span>
          <div className="quiz-result-score">
            {score} / {questions.length}
          </div>
          <p className="quiz-result-message">{result.text}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
            <button className="btn-rose quiz-restart" onClick={restart}>
              Main Lagi
            </button>
            <button className="btn-rose quiz-share" onClick={handleShare} style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', border: '1px solid #128C7E', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)' }}>
              <Share2 size={16} style={{ marginRight: '6px' }} /> Bagikan Hasil
            </button>
          </div>
        </div>

        <ScorecardModal
          isOpen={showScorecard}
          onClose={() => setShowScorecard(false)}
          scorecardUrl={scorecardUrl}
          gameTitle={quizMode === 'bunda' ? 'Kuis Bunda' : 'Kuis Papa'}
          captionText={captionText}
        />
      </div>
    );
  }

  const question = questions[currentQ];
  const progress = ((currentQ + (selected !== null ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="love-quiz">
      <div className="quiz-header">
        <button className="quiz-back-btn" onClick={restart} title="Kembali">
          <ArrowLeft size={18} />
        </button>
        <h3 className="love-quiz-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: 0 }}>
          {quizMode === 'bunda' ? 'Kuis Bunda' : 'Kuis Papa'} <Heart size={20} fill="currentColor" style={{ color: 'var(--rose-gold)' }} />
        </h3>
      </div>

      {/* Progress Bar */}
      <div className="quiz-progress-wrapper">
        <p className="quiz-progress-text">
          Pertanyaan {currentQ + 1} dari {questions.length}
        </p>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      {question && <p className="quiz-question">{question.q}</p>}

      {/* Options */}
      <div className="quiz-options">
        {question && question.options.map((opt, i) => {
          let cls = 'quiz-option';
          if (selected !== null) {
            cls += ' quiz-option-disabled';
            if (i === question.correct) cls += ' correct';
            else if (i === selected) cls += ' wrong';
          }
          return (
            <button key={i} className={cls} onClick={() => handleAnswer(i)}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
