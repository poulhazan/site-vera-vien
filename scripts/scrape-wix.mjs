// One-off scraper for veroniquevien.wixsite.com/portfolio, organized per the
// taxonomy Alexandre requested: one folder per character, one per environment-concept
// project, flat mp4 dump for animation, flat photo dump for object design.
// Uses curl (consistent with the ArtStation scraper) to avoid any bot-fingerprint issues.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const OUT_DIR = String.raw`C:\Users\poulh\OneDrive\Bureau\claude\site Vera Vien\My files\siteperso`;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

function curlDownload(url, destPath) {
  execFileSync("curl", ["-s", "-H", `User-Agent: ${UA}`, "-o", destPath, url]);
  return fs.statSync(destPath).size;
}

function originalWixImageUrl(src) {
  // static.wixstatic.com/media/<filename>/<transform-params...> -> strip transform params
  const m = src.match(/^(https:\/\/static\.wixstatic\.com\/media\/[^/]+)\/.*/);
  return m ? m[1] : src;
}

function ext(url) {
  const clean = url.split("?")[0];
  const e = path.extname(clean);
  return e || ".jpg";
}

// [folder, [ {alt, src} ]]
const CHARACTERS = [
  {
    folder: "Alastair",
    images: [
      "https://static.wixstatic.com/media/cf3f27_145a4b0276274a7781654c85c079d1a5~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_42ae93855efe4d1da26c316bb154646a~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_d189b1ccd1f9490eafc4686efb8091aa~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_e213b2a9a5c5436896400380386702b4~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_7363b1e7cdb94300b6b4b47587fb1918~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_89d3d4affb4f455f8bbfeaa7bae89d79~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_2a3cd4b50ab14ba785e1dc9a41a41a7c~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_7de61a4f5a9e4e7c803578894ea0f011~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_b80a9f98345f48b1894ee5629ae8f0f1~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_2b218677f06f477fbab05de0c7fd77d4~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_6ae55ca919674f2e81adec817c333294~mv2.jpg",
    ],
  },
  {
    folder: "Timmy",
    images: [
      "https://static.wixstatic.com/media/cf3f27_6493d34e1f3e45c4878778834088dff5~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_b3b8a101c0ae48a2a80e6f7ae4740d23~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_e85b0a5e773647c0af90d9178634d72d~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_5a6c75627a9d4d8db06ce66ed742ea74~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_e296655e561a4962a10ec8cdabd5f8fc~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_f6125a1647c542e19dcdbba2fb9b2ddd~mv2.jpg",
    ],
  },
];

const ENVIRONMENT_PROJECTS = [
  {
    folder: "Decor UPA",
    images: ["https://static.wixstatic.com/media/cf3f27_62362aa4512a4859aa4dac9e97e44ea2~mv2.jpg"],
  },
  {
    folder: "Micro Maison",
    images: [
      "https://static.wixstatic.com/media/cf3f27_468392827f6742bda47e91dec172b5f3~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_4530e387d34245bf971e71fbcb1c250c~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_cf1d68d887c9487fb572e2da6c0bf5b1~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_bbcbf0aa7b2544409c7ed4cff085803e~mv2.jpg",
    ],
  },
  {
    folder: "Decor UPA - Grease - 2021",
    images: [
      "https://static.wixstatic.com/media/cf3f27_fabae60acfc240428388a0cd44c79dec~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_5eda5205ebff49ba91f4a1dcc6f9e89d~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_4b6ea61b0fa64857b2ee3d090a7fa911~mv2.jpg",
      "https://static.wixstatic.com/media/cf3f27_b41db23079eb4946aa0da22ffff22a46~mv2.jpg",
    ],
  },
  {
    folder: "Petite-Patrie",
    images: ["https://static.wixstatic.com/media/cf3f27_bd54c78e39074f1f921816b3f795ba0d~mv2.jpg"],
  },
  {
    folder: "Place du Poulhazan",
    images: ["https://static.wixstatic.com/media/cf3f27_adca31143cf8451ca8818fdda0dd847b~mv2.jpg"],
  },
  {
    folder: "Derniere Frontiere",
    images: ["https://static.wixstatic.com/media/cf3f27_98edaa1ca63c49cfbfe60fe7dce862aa~mv2.jpg"],
  },
];

