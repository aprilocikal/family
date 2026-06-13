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
    q: "Apa hal pertama yang dicari Papa saat pertama kali sampai di rumah setelah bekerja?",
    options: ['Segelas air dingin / kopi hangat', 'Mencari keberadaan Bunda tercinta', 'Langsung berganti pakaian santai', 'Mencari HP-nya'],
    correct: 1,
  },
  {
    q: "Menurut Papa, apa masakan Bunda yang rasanya paling juara dan tiada tanding?",
    options: ['Masakan rumah sederhana apa saja buatan Bunda', 'Nasi goreng buatan Bunda di pagi hari', 'Lauk kering/sambal racikan khusus Bunda', 'Semua masakan Bunda adalah restoran bintang lima!'],
    correct: 3,
  },
  {
    q: "Saat Papa sedang lelah atau stres, apa cara terbaik Bunda untuk mengembalikan senyumnya?",
    options: ['Membuatkan minuman hangat kesukaannya', 'Memberikan pelukan hangat dan pijatan lembut', 'Mengajaknya mengobrol santai tanpa membahas masalah', 'Mendengarkan keluh kesahnya dengan sabar'],
    correct: 1,
  },
  {
    q: "Di mata Papa, apa sifat Bunda yang paling membuat Papa jatuh hati setiap harinya?",
    options: ['Kesabaran Bunda yang luar biasa', 'Senyum manis Bunda yang menenangkan', 'Ketulusan Bunda merawat keluarga', 'Semua pesona Bunda lahir dan batin'],
    correct: 3,
  },
  {
    q: "Apa impian atau harapan terbesar Papa untuk masa depan bersama Bunda?",
    options: ['Menikmati masa tua yang damai berdua', 'Melihat anak-anak sukses dan bahagia', 'Selalu sehat dan bergandengan tangan selamanya', 'Semua impian indah di atas'],
    correct: 3,
  },
  {
    q: "Kapan biasanya Papa terlihat paling rileks dan bahagia di rumah?",
    options: ['Saat menonton acara favorit/video sambil ngopi', 'Saat bercanda gurau dengan anak-anak dan Bunda', 'Saat akhir pekan bebas dari pekerjaan', 'Semua momen santai di rumah'],
    correct: 3,
  },
  {
    q: "Apa kebiasaan Papa yang paling sering membuat Bunda tersenyum sendiri?",
    options: ['Cara Papa tertawa lepas mendengar lelucon', 'Momen ketika Papa perhatian secara tiba-tiba', 'Saat Papa lahap makan masakan Bunda', 'Semua hal kecil romantis yang dilakukan Papa'],
    correct: 3,
  },
  {
    q: "Jika Papa merencanakan kencan berdua saja dengan Bunda, tempat seperti apa yang akan dipilihnya?",
    options: ['Makan malam romantis di tempat yang tenang', 'Jalan-jalan santai di taman atau tempat terbuka', 'Menonton bioskop bersama', 'Nongkrong santai di kafe estetis'],
    correct: 0,
  },
  {
    q: "Apa yang paling Papa hargai dari dukungan Bunda dalam kehidupan sehari-hari?",
    options: ['Doa-doa tulus Bunda di setiap sujudnya', 'Kehadiran Bunda di kala suka maupun duka', 'Kata-kata penyemangat saat Papa lelah', 'Seluruh pengorbanan dan cinta kasih Bunda'],
    correct: 3,
  },
  {
    q: "Di hari ulang tahun Papa, hadiah apa yang sebenarnya paling berharga baginya?",
    options: ['Barang hobi yang sudah lama diimpikan', 'Kehadiran utuh dan senyuman keluarga tercinta', 'Kado buatan tangan yang penuh kenangan', 'Makan malam spesial bersama istri dan anak-anak'],
    correct: 1,
  }
];

const PAPA_QUESTIONS = [
  {
    q: "Apa hal yang paling cepat meredakan rasa lelah Bunda setelah seharian sibuk?",
    options: ['Waktu tenang (me-time) sejenak', 'Kata-kata manis dan pelukan dari Papa', 'Melihat rumah bersih dan rapi', 'Dipijat pundaknya oleh Papa tercinta'],
    correct: 1,
  },
  {
    q: "Momen sederhana apa yang paling membuat Bunda merasa disayangi oleh Papa?",
    options: ['Saat Papa membantu tanpa diminta', 'Saat Papa mendengarkan ceritanya dengan fokus', 'Saat dibawakan camilan kecil kesukaannya', 'Semua perhatian kecil yang Papa berikan'],
    correct: 3,
  },
  {
    q: "Dari semua kebiasaan Papa, mana yang paling sering membuat Bunda tersenyum gemas?",
    options: ['Saat Papa mencoba melucu tapi garing', 'Saat Papa memanjakan anak-anak', 'Saat Papa menatap Bunda penuh cinta', 'Saat Papa lahap memakan masakan Bunda'],
    correct: 2,
  },
  {
    q: "Apa hal yang paling Bunda utamakan demi kenyamanan keluarga di rumah?",
    options: ['Kebersihan dan kerapian setiap sudut rumah', 'Kesehatan dan asupan gizi keluarga', 'Suasana rumah yang hangat dan penuh tawa', 'Semua hal di atas selalu dijaga Bunda'],
    correct: 3,
  },
  {
    q: "Jika Bunda bisa memilih satu kado paling berharga dari Papa, apakah itu?",
    options: ['Waktu berkualitas berdua saja tanpa gangguan', 'Kesehatan dan kehadiran Papa di sampingnya', 'Bantuan tulus Papa dalam keseharian', 'Semua cinta, waktu, dan kesetiaan Papa'],
    correct: 3,
  },
  {
    q: "Apa yang biasanya Bunda lakukan ketika ingin memanjakan dirinya setelah lelah?",
    options: ['Menonton serial drama kesukaannya', 'Berbelanja atau melihat-lihat online shop', 'Tidur siang dengan tenang', 'Menikmati teh/kopi hangat di sudut favorit'],
    correct: 1,
  },
  {
    q: "Apa kekhawatiran terbesar Bunda dalam merawat keluarga sehari-hari?",
    options: ['Kesehatan Papa dan anak-anak yang terganggu', 'Kebutuhan keluarga yang kurang terpenuhi', 'Pendidikan dan masa depan anak-anak', 'Semua yang menyangkut kebahagiaan keluarga'],
    correct: 3,
  },
  {
    q: "Mendengar kata-kata pujian seperti apa yang paling membuat hati Bunda berbunga-bunga?",
    options: ['"Terima kasih sudah merawat kami dengan luar biasa"', '"Bunda terlihat sangat cantik hari ini"', '"Masakan Bunda hari ini enak sekali!"', 'Semua kalimat apresiasi tulus dari Papa'],
    correct: 3,
  },
  {
    q: "Di mana tempat liburan impian Bunda yang sering ia ceritakan atau bayangkan?",
    options: ['Tempat pegunungan yang sejuk dan damai', 'Pantai dengan suara ombak yang menenangkan', 'Kota wisata yang ramai dan penuh tempat berfoto', 'Ke mana saja, asalkan perginya lengkap bersama keluarga'],
    correct: 3,
  },
  {
    q: "Bagaimana cara Bunda menunjukkan rasa sayangnya yang paling sering Papa rasakan?",
    options: ['Menyiapkan segala keperluan Papa sebelum diminta', 'Menanyakan kabar dan mendengarkan keluh kesah Papa', 'Menyambut Papa dengan senyuman hangat di depan pintu', 'Semua tindakan penuh kasih sayang di atas'],
    correct: 3,
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
