import sharp from 'sharp';

async function fixAlpha(path) {
  const img = sharp(path).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const isNeutral = (max - min) < 8;
    const isBright = min > 233;
    if (isNeutral && isBright) {
      data[i + 3] = 0;
    }
  }
  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(path);
}

const files = process.argv.slice(2);
for (const f of files) {
  await fixAlpha(f);
  console.log('fixed', f);
}
