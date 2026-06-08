// Shared helpers for listing & downloading public Google Drive folder contents.

import fs from "fs";
import path from "path";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";

/**
 * Lists entries in a public Drive folder by scraping the embedded data.
 * Returns [{ id, name, mime, isFolder }].
 */
export async function listFolder(folderId) {
  const res = await fetch(
    `https://drive.google.com/drive/folders/${folderId}`,
    { headers: { "User-Agent": UA } }
  );
  const html = await res.text();

  // Drive embeds entries (with \x22 = " and \x5b/\x5d = [ ]) like:
  //   "FILEID\x22,\x5b\x22PARENTID\x22\x5d,\x22NAME\x22,\x22MIME\x22
  const text = html
    .replace(/\\x22/g, '"')
    .replace(/\\x5b/g, "[")
    .replace(/\\x5d/g, "]");

  const re =
    /"([A-Za-z0-9_-]{25,44})",\["[A-Za-z0-9_-]{25,44}"\],"([^"]+)","([^"]+)"/g;

  const seen = new Set();
  const entries = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const [, id, name, mime] = m;
    if (seen.has(id) || id === folderId) continue;
    seen.add(id);
    entries.push({ id, name, mime, isFolder: mime.includes("folder") });
  }
  return entries;
}

/**
 * Downloads a Drive file by ID, handling the large-file confirm interstitial.
 * Retries transient failures. Returns a Buffer.
 */
export async function downloadFile(id, retries = 3) {
  const base = `https://drive.usercontent.google.com/download?id=${id}&export=download`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      let res = await fetch(base, { headers: { "User-Agent": UA }, redirect: "follow" });
      const ct = res.headers.get("content-type") || "";

      if (ct.includes("text/html")) {
        const html = await res.text();
        const confirm =
          html.match(/name="confirm"\s+value="([^"]+)"/)?.[1] ||
          html.match(/confirm=([0-9A-Za-z_-]+)/)?.[1];
        const uuid = html.match(/name="uuid"\s+value="([^"]+)"/)?.[1];
        if (!confirm) throw new Error("no confirm token");
        let url = `${base}&confirm=${confirm}`;
        if (uuid) url += `&uuid=${uuid}`;
        res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
      }

      if (!res.ok) throw new Error(`status ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      if (attempt === retries) throw e;
      await new Promise((r) => setTimeout(r, 1500 * attempt)); // backoff
    }
  }
}

/**
 * Recursively downloads an entire Drive folder into destDir, preserving the
 * nested structure (e.g. textures/ subfolders that .gltf files reference).
 * Skips license/readme files.
 */
export async function downloadFolderRecursive(folderId, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  const entries = await listFolder(folderId);
  for (const e of entries) {
    if (e.isFolder) {
      await downloadFolderRecursive(e.id, path.join(destDir, e.name));
    } else {
      if (/license|readme/i.test(e.name)) continue;
      process.stdout.write(`   ↓ ${e.name} … `);
      const buf = await downloadFile(e.id);
      fs.writeFileSync(path.join(destDir, e.name), buf);
      console.log(`${(buf.length / 1024 / 1024).toFixed(2)}MB`);
    }
  }
}
