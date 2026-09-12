// One-off: copies real artwork from "My files/content" into public/assets/images/projects/<slug>/
// using the exact filenames referenced in the project markdown frontmatter.
import fs from "node:fs";
import path from "node:path";

const CONTENT = String.raw`C:\Users\poulh\OneDrive\Bureau\claude\site Vera Vien\My files\content\Artstation`;
const SITEPERSO = String.raw`C:\Users\poulh\OneDrive\Bureau\claude\site Vera Vien\My files\content\siteperso`;
const OUT = String.raw`C:\Users\poulh\OneDrive\Bureau\claude\site Vera Vien\public\assets\images\projects`;

function findDir(base, prefix) {
  const entries = fs.readdirSync(base, { withFileTypes: true });
  const match = entries.find((e) => e.isDirectory() && e.name.startsWith(prefix));
  if (!match) throw new Error(`No folder starting with "${prefix}" in ${base}`);
  return path.join(base, match.name);
}

function copy(srcDir, srcIndex, destDir, destName) {
  const src = path.join(srcDir, String(srcIndex).padStart(3, "0") + ".jpg");
  const dest = path.join(destDir, destName);
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
}

// ---- Flammèche ----
{
  const bg = findDir(CONTENT, "13");
  const affiche = findDir(CONTENT, "11");
  const movie = findDir(CONTENT, "12");
  const art = findDir(CONTENT, "10");
  const dest = path.join(OUT, "flammeche");

  copy(affiche, 1, dest, "poster.jpg");
  copy(movie, 1, dest, "opening.jpg");
  for (let i = 1; i <= 12; i++) {
    const name = i === 5 ? "decor-05-pan.jpg" : `decor-${String(i <= 4 ? i : i - 1).padStart(2, "0")}.jpg`;
    copy(bg, i, dest, name);
  }
  // characters: 8 from "10", split 5 flammeche-char + 3 autre; Ayleen group borrows from Alastair folder (siteperso)
  const alastair = path.join(SITEPERSO, "Conception de personnages", "Alastair");
  for (let i = 1; i <= 7; i++) {
    fs.copyFileSync(path.join(alastair, String(i).padStart(3, "0") + ".jpg"), path.join(dest, `ayleen-${String(i).padStart(2, "0")}.jpg`));
  }
  for (let i = 1; i <= 5; i++) copy(art, i, dest, `flammeche-char-${String(i).padStart(2, "0")}.jpg`);
  for (let i = 6; i <= 8; i++) copy(art, i, dest, `autre-${String(i - 5).padStart(2, "0")}.jpg`);
  for (let i = 9; i <= 20; i++) copy(art, i, dest, `storyboard-${String(i - 8).padStart(2, "0")}.jpg`);
  console.log("Flammèche done");
}

// ---- Eva & Co ----
{
  const src = findDir(CONTENT, "01");
  const dest = path.join(OUT, "eva-and-co");
  copy(src, 1, dest, "opening.jpg");
  copy(src, 2, dest, "planche-01.jpg");
  copy(src, 3, dest, "planche-02.jpg");
  copy(src, 4, dest, "double-page.jpg");
  copy(src, 5, dest, "process-character.jpg");
  copy(src, 6, dest, "process-storyboard.jpg");
  copy(src, 7, dest, "process-color.jpg");
  console.log("Eva & Co done");
}

// ---- HOP! ----
{
  const src = findDir(CONTENT, "04");
  const dest = path.join(OUT, "hop");
  copy(src, 1, dest, "opening.jpg");
  for (let i = 2; i <= 13; i++) copy(src, i, dest, `prop-${String(i - 1).padStart(2, "0")}.jpg`);
  console.log("HOP! done");
}

// ---- Ex-fan des seventies ----
{
  const src = findDir(CONTENT, "06");
  const dest = path.join(OUT, "ex-fan-des-seventies");
  copy(src, 1, dest, "opening.jpg");
  copy(src, 2, dest, "illustration-01.jpg");
  copy(src, 3, dest, "illustration-02.jpg");
  copy(src, 4, dest, "illustration-03.jpg");
  console.log("Ex-fan des seventies done");
}

// ---- Wild Manes ----
{
  const src = findDir(CONTENT, "03");
  const dest = path.join(OUT, "wild-manes");
  copy(src, 1, dest, "opening.jpg");
  for (let i = 2; i <= 8; i++) copy(src, i, dest, `design-${String(i - 1).padStart(2, "0")}.jpg`);
  console.log("Wild Manes done (7 vectorization images, not 12)");
}

// ---- Hilda's World ----
{
  const day = findDir(CONTENT, "17");
  const night = findDir(CONTENT, "16");
  const dest = path.join(OUT, "hildas-world");
  copy(day, 1, dest, "opening.jpg");
  copy(day, 2, dest, "decor-01.jpg");
  copy(night, 1, dest, "decor-02.jpg");
  copy(night, 2, dest, "decor-03.jpg");
  console.log("Hilda's World done (3 decor images, not 4)");
}

console.log("\nAll done.");
