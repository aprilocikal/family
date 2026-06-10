import { useEffect, useRef } from 'react';
import './Reasons.css';
import { Smile, Sun, Heart, Laugh, Flame, Sparkles } from 'lucide-react';

const reasons = [
  {
    icon: Smile,
    color: '#ff70a6',
    title: 'Your Smile',
    description:
      'The one that lights up my darkest days and makes everything worthwhile.',
  },
  {
    icon: Sun,
    color: '#ffd700',
    title: 'Your Soul',
    description:
      'Rare, luminous, and more precious than anything this world has to offer.',
  },
  {
    icon: Heart,
    color: '#ff4b82',
    title: 'Your Kindness',
    description:
      'The way you care for everyone around you makes this world a better place.',
  },
  {
    icon: Laugh,
    color: '#ffd1e6',
    title: 'Your Laughter',
    description:
      'My favourite sound in the universe. It echoes in my heart forever.',
  },
  {
    icon: Flame,
    color: '#ff9f1c',
    title: 'Your Strength',
    description:
      'You face every storm with grace. I admire you more each day.',
  },
  {
    icon: Sparkles,
    color: '#e0aaff',
    title: 'Simply You',
    description:
      'Every version of you is perfect. You are more than enough. You are everything.',
  },
];

const Reasons = () => {
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
      { threshold: 0.1 }
    );

    const revealEls = sectionRef.current?.querySelectorAll('.reveal');
    revealEls?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="reasons" className="reasons-section" ref={sectionRef}>
      <div className="section-inner">
        {/* Header */}
        <span className="section-eyebrow reveal">
          a thousand reasons and counting
        </span>
        <h2 className="section-title reveal reveal-delay-1">
          Why You Are
          <br />
          <em>So Special</em>
        </h2>

        {/* Cards Grid */}
        <div className="reasons-grid">
            {reasons.map((reason, index) => {
              const IconComponent = reason.icon;
              return (
                <div
                  key={reason.title}
                  className={`reason-card glass reveal reveal-delay-${Math.min(index + 1, 5)}`}
                >
                  <div className="reason-card-glow" aria-hidden="true"></div>
                  <span className="reason-emoji" aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', color: reason.color }}>
                    <IconComponent size={40} />
                  </span>
                  <h3 className="reason-title">{reason.title}</h3>
                  <p className="reason-description">{reason.description}</p>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Reasons;
