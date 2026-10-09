import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEQUENCE_DIR = path.resolve(__dirname, '../public/hero-sequence');

// Parse CLI arguments: e.g. node convert-frames.mjs --quality 80
const args = process.argv.slice(2);
let quality = 80;
const qIndex = args.indexOf('--quality');
if (qIndex !== -1 && args[qIndex + 1]) {
  quality = parseInt(args[qIndex + 1], 10) || 80;
}

async function convertFrames() {
  console.log(`Starting WebP conversion in: ${SEQUENCE_DIR} (Quality: ${quality})`);
  if (!fs.existsSync(SEQUENCE_DIR)) {
    console.error(`Directory not found: ${SEQUENCE_DIR}`);
    process.exit(1);
  }

  const allFiles = fs.readdirSync(SEQUENCE_DIR);
  // Match ezgif-frame-001.jpg or similar
  const jpgFiles = allFiles
    .filter((f) => /\.(jpe?g)$/i.test(f) && !f.startsWith('frame_'))
    .sort();

  console.log(`Found ${jpgFiles.length} source JPG frames.`);

  let totalJpgBytes = 0;
  let totalWebpBytes = 0;
  let convertedCount = 0;

  for (let i = 0; i < jpgFiles.length; i++) {
    const filename = jpgFiles[i];
    const match = filename.match(/(\d+)/);
    const indexNum = match ? parseInt(match[1], 10) : i + 1;
    const padded = String(indexNum).padStart(3, '0');

    const inputPath = path.join(SEQUENCE_DIR, filename);
    const webpFilename = `frame_${padded}.webp`;
    const jpgFallbackFilename = `frame_${padded}.jpg`;
    const webpPath = path.join(SEQUENCE_DIR, webpFilename);
    const jpgFallbackPath = path.join(SEQUENCE_DIR, jpgFallbackFilename);

    const jpgStat = fs.statSync(inputPath);
    totalJpgBytes += jpgStat.size;

    // Keep JPG with standard zero-padded name for clean fallback
    if (!fs.existsSync(jpgFallbackPath) && inputPath !== jpgFallbackPath) {
      fs.copyFileSync(inputPath, jpgFallbackPath);
    }

    // Convert to WebP quality 80
    await sharp(inputPath)
      .webp({ quality: 80, effort: 4 })
      .toFile(webpPath);

    const webpStat = fs.statSync(webpPath);
    totalWebpBytes += webpStat.size;
    convertedCount++;

    if (convertedCount % 50 === 0 || convertedCount === jpgFiles.length) {
      console.log(`Converted ${convertedCount}/${jpgFiles.length} frames...`);
    }
  }

  const jpgMb = (totalJpgBytes / (1024 * 1024)).toFixed(2);
  const webpMb = (totalWebpBytes / (1024 * 1024)).toFixed(2);
  const savedMb = ((totalJpgBytes - totalWebpBytes) / (1024 * 1024)).toFixed(2);
  const pct = (((totalJpgBytes - totalWebpBytes) / totalJpgBytes) * 100).toFixed(1);

  console.log('\n=============================================');
  console.log('🎉 Frame Conversion Complete!');
  console.log(`Total Frames Converted: ${convertedCount}`);
  console.log(`Original JPG Total Size: ${jpgMb} MB (${totalJpgBytes} bytes)`);
  console.log(`Optimized WebP Total Size: ${webpMb} MB (${totalWebpBytes} bytes)`);
  console.log(`Bandwidth Saved: ${savedMb} MB (${pct}% reduction)`);
  console.log('=============================================\n');
}

convertFrames().catch((err) => {
  console.error('Error during conversion:', err);
  process.exit(1);
});
