import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname, relative } from "path";
import * as dotenv from "dotenv";

// Load .env.local for script execution
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "images";
const PUBLIC_DIR = join(process.cwd(), "public", "images");
const WEBP_QUALITY = 85;

async function getAllFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...(await getAllFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function migrateImages() {
  const files = await getAllFiles(PUBLIC_DIR);
  console.log(`Found ${files.length} files to migrate\n`);

  let ok = 0;
  let fail = 0;
  let totalOriginalBytes = 0;
  let totalWebpBytes = 0;

  for (const filePath of files) {
    const ext = extname(filePath).toLowerCase();
    const relativePath = relative(PUBLIC_DIR, filePath);

    if (ext === ".svg") {
      const buffer = readFileSync(filePath);
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(relativePath, buffer, { contentType: "image/svg+xml", upsert: true });
      if (error) {
        console.error(`FAIL [SVG] ${relativePath}: ${error.message}`);
        fail++;
      } else {
        console.log(`OK   [SVG] ${relativePath} (${(buffer.length / 1024).toFixed(0)}KB)`);
        ok++;
      }
    } else if ([".png", ".jpg", ".jpeg"].includes(ext)) {
      const buffer = readFileSync(filePath);
      const originalSize = buffer.length;
      totalOriginalBytes += originalSize;

      const webpBuffer = await sharp(buffer).webp({ quality: WEBP_QUALITY }).toBuffer();
      totalWebpBytes += webpBuffer.length;

      const storagePath = relativePath.replace(/\.(png|jpg|jpeg)$/i, ".webp");
      const savings = ((1 - webpBuffer.length / originalSize) * 100).toFixed(0);

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, webpBuffer, { contentType: "image/webp", upsert: true });

      if (error) {
        console.error(`FAIL [WebP] ${storagePath}: ${error.message}`);
        fail++;
      } else {
        console.log(
          `OK   [WebP] ${storagePath} (${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(webpBuffer.length / 1024).toFixed(0)}KB, -${savings}%)`
        );
        ok++;
      }
    } else {
      console.log(`SKIP ${relativePath}`);
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ OK: ${ok}  ❌ FAIL: ${fail}`);
  if (totalOriginalBytes > 0) {
    const totalSavings = ((1 - totalWebpBytes / totalOriginalBytes) * 100).toFixed(0);
    console.log(
      `📦 PNG Total: ${(totalOriginalBytes / 1024 / 1024).toFixed(1)}MB → WebP: ${(totalWebpBytes / 1024 / 1024).toFixed(1)}MB (-${totalSavings}%)`
    );
  }
  console.log(`Migration complete!`);
}

migrateImages().catch(console.error);
