/* ============================================================
   🎵 MusicPlayer — Vinyl Record Player
   ============================================================ */
import { useState, useRef, useEffect, useCallback } from 'react';
import './MusicPlayer.css';
import { Play, Pause } from 'lucide-react';
const AUDIO_SRC = '/music/Nadin Amizah - Bertaut (Official Music Video).mp3';

export default function MusicPlayer({ isVisible = true, forcePlay = false }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const forcePlayTriggered = useRef(false);

  /* ── Setup audio element with native event listeners ── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;
    audio.loop = true;

    const handleError = () => {
      setIsDisabled(true);
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      setIsDisabled(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('error', handleError);
    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      
      // Stop playing immediately on unmount to prevent background ghost streams
      audio.pause();
    };
  }, []);

  /* ── Autoplay when forced ── */
  useEffect(() => {
    if (forcePlay && !forcePlayTriggered.current && audioRef.current && !isDisabled) {
      forcePlayTriggered.current = true;
      if (audioRef.current.paused) {
        audioRef.current.play().catch((err) => {
          console.warn("Autoplay blocked or failed:", err);
        });
      }
    }
  }, [forcePlay, isDisabled]);

  /* ── Toggle play / pause ── */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isDisabled) return;

    if (audio.paused) {
      audio.play().catch((err) => {
        console.warn("Play failed:", err);
      });
    } else {
      audio.pause();
    }
  }, [isDisabled]);

  /* ── Build class list ── */
  const containerClasses = [
    'music-player',
    !isVisible && 'music-player--hidden',
    isPlaying && 'music-player--playing',
    isDisabled && 'music-player--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  const vinylClasses = [
    'music-player__vinyl',
    isPlaying ? 'music-player__vinyl--spinning' : 'music-player__vinyl--paused',
  ].join(' ');

  return (
    <div className={containerClasses}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />

      {/* Song info pill */}
      <div className="music-player__info">
        <span className="music-player__song">Bertaut</span>
        <span className="music-player__artist">Nadin Amizah</span>
      </div>

      {/* Vinyl button */}
      <button
        className="music-player__btn"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        title={isDisabled ? 'Audio unavailable' : isPlaying ? 'Pause' : 'Play'}
      >
        <div className={vinylClasses} />
        <div className="music-player__icon-overlay">
          {isPlaying ? (
            <Pause size={11} fill="currentColor" />
          ) : (
            <Play size={11} fill="currentColor" style={{ marginLeft: '1px' }} />
          )}
        </div>
      </button>
    </div>
  );
}
