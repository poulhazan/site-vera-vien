// One-off scraper: downloads all Vera Vien ArtStation projects as high-res images,
// one subfolder per project, using ArtStation's public (unauthenticated) JSON endpoints.
// Uses curl (not node's fetch) because ArtStation's Cloudflare bot check blocks Node's TLS fingerprint.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const USERNAME = "veravien";
const OUT_DIR = String.raw`C:\Users\poulh\OneDrive\Bureau\claude\site Vera Vien\My files\Artstation`;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

function sanitize(name) {
  return (
    name
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120) || "untitled"
  );
}

function curlJson(url) {
  const out = execFileSync("curl", ["-s", "-H", `User-Agent: ${UA}`, "-H", "Accept: application/json", url], {
    maxBuffer: 1024 * 1024 * 50,
  });
  return JSON.parse(out.toString("utf8"));
}

function curlDownload(url, destPath) {
  execFileSync("curl", ["-s", "-H", `User-Agent: ${UA}`, "-o", destPath, url]);
  return fs.statSync(destPath).size;
}

function curlHeadOk(url) {
  const out = execFileSync("curl", ["-s", "-o", "NUL", "-w", "%{http_code}", "-I", "-H", `User-Agent: ${UA}`, url]);
  return out.toString("utf8").trim() === "200";
}

function bestImageUrl(imageUrl) {
  const url4k = imageUrl.replace("/large/", "/4k/");
  if (url4k !== imageUrl && curlHeadOk(url4k)) return url4k;
  return imageUrl;
}

function listAllProjects() {
  const projects = [];
  for (let page = 1; ; page++) {
    const data = curlJson(`https://www.artstation.com/users/${USERNAME}/projects.json?page=${page}`);
    if (!data.data || data.data.length === 0) break;
    projects.push(...data.data);
    if (projects.length >= data.total_count) break;
  }
  return projects;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log("Listing projects...");
  const projects = listAllProjects();
  console.log(`Found ${projects.length} projects.`);

  const summary = [];

  projects.forEach((proj, i) => {
    const folderName = sanitize(`${String(i + 1).padStart(2, "0")} - ${proj.title}`);
    const projectDir = path.join(OUT_DIR, folderName);
    fs.mkdirSync(projectDir, { recursive: true });
    console.log(`\n[${i + 1}/${projects.length}] ${proj.title} (${proj.hash_id})`);

    let detail;
    try {
      detail = curlJson(`https://www.artstation.com/projects/${proj.hash_id}.json`);
    } catch (e) {
      console.error(`  ! failed to fetch project detail: ${e.message}`);
      summary.push({ title: proj.title, hash_id: proj.hash_id, images: 0, error: String(e.message) });
      return;
    }

    const imageAssets = (detail.assets || []).filter((a) => a.asset_type === "image" && a.image_url);

    let count = 0;
    for (const asset of imageAssets) {
      const bestUrl = bestImageUrl(asset.image_url);
      const ext = path.extname(new URL(bestUrl).pathname) || ".jpg";
      const fileName = `${String(count + 1).padStart(3, "0")}${ext}`;
      const destPath = path.join(projectDir, fileName);
      try {
        const size = curlDownload(bestUrl, destPath);
        console.log(`  - ${fileName} (${(size / 1024).toFixed(0)} KB)`);
        count++;
      } catch (e) {
        console.error(`  ! failed ${fileName}: ${e.message}`);
      }
    }

    summary.push({ title: proj.title, hash_id: proj.hash_id, images: count });
  });

  fs.writeFileSync(path.join(OUT_DIR, "_scrape-summary.json"), JSON.stringify(summary, null, 2));
  console.log("\nDone. Summary written to _scrape-summary.json");
}

main();
