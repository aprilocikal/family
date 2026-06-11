/* ============================================================
   💕 LoveQuiz — How Well Do You Know Me?
   ============================================================ */
import { useState, useCallback } from 'react';
import './LoveQuiz.css';
import { Heart, Sparkles, Trophy } from 'lucide-react';

const QUESTION_BANK = [
  {
    q: 'What makes Naylin smile the most?',
    options: ['A sweet message out of the blue', 'Hearing her favorite song', 'Receiving pretty flowers', 'Warm hugs on a rainy day'],
    correct: 0,
  },
  {
    q: 'What is the best way to spend time together?',
    options: ['A cozy coffee shop date', 'Walking hand in hand under the stars', 'Cooking a delicious meal together', 'Any second spent together is the absolute best'],
    correct: 3,
  },
  {
    q: 'What does Naylin deserve?',
    options: ['Endless fields of fresh flowers', 'The sweetest dreams every single night', 'All the love and happiness in the world', 'The absolute best of everything in life'],
    correct: 2,
  },
  {
    q: 'How special is Naylin?',
    options: ['More special than words could ever describe', 'Sweeter than a bucket of honey', 'The most special person in the whole universe', 'My favorite thought every single day'],
    correct: 2,
  },
  {
    q: 'What would I do for Naylin?',
    options: ['Travel to the ends of the earth', 'Always be there to make you laugh and smile', 'Bring you your favorite snacks whenever you want', 'All of this and so much more'],
    correct: 3,
  },
  {
    q: "Which of these traits defines Naylin's magic the most?",
    options: ['Your beautiful, bright smile', 'Your warm and kind heart', 'The way you bring color to my world', 'Your gentle voice and sweet laugh'],
    correct: 1,
  },
  {
    q: 'What is the perfect soundtrack for us?',
    options: ['A sweet love song playing on repeat', 'The sound of our laughter together', 'Just the sound of your voice calling my name', 'Quiet whispers in the middle of the night'],
    correct: 2,
  },
  {
    q: 'When did I realize how special you are?',
    options: ['From the very first moment we talked', 'When I realized I could not stop thinking about you', 'When your smile became my favorite sight', 'All of the above, from day one'],
    correct: 3,
  },
  {
    q: 'What is my absolute favorite thing to do with you?',
    options: ['Sharing secret jokes and laughing endlessly', 'Walking side by side, hand in hand', 'Just sitting in cozy, warm silence together', 'Looking into your beautiful eyes and smiling'],
    correct: 1,
  },
  {
    q: 'If I could give Naylin one gift, what would it be?',
    options: ['A key to a garden of eternal spring', 'A star named after you in the night sky', 'A lifetime supply of warm hugs and sweet kisses', 'A mirror that shows how beautiful you truly are'],
    correct: 2,
  },
  {
    q: "What color matches Naylin's aura the best?",
    options: ['Deep violet, because you are mystical and deep', 'Bright gold, because you shine so bright', 'Soft pink, because of your gentle kindness', 'Rose red, because you are so loved'],
    correct: 2,
  },
  {
    q: 'What is the sweetest thing about Naylin?',
    options: ['Your adorable pout when you are teasing', 'Your kind heart that always cares', 'The way your eyes light up when you are happy', 'Your soothing presence that calms my mind'],
    correct: 1,
  },
  {
    q: 'If you were a season, which one would you be?',
    options: ['Spring, because you bring new beginnings and life', 'Summer, because you are warm and full of energy', 'Autumn, because you are cozy and beautiful', 'Winter, because you make me want to cuddle'],
    correct: 0,
  },
  {
    q: 'What is my favorite thought before falling asleep?',
    options: ['Replaying our sweet conversations in my head', 'Hoping to meet you in my dreams tonight', 'Counting the days until we see each other again', 'Wondering if you are sleeping well right now'],
    correct: 1,
  },
  {
    q: 'What is the secret ingredient in our relationship?',
    options: ['A huge amount of cute teasing and jokes', 'Endless understanding and support', 'A lot of sweet love letters and messages', 'An infinite amount of pure love'],
    correct: 3,
  },
];

function getResultMessage(score) {
  if (score === 5) return { icon: Trophy, color: '#ffd700', text: 'You know me perfectly! We are truly meant to be' };
  if (score >= 3) return { icon: Sparkles, color: '#f57eb6', text: 'So close! Keep loving me and you will know everything' };
  return { icon: Heart, color: '#ff4b82', text: 'Hmm, spend more time with me!' };
}

function Confetti() {
  const [pieces] = useState(() => Array.from({ length: 40 }, (_, i) => {
    const colors = ['#C8748A', '#F2C4CE', '#D4A574', '#FFD700', '#FF69B4', '#FF1493'];
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
  const [questions, setQuestions] = useState(() => {
    const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  });
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleAnswer = useCallback(
    (index) => {
      if (selected !== null) return; // already answered
      setSelected(index);

      const isCorrect = index === questions[currentQ].correct;
      const newScore = isCorrect ? score + 1 : score;
      if (isCorrect) setScore(newScore);

      // Auto-advance after 1 second
      setTimeout(() => {
        if (currentQ + 1 < questions.length) {
          setCurrentQ((prev) => prev + 1);
          setSelected(null);
        } else {
          setFinished(true);
          if (newScore === 5) setShowConfetti(true);
        }
      }, 1000);
    },
    [selected, currentQ, score, questions]
  );

  const restart = () => {
    const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    setShowConfetti(false);
  };

  if (finished) {
    const result = getResultMessage(score);
    return (
      <div className="love-quiz">
        {showConfetti && <Confetti />}
        <h3 className="love-quiz-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          Love Quiz <Heart size={20} fill="currentColor" style={{ color: 'var(--rose-gold)' }} />
        </h3>
        <div className="quiz-result">
          <span className="quiz-result-emoji" style={{ color: result.color, display: 'inline-flex', marginBottom: '12px' }}>
            <result.icon size={48} fill={result.icon === Heart ? 'currentColor' : 'none'} />
          </span>
          <div className="quiz-result-score">
            {score} / {questions.length}
          </div>
          <p className="quiz-result-message">{result.text}</p>
          <button className="btn-rose quiz-restart" onClick={restart}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQ];
  const progress = ((currentQ + (selected !== null ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="love-quiz">
      <h3 className="love-quiz-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        Love Quiz <Heart size={20} fill="currentColor" style={{ color: 'var(--rose-gold)' }} />
      </h3>

      {/* Progress Bar */}
      <div className="quiz-progress-wrapper">
        <p className="quiz-progress-text">
          Question {currentQ + 1} of {questions.length}
        </p>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <p className="quiz-question">{question.q}</p>

      {/* Options */}
      <div className="quiz-options">
        {question.options.map((opt, i) => {
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
