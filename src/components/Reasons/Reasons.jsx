import { useEffect, useRef } from 'react';
import './Reasons.css';
import { HandHeart, Anchor, BookOpen, Home, Heart, Sparkles } from 'lucide-react';

const reasons = [
  {
    Icon: HandHeart,
    title: 'Doa Papa & Bunda',
    description:
      'Jangkar sunyi yang selalu melindungi dan menuntun setiap langkah dalam hidupku.',
  },
  {
    Icon: Anchor,
    title: 'Pengorbananmu',
    description:
      'Mengesampingkan kenyamanan pribadi demi memastikan aku mendapatkan masa depan terbaik.',
  },
  {
    Icon: BookOpen,
    title: 'Ajaran & Nasihat',
    description:
      'Menanamkan nilai kejujuran, kebaikan, dan keteguhan yang membentuk kepribadianku.',
  },
  {
    Icon: Home,
    title: 'Kehangatan Rumah',
    description:
      'Rumah yang selalu terbuka, menawarkan kedamaian dan kenyamanan tak peduli sekeras apa pun dunia luar.',
  },
  {
    Icon: Heart,
    title: 'Kesabaranmu',
    description:
      'Menerima segala kesalahan dan kekuranganku dengan kelapangan dada dan kasih sayang tanpa batas.',
  },
  {
    Icon: Sparkles,
    title: 'Segalanya Untukku',
    description:
      'Atas kasih sayang tak berujung, bimbingan tiada henti, dan menjadi orang tua terbaik yang pernah ada.',
  },
];

const Reasons = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const revealEls = sectionRef.current?.querySelectorAll('.reveal');
      if (!revealEls) return;

      // Triggers when element is 80% up from the bottom of the viewport
      const triggerBottom = (window.innerHeight / 5) * 4.2;

      revealEls.forEach((el) => {
        const boxTop = el.getBoundingClientRect().top;
        if (boxTop < triggerBottom) {
          el.classList.add('revealed');
          el.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger on mount/delay to reveal elements already in view
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="reasons" className="reasons-section" ref={sectionRef}>
      <div className="section-inner">
        {/* Header */}
        <span className="section-eyebrow reveal">
          persembahan tulus untuk pelindungku
        </span>
        <h2 className="section-title reveal reveal-delay-1">
          Mengapa Kalian Adalah
          <br />
          <em>Seluruh Duniaku</em>
        </h2>

        {/* Cards Grid */}
        <div className="reasons-grid">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className={`reason-card glass reveal reveal-delay-${Math.min(index + 1, 5)}`}
            >
              <div className="reason-card-glow" aria-hidden="true"></div>
              <div className="reason-icon-wrapper" aria-hidden="true">
                <reason.Icon className="reason-icon" />
              </div>
              <h3 className="reason-title">{reason.title}</h3>
              <p className="reason-description">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reasons;
