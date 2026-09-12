import sharp from 'sharp';

function toHex(c) {
  return '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function kmeans(pixels, k, iterations = 12) {
  let centroids = [];
  const used = new Set();
  while (centroids.length < k) {
    const idx = Math.floor(Math.random() * pixels.length);
    if (used.has(idx)) continue;
    used.add(idx);
    centroids.push(pixels[idx].slice());
  }
  let assignments = new Array(pixels.length).fill(0);
  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < pixels.length; i++) {
      let best = 0, bestDist = Infinity;
      for (let c = 0; c < k; c++) {
        const dr = pixels[i][0] - centroids[c][0];
        const dg = pixels[i][1] - centroids[c][1];
        const db = pixels[i][2] - centroids[c][2];
        const dist = dr * dr + dg * dg + db * db;
        if (dist < bestDist) { bestDist = dist; best = c; }
      }
      assignments[i] = best;
    }
    const sums = Array.from({ length: k }, () => [0, 0, 0, 0]);
    for (let i = 0; i < pixels.length; i++) {
      const c = assignments[i];
      sums[c][0] += pixels[i][0];
      sums[c][1] += pixels[i][1];
      sums[c][2] += pixels[i][2];
      sums[c][3] += 1;
    }
    for (let c = 0; c < k; c++) {
      if (sums[c][3] > 0) {
        centroids[c] = [sums[c][0] / sums[c][3], sums[c][1] / sums[c][3], sums[c][2] / sums[c][3]];
      }
    }
  }
  const counts = new Array(k).fill(0);
  for (const a of assignments) counts[a]++;
  return centroids.map((c, i) => ({ color: c, count: counts[i] }));
}

async function extract(path, k = 5) {
  const { data, info } = await sharp(path)
    .resize(120, 68, { fit: 'inside' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixels = [];
  for (let i = 0; i < data.length; i += info.channels) {
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }
  const clusters = kmeans(pixels, k, 14);
  clusters.sort((a, b) => b.count - a.count);
  return clusters.map((c) => toHex(c.color));
}

const files = process.argv.slice(2);
for (const f of files) {
  const hexes = await extract(f, 5);
  console.log(f, '->', hexes.join(', '));
}
