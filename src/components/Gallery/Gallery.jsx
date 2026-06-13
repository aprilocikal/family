import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Gallery.css';
import { BookOpen, Camera, Gift, Heart, ChevronLeft, ChevronRight, X, Sparkles, Lightbulb } from 'lucide-react';
import { triggerFireworks } from '../../utils/fireworks';

// Import actual family images
import imgUntuk from '../../assets/images/gallery-untuk.webp';
import imgPapa from '../../assets/images/gallery-2.webp';
import imgDan from '../../assets/images/gallery-dan.webp';
import imgBunda from '../../assets/images/gallery-4.webp';
import imgYang from '../../assets/images/gallery-yang.webp';
import imgPaling from '../../assets/images/gallery-paling.webp';
import imgBerharga from '../../assets/images/gallery-berharga.webp';
import imgAnakAnak from '../../assets/images/gallery-anak-anak.webp';

const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%23E2EDF8"/><stop offset="100%" stop-color="%23F7F9FC"/></linearGradient><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23A5C7E6"/><stop offset="100%" stop-color="%238BB0D6"/></linearGradient><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23C2D8ED"/><stop offset="100%" stop-color="%23A9C7E3"/></linearGradient></defs><rect width="400" height="300" fill="url(%23g1)"/><circle cx="280" cy="110" r="25" fill="%23FCE8B2" opacity="0.9"/><circle cx="280" cy="110" r="35" fill="%23FCE8B2" opacity="0.3"/><polygon points="50,300 190,140 310,300" fill="url(%23g3)" opacity="0.8"/><polygon points="130,300 270,110 420,300" fill="url(%23g2)" opacity="0.9"/><g transform="translate(188, 110)" opacity="0.45"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="%233A5C8B"/></g></svg>`;

const SLOT_COUNT = 8;

