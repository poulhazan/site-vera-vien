// Reorganizes the raw Instagram "Download your information" export into
// browsable folders: one folder per post/carousel (named by date + caption
// excerpt), a flat Stories folder, and a flat Archived posts folder.
import fs from "node:fs";
import path from "node:path";

const BASE = String.raw`C:\Users\poulh\OneDrive\Bureau\claude\site Vera Vien\My files\Instagram`;
const EXPORT_DIR = path.join(BASE, "instagram-veravienillustration-2026-07-09-scrap");
const MEDIA_JSON_DIR = path.join(EXPORT_DIR, "your_instagram_activity", "media");

function fixMojibake(str) {
  if (!str) return str;
  try {
    return Buffer.from(str, "latin1").toString("utf8");
  } catch {
    return str;
  }
}

function loadJson(name) {
  const p = path.join(MEDIA_JSON_DIR, name);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function dateSlug(ts) {
  const d = new Date(ts * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function captionSlug(caption) {
  const firstLine = (caption || "").split("\n")[0];
  const clean = firstLine
    .replace(/[<>:"/\\|?*\x00-\x1F#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return clean.slice(0, 60);
}

function extOf(uri) {
  return path.extname(uri) || ".jpg";
}

// ---- Build groups from the "simple" format (posts_1.json / archived_posts.json) ----
function groupsFromSimple(entries) {
  return entries
    .filter((e) => e.media && e.media.length && e.media.some((m) => m.uri))
    .map((e) => ({
      timestamp: e.creation_timestamp || e.media[0].creation_timestamp,
      caption: fixMojibake(e.title || e.media.map((m) => m.title).find(Boolean) || ""),
      uris: e.media.filter((m) => m.uri).map((m) => m.uri),
    }));
}

// ---- Build groups from the "label_values" format (posts.json) ----
function groupsFromLabelValues(entries) {
  const groups = [];
  for (const e of entries) {
    const mediaLabel = (e.label_values || []).find((l) => l.label === "Media" && l.media);
    if (!mediaLabel) continue;
    const uris = mediaLabel.media.filter((m) => m.uri).map((m) => m.uri);
    if (!uris.length) continue;
    const caption = fixMojibake(mediaLabel.media.map((m) => m.title).find(Boolean) || "");
    groups.push({ timestamp: e.timestamp || mediaLabel.media[0].creation_timestamp, caption, uris });
  }
  return groups;
}

function dedupeGroups(groupLists) {
  const seen = new Set();
  const result = [];
  for (const groups of groupLists) {
    for (const g of groups) {
      const key = g.uris.slice().sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(g);
    }
  }
  return result;
}

function copyGroupsInto(groups, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  groups.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  let copied = 0;
  let missing = 0;
  for (const g of groups) {
    const folderName = `${dateSlug(g.timestamp)}${g.caption ? " - " + captionSlug(g.caption) : ""}` || `post-${g.timestamp}`;
    const dir = path.join(destDir, folderName || `post-${g.timestamp}`);
    fs.mkdirSync(dir, { recursive: true });
    g.uris.forEach((uri, i) => {
      const src = path.join(EXPORT_DIR, uri);
      if (!fs.existsSync(src)) {
        missing++;
        return;
      }
      const dest = path.join(dir, `${String(i + 1).padStart(2, "0")}${extOf(uri)}`);
      fs.copyFileSync(src, dest);
      copied++;
    });
    if (g.caption) {
      fs.writeFileSync(path.join(dir, "caption.txt"), g.caption, "utf8");
    }
  }
  return { copied, missing };
}

function copyFlat(entries, destDir, getUri, getTitle) {
  fs.mkdirSync(destDir, { recursive: true });
  let copied = 0;
  let missing = 0;
  entries.forEach((e, i) => {
    const uri = getUri(e);
    if (!uri) return;
    const src = path.join(EXPORT_DIR, uri);
    if (!fs.existsSync(src)) {
      missing++;
      return;
    }
    const ts = e.creation_timestamp || 0;
    const dest = path.join(destDir, `${dateSlug(ts)}-${String(i + 1).padStart(3, "0")}${extOf(uri)}`);
    fs.copyFileSync(src, dest);
    copied++;
  });
  return { copied, missing };
}

// ---- Posts (regular) ----
const postsSimple = loadJson("posts_1.json") || [];
const postsLabelValues = loadJson("posts.json") || [];
const postGroups = dedupeGroups([groupsFromSimple(postsSimple), groupsFromLabelValues(postsLabelValues)]);
const postsResult = copyGroupsInto(postGroups, path.join(BASE, "Posts"));
console.log(`Posts: ${postGroups.length} publications, ${postsResult.copied} fichiers copiés, ${postsResult.missing} manquants`);

// ---- Archived posts ----
const archived = (loadJson("archived_posts.json") || {}).ig_archived_post_media || [];
const archivedGroups = dedupeGroups([groupsFromSimple(archived)]);
const archivedResult = copyGroupsInto(archivedGroups, path.join(BASE, "Archived posts"));
console.log(`Archived posts: ${archivedGroups.length} publications, ${archivedResult.copied} fichiers copiés, ${archivedResult.missing} manquants`);

// ---- Stories (flat, no captions grouping needed) ----
const stories = (loadJson("stories.json") || {}).ig_stories || [];
const storiesResult = copyFlat(stories, path.join(BASE, "Stories"), (e) => e.uri, (e) => e.title);
console.log(`Stories: ${stories.length} entrées, ${storiesResult.copied} fichiers copiés, ${storiesResult.missing} manquants`);

console.log("\nDone.");
