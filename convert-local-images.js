/**
 * 🖼️ Image to WebP Converter Utility
 * This script scans the project's image directory and converts all JPG, JPEG, and PNG images
 * into WebP format for optimal performance and lightweight page loads.
 * 
 * Usage:
 * 1. Open terminal in project root
 * 2. Run: node convert-local-images.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const TARGET_DIR = path.join(process.cwd(), 'src', 'assets', 'images');

// Ensure sharp is installed
try {
  console.log('Checking for "sharp" image processor...');
  await import('sharp');
} catch (e) {
  console.log('"sharp" is not installed. Installing sharp dynamically...');
  try {
    execSync('npm install sharp --no-save', { stdio: 'inherit' });
    console.log('"sharp" installed successfully!');
  } catch (err) {
    console.error('Failed to install sharp. Please run: npm install sharp');
    process.exit(1);
  }
}

const sharp = (await import('sharp')).default;

async function convertImages() {
  if (!fs.existsSync(TARGET_DIR)) {
    console.log(`Directory does not exist: ${TARGET_DIR}`);
    return;
  }

  const files = fs.readdirSync(TARGET_DIR);
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.tiff', '.gif'];
  
  let convertedCount = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (imageExtensions.includes(ext)) {
      const inputPath = path.join(TARGET_DIR, file);
      const outputName = path.basename(file, ext) + '.webp';
      const outputPath = path.join(TARGET_DIR, outputName);

      // Skip if WebP version already exists and is newer
      if (fs.existsSync(outputPath)) {
        const inputStat = fs.statSync(inputPath);
        const outputStat = fs.statSync(outputPath);
        if (outputStat.mtime > inputStat.mtime) {
          console.log(`- Skipping ${file} (WebP version is up to date)`);
          continue;
        }
      }

      console.log(`⚡ Converting ${file} to WebP...`);
      try {
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        
        console.log(`✅ Converted: ${outputName} (Quality: 80)`);
        convertedCount++;
      } catch (err) {
        console.error(`❌ Error converting ${file}:`, err.message);
      }
    }
  }

  console.log(`\n🎉 Image conversion completed! Converted ${convertedCount} images.`);
}

convertImages().catch((err) => {
  console.error('An error occurred during conversion:', err);
});
