import { useEffect, useRef } from 'react';
import './LoveLetter.css';
import { Flower, Flower2, Heart } from 'lucide-react';

const LoveLetter = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealEls = sectionRef.current?.querySelectorAll('.reveal');
    revealEls?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="message" className="love-letter-section" ref={sectionRef}>
      {/* Floating petals around the card */}
      <div className="ll-petal ll-petal-1" aria-hidden="true" style={{ color: 'var(--rose-gold)' }}><Flower size={18} /></div>
      <div className="ll-petal ll-petal-2" aria-hidden="true" style={{ color: 'var(--blush)' }}><Flower2 size={18} /></div>
      <div className="ll-petal ll-petal-3" aria-hidden="true">✿</div>
      <div className="ll-petal ll-petal-4" aria-hidden="true">❀</div>
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
            from the bottom of my heart
          </span>

          {/* Title */}
          <h2 className="section-title ll-title reveal reveal-delay-2">
            In This World of Billions
            <br />
            <em>I Found You</em>
          </h2>

          {/* Decorative divider */}
          <div className="ll-divider reveal reveal-delay-2">
            <span></span>
            <span className="ll-divider-heart">♥</span>
            <span></span>
          </div>

          {/* Body paragraphs */}
          <div className="ll-body">
            <p className="ll-paragraph reveal reveal-delay-3">
              Naylin, in a universe filled with endless faces and fleeting moments, 
              you are the one my soul recognized before my eyes ever found you. 
              You make the ordinary feel sacred. A quiet morning, a simple glance, 
              or a shared silence, all of it becomes poetry when you are near. 
              I never knew that someone could hold the power to make the whole world 
              feel softer, warmer, and infinitely more beautiful just by existing.
            </p>
            <p className="ll-paragraph reveal reveal-delay-4">
              Every day with you is a reminder that some things in life are too 
              precious to be explained, they can only be felt. You are my calm 
              in the chaos, my light when the world goes dark, and the reason I 
              believe that love is not just a word but a living, breathing miracle. 
              I don't just love you for who you are, I love who I become when I'm 
              with you. You are, and will always be, my most beautiful discovery.
            </p>
          </div>

          {/* Signature */}
          <p className="ll-signature reveal reveal-delay-5">
            From someone who adores you <Heart size={16} fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px', color: 'var(--rose-gold)' }} />
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoveLetter;
