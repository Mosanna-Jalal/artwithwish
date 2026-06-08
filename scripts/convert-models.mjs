/**
 * One-time converter: pulls the multi-file .gltf models from the shared Drive
 * subfolders, packs each into a single self-contained .glb (geometry + buffers
 * inlined) with gltf-pipeline, and writes them to public/models/ (gitignored).
 *
 * Run: npm run convert-models
 */

import fs from "fs";
import path from "path";
import os from "os";
import gltfPipeline from "gltf-pipeline";
import { listFolder, downloadFolderRecursive } from "./drive-utils.mjs";

const { gltfToGlb } = gltfPipeline;

// Subfolder ID  →  output .glb filename
const SUBFOLDERS = [
  { id: "1DtGiEM7htbrviJ0DfV_4rgsxc-DCAvMy", out: "arabic-alphabet.glb" },
  { id: "1mh9jeLPMnuDiMVJUISPI2OT7_XTOIbE0", out: "scene-1.glb" },
  { id: "1zVB57U_N7p60JbCp6FcGqxIMDyIdT8XR", out: "scene-2.glb" },
];

const OUT_DIR = path.join(process.cwd(), "public", "models");

async function convertFolder({ id, out }) {
  console.log(`\n📦  ${out}  (folder ${id.slice(0, 10)}…)`);

  const files = await listFolder(id);
  const gltfFile = files.find((f) => /\.gltf$/i.test(f.name));
  if (!gltfFile) {
    console.log("   ⚠  no .gltf found, skipping");
    return;
  }

  // Temp working dir holding the .gltf + every resource it references,
  // including nested textures/ subfolders.
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "gltf-"));
  try {
    await downloadFolderRecursive(id, tmp);

    // Pack into a single .glb (resourceDirectory resolves scene.bin, textures)
    const gltf = JSON.parse(fs.readFileSync(path.join(tmp, gltfFile.name), "utf8"));
    const { glb } = await gltfToGlb(gltf, { resourceDirectory: tmp + path.sep });

    fs.mkdirSync(OUT_DIR, { recursive: true });
    const outPath = path.join(OUT_DIR, out);
    fs.writeFileSync(outPath, glb);
    console.log(`   ✅ wrote ${out}  (${(glb.length / 1024 / 1024).toFixed(1)}MB)`);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

async function main() {
  console.log("🎨  Converting Drive .gltf models → self-contained .glb");
  for (const folder of SUBFOLDERS) {
    try {
      await convertFolder(folder);
    } catch (e) {
      console.error(`   ❌ ${folder.out} failed:`, e.message);
    }
  }
  console.log("\n✨  Done. Files in public/models/ (gitignored).");
}

main();
