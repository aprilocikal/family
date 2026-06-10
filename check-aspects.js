import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const TARGET_DIR = path.join(process.cwd(), 'src', 'assets', 'images');

async function checkAspectRatios() {
  const files = fs.readdirSync(TARGET_DIR).filter(f => f.endsWith('.webp'));
  for (const file of files) {
    const meta = await sharp(path.join(TARGET_DIR, file)).metadata();
    const ratio = meta.width / meta.height;
    console.log(`${file}: ${meta.width}x${meta.height} (Ratio: ${ratio.toFixed(2)}) - ${ratio > 1.2 ? 'LANDSCAPE' : ratio < 0.85 ? 'PORTRAIT' : 'SQUARE'}`);
  }
}

checkAspectRatios().catch(console.error);
