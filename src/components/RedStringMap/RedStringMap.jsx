/* ============================================================
   📍 RedStringMap — Connected by the Red String
   ============================================================ */
import { useState, useEffect, useRef } from 'react';
import './RedStringMap.css';
import { MapPin, Heart } from 'lucide-react';

export default function RedStringMap() {
  const [hoveredNode, setHoveredNode] = useState(null); // null | 'depok' | 'bekasi'
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.querySelectorAll('.reveal').forEach((r) => r.classList.add('visible'));
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="destiny-map" className="destiny-map-section" ref={sectionRef}>
      <div className="section-inner">
        <p className="section-eyebrow reveal">two cities, one thread of fate</p>
        <h2 className="section-title reveal reveal-delay-1">
          Connected by the <em>Red String</em>
        </h2>

        <div className="map-container glass reveal reveal-delay-2">
          {/* Constellation Grid Overlay */}
          <div className="map-grid-overlay" />

          {/* Map Info Panel */}
          <div className="map-info-panel">
            <div className="map-node-card">
              <div className="node-header">
                <MapPin className="pin-depok" size={18} />
                <span>Depok</span>
              </div>
              <span className="node-coords">6.4025° S, 106.7942° E</span>
              <p className="node-desc">Where my thoughts start and drift towards you every single day.</p>
            </div>

            <div className="map-connection-stats">
              <div className="stat-item">
                <span className="stat-label">Geographic Distance</span>
                <span className="stat-val">~28.5 km</span>
              </div>
              <div className="connection-line-indicator">
                <Heart className="beating-heart" size={16} fill="currentColor" />
              </div>
              <div className="stat-item">
                <span className="stat-label">Heart Distance</span>
                <span className="stat-val">0 km</span>
              </div>
            </div>

            <div className="map-node-card">
              <div className="node-header">
                <MapPin className="pin-bekasi" size={18} />
                <span>Bekasi</span>
              </div>
              <span className="node-coords">6.2383° S, 106.9756° E</span>
              <p className="node-desc">Where you shine bright, making the distance feel like nothing.</p>
            </div>
          </div>

          {/* Interactive Map Visualizer */}
          <div className="map-visualizer">
            <svg viewBox="0 0 900 600" className="map-svg">
              <defs>
                <filter id="string-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Java Island Coastline & Landmass */}
              <path
                d="M 80,310 C 80,290 95,270 110,265 C 130,260 145,280 165,275 C 185,270 195,250 215,250 C 235,250 250,270 270,270 C 310,270 350,290 390,285 C 410,280 430,250 455,240 C 475,230 490,245 490,265 C 490,285 520,295 550,295 C 600,295 640,280 670,275 C 685,270 695,285 710,290 C 730,295 765,285 780,300 C 795,315 805,325 805,335 C 805,345 790,355 775,355 C 750,355 720,345 690,345 C 660,345 630,355 600,355 C 550,355 510,345 470,345 C 430,345 390,360 350,360 C 310,360 270,375 240,365 C 210,355 170,365 140,360 C 110,355 90,345 80,335 Z"
                className="landmass"
              />

              {/* Madura Island */}
              <path
                d="M 680,255 C 700,250 730,250 750,255 C 760,258 760,262 750,265 C 730,270 700,270 680,265 C 670,262 670,258 680,255 Z"
                className="landmass"
              />

              {/* Bali Island */}
              <path
                d="M 815,335 L 835,330 L 845,345 L 825,350 Z"
                className="landmass"
              />

              {/* Map Watermark Label */}
              <text x="80" y="550" className="map-watermark">JAVA ISLAND</text>

              {/* Grid Lines */}
              <line x1="100" y1="0" x2="100" y2="600" className="grid-line" />
              <line x1="300" y1="0" x2="300" y2="600" className="grid-line" />
              <line x1="500" y1="0" x2="500" y2="600" className="grid-line" />
              <line x1="700" y1="0" x2="700" y2="600" className="grid-line" />
              <line x1="0" y1="150" x2="900" y2="150" className="grid-line" />
              <line x1="0" y1="300" x2="900" y2="300" className="grid-line" />
              <line x1="0" y1="450" x2="900" y2="450" className="grid-line" />

              {/* Contextual City Markers */}
              <g className="context-city">
                <circle cx="220" cy="280" r="3.5" />
                <text x="220" y="270">Jakarta</text>
              </g>
              <g className="context-city">
                <circle cx="260" cy="335" r="3" />
                <text x="260" y="350">Bandung</text>
              </g>
              <g className="context-city">
                <circle cx="450" cy="285" r="3" />
                <text x="450" y="275">Semarang</text>
              </g>
              <g className="context-city">
                <circle cx="435" cy="335" r="3" />
                <text x="435" y="350">Yogyakarta</text>
              </g>
              <g className="context-city">
                <circle cx="680" cy="295" r="3.5" />
                <text x="680" y="287">Surabaya</text>
              </g>

              {/* Stylized background radar circles */}
              <circle cx="200" cy="330" r="40" className="radar-circle radar-1" />
              <circle cx="200" cy="330" r="90" className="radar-circle radar-2" />
              <circle cx="270" cy="290" r="40" className="radar-circle radar-1" />
              <circle cx="270" cy="290" r="90" className="radar-circle radar-2" />

              {/* Connecting Red String */}
              {/* Outer Glow */}
              <path
                d="M 200 330 C 220 280, 250 310, 270 290"
                className="red-string-glow"
                filter="url(#string-glow)"
              />
              {/* Main Line */}
              <path
                d="M 200 330 C 220 280, 250 310, 270 290"
                className="red-string"
              />
              {/* Flowing Dash */}
              <path
                d="M 200 330 C 220 280, 250 310, 270 290"
                className="red-string-flow"
              />

              {/* Node: Depok */}
              <g 
                className={`map-node ${hoveredNode === 'depok' ? 'active' : ''}`}
                onMouseEnter={() => setHoveredNode('depok')}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle cx="200" cy="330" r="14" className="node-bg" />
                <circle cx="200" cy="330" r="6" className="node-core" />
                <foreignObject x="100" y="355" width="200" height="80">
                  <div className="node-label-svg text-left">
                    <h5>Depok 📍</h5>
                    <p>6.4025° S</p>
                  </div>
                </foreignObject>
              </g>

              {/* Node: Bekasi */}
              <g 
                className={`map-node ${hoveredNode === 'bekasi' ? 'active' : ''}`}
                onMouseEnter={() => setHoveredNode('bekasi')}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle cx="270" cy="290" r="14" className="node-bg" />
                <circle cx="270" cy="290" r="6" className="node-core" />
                <foreignObject x="170" y="210" width="200" height="80">
                  <div className="node-label-svg text-right">
                    <h5>📍 Bekasi</h5>
                    <p>6.2383° S</p>
                  </div>
                </foreignObject>
              </g>
            </svg>

            {/* Motion Path Floating Hearts */}
            <div className="motion-hearts-container">
              <span className="flowing-heart">💖</span>
              <span className="flowing-heart">💕</span>
              <span className="flowing-heart">🌸</span>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <p className="map-quote reveal reveal-delay-3">
          "Distance is just a number, but this red string will always lead me to you."
        </p>
      </div>
    </section>
  );
}
