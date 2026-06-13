/* ============================================================
   🎨 ScorecardModal — Share/Download Scorecard Image
   ============================================================ */
import { useState } from 'react';
import { X, Download, Share2, Copy, Check } from 'lucide-react';
import './ScorecardModal.css';

// Custom WhatsApp Logo SVG
const WhatsAppIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path d="M12.004 2C6.48 2 2.001 6.477 2.001 12c0 1.891.526 3.66 1.438 5.176l-1.42 5.181 5.302-1.39A9.954 9.954 0 0 0 12.004 22c5.522 0 10.002-4.477 10.002-10S17.526 2 12.004 2zm5.794 14.153c-.244.688-1.218 1.25-1.72 1.298-.465.044-.925.215-2.964-.595-2.607-1.034-4.25-3.69-4.38-3.864-.13-.174-1.047-1.391-1.047-2.654 0-1.263.66-1.884.896-2.128.235-.244.512-.305.683-.305.17 0 .341.002.489.009.153.007.359-.058.563.44.209.508.716 1.742.778 1.868.062.127.104.275.02.443-.083.167-.125.275-.25.42-.125.146-.263.327-.375.439-.126.126-.258.263-.112.513.146.25.648 1.07 1.391 1.732.955.85 1.758 1.112 2.008 1.238.25.126.396.105.543-.062.146-.168.627-.729.794-.979.167-.25.333-.209.563-.125.23.084 1.46.688 1.71.813.25.125.417.188.479.292.062.105.062.605-.182 1.293z" />
  </svg>
);

export default function ScorecardModal({
  isOpen,
  onClose,
  scorecardUrl,
  gameTitle,
  captionText,
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `${gameTitle.toLowerCase().replace(/\s+/g, '-')}-scorecard.png`;
    link.href = scorecardUrl;
    link.click();
  };

  const handleNativeShare = async () => {
    try {
      const response = await fetch(scorecardUrl);
      const blob = await response.blob();
      const file = new File([blob], 'scorecard.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: gameTitle,
          text: captionText,
        });
      } else {
        await navigator.clipboard.writeText(`${captionText} Mainkan juga di: ${window.location.origin + window.location.pathname}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        alert(
          'Perangkat Anda tidak mendukung berbagi file secara langsung. Keterangan teks telah disalin ke papan klip! Anda dapat mengunduh gambar dan mengunggahnya secara manual ke WhatsApp. 💙'
        );
      }
    } catch (err) {
      console.error('Sharing failed', err);
      navigator.clipboard.writeText(`${captionText} Mainkan juga di: ${window.location.origin + window.location.pathname}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      alert(
        'Gagal membagikan secara otomatis. Keterangan teks telah disalin ke papan klip! Silakan unduh gambar dan bagikan secara manual di WhatsApp. 💙'
      );
    }
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(`${captionText} Mainkan juga di: ${window.location.origin + window.location.pathname}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const shareUrl = window.location.origin + window.location.pathname;
    const textToCopy = `${captionText} Mainkan juga di: ${shareUrl}`;
    
    // Copy text automatically for easier pasting
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => console.log(err));

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textToCopy)}`, '_blank');
  };

  return (
    <div className="scorecard-modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="scorecard-modal-content">
        <div className="scorecard-modal-header">
          <h4 className="scorecard-modal-title">Bagikan Hasil Foto</h4>
          <button className="scorecard-close-btn" onClick={onClose} aria-label="Tutup">
            <X size={20} />
          </button>
        </div>

        <div className="scorecard-preview-container">
          <img src={scorecardUrl} alt="Scorecard Preview" className="scorecard-preview-img" />
        </div>

        <div className="scorecard-actions">
          <button className="scorecard-btn scorecard-btn-primary" onClick={handleNativeShare}>
            <Share2 size={16} /> Bagikan Langsung
          </button>

          <div className="scorecard-actions-row">
            <button className="scorecard-btn scorecard-btn-secondary" onClick={handleDownload}>
              <Download size={16} /> Unduh Gambar
            </button>
            <button className="scorecard-btn scorecard-btn-secondary" onClick={handleCopyCaption}>
              {copied ? <Check size={16} style={{ color: '#25D366' }} /> : <Copy size={16} />}
              {copied ? 'Tersalin!' : 'Salin Keterangan'}
            </button>
          </div>

          <button className="scorecard-btn scorecard-btn-wa" onClick={handleWhatsAppShare}>
            <WhatsAppIcon size={16} /> Kirim ke WhatsApp
          </button>
        </div>

        <p className="scorecard-tip">
          💡 <strong>Tips:</strong> Klik <strong>Unduh Gambar</strong> lalu bagikan foto tersebut ke Status WhatsApp Anda bersama keterangan yang telah disalin!
        </p>
      </div>
    </div>
  );
}
