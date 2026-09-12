import sharp from 'sharp';

const [input, output, width] = process.argv.slice(2);
await sharp(input)
  .rotate()
  .resize({ width: Number(width) || 900, withoutEnlargement: true })
  .jpeg({ quality: 84 })
  .toFile(output);
console.log('done', output);
