import { useEffect, useRef } from 'react';
import './LoveLetter.css';
import { Flower, Flower2, Heart } from 'lucide-react';

const LoveLetter = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const revealEls = sectionRef.current?.querySelectorAll('.reveal');
      if (!revealEls) return;

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
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="message" className="love-letter-section" ref={sectionRef}>
      {/* Floating petals around the card */}
      <div className="ll-petal ll-petal-1" aria-hidden="true" style={{ color: 'var(--rose-gold)' }}><Flower size={18} /></div>
      <div className="ll-petal ll-petal-2" aria-hidden="true" style={{ color: 'var(--blush)' }}><Flower2 size={18} /></div>
      <div className="ll-petal ll-petal-3" aria-hidden="true" style={{ color: 'var(--rose-gold)' }}><Flower size={18} /></div>
      <div className="ll-petal ll-petal-4" aria-hidden="true" style={{ color: 'var(--blush)' }}><Flower2 size={18} /></div>
      <div className="ll-petal ll-petal-5" aria-hidden="true" style={{ color: 'var(--rose-gold)' }}><Flower size={18} /></div>
      <div className="ll-petal ll-petal-6" aria-hidden="true" style={{ color: 'var(--blush)' }}><Flower2 size={18} /></div>

      <div className="section-inner">
        <div className="love-letter-card glass reveal">
          {/* Top flower decoration */}
          <div className="ll-top-flowers">
            <span className="ll-flower ll-flower-1" style={{ color: 'var(--rose-gold)', display: 'inline-flex' }}><Flower size={20} /></span>
            <span className="ll-flower ll-flower-2" style={{ color: 'var(--blush)', display: 'inline-flex' }}><Flower2 size={24} /></span>
            <span className="ll-flower ll-flower-3" style={{ color: 'var(--rose-gold)', display: 'inline-flex' }}><Flower size={20} /></span>
          </div>

          {/* Eyebrow */}
          <span className="section-eyebrow reveal reveal-delay-1">
            a letter of endless gratitude
          </span>

          {/* Title */}
          <h2 className="section-title ll-title reveal reveal-delay-2">
            To My Beloved Parents
            <br />
            <em>You Are My Home</em>
          </h2>

          {/* Decorative divider */}
          <div className="ll-divider reveal reveal-delay-2">
            <span></span>
            <span className="ll-divider-heart">💙</span>
            <span></span>
          </div>

          {/* Body paragraphs */}
          <div className="ll-body">
            <p className="ll-paragraph reveal reveal-delay-3">
              Papa & Bunda, di dalam semesta yang begitu luas dengan segala kesibukannya,
              kalian adalah pelabuhan terbaik tempatku pulang. Terima kasih atas setiap peluh,
              doa yang tak pernah putus, dan kasih sayang tanpa syarat yang telah mendewasakanku.
              Setiap langkah yang kujalani hari ini adalah berkat ketulusan, kesabaran, dan
              pengorbanan yang tak terhingga yang telah kalian berikan sepanjang hidup kalian.
            </p>
            <p className="ll-paragraph reveal reveal-delay-4">
              Setiap momen bersama kalian adalah pengingat bahwa cinta yang paling tulus adalah
              cinta orang tua kepada anaknya. Kalian adalah cahaya penuntun saat duniaku terasa gelap,
              dan penyemangat terbaik di setiap jatuh bangun hidupku. Aku sangat bersyukur terlahir
              sebagai anak kalian, dan aku berharap bisa membuat kalian bangga serta bahagia.
            </p>
          </div>

          {/* Signature */}
          <p className="ll-signature reveal reveal-delay-5">
            Dengan segenap rasa sayang <Heart size={16} fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px', color: 'var(--rose-gold)' }} />
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoveLetter;
