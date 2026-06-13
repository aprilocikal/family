/* ============================================================
   🎨 Scorecard Generator — Client-side Image Creation
   ============================================================ */

export function generateScorecard({ gameTitle, subtitle, stats, message }) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Background gradient (bright light blue to white)
  const grad = ctx.createRadialGradient(400, 300, 50, 400, 300, 550);
  grad.addColorStop(0, '#FFFFFF'); // Pure white center
  grad.addColorStop(0.5, '#F0F6FC'); // Light blue-grey
  grad.addColorStop(1, '#D0E3FF'); // Light sky blue outer
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 600);

  // 2. Ambient shimmery background circles
  ctx.fillStyle = 'rgba(0, 118, 255, 0.06)';
  ctx.beginPath();
  ctx.arc(200, 150, 80, 0, Math.PI * 2);
  ctx.arc(600, 450, 100, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(75, 165, 255, 0.04)';
  ctx.beginPath();
  ctx.arc(400, 300, 150, 0, Math.PI * 2);
  ctx.fill();

  // Draw flares
  const drawStar = (x, y, r, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - r, y);
    ctx.lineTo(x + r, y);
    ctx.moveTo(x, y - r);
    ctx.lineTo(x, y + r);
    ctx.stroke();
  };
  drawStar(120, 140, 10, 'rgba(0, 118, 255, 0.4)');
  drawStar(680, 160, 14, 'rgba(75, 165, 255, 0.35)');
  drawStar(150, 450, 8, 'rgba(75, 165, 255, 0.35)');
  drawStar(620, 480, 10, 'rgba(0, 118, 255, 0.4)');

  // 3. Double royal border
  ctx.strokeStyle = '#0076FF'; // Primary blue
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, 740, 540);

  ctx.strokeStyle = 'rgba(0, 118, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, 720, 520);

  // Corner brackets
  ctx.fillStyle = '#0076FF';
  const cSize = 15;
  // Top-left
  ctx.fillRect(27, 27, cSize, 6);
  ctx.fillRect(27, 27, 6, cSize);
  // Top-right
  ctx.fillRect(773 - cSize, 27, cSize, 6);
  ctx.fillRect(767, 27, 6, cSize);
  // Bottom-left
  ctx.fillRect(27, 567, cSize, 6);
  ctx.fillRect(27, 567 - cSize, 6, cSize);
  // Bottom-right
  ctx.fillRect(773 - cSize, 567, cSize, 6);
  ctx.fillRect(767, 567 - cSize, 6, cSize);

  // 4. Heart Emblem at top
  const hx = 400, hy = 110;
  ctx.fillStyle = '#0076FF';
  ctx.beginPath();
  // Draw simple vectors for heart
  ctx.arc(hx - 12, hy, 12, Math.PI, 0, false);
  ctx.arc(hx + 12, hy, 12, Math.PI, 0, false);
  ctx.lineTo(hx, hy + 24);
  ctx.closePath();
  ctx.fill();

  // 5. Titles
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.fillStyle = '#1E3B70'; // Rich navy
  ctx.font = "bold 32px Georgia, serif";
  ctx.fillText(gameTitle, 400, 180);

  ctx.fillStyle = '#0076FF'; // Vibrant primary blue
  ctx.font = "italic 20px Georgia, serif";
  ctx.fillText(subtitle, 400, 220);

  // Divider
  ctx.strokeStyle = 'rgba(0, 118, 255, 0.2)';
  ctx.beginPath();
  ctx.moveTo(300, 250);
  ctx.lineTo(500, 250);
  ctx.stroke();

  // 6. Stats card plate
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'; // Solid white glass
  ctx.strokeStyle = 'rgba(0, 118, 255, 0.18)';
  ctx.lineWidth = 1.5;
  const pWidth = 440;
  const pHeight = 110;
  const px = 400 - pWidth / 2;
  const py = 280;
  
  // Custom rounded rectangle drawing
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(px, py, pWidth, pHeight, 14) : ctx.rect(px, py, pWidth, pHeight);
  ctx.fill();
  ctx.stroke();

  // Stats columns
  const columns = Object.entries(stats);
  if (columns.length === 1) {
    const [label, val] = columns[0];
    ctx.fillStyle = 'rgba(26, 46, 84, 0.6)';
    ctx.font = "12px Arial, sans-serif";
    ctx.fillText(label.toUpperCase(), 400, 310);
    
    ctx.fillStyle = '#0076FF';
    ctx.font = "bold 42px Georgia, serif";
    ctx.fillText(val, 400, 345);
  } else if (columns.length === 2) {
    // Col 1
    const [label1, val1] = columns[0];
    ctx.fillStyle = 'rgba(26, 46, 84, 0.6)';
    ctx.font = "12px Arial, sans-serif";
    ctx.fillText(label1.toUpperCase(), 290, 310);
    
    ctx.fillStyle = '#0076FF';
    ctx.font = "bold 34px Georgia, serif";
    ctx.fillText(val1, 290, 345);

    // Col 2
    const [label2, val2] = columns[1];
    ctx.fillStyle = 'rgba(26, 46, 84, 0.6)';
    ctx.font = "12px Arial, sans-serif";
    ctx.fillText(label2.toUpperCase(), 510, 310);
    
    ctx.fillStyle = '#0076FF';
    ctx.font = "bold 34px Georgia, serif";
    ctx.fillText(val2, 510, 345);

    // Center plate divider
    ctx.strokeStyle = 'rgba(0, 118, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(400, 292);
    ctx.lineTo(400, 378);
    ctx.stroke();
  }

  // 7. Message
  ctx.fillStyle = '#1A2E54';
  ctx.font = "italic 18px Georgia, serif";
  ctx.fillText(message, 400, 440);

  // 8. Watermark
  ctx.fillStyle = 'rgba(26, 46, 84, 0.5)';
  ctx.font = "14px Arial, sans-serif";
  ctx.fillText("Dibuat dengan segenap cinta untuk Papa & Bunda 💙", 400, 520);

  return canvas.toDataURL('image/png');
}