const ANIMATION_VIDEOS = [
  "https://video.wixstatic.com/video/cf3f27_696217d8ddb3454ca4a3b086843ce2a7/720p/mp4/file.mp4",
  "https://video.wixstatic.com/video/cf3f27_9890e531e0154c05b759c6b8f235a3f8/1080p/mp4/file.mp4",
  "https://video.wixstatic.com/video/cf3f27_7cd4ee6fbb814b918d8f6e82b74543f6/480p/mp4/file.mp4",
  "https://video.wixstatic.com/video/cf3f27_06e2b36728f34c1888148595616f9021/720p/mp4/file.mp4",
  "https://video.wixstatic.com/video/cf3f27_1cd88dc107e841f39803213df0410e96/480p/mp4/file.mp4",
  "https://video.wixstatic.com/video/cf3f27_1e627ee7ff274c7fb4367d018675ad2e/480p/mp4/file.mp4",
  "https://video.wixstatic.com/video/cf3f27_dd8376323e304be5a016d0d3fe44f429/360p/mp4/file.mp4",
  "https://video.wixstatic.com/video/cf3f27_7899fd4d01f847a88f35efb2fa1ff6f1/360p/mp4/file.mp4",
  "https://video.wixstatic.com/video/cf3f27_c53c970a0c614d808293ece38db6d4e2/360p/mp4/file.mp4",
];

const OBJECT_DESIGN_PHOTOS = [
  "https://static.wixstatic.com/media/cf3f27_a1e5d0835530465e80ddcbb800398442~mv2_d_5184_3456_s_4_2.jpg",
  "https://static.wixstatic.com/media/cf3f27_b704c732c3e342b89b870542c6416aa0~mv2_d_5184_3456_s_4_2.jpg",
  "https://static.wixstatic.com/media/cf3f27_40207e6fc8b74ccc94538b2bc708e864~mv2_d_5184_3456_s_4_2.jpg",
  "https://static.wixstatic.com/media/cf3f27_c291725155e04a64a1179a4dea3fcea7~mv2_d_5184_3456_s_4_2.jpg",
  "https://static.wixstatic.com/media/cf3f27_072c698255ba4f8c81d5bc617485465d~mv2_d_5184_3456_s_4_2.jpg",
  "https://static.wixstatic.com/media/cf3f27_bf8c8b952bb74ca6881a76bde76de97c~mv2.jpg",
  "https://static.wixstatic.com/media/cf3f27_648bd429d2ad4bfeadf4c095c94ca3ef~mv2.jpg",
  "https://static.wixstatic.com/media/cf3f27_61511847775740448b4004ad77d3a87a~mv2.jpg",
];

function downloadGroup(groups, baseDir) {
  for (const { folder, images } of groups) {
    const dir = path.join(baseDir, folder);
    fs.mkdirSync(dir, { recursive: true });
    console.log(`\n${folder}`);
    images.forEach((src, i) => {
      const origUrl = originalWixImageUrl(src);
      const fileName = `${String(i + 1).padStart(3, "0")}${ext(origUrl)}`;
      const dest = path.join(dir, fileName);
      const size = curlDownload(origUrl, dest);
      console.log(`  - ${fileName} (${(size / 1024).toFixed(0)} KB)`);
    });
  }
}

function downloadFlat(urls, dir, prefix) {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`\n${path.basename(dir)}`);
  urls.forEach((src, i) => {
    const origUrl = src.startsWith("https://static.wixstatic.com/media/") ? originalWixImageUrl(src) : src;
    const fileName = `${prefix}-${String(i + 1).padStart(2, "0")}${ext(origUrl)}`;
    const dest = path.join(dir, fileName);
    const size = curlDownload(origUrl, dest);
    console.log(`  - ${fileName} (${(size / 1024).toFixed(0)} KB)`);
  });
}

console.log("=== Conception de personnages ===");
downloadGroup(CHARACTERS, path.join(OUT_DIR, "Conception de personnages"));

console.log("\n=== Concept d'environnement ===");
downloadGroup(ENVIRONMENT_PROJECTS, path.join(OUT_DIR, "Concept d'environnement"));

console.log("\n=== Animation (mp4) ===");
downloadFlat(ANIMATION_VIDEOS, path.join(OUT_DIR, "Animation"), "animation");

console.log("\n=== Design d'objets (photos) ===");
downloadFlat(OBJECT_DESIGN_PHOTOS, path.join(OUT_DIR, "Design d'objets"), "objet");

console.log("\nDone.");