export default function Gallery() {
  // Each photo: { src: dataURL | null, caption: string, width: number, height: number, isPlaceholder: boolean }
  const [photos, setPhotos] = useState([
    { src: imgUntuk, caption: 'untuk', width: 494, height: 661, objectPosition: 'center 35%', isPlaceholder: false },
    { src: PLACEHOLDER_SVG, caption: 'papa', width: 900, height: 1600, isPlaceholder: true },
    { src: imgDan, caption: 'dan', width: 494, height: 661, objectPosition: 'center 75%', isPlaceholder: false },
    { src: PLACEHOLDER_SVG, caption: 'bunda', width: 1600, height: 1200, isPlaceholder: true },
    { src: imgYang, caption: 'yang', width: 362, height: 654, objectPosition: 'center 45%', isPlaceholder: false },
    { src: imgPaling, caption: 'paling', width: 462, height: 658, objectPosition: 'center 20%', isPlaceholder: false },
    { src: imgBerharga, caption: 'berharga', width: 404, height: 659, objectPosition: 'center 12%', isPlaceholder: false },
    { src: imgAnakAnak, caption: 'selamanya', width: 909, height: 685, objectPosition: 'center center', isPlaceholder: false },
  ]);

  const [columnCount, setColumnCount] = useState(3);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [viewMode, setViewMode] = useState('album'); // 'grid' | 'album'
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null); // 'left' | 'right' | null
  
  const fileInputRefs = useRef([]);
  const sectionRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });

  const activePhotos = photos.filter((p) => p.src);
  const totalCards = [...activePhotos, { isSurprise: true }];

  /* ── Responsive Column Count ── */
  useEffect(() => {
    const updateColumnCount = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setColumnCount(2); // 2 columns on mobile
      } else if (w < 1025) {
        setColumnCount(3); // 3 columns on tablet
      } else {
        setColumnCount(4); // 4 columns on desktop/laptop
      }
    };
    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  /* ── Scroll-reveal ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reveals = section.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach((el) => observer.observe(el));
    return () => reveals.forEach((el) => observer.unobserve(el));
  }, [columnCount, photos, viewMode]);

  /* ── File upload handler with WebP compression ── */
  const handleFileChange = useCallback((index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_DIM = 1000;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const webpDataUrl = canvas.toDataURL('image/webp', 0.8);
          
          setPhotos((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], src: webpDataUrl, width, height, isPlaceholder: false };
            return next;
          });
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSlotClick = useCallback(
    (index) => {
      if (photos[index].src && !photos[index].isPlaceholder) {
        setLightbox({ open: true, index });
      } else {
        fileInputRefs.current[index]?.click();
      }
    },
    [photos]
  );

  /* ── Lightbox helpers ── */
  const filledIndices = photos
    .map((p, i) => (p.src && !p.isPlaceholder ? i : null))
    .filter((i) => i !== null);

  const closeLightbox = useCallback(() => {
    setLightbox({ open: false, index: 0 });
  }, []);

  const navigateLightbox = useCallback(
    (direction) => {
      const currentPos = filledIndices.indexOf(lightbox.index);
      if (currentPos === -1) return;
      const nextPos =
        (currentPos + direction + filledIndices.length) % filledIndices.length;
      setLightbox({ open: true, index: filledIndices[nextPos] });
    },
    [filledIndices, lightbox.index]
  );

  /* ── Keyboard nav for lightbox ── */
  useEffect(() => {
    if (!lightbox.open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox.open, closeLightbox, navigateLightbox]);

  /* ── Lock body scroll when lightbox open ── */
  useEffect(() => {
    if (lightbox.open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightbox.open]);

  /* ── Trigger fireworks immediately when surprise card is active ── */
  useEffect(() => {
    const list = photos.filter((p) => p.src);
    if (list.length > 0 && activeIndex === list.length) {
      triggerFireworks(window.innerWidth / 2, window.innerHeight / 2);
    }
  }, [activeIndex, photos]);

  const currentFilledPos = filledIndices.indexOf(lightbox.index) + 1;

  /* ── 3D Album Drag-and-Swipe Logic ── */
  const triggerSwipe = useCallback((dir) => {
    const list = photos.filter((p) => p.src);
    if (list.length === 0) return;
    const totalCardsCount = list.length + 1; // photos + surprise card

    setSwipeDirection(dir);
    setDragOffset({
      x: dir === 'right' ? 420 : -420,
      y: dragOffset.y + 30,
    });

    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % totalCardsCount);
      setSwipeDirection(null);
      setDragOffset({ x: 0, y: 0 });
    }, 350);
  }, [photos, dragOffset.y]);

  const prevCard = useCallback(() => {
    const list = photos.filter((p) => p.src);
    if (list.length === 0 || swipeDirection) return;
    const totalCardsCount = list.length + 1;
    setActiveIndex((prev) => (prev - 1 + totalCardsCount) % totalCardsCount);
  }, [photos, swipeDirection]);

  const nextCard = useCallback(() => {
    triggerSwipe('right');
  }, [triggerSwipe]);

  const handleDragStart = (e) => {
    if (swipeDirection) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX, y: clientY };
    setIsDragging(true);
  };

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const offsetX = clientX - dragStart.current.x;
    const offsetY = clientY - dragStart.current.y;
    setDragOffset({ x: offsetX, y: offsetY });
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const distance = Math.sqrt(dragOffset.x ** 2 + dragOffset.y ** 2);
    if (distance < 5) {
      // It was a click/tap: Open lightbox or trigger surprise
      const list = photos.filter((p) => p.src);
      const isSurpriseActive = activeIndex === list.length;

      if (isSurpriseActive) {
        window.dispatchEvent(
          new CustomEvent('open-secret-letter', {
            detail: { x: dragStart.current.x, y: dragStart.current.y }
          })
        );
      } else {
        const topPhoto = list[activeIndex];
        if (topPhoto) {
          const origIdx = photos.findIndex((p) => p.src === topPhoto.src);
          if (origIdx !== -1) {
            if (photos[origIdx].isPlaceholder) {
              fileInputRefs.current[origIdx]?.click();
            } else {
              setLightbox({ open: true, index: origIdx });
            }
          }
        }
      }
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    const threshold = 120;
    if (dragOffset.x > threshold) {
      triggerSwipe('right');
    } else if (dragOffset.x < -threshold) {
      triggerSwipe('left');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  }, [isDragging, dragOffset, photos, activeIndex, triggerSwipe]);

  const handleHeartClick = (e) => {
    const list = photos.filter((p) => p.src);
    const isSurpriseActive = activeIndex === list.length;

    if (isSurpriseActive) {
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      window.dispatchEvent(
        new CustomEvent('open-secret-letter', {
          detail: { x: cx, y: cy }
        })
      );
    } else {
      triggerSwipe('right');
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 12;
    const heartColors = ['#4ba5ff', '#70b8ff', '#d1e8ff', '#aad4ff', '#5eb8f5'];
 
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'album-heart-burst';
      const randomColor = heartColors[Math.floor(Math.random() * heartColors.length)];
      heart.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style="color: ${randomColor}"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
      
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5; // Fan upwards
      const dist = 50 + Math.random() * 80;
      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * dist;
      
      heart.style.left = `${cx}px`;
      heart.style.top = `${cy}px`;
      heart.style.setProperty('--hx', `${px}px`);
      heart.style.setProperty('--hy', `${py}px`);
      
      document.body.appendChild(heart);
      
      setTimeout(() => heart.remove(), 1000);
    }
  };

  // Distribute photos into columns using a greedy algorithm for masonry
  const columns = Array.from({ length: columnCount }, () => []);
  const colHeights = Array(columnCount).fill(0);

  photos.forEach((photo, index) => {
    const ratio = photo.width && photo.height ? photo.height / photo.width : 1;
    let minColIdx = 0;
    for (let i = 1; i < columnCount; i++) {
      if (colHeights[i] < colHeights[minColIdx]) {
        minColIdx = i;
      }
    }
    columns[minColIdx].push({ ...photo, originalIndex: index });
    colHeights[minColIdx] += ratio;
  });

  return (
    <section id="gallery" className="gallery-section" ref={sectionRef}>
      <div className="section-inner">
        {/* Header */}
        <div className="gallery-header reveal">
          <p className="section-eyebrow">captured in time</p>
          <h2 className="section-title">
            Beautiful <em>Moments</em>
          </h2>
        </div>

        {/* View Toggle */}
        <div className="gallery-toggle reveal reveal-delay-1">
          <button
            className={`toggle-btn ${viewMode === 'album' ? 'active' : ''}`}
            onClick={() => setViewMode('album')}
          >
            <BookOpen size={16} /> 3D Album
          </button>
          <button
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <Camera size={16} /> Grid View
          </button>
        </div>

        {/* 3D Album Stack View */}
        {viewMode === 'album' && (
          <div className="gallery-album-container reveal reveal-delay-2">
            {activePhotos.length > 0 ? (
              <>
                <div className="gallery-album-stack">
                  {totalCards.map((card, i) => {
                    const d = (i - activeIndex + totalCards.length) % totalCards.length;
                    const isTop = d === 0;
                    
                    if (d > 2) return null;
                    
                    let transformStyle = '';
                    let opacityStyle = 1;
                    let zIndexStyle = 10 - d;
                    
                    if (isTop) {
                      transformStyle = `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.05}deg)`;
                      opacityStyle = 1;
                    } else if (d === 1) {
                      transformStyle = `scale(0.95) translateY(-16px) rotate(2deg)`;
                      opacityStyle = 0.95;
                    } else if (d === 2) {
                      transformStyle = `scale(0.9) translateY(-32px) rotate(-2deg)`;
                      opacityStyle = 0.9;
                    }

                    const isSurpriseCard = card.isSurprise;
                    
                    return (
                      <div
                        key={isSurpriseCard ? 'surprise' : i}
                        className={`gallery-album-card ${isSurpriseCard ? 'polaroid-surprise' : ''} ${isDragging && isTop ? 'dragging' : ''} ${swipeDirection && isTop ? 'swiping' : ''}`}
                        style={{
                          transform: transformStyle,
                          opacity: opacityStyle,
                          zIndex: zIndexStyle,
                          transition: isDragging && isTop ? 'none' : 'transform 0.4s var(--ease-out-expo), opacity 0.4s var(--ease-out-expo)',
                        }}
                        onMouseDown={isTop ? handleDragStart : null}
                        onMouseMove={isTop ? handleDragMove : null}
                        onMouseUp={isTop ? handleDragEnd : null}
                        onMouseLeave={isTop ? handleDragEnd : null}
                        onTouchStart={isTop ? handleDragStart : null}
                        onTouchMove={isTop ? handleDragMove : null}
                        onTouchEnd={isTop ? handleDragEnd : null}
                      >
                        {isSurpriseCard ? (
                          <>
                            <div className="polaroid-surprise-container">
                              <span className="surprise-emoji"><Gift size={64} className="surprise-icon" style={{ color: 'var(--rose-gold)' }} /></span>
                              <div className="surprise-pulse-glow" />
                            </div>
                            <div className="polaroid-caption surprise-caption" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                              open your surprise <Heart size={16} fill="currentColor" style={{ color: 'var(--rose-gold)' }} />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="polaroid-image-container">
                              <img 
                                src={card.src} 
                                alt={card.caption} 
                                draggable="false" 
                                style={{ objectPosition: card.objectPosition || 'center center' }} 
                              />
                            </div>
                            <div className="polaroid-caption">
                              {card.caption || 'moment'}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Controls */}
                <div className="gallery-album-controls">
                  <button className="album-ctrl-btn prev" onClick={prevCard} aria-label="Previous photo">
                    <ChevronLeft size={24} />
                  </button>
                  <button className="album-ctrl-btn heart" onClick={handleHeartClick} aria-label="Love photo">
                    <Heart size={28} fill="currentColor" style={{ color: 'var(--blush)' }} />
                  </button>
                  <button className="album-ctrl-btn next" onClick={nextCard} aria-label="Next photo">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </>
            ) : (
              <div className="gallery-album-empty">
                <span className="empty-icon-wrapper"><Camera size={48} style={{ color: 'var(--rose-gold)', marginBottom: '16px' }} /></span>
                <p>No photos in your album yet!</p>
                <button className="btn-rose" onClick={() => setViewMode('grid')}>
                  Go to Grid View
                </button>
              </div>
            )}

            <p className="album-tip" style={{ display: 'block' }}>
              swipe left/right or tap photo for fullscreen view <Sparkles size={14} className="inline-icon" style={{ display: 'inline-block', verticalAlign: 'middle', color: 'var(--rose-gold)' }} />
              <br />
              <span className="album-tip-sub">
                <Lightbulb size={12} className="inline-icon" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px', color: 'var(--gold-shimmer)' }} /> Switch to <strong>Grid View</strong> to add or change photos!
              </span>
            </p>
          </div>
        )}

        {/* Masonry Grid View */}
        {viewMode === 'grid' && (
          <div className="gallery-grid-wrapper reveal reveal-delay-2">
            <div className="gallery-grid">
              {columns.map((column, colIdx) => (
                <div key={colIdx} className="gallery-column">
                  {column.map((photo) => (
                    <div
                      key={photo.originalIndex}
                      className={`gallery-card reveal reveal-delay-${(photo.originalIndex % 5) + 1}`}
                      onClick={() => handleSlotClick(photo.originalIndex)}
                      style={{
                        aspectRatio: photo.width && photo.height ? `${photo.width} / ${photo.height}` : '1 / 1'
                      }}
                    >
                      {photo.src && !photo.isPlaceholder ? (
                        <div className="gallery-image-wrapper">
                          <img
                            src={photo.src}
                            alt={photo.caption}
                            className="gallery-image"
                            loading="lazy"
                          />
                          <div className="gallery-caption">{photo.caption}</div>
                        </div>
                      ) : (
                        <div className="gallery-placeholder">
                          <span className="gallery-placeholder-emoji"><Camera size={36} style={{ color: 'rgba(94, 184, 245, 0.4)' }} /></span>
                          <span className="gallery-placeholder-text">
                            tap to add photo
                          </span>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        className="gallery-file-input"
                        ref={(el) => (fileInputRefs.current[photo.originalIndex] = el)}
                        onChange={(e) => handleFileChange(photo.originalIndex, e)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox.open && photos[lightbox.index]?.src && (
        <div
          className="gallery-lightbox"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <button
            className="gallery-lightbox-close"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>
 
          {filledIndices.length > 1 && (
            <>
              <button
                className="gallery-lightbox-nav prev"
                onClick={() => navigateLightbox(-1)}
                aria-label="Previous photo"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className="gallery-lightbox-nav next"
                onClick={() => navigateLightbox(1)}
                aria-label="Next photo"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <img
            src={photos[lightbox.index].src}
            alt={photos[lightbox.index].caption}
            className="gallery-lightbox-image"
          />

          {filledIndices.length > 1 && (
            <div className="gallery-lightbox-counter">
              {currentFilledPos} / {filledIndices.length}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
