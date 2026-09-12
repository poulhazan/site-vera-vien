const sharp = require('sharp');
const path = require('path');

async function lineOnlyWarm(inPath, outPath, darkThresh, lightThresh) {
  const img = sharp(inPath);
  const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    const maxAlpha = 225; // cap below 255 so ink sits a bit softer against the page
    let alpha;
    if (lum <= darkThresh) alpha = maxAlpha;
    else if (lum >= lightThresh) alpha = 0;
    else alpha = Math.round(maxAlpha * (1 - (lum - darkThresh) / (lightThresh - darkThresh)));

    out[i * 4] = Math.min(255, lum * 0.55);
    out[i * 4 + 1] = Math.min(255, lum * 0.42);
    out[i * 4 + 2] = Math.min(255, lum * 0.32);
    out[i * 4 + 3] = alpha;
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outPath);
}

async function main() {
  const src = 'My files/content/Artstation/31 - Live Model Drawings - part 2';
  const dst = 'public/assets/images/sketchbook';
  // Widen the dark/light band a bit (55/155 vs old 70/140) to soften the alpha falloff -> less contrast
  await lineOnlyWarm(path.join(src, '011.png'), path.join(dst, 'sketch-18.png'), 55, 155);
  await lineOnlyWarm(path.join(src, '012.png'), path.join(dst, 'sketch-19.png'), 55, 155);
  console.log('done');
}

main().catch(e => { console.error(e); process.exit(1); });
